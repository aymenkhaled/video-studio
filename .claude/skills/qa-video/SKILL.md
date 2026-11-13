---
name: qa-video
description: Quality-check a rendered video (technical, visual, licence, policy) and produce a PASS/FAIL report. Use after every render and before packaging.
---

# qa-video

Automated part runs in CI (`tools/qa_video.py`, job `qa`); any failure fails the job.

## Technical (CI)
- ffprobe: expected width/height/fps/duration (±1 frame); audio 48 kHz stereo AAC.
- `ebur128=peak=true`: integrated −14 ±1 LUFS, true peak ≤ −1.5 dBTP.
- `blackdetect` (d=0.5), `freezedetect` (n=0.003, d=2), `silencedetect` (−50 dB, d=1.5): any hit must be listed in the episode's `shots.json` as intentional.
- Metadata stripped (`-map_metadata -1`).
- Contact sheet: 12 frames (Shorts) / 24 frames (long), labelled with timecodes.

## Visual (you, every time)
Open the contact sheet and frames 0, 15, 30. Check: subject readable on a phone at frame 0; nothing key in the bottom 420 px / right 120 px (Shorts); no broken layer edges, empty corners, or text overlaps; motion rules (nothing static > 3 s, eased moves, parallax). Write findings with timecodes.

## Independent review
Spawn one reviewer subagent that did not build the video. Give it the contact sheet path, `script.md`, `sources.md`, `docs/LICENSES.md`. Ask for PASS/FAIL with reasons on: facts vs sources, licences, policy (violence, first 7 s, AI people, copyrighted media), readability.

## Report
Write `qa.md` in the episode folder: each check, value, PASS/FAIL, plus anything not performed (state it plainly).
