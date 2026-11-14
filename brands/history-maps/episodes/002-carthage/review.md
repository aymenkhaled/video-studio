# 002-carthage — review

Final: render run 43536415513 (branch `ep/002-carthage`) — 11:43 (703.5 s), 1920×1080, 24 fps, AAC 48 kHz stereo, −14.6 LUFS, −2.1 dBTP, QA PASS (black / freeze / silence clean). 12 chunks. Package: `UPLOAD.md` (3 titles, chapters, sources, CC BY credits), `captions.srt` (193 cues, built from the same cue logic as the burned-in captions), 3 thumbnails with PD art. Local copy: `out/002-carthage/` (git-ignored).

## Process
- 4 stills rounds (round 1 found small text, clipped labels and no real imagery; Aymen's feedback then triggered the v2 engine work; rounds 2–4 fixed relief edges, label/panel collisions and off-screen country labels).
- Independent reviewer (fresh agent, did not build it): **FAIL 6.5/10** on the round-3 stills. Every Critical/Important finding was fixed in one pass: the "a 0 years" caption bug (tested), siege chronology (Scipio now takes command before the dam and secret channel, per Appian 121), hedges (Scipio's curse, "by tradition" 600 years), 9 missing source rows, contradictory stadium comparisons, pop-ups colliding with panels, modern country labels pinned to the frame edge on close-ups, label overlaps, intros for Zama / Emporia / Caesar / Augustus / Homer, renumbered siege phases, full CC BY credits, a photo that did not show the harbour. The fixes were verified on a fresh stills run; no second independent review was run.
- Hannibal regression: 12 stills before and after the engine changes are visually identical (no captions, legend or modern borders leaked into episode 001).

## Scores /10 (honest)
Hook 7 · clarity 8 · visuals 7.5 · motion 6.5 · sound 6 (not heard on a phone speaker) · originality 7 → **7/10**.

## Top 3 weaknesses
1. **Voice:** Kokoro is clear but still fairly flat over 12 minutes, even with per-scene pacing. Nobody has listened on a phone speaker yet (Claude cannot), so Aymen should do that before upload. Next step: benchmark Chatterbox (MIT, emotion control) on CI CPU.
2. **Image resolution:** several PD sources are small (engravings 696–734 px wide, Turner 1536 px), so full-frame art shots are soft at 1080p. Sharper museum scans (Tate and National Gallery downloads, NYPL originals) would help.
3. **The siege is a schematic plan:** figures, phases and a legend, but no troop numbers (no reliable source) and a sparse layout. North Africa has no rivers at Natural Earth 1:50m, and the relief is coarse at close zoom.

## Not done / disclosed
- No phone-speaker listening test.
- The "Altered or synthetic content" flag is set to No: no realistic people, and the depth model only splits real artworks into layers.
- The 1958 postcard (ports-1958) is PD by Commons tags (PD-Tunisia + PD-US/URAA). The reviewer noted it looks like a modern colour aerial photo; if in doubt, swap it for the CC BY Rickards photo.
