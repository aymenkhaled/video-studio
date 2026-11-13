"""Timeline-driven soundtrack: Kokoro voice + original MIDI score (FluidSynth) + foley/SFX + ambience.

CI only (needs fluidsynth, ffmpeg, Kokoro model). Ported and generalised from the Horn Lock
`make_field_audio.py` and the T. rex / Whip `make_audio*.py` mixes.

Usage: python packages/audio/soundtrack.py <timeline.json>
Writes: out/soundtrack.wav (48 kHz stereo, two-pass loudnorm −14 LUFS / −1.5 dBTP),
        public/generated/timing.json (voice line + word timings for captions, audio level per frame),
        out/audio_report.json, out/stems/*.wav
"""

import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import pretty_midi
import requests
import soundfile as sf
from scipy.signal import butter, resample_poly, sosfilt

if os.environ.get("GITHUB_ACTIONS") != "true" and os.environ.get("ALLOW_LOCAL_AUDIO") != "1":
    raise SystemExit("Soundtrack generation is CI-only (set ALLOW_LOCAL_AUDIO=1 to override)")

ROOT = Path(__file__).resolve().parents[2]
RATE = 48000
KOKORO = {
    "model": ("https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx",
              92361271, "6e742170d309016e5891a994e1ce1559c702a2ccd0075e67ef7157974f6406cb"),
    "voices": ("https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
               28214398, "bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d"),
}
FOLEY = {  # files from the assets-v1 "freesound-dino-foley.zip" (see docs/LICENSES.md)
    "steps": "steps_410609.flac", "breath": "breath_427414.wav", "thud": "thud_132149.wav",
    "rumble": "rumble_507066.wav", "bellow": "bellow_529462.mp3",
}

tl = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
PRE = {}  # line id -> (samples, source_rate) generated in the voice-first pre-pass
SCENES = []


def _download(url, target, size, sha):
    target.parent.mkdir(parents=True, exist_ok=True)
    if not (target.is_file() and target.stat().st_size == size):
        with requests.get(url, stream=True, timeout=180) as r:
            r.raise_for_status()
            with target.open("wb") as f:
                for chunk in r.iter_content(1 << 20):
                    f.write(chunk)
    if hashlib.sha256(target.read_bytes()).hexdigest() != sha:
        raise RuntimeError(f"checksum mismatch: {target}")


def kokoro_engine():
    from kokoro_onnx import Kokoro

    cache = ROOT / ".cache" / "kokoro-v1.0"
    mpath, vpath = cache / "kokoro-v1.0.int8.onnx", cache / "voices-v1.0.bin"
    _download(KOKORO["model"][0], mpath, KOKORO["model"][1], KOKORO["model"][2])
    _download(KOKORO["voices"][0], vpath, KOKORO["voices"][1], KOKORO["voices"][2])
    return Kokoro(str(mpath), str(vpath))


def _tts(kokoro, text, vcfg, speed):
    smp, sr = kokoro.create(text, voice=vcfg.get("voice", "am_michael"), speed=speed, lang=vcfg.get("language", "en-us"))
    smp = np.nan_to_num(np.asarray(smp, dtype=np.float64).reshape(-1))
    idx = np.flatnonzero(np.abs(smp) > 0.008)
    if not len(idx):
        return None, sr
    return smp[max(0, idx[0] - round(0.025 * sr)): idx[-1] + round(0.12 * sr)], sr


TTS_CACHE = ROOT / ".cache" / "tts"


def speak(kokoro, text, vcfg, speed):
    """Cached TTS: identical (text, voice, speed, lang) lines are never synthesised twice across runs
    (CI restores .cache/tts). Saves most of the ~1.7 s-per-second-of-audio Kokoro cost on re-renders."""
    key = hashlib.sha1(f"v1|{text}|{vcfg.get('voice', 'am_michael')}|{speed:.4f}|{vcfg.get('language', 'en-us')}".encode()).hexdigest()
    f = TTS_CACHE / f"{key}.npz"
    if f.exists():
        z = np.load(f)
        return z["smp"], int(z["sr"])
    smp, sr = _speak(kokoro, text, vcfg, speed)
    TTS_CACHE.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(f, smp=smp.astype(np.float32), sr=sr)
    return smp, sr


def _speak(kokoro, text, vcfg, speed):
    """Kokoro TTS with silence/NaN guard (the int8 model intermittently returns silence).
    Retries with tiny speed jitter, then falls back to sentence-by-sentence synthesis."""
    for attempt, jitter in enumerate((1.0, 0.985, 1.015)):
        smp, sr = _tts(kokoro, text, vcfg, speed * jitter)
        if smp is not None:
            return smp, sr
        print(f"WARN silent TTS output (attempt {attempt + 1}): {text!r}")
    parts = [p for p in re.split(r"(?<=[.!?,;:])\s+", text) if p.strip()]
    pieces, sr = [], 24000
    for part in parts:
        for jitter in (1.0, 0.99, 1.01, 0.98):
            smp, sr = _tts(kokoro, part, vcfg, speed * jitter)
            if smp is not None:
                pieces.append(smp)
                pieces.append(np.zeros(round(0.12 * sr)))
                break
        else:
            raise RuntimeError(f"TTS stayed silent for fragment {part!r} of {text!r}")
    print(f"WARN used sentence-split synthesis for: {text!r}")
    return np.concatenate(pieces[:-1]), sr


# ---------- voice-first layout (long-form) ----------
# Timeline with "scenes": each scene lists narration lines; scene lengths follow the generated voice,
# so nobody hand-times a 30-minute script. Converted here into the fixed schema used below.
if "scenes" in tl:
    vcfg = tl["voice"]
    kokoro = kokoro_engine()
    lines, sections, sfx = [], [], list(tl.get("sfx", []))
    t = 0.0
    gap = float(vcfg.get("gap", 0.38))
    for si, sc in enumerate(tl["scenes"]):
        start = t
        t += float(sc.get("lead", 0.6))
        for li, text in enumerate(sc.get("lines", [])):
            lid = f"{sc['id']}-{li + 1}"
            smp, sr = speak(kokoro, text, vcfg, float(vcfg.get("speed", 1.0)))
            PRE[lid] = (smp, sr)
            d = len(smp) / sr
            lines.append({"id": lid, "t": round(t, 3), "until": round(t + d + 0.05, 3), "text": text})
            t += d + gap
        end = max(t - gap + float(sc.get("tail", 0.8)), start + float(sc.get("min", 3.0)))
        t = end
        SCENES.append({"id": sc["id"], "start": round(start, 3), "end": round(end, 3)})
        if sc.get("music"):
            sections.append({"start": start, "end": end, "mood": sc["music"]})
        for ev in sc.get("sfx", []):
            sfx.append({**ev, "t": start + float(ev.get("at", 0))})
    del kokoro
    tl["voice"]["lines"] = lines
    tl.setdefault("music", {})["sections"] = sections
    tl["sfx"] = sfx
    tl["duration"] = round(t, 3)
    print(f"voice-first layout: {len(SCENES)} scenes, {len(lines)} lines, {t:.1f}s")

duration = float(tl["duration"])
fps = int(tl.get("fps", 30))
N = round(duration * RATE)
out = ROOT / "out"
(out / "stems").mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(int(tl.get("seed", 1)))


# ---------- dsp helpers ----------
def filt(x, cutoff, kind="lowpass", order=3):
    return sosfilt(butter(order, cutoff, btype=kind, fs=RATE, output="sos"), x, axis=0)


def norm(x, peak=1.0):
    m = float(np.max(np.abs(x))) if len(x) else 0.0
    if m < 1e-9:
        raise RuntimeError("expected audible source is silent")
    return x * (peak / m)


def env(n, attack=0.02, release=0.08):
    e = np.ones(n)
    a, r = min(n // 2, round(attack * RATE)), min(n // 2, round(release * RATE))
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[-r:] = np.linspace(1, 0, r) ** 1.5
    return e


def place(stereo, mono, at, gain=1.0, pan=0.0):
    s = max(0, round(at * RATE))
    e = min(N, s + len(mono))
    if e <= s:
        return
    x = mono[: e - s] * gain
    stereo[s:e, 0] += x * np.sqrt((1 - pan) / 2)
    stereo[s:e, 1] += x * np.sqrt((1 + pan) / 2)


def download(url, target, size, sha):
    target.parent.mkdir(parents=True, exist_ok=True)
    if not (target.is_file() and target.stat().st_size == size):
        with requests.get(url, stream=True, timeout=180) as r:
            r.raise_for_status()
            with target.open("wb") as f:
                for chunk in r.iter_content(1 << 20):
                    f.write(chunk)
    if hashlib.sha256(target.read_bytes()).hexdigest() != sha:
        raise RuntimeError(f"checksum mismatch: {target}")


# ---------- voice ----------
voice = np.zeros((N, 2))
voice_mask = np.zeros(N)
lines_out = []
vcfg = tl.get("voice")
if vcfg and vcfg.get("lines"):
    if vcfg.get("engine", "kokoro") != "kokoro":
        raise RuntimeError("only kokoro is wired; recorded voice comes in a later step")
    kokoro = None if all(l["id"] in PRE for l in vcfg["lines"]) else kokoro_engine()
    for line in vcfg["lines"]:
        speed = float(vcfg.get("speed", 1.0))
        slot = float(line["until"]) - float(line["t"])
        if line["id"] in PRE:
            smp, sr = PRE[line["id"]]
            dur = len(smp) / sr
        else:
            for _ in range(3):
                smp, sr = speak(kokoro, line["text"], vcfg, speed)
                dur = len(smp) / sr
                if dur <= slot:
                    break
                speed = min(1.35, speed * dur / slot * 1.03)
        if dur > slot + 0.05:
            raise RuntimeError(f"voice line {line['id']} too long for its slot ({dur:.2f}s > {slot:.2f}s); shorten the text")
        smp = resample_poly(smp, RATE, sr)
        smp = filt(smp, 85, "highpass")
        presence = filt(filt(smp, 1600, "highpass", 2), 4200, "lowpass", 2)
        smp = norm(smp + presence * 0.16, 0.7) * env(len(smp), 0.005, 0.03)
        place(voice, smp, float(line["t"]), 1.0)
        s = round(float(line["t"]) * RATE)
        voice_mask[s: min(N, s + len(smp))] = 1
        # approximate word timings: proportional to word length (+1 for the gap)
        words = line["text"].split()
        weights = np.array([len(re.sub(r"\W", "", w)) + 1.5 for w in words], dtype=float)
        edges = np.concatenate([[0], np.cumsum(weights)]) / weights.sum() * (len(smp) / RATE)
        lines_out.append({
            "id": line["id"], "t": float(line["t"]), "duration": len(smp) / RATE, "text": line["text"], "speed": speed,
            "words": [{"w": w, "t": float(line["t"] + edges[i]), "end": float(line["t"] + edges[i + 1])} for i, w in enumerate(words)],
        })
        print(f"VOICE {line['id']} {len(smp)/RATE:.2f}s @ {line['t']}s (speed {speed:.2f}): {line['text']}")
    del kokoro

# ---------- music (original, generated) ----------
# Each mood is a small original pattern in the episode key; sections are stitched on the timeline.
KEYS = {"C": 48, "D": 50, "E": 52, "F": 53, "G": 55, "A": 57}
SCALE_MINOR = [0, 2, 3, 5, 7, 8, 10]
mcfg = tl.get("music", {})
root = KEYS.get(mcfg.get("key", "D"), 50)
tempo = float(mcfg.get("tempo", 84))
beat = 60.0 / tempo
midi = pretty_midi.PrettyMIDI(initial_tempo=tempo)
pad = pretty_midi.Instrument(48, name="Strings")       # String Ensemble 1
low = pretty_midi.Instrument(43, name="Contrabass")
lead = pretty_midi.Instrument(60, name="French horn")
bell = pretty_midi.Instrument(8, name="Celesta")
perc = pretty_midi.Instrument(0, is_drum=True, name="Perc")


def note(vel, pitch, start, end):
    """MIDI note that is never zero/negative length (short scenes can squeeze the patterns)."""
    return pretty_midi.Note(int(vel), int(pitch), float(start), max(float(end), float(start) + 0.06))


def deg(d, octave=0):
    return root + 12 * octave + SCALE_MINOR[d % 7] + 12 * (d // 7)


PROG = [0, 5, 3, 4]  # i – VI – iv – v (minor)
for sec in mcfg.get("sections", []):
    a, b, mood = float(sec["start"]), float(sec["end"]), sec["mood"]
    mood = {"march": "build", "somber": "tension", "epic": "reveal", "calm": "wonder"}.get(mood, mood)
    if mood == "silence":
        continue
    bar = 4 * beat
    t, k = a, 0
    while t < b - 0.2:
        chord = PROG[k % len(PROG)]
        end = min(b - 0.05, t + bar)
        vel = {"tension": 34, "build": 40 + min(k * 4, 30), "reveal": 72, "wonder": 46, "outro": 36}.get(mood, 40)
        for d in (chord, chord + 2, chord + 4):
            pad.notes.append(note(vel, deg(d, 1), t, end))
        low.notes.append(note(vel + 6, deg(chord, -1), t, end))
        if mood in ("build", "reveal"):
            n_hits = 4 if mood == "build" else 2
            for i in range(n_hits):
                ht = t + i * bar / n_hits
                if ht < end:
                    perc.notes.append(note(min(110, vel + 20), 36 if i % 2 == 0 else 41, ht, ht + 0.15))
        if mood in ("reveal", "wonder"):
            motif = [(0, 4), (1, 3), (2, 2), (3, 0)] if mood == "reveal" else [(0, 7), (1.5, 9), (3, 8)]
            for off, d in motif:
                nt = t + off * beat
                if nt < end:
                    (lead if mood == "reveal" else bell).notes.append(note(vel, deg(chord + d, 1 if mood == "reveal" else 2), nt, min(end, nt + beat * 1.4)))
        if mood == "tension" and k % 2 == 0:
            bell.notes.append(note(30, deg(chord + 7, 2), t + 2 * beat, min(end, t + 3 * beat)))
        t += bar
        k += 1
midi.instruments.extend([pad, low, lead, bell, perc])
music = np.zeros((N, 2))
if mcfg.get("sections"):
    midi.write(str(out / "music.mid"))
    subprocess.run(["fluidsynth", "-ni", "-g", "0.6", "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(out / "music.mid"),
                    "-F", str(out / "music.wav"), "-r", str(RATE)], check=True, capture_output=True)
    m, mr = sf.read(out / "music.wav", always_2d=True)
    if mr != RATE:
        m = resample_poly(m, RATE, mr, axis=0)
    m = m[:N]
    music[: len(m)] = norm(m, 0.3)

# ---------- foley / sfx ----------
sfx_dir = ROOT / "assets-cache" / "sfx"
rec = {}


def recorded(name, start, n, cutoff):
    if name not in rec:
        x, sr = sf.read(sfx_dir / FOLEY[name], always_2d=True)
        rec[name] = resample_poly(x.mean(axis=1), RATE, sr)
    x = rec[name][round(start * RATE): round(start * RATE) + n]
    if len(x) < n:
        x = np.pad(x, (0, n - len(x)))
    return norm(filt(filt(x, 65, "highpass", 2), cutoff))


def effect(kind, n, v):
    t = np.arange(n) / RATE
    noise = rng.normal(0, 1, n)
    if kind == "footstep":
        body = np.sin(2 * np.pi * 62 * t) * np.exp(-t * 10) + 0.35 * np.sin(2 * np.pi * 124 * t) * np.exp(-t * 14)
        return (recorded("steps", 3.6 + (v % 4) * 0.018, n, 2400) * 0.6 + body * 0.4) * env(n, 0.004, 0.15)
    if kind == "breath":
        return recorded("breath", 5.6 + (v % 3) * 0.06, n, 1800) * env(n, 0.07, 0.22)
    if kind == "rumble":
        return recorded("rumble", 2.3, n, 460) * env(n, 0.1, 0.3)
    if kind == "bellow":
        return recorded("bellow", 0.0, n, 1400) * env(n, 0.05, 0.4)
    if kind == "impact":
        thud = recorded("thud", 0.02, n, 700)
        boom = np.sin(2 * np.pi * 48 * t * (1 - 0.3 * t)) * np.exp(-t * 5)
        return norm(thud * 0.5 + boom * 0.8) * env(n, 0.002, 0.3)
    if kind == "whoosh":
        sweep = filt(noise, 300, "highpass") * np.sin(np.pi * np.clip(t / (n / RATE), 0, 1)) ** 2
        return norm(filt(sweep, 5000)) * env(n, 0.01, 0.1)
    if kind == "riser":
        f = 120 + 900 * (t / (n / RATE)) ** 2
        tone = np.sin(2 * np.pi * np.cumsum(f) / RATE)
        return norm(tone * 0.4 + filt(noise, 2000, "highpass") * 0.25 * (t / (n / RATE))) * env(n, 0.3, 0.05)
    if kind == "tick":
        return np.sin(2 * np.pi * 1580 * t) * np.exp(-t * 32) * env(n, 0.002, 0.04)
    if kind == "counter":  # rapid ticks while a number counts up
        x = np.zeros(n)
        for i in range(0, n, round(0.06 * RATE)):
            m = min(n - i, round(0.03 * RATE))
            x[i: i + m] += np.sin(2 * np.pi * 2200 * t[:m]) * np.exp(-t[:m] * 90)
        return x
    raise RuntimeError(f"unknown sfx type: {kind}")


foley = np.zeros((N, 2))
events = []
for ev in tl.get("sfx", []):
    if "every" in ev:  # repeating event (e.g. footsteps): optional gain ramp from `rampFrom`×gain up to gain
        t0, t1, step = float(ev["from"]), float(ev["to"]), float(ev["every"])
        k, count = 0, max(1, int((t1 - t0) / step) + 1)
        while t0 + k * step <= t1:
            g = float(ev.get("gain", 0.8)) * (float(ev.get("rampFrom", 1)) + (1 - float(ev.get("rampFrom", 1))) * k / max(1, count - 1))
            events.append({**ev, "t": t0 + k * step, "gain": g, "pan": (0.15 if k % 2 else -0.15)})
            k += 1
    else:
        events.append(ev)
for i, ev in enumerate(events):
    n = round(float(ev.get("duration", 0.6)) * RATE)
    place(foley, effect(ev["type"], n, i), float(ev["t"]), float(ev.get("gain", 0.8)), float(ev.get("pan", 0)))

ambience = np.zeros((N, 2))
amb = tl.get("ambience")
if amb:
    tt = np.arange(N) / RATE
    for ch in range(2):
        air = norm(filt(filt(rng.normal(0, 1, N), 110, "highpass"), 1800))
        ambience[:, ch] = air * float(amb.get("gain", 0.25)) * (0.5 + 0.15 * np.sin(2 * np.pi * 0.07 * tt + ch))

# ---------- mix ----------
for ch, offs in enumerate(((0.085, 0.185, 0.33), (0.11, 0.215, 0.365))):  # small-room reflections on foley
    dry = foley[:, ch].copy()
    for o, g in zip(offs, (0.12, 0.075, 0.04)):
        s = round(o * RATE)
        foley[s:, ch] += filt(dry[:-s], 4200) * g
duck = 1 - 0.65 * np.clip(filt(voice_mask, 5, "lowpass", 2), 0, 1)
music *= duck[:, None]
ambience *= duck[:, None]
mix = voice * 1.0 + music * 0.85 + ambience * 0.5 + foley * 0.85
for name, stem in (("voice", voice), ("music", music), ("ambience", ambience), ("foley", foley)):
    sf.write(out / "stems" / f"{name}.wav", stem, RATE, subtype="PCM_16")
peak = float(np.max(np.abs(mix)))
if peak < 1e-6:
    raise RuntimeError("soundtrack is silent")
mix *= 0.9 / peak
sf.write(out / "premix.wav", mix, RATE, subtype="PCM_24")

meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(out / "premix.wav"), "-af",
                       "loudnorm=I=-14:TP=-2.5:LRA=9:print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
vals = json.loads(re.search(r'\{\s*"input_i".*?\}', meas.stderr, re.DOTALL).group(0))
# TP −2.5 (not −1.5): AAC encoding adds ~0.4–0.8 dB of inter-sample peak; QA gate is ≤ −1.5 dBTP on the final file.
ln = ("loudnorm=I=-14:TP=-2.5:LRA=9:" f"measured_I={vals['input_i']}:measured_TP={vals['input_tp']}:measured_LRA={vals['input_lra']}:"
      f"measured_thresh={vals['input_thresh']}:offset={vals['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(out / "premix.wav"), "-af", ln,
                "-ar", str(RATE), "-ac", "2", "-c:a", "pcm_s16le", "-map_metadata", "-1", str(out / "soundtrack.wav")], check=True)

final, _ = sf.read(out / "soundtrack.wav", always_2d=True)
win = RATE // fps
levels = np.array([np.sqrt(np.mean(final[i: i + win] ** 2)) for i in range(0, min(N, len(final)), win)])
levels /= max(float(np.quantile(levels, 0.98)), 1e-8)
timing = {"fps": fps, "duration": duration, "lines": lines_out, "scenes": SCENES, "level": np.clip(levels, 0, 1).round(3).tolist()}
gen = ROOT / "public" / "generated"
gen.mkdir(parents=True, exist_ok=True)
(gen / "timing.json").write_text(json.dumps(timing), encoding="utf-8")
(out / "audio_report.json").write_text(json.dumps({"lines": lines_out, "premix_loudness": vals,
    "stems_rms": {k: float(np.sqrt(np.mean(v ** 2))) for k, v in (("voice", voice), ("music", music), ("ambience", ambience), ("foley", foley))}}, indent=2))
print(f"soundtrack ok: {duration:.1f}s, {len(lines_out)} voice lines, {len(tl.get('sfx', []))} sfx")
