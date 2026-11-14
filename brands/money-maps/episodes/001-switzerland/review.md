# Money & Maps 001 "Why Is Switzerland So Rich?" — review

Final: render run 43616583892 (branch `ep/c001-money-maps`) — 11:58 (717.9 s), 1920×1080, 24 fps, AAC 48 kHz stereo, −14.5 LUFS, −2.2 dBTP, **QA PASS** (black / freeze / silence clean). 12 chunks. Package: `UPLOAD.md` (3 titles, 9 chapters, sources, credits), `captions.srt` (163 cues from the same cue logic as the burned-in captions), 3 thumbnails (1 and 3 re-rendered after the ≤ 3-words fix: runs 43616744000 / 43616747282). Channel art: `MoneyAvatar` (800×800) and `MoneyBanner` (2560×1440, text inside the central 1546×423). Delivered to `D:\deep-time-fables\money-maps-episode-001\` (video never committed).

Topic choice: "Why is Switzerland so rich?" had the strongest proven demand — a 12.9K-subscriber channel's video on it reached ~199K views in 6 weeks vs ~18K for Egypt on the same channel; Russia showed little.

## Process
- Research → `sources.md` (49 rows, every money number with year + currency; CALC rows re-done by the reviewer, all correct).
- New shared engine (opt-in): scene kind `chart` (bar / line / share / proportional area / pictogram, source + year in frame, "how to read" line, living camera), `MapSpec.choropleth` (Natural Earth countries by value, viridis classes + value labels + outline as second cue, legend), money captions (`$`, `%`, million/billion, 2020s years, "nineteen hundred seven"), label `drop` (country names hide instead of drifting), "today / N years ago" timeline, train / clock / pop / wind SFX. 14 unit tests pass, typecheck clean.
- 3 stills rounds. Round 1 found country names drifting onto other countries (Liechtenstein in France, etc.), Basel hidden by Lörrach, a clipped share label, glossary vs "how to read" overlap, "AD 2024". Round 2/3 verified the fixes.
- Independent reviewer (fresh agent): **FAIL 6.5/10** on round-1 stills. Fixed in one pass: patent fact (1888 law excluded chemicals until 1907), label drift, Basel, "people in Switzerland ate grass" (not "here"), Lucerne/Appenzell pop-ups, "Geneva joined Switzerland in 1815", export / import / exchange-rate / guarantee pop-ups, "not counting gold" on export charts, bank figure attributed to the Swiss Bankers Association (no per-resident framing), "partner countries" for AEOI, savings amount dropped (source has no year), script/screen sync (money line moved to the area chart; exchange-rate line kept on the line chart), Bergier Commission line for balance, "mostly mountains", "a quarter live in the mountains", c8d replaced by new content. No second independent review was run.
- Full render 1 failed QA on freezedetect (13 static chart scenes after their animation ended) → charts got the maps' living camera (push-in + absolute-time drift); render 2 QA PASS.

## Scores /10 (honest)
Hook 7.5 · clarity 8 · visuals 7.5 · motion 7 · sound 6 (not heard on a phone speaker) · originality 7.5 → **7.5/10**.

## Top 3 weaknesses
1. **Voice:** still Kokoro (now `af_heart`); clear but flat over 12 minutes. Nobody has listened on a phone speaker (Claude cannot). Aymen should listen before upload. Chatterbox (MIT) evaluation still pending.
2. **Few modern photos:** all real images are historical (photochroms c. 1890–1900, paintings, a 1650 watch) or NASA satellite photos; no PD/CC0 modern photo of Basel pharma, Zurich banks or the Gotthard Base Tunnel (most are CC BY-SA, rejected). Frame 1 has no Swiss border drawn on the satellite photo (reviewer note, not fixed).
3. **Relief and close-up maps:** Natural Earth 1:50m relief is faint on the light Money & Maps land colour and coarse at country zoom, so "the Alps" are a label more than a visible shape on maps; the satellite photo carries that job instead.

## Not done / disclosed
- No phone-speaker listening test; no second independent review after fixes.
- "Altered or synthetic content": No (no realistic people; synthetic narration only).
- The end screen teases "Why is Russia so big, but so empty?" — that video must be made next (or edit the teaser).
