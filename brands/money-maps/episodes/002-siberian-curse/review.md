# Money & Maps 002 "174,000 People Live in This Arctic City. No Road Leads There" (the Siberian curse) — review

Final: render run 43825916074 (branch `ep/c002-siberian-curse`), 10:40, 1920×1080 @ 24 fps, AAC 48 kHz stereo, 12 chunks. QA result and loudness: see STATUS / WORKLOG entry of the same day (render 43823518911 passed everything except true peak −0.4 dBTP → 4× oversampled limiter added, re-rendered).
Package: `UPLOAD.md` (3 titles, 7 chapters, sources, credits, not-financial-advice line), `captions.srt` (145 cues), 3 thumbnails rendered at 1920×1080.

## Topic choice (docs/research/topic-scout-2026-11-15.md)
14 candidates from 3 parallel scouts. Russia-geography demand is proven (Johnny Harris 7.4M, RealLifeLore 5.3M, RLL Yakutsk 2026 745K — mirror counts) but nobody covers the economics of the cold (Hill & Gaddy, *The Siberian Curse*, Brookings 2003); pays off the C001 end-screen tease. Score 33/35.

## Process
- Packaging gate before the script (3 titles, 3 thumbnail ideas) + `promises.json` (10 promises, all paid, longest gap ~4.5 min). Title 1 and thumbnails redone after C001's real CTR (1.7 %): specific paradox title, number-led bright thumbnails (174,000 / −37 °C / 2× pay).
- `sources.md` ~75 rows; unverifiable claims dropped ("23 of 25 coldest cities", cost-of-cold % of GDP, exact TPC values, 2 M Vorkutlag).
- Stills: 3 rounds + 1 verification round, every sheet looked at.
- Independent review 1 (fresh agent): FAIL 6.5 (3 Critical, 14 Important). Review 2 (another fresh agent): FAIL 7.0 (round-1 items mostly fixed; 4 new Important). All Critical/Important fixed except region outlines (no admin-1 boundary data in the engine; regions remain text labels). No third review was run after the last fixes.
- Engine (opt-in): fly-to camera (van Wijk), `City.dot/note`, art `points` (circled lights), `BarDatum.valueText` (ranges, never midpoints), title-card auto size, `fetch_media` crop/max/src/gamma, Mercator rotates to camera longitude; audio: 20 dB ducking with gap bridging, phone voice chain, per-sentence prosody, fp32 Kokoro, 4× oversampled true-peak limiter; thumbnails at 1920×1080.
- Incidents: Kokoro int8 returned inf/NaN on the 16 Nov runner image (fixed with fp32); final render 1 failed true peak (−0.4 dBTP).

## Scores /10 (honest)
Hook 8 · clarity 7.5 · visuals 7 · motion 7 · sound 6.5 (not heard on a phone; new chain + ducking untested by ear) · accuracy/sourcing 8.5 · originality 8 → **7.5/10**

## Top 3 weaknesses
1. **Many maps are pale and label-driven**: Siberia, the Far East, Khanty-Mansi, Yamal and Chukotka are text labels, not outlined regions (no admin-1 data yet); several dimmed text cards remain (c3c, c4j, c5g, c5h, c6c).
2. **Voice**: still Kokoro (now fp32 + chain + prosody). Nobody has listened on a phone speaker; Aymen should, before upload.
3. **Few real modern photos of the places themselves**: Norilsk and Yakutsk are shown from space or as map dots; no PD/CC0 street-level photos were found in time.

## Not done / disclosed
- No phone-speaker listening test. No third independent review after the round-2 fixes.
- "Altered or synthetic content": No (no realistic people; synthetic narration only).
- End screen teases phantom borders ("borders that vanished 100 years ago still decide who is rich") — that must be the next Money & Maps video, or edit the teaser.
