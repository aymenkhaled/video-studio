# Money & Maps 003 "Germany Reunited 36 Years Ago. Its Money Map Didn't" (phantom borders) — review

Final: render run 44740760073 (branch `ep/c003-phantom-borders`), 9:23, 1920×1080 @ 24 fps, AAC 48 kHz stereo, 12 chunks.
QA PASS: loudness −14.8 LUFS, true peak −3.5 dBTP, no black/freeze/silence. Thumbnails re-rendered in run 44742634636.
Deliverables: `D:\deep-time-fables\money-maps-episode-003\` (final.mp4, contact_sheet.jpg, thumb_1..3, captions.srt, UPLOAD.md).

## Topic + packaging
Teased in C002's end screen; scout score 32/35. Number-led paradox title 1 (C002 pattern, CTR 2.0 %). Thumbnail 1 = our own money map with the ghost border glowing on the colour edge.

## Process
- Research by Claude (OpenCode paid credits gone); 41 source rows; honest twists kept: Poland's income gap **closed** (Grosfeld & Zhuravskaya), the viral Polish election map is mostly a smooth slope; "100-million-year coastline" replaced by sourced ">66 million years".
- Engine: regional choropleths from a geo file (`choropleth.file`), glowing ghost borders (`MapSpec.ghosts`), exact shared region edges extracted in `fetch_media.py` (inner German border = 1 clean line); media build reuses earlier media packs + hand-fetched `-src` release (Wikimedia 429s CI; NASA moved to assets.science.nasa.gov).
- Stills: 3 rounds (zoom ×2–4, framing, chart labels). Full render 1 failed silencedetect (chapter cards had no music) → soundtrack now carries the previous mood through mood-less scenes.
- No independent second review was run (cost); claims spot-checked against sources.md while writing.

## Scores /10 (honest)
Hook 8 · clarity 8 · visuals 7.5 · motion 7 · sound 6.5 (not heard on a phone) · accuracy/sourcing 8.5 · originality 8.5 → **7.7/10**

## Top 3 weaknesses
1. Historic 1914 borders and the Limes are our own approximate tracings (~10–15 km); Poland/Habsburg maps show no regional data under the line, only labels/lists.
2. Frame 1 is a pale map for ~0.8 s before the money colours fade in; several dimmed list/quote cards in chapters 2–3; Stuttgart label sits under a caption (c1f).
3. Two low-resolution photos (Europe at night 960 px, cotton farmers 500 px, framed); voice still Kokoro, no phone-speaker check; no second independent review.
