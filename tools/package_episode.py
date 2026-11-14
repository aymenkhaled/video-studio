"""Build upload package files from the episode timeline + generated voice timing.

Usage: python tools/package_episode.py <timeline.json> <timing.json> <episode_dir> <out_dir>
Writes <out_dir>/UPLOAD.md and <out_dir>/captions.srt. Reads <episode_dir>/package.json (titles, hook,
hashtags, credits) and <episode_dir>/sources.md (primary-source lines).
"""

import json
import re
import sys
from pathlib import Path

tl_path, timing_path, ep_dir, out_dir = map(Path, sys.argv[1:5])
tl = json.loads(tl_path.read_text(encoding="utf-8"))
timing = json.loads(timing_path.read_text(encoding="utf-8"))
pkg = json.loads((ep_dir / "package.json").read_text(encoding="utf-8"))
out_dir.mkdir(parents=True, exist_ok=True)


def ts(sec, srt=False):
    h, rem = divmod(max(0.0, sec), 3600)
    m, s = divmod(rem, 60)
    if srt:
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"
    return f"{int(h)}:{int(m):02d}:{int(s):02d}" if h else f"{int(m):02d}:{int(s):02d}"


# ---------- chapters (YouTube: first at 00:00, ≥3 chapters, each ≥10 s) ----------
starts = {s["id"]: s["start"] for s in timing["scenes"]}
chapters = [(0.0 if i == 0 else starts[sid], title) for i, (sid, title) in enumerate(pkg["chapters"].items())]
chapters.sort()
for (a, _), (b, t) in zip(chapters, chapters[1:]):
    if b - a < 10:
        raise SystemExit(f"chapter '{t}' starts {b - a:.1f}s after the previous one (<10 s)")

# ---------- spoken-form numbers → numerals in captions ("two hundred sixteen B C" → "216 BC") ----------
UNITS = {w: i for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split())}
TENS = {w: 10 * (i + 2) for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}


def _num_value(words):
    total, cur = 0, 0
    for w in words:
        for part in w.split("-"):
            if part in UNITS:
                cur += UNITS[part]
            elif part in TENS:
                cur += TENS[part]
            elif part == "hundred":
                cur *= 100
            elif part == "thousand":
                total += cur * 1000
                cur = 0
    return total + cur


def numerals(text):
    toks = text.split(" ")
    out, i = [], 0
    is_num = lambda t: all(p in UNITS or p in TENS or p in ("hundred", "thousand") for p in re.sub(r"[^a-z\-]", "", t.lower()).split("-") if p)
    while i < len(toks):
        j = i
        while j < len(toks) and re.sub(r"[^a-z\-]", "", toks[j].lower()) and is_num(toks[j]) and (j == i or not re.search(r"[.,;:?!]$", toks[j - 1])):
            j += 1
        run = toks[i:j]
        bc = j + 1 < len(toks) + 1 and j < len(toks) and toks[j] == "B" and j + 1 < len(toks) and re.match(r"^C\b", toks[j + 1])
        clean = [re.sub(r"[^a-z\-]", "", t.lower()) for t in run]
        if run and (bc or any(c in ("hundred", "thousand") for c in clean)):
            trail = re.sub(r"^[A-Za-z\-]+", "", run[-1])
            val = f"{_num_value(clean):,}" if not bc else str(_num_value(clean))
            if bc:
                out.append(f"{val} BC{re.sub(r'^C', '', toks[j + 1])}")
                i = j + 2
            else:
                out.append(val + trail)
                i = j
            continue
        out.append(toks[i])
        i += 1
    return " ".join(out)


# ---------- captions ----------
cues = []
for line in timing["lines"]:
    words = line["words"]
    text = line["text"]
    if len(text) <= 84:
        cues.append((line["t"], line["t"] + line["duration"], text))
        continue
    # split long lines at sentence/comma boundaries into chunks of ≤ ~84 chars using word timings
    chunk = []
    for w in words:
        chunk.append(w)
        joined = " ".join(x["w"] for x in chunk)
        if len(joined) >= 60 and (re.search(r"[.,;:?!]$", w["w"]) or len(joined) > 84):
            cues.append((chunk[0]["t"], chunk[-1]["end"], joined))
            chunk = []
    if chunk:
        cues.append((chunk[0]["t"], chunk[-1]["end"], " ".join(x["w"] for x in chunk)))
srt = "\n".join(f"{i + 1}\n{ts(a, True)} --> {ts(b, True)}\n{numerals(t)}\n" for i, (a, b, t) in enumerate(cues))
(out_dir / "captions.srt").write_text(srt, encoding="utf-8")

# ---------- sources from sources.md ----------
# YouTube descriptions are plain text: drop markdown emphasis (*Title*) but keep '*' inside URLs.
src_lines = [re.sub(r"\*([A-Za-z][^*]*?)\*", r"\1", l.strip("- ").strip()) for l in (ep_dir / "sources.md").read_text(encoding="utf-8").splitlines() if l.startswith("- ")]

dur = timing["duration"]
md = [f"# UPLOAD — {pkg['titles'][0]}", "", f"Length: {ts(dur)} · Render: see release / artifact `final.mp4` · Thumbnails: `thumb_1..3.jpg`", "",
      "## Titles (Test & Compare — add all 3)", *[f"{i + 1}. {t}" for i, t in enumerate(pkg["titles"])], "",
      "## Description (copy everything in the box)", "```", pkg["hook"], "", "Chapters:",
      *[f"{ts(a)} {t}" for a, t in chapters], "", "Sources:", *[f"- {s}" for s in src_lines], "",
      "Credits:", *[f"- {c}" for c in pkg["credits"]], "", " ".join(pkg["hashtags"]), "```", "",
      "## Settings checklist",
      "- [ ] Audience: **No, it's not made for kids**",
      "- [ ] Altered or synthetic content: **No** (no realistic people or events are depicted; narration voice is synthetic but this label is for realistic content)",
      "- [ ] Category: **Education** · Language: **English** · Caption certification: none needed",
      "- [ ] Upload subtitles: `captions.srt` (English)",
      "- [ ] Test & Compare: upload thumbnails 1–3",
      "- [ ] Auto-dubbing: enable, then review the dubs before publishing",
      "- [ ] End screen: subscribe + next video / playlist (from 20 s before the end)",
      f"- [ ] Pinned comment: {pkg['pinned_comment']}",
      "- [ ] After 48 h: record CTR, average % viewed, 30-s retention in docs/LESSONS.md", ""]
(out_dir / "UPLOAD.md").write_text("\n".join(md), encoding="utf-8")
print(f"packaged: {len(chapters)} chapters, {len(cues)} caption cues, duration {ts(dur)}")
