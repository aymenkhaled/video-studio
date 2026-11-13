"""Technical QA for a rendered video. CI only. Exit code 1 on any failure.

Usage: python tools/qa_video.py <video> --width 1080 --height 1920 --fps 30 --frames N
       [--no-audio] [--sheet out/contact_sheet.jpg] [--sheet-count 12] [--allow-intervals intervals.json]
Writes <video>.qa.json next to the video.
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    out = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path])
    return json.loads(out.stdout)


def detect(path, vf=None, af=None):
    cmd = ["ffmpeg", "-hide_banner", "-nostats", "-i", path]
    cmd += ["-vf", vf] if vf else ["-vn"]
    if af:
        cmd += ["-af", af]
    else:
        cmd += ["-an"]
    cmd += ["-f", "null", "-"]
    return run(cmd).stderr


def intervals(log, start_key, end_key):
    starts = [float(x) for x in re.findall(rf"{start_key}:\s*(-?[\d.]+)", log)]
    ends = [float(x) for x in re.findall(rf"{end_key}:\s*(-?[\d.]+)", log)]
    return [[s, ends[i] if i < len(ends) else None] for i, s in enumerate(starts)]


def allowed(found, allow):
    # an open-ended interval (no end reported = runs to the end of the file) counts as ending at the file end
    return [iv for iv in found if not any(a[0] - 0.1 <= iv[0] and (iv[1] if iv[1] is not None else a[1] - 0.5) <= a[1] + 0.1 for a in allow)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--width", type=int, required=True)
    ap.add_argument("--height", type=int, required=True)
    ap.add_argument("--fps", type=float, required=True)
    ap.add_argument("--frames", type=int, required=True)
    ap.add_argument("--no-audio", action="store_true")
    ap.add_argument("--sheet")
    ap.add_argument("--sheet-count", type=int, default=12)
    ap.add_argument("--allow-intervals", help="json {black:[[a,b]], freeze:[[a,b]], silence:[[a,b]]}")
    ap.add_argument("--allow-end-freeze", type=float, default=0.0, help="seconds at the end allowed to be static (end screen)")
    a = ap.parse_args()

    allow = json.loads(Path(a.allow_intervals).read_text()) if a.allow_intervals else {}
    if a.allow_end_freeze:
        end = a.frames / a.fps
        allow.setdefault("freeze", []).append([end - a.allow_end_freeze, end + 1])
    checks, fail = [], False

    def check(name, ok, value):
        nonlocal fail
        fail |= not ok
        checks.append({"check": name, "pass": bool(ok), "value": value})

    info = probe(a.video)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    fps = num / den
    dur = float(info["format"]["duration"])
    expect = a.frames / a.fps
    check("resolution", (v["width"], v["height"]) == (a.width, a.height), f"{v['width']}x{v['height']}")
    check("fps", abs(fps - a.fps) < 0.01, fps)
    check("duration", abs(dur - expect) <= 1.5 / a.fps + 0.05, f"{dur:.3f}s (expect {expect:.3f}s)")
    tags = info["format"].get("tags", {})
    check("metadata_stripped", not any(k.lower() in ("title", "comment", "artist", "encoder_settings") for k in tags), sorted(tags))

    black = allowed(intervals(detect(a.video, vf="blackdetect=d=0.5:pix_th=0.10"), "black_start", "black_end"), allow.get("black", []))
    check("blackdetect", not black, black)
    freeze = allowed(intervals(detect(a.video, vf="freezedetect=n=0.003:d=2"), "lavfi.freezedetect.freeze_start", "lavfi.freezedetect.freeze_end"), allow.get("freeze", []))
    check("freezedetect>2s", not freeze, freeze)

    aud = [s for s in info["streams"] if s["codec_type"] == "audio"]
    if a.no_audio:
        check("audio_absent_as_expected", not aud, len(aud))
    else:
        check("audio_stream", bool(aud) and aud[0].get("sample_rate") == "48000" and aud[0].get("channels") == 2,
              f"{aud[0].get('codec_name')} {aud[0].get('sample_rate')} {aud[0].get('channels')}ch" if aud else "none")
        log = detect(a.video, af="ebur128=peak=true")
        lufs = float(re.findall(r"I:\s*(-?[\d.]+) LUFS", log)[-1])
        peak = float(re.findall(r"Peak:\s*(-?[\d.]+) dBFS", log)[-1])
        check("loudness_-14±1", abs(lufs + 14) <= 1, lufs)
        check("true_peak<=-1.5", peak <= -1.5, peak)
        silence = allowed(intervals(detect(a.video, af="silencedetect=n=-50dB:d=1.5"), "silence_start", "silence_end"), allow.get("silence", []))
        check("silencedetect", not silence, silence)

    if a.sheet:
        n = a.sheet_count
        step = max(1, a.frames // n)
        cols = 6 if n >= 12 else n
        rows = (n + cols - 1) // cols
        vf = (f"select='not(mod(n\\,{step}))',scale=270:-2,"
              f"drawtext=text='%{{pts\\:hms}}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,"
              f"tile={cols}x{rows}:padding=6:color=0x202020")
        r = run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vf", vf, "-frames:v", "1", "-fps_mode", "vfr", a.sheet])
        check("contact_sheet", r.returncode == 0 and Path(a.sheet).exists(), a.sheet if r.returncode == 0 else r.stderr[-300:])

    report = {"video": a.video, "pass": not fail, "checks": checks}
    Path(a.video + ".qa.json").write_text(json.dumps(report, indent=2))
    for c in checks:
        print(f"{'PASS' if c['pass'] else 'FAIL'}  {c['check']}: {c['value']}")
    print("RESULT", "PASS" if not fail else "FAIL")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
