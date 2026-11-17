# LESSONS — read before every new script

> Raw lesson log. Every lesson below is merged into **[`docs/PLAYBOOK.md`](PLAYBOOK.md)** (the single source of truth, with research evidence and status). Read the playbook first; add new raw notes here and a row there.

## From the old work (Phase 0 review of 8 films, all ≤5/10; details in INVENTORY.md and REFERENCE_AUDIT_dtf.md)
1. Frame 1 must show a readable subject on a phone. The Sound opened on a dark belly close-up; Whip opened on an empty landscape.
2. No black end cards. They kill the loop and the replay signal. End on motion that matches frame 1.
3. Fill the 9:16 frame. Empty bottom 40 % (Horn Lock), letterboxing (Egg Thief), and empty sky (Softest Prey) all wasted the screen.
4. Real locomotion: walk cycles with foot contact, not a body sliding across the ground.
5. One model recoloured is not two characters. Vary species, scale, or silhouette.
6. QA must fail the job. Warnings that return exit code 0 let weak films ship.
7. Loudness compliance ≠ good sound. Someone must actually listen on a phone speaker.
8. Write the format contract first. The OpenCode run optimised for "wordless paper-cut", which was never what the channel needed.
9. Fog flattens low-poly. Use contrast and rim light, not haze, for depth.
10. 2–600 views on the dinosaur Shorts: topic and hook were weak, there was no seed audience, and no title/thumbnail testing.

## From production of episode 001 (Hannibal, 13 Nov 2026)
11. Superlatives ("most complete", "largest in history") slip into scripts; the independent reviewer must check every one against a source.
12. Every on-screen number needs an attribution in-frame ("Polybius 3.35"), and contested numbers need both sources.
13. Motion: eased camera keyframes start at zero speed — always add absolute-time drift; dark cards over moving maps read as frozen.
14. Kokoro int8 occasionally returns silence; the cache + jitter + sentence-split fallback handles it. Cache TTS lines: first run ~1.7× real time, re-runs ~free.
15. Captions must show numerals ("216 BC"), not TTS spelling.

## From Aymen's feedback + episodes 001 v2 / 002 (14 Nov 2026) — the standard for every new video
Read with `docs/VIEWER_CLARITY_FEEDBACK.md` (owner checklist) and `docs/CLARITY_STANDARD.md`. Engine: all of this is the opt-in Clarity Kit (`HistoryEpisode clarity={...}`, `MapSpec.modern/avoidLabels/relief/minText`, scene kind `art`, `BattleShot` figures + `phases`). Start new episodes by copying `brands/history-maps/episodes/002-carthage/` (scenes.ts patterns, timeline, sources table with a "For the description" bullet list).
1. Never open on a diagram. First 5 s = a real PD painting/artefact + where, when, WHO and why in plain words.
2. Zero-background viewer: every person (card at first mention, watch duplicate names), term (≤ 8-word pop-up), place (then → now "today:" line) and number (context: tonnes, stadiums) explained the moment it appears.
3. Real visuals: PD/CC0/CC BY art through `assets/media.json` → `render.yml mode=media` → release media-v1 (Wikimedia rate-limits; never fetch per render). No AI realistic people. Illustrated figures, never NATO boxes.
4. Captions 46 px (Aymen: 54 px was too big), pop-ups ~32 px. Owner's taste beats the checklist number.
5. Labels: bounded shifts only (a label must stay next to its own dot); clarity panels are obstacles; off-screen anchors are hidden, never pinned to the frame edge.
6. Every scene ≤ 15 s (`tools/check_episode.mjs`); split long two-line scenes. "So far" recap + open loop at each chapter end; 20 s end screen teasing the next video.
7. Always run a fresh independent reviewer (facts vs sources.md, licences, policy, clarity) before the final render — both episodes FAILED the first review (6.5 and 7.0) on fixable things: labels on wrong dots, unsourced superlatives, contradictory comparisons, wrong chronology.
8. Audio: new SFX transients broke true peak once → keep the −3 dBFS limiter after loudnorm; nobody has phone-tested Kokoro yet (flat over 12 min) — evaluate Chatterbox (MIT).
9. Work fast and report early: Aymen wants short answers and simple work when he asks for something small; long silent runs frustrate him.
10. Upload rhythm: schedule episodes ~3 days apart, pinned question comment, reply to all comments in 48 h; end screens link the episodes both ways.

11. Inspiration (optional, not a rule): Aymen liked a Storyhub-style reel ("you" framing, continuous camera, living backgrounds, micro-animation, comment-question ending). Use only what suits a given video.

## From Money & Maps 001 Switzerland (14 Nov 2026)
1. Charts freeze: an animation that finishes at 60 % of a 12 s scene leaves > 2 s of static frame → freezedetect FAIL. Every scene kind needs a living camera (push-in + absolute-time drift), not only maps.
2. Country-name labels must never be relocated far: give them `maxShift` + `drop` so a blocked label hides. Tiny countries (Liechtenstein) get a city marker in the one scene that needs them, not a permanent modern label.
3. Money captions: TTS lines spell numbers; the caption converter now handles "$", "%", million/billion, "twenty twenty-four" and "nineteen hundred seven". Avoid "point" decimals and "oh" years in narration; the converter cannot show them.
4. Economic facts need the definition behind the number: export totals exclude gold (BAZG business-cycle total), industry-body superlatives must be attributed ("according to the Swiss Bankers Association"), a money number without a year is dropped rather than shown.
5. The reviewer caught a real fact error (Swiss patents existed from 1888 but excluded chemicals until 1907). Always check "had no X law" claims against a primary or academic source.
6. Balance on neutral/banking stories: one sourced line on the critical record (Bergier Commission 2002) keeps the tone factual, not promotional.
## From Scale & Science 001 (biggest animal, 14 Nov 2026)
1. Size-comparison stages need label rules, not hand placement: labels avoid the title, chips, tracker AND other animals' bodies; fall back inside their own body; hide when the subject's top is off-frame; leader line when lifted. Without this a label landed on the wrong animal (reviewer Critical).
2. Log-space pull-backs (krill → whale, you → whale) spend most of their time zoomed in: add a mid key so the big subject is in frame by ~50 % of the scene, or the payoff line plays over empty sea.
3. Never show mid-animation numbers ("22.3 m") while an estimate grows; show the sourced range. Never round a sourced value to a "nicer" one (114 → 115 slipped in once); round only conversions.
4. Narration and on-screen units must match exactly ("each line is one metre" vs a 50 cm grid; "33 m" vs "33.5 m"; tons vs tonnes) — the reviewer catches all of them.
5. Discovery stories need the paper, not the press: Ichthyotitan was found first by a collector, then by a girl and her father.
6. Per-channel media releases (`media_release` input) so one channel's media rebuild never breaks another's renders.
7. Fat silhouettes read as sunfish: check proportions on the first stills (shark depth ≈ 0.2 × length).
8. Caption numerals can be WRONG, not just ugly: "Even one twenty-four metres long" was captioned "25 metres" (one + twenty-four merged). Never put two number words next to each other in the script, and run `tools/caption_numbers.mjs <timeline.json>` before every render and read every line against sources.md. Also check the final contact sheet captions — this was caught only there.
9. QA freezedetect fails on finished 2D charts: bars/timelines that stop animating for > 2 s froze 12 times in the first full render. Every scene kind needs constant motion (slow push + drift); compare/deeptime now have it built in.
10. Parallel sessions merge to main while you work (Money & Maps 001 landed mid-episode). Merge `origin/main` INTO your branch inside your own worktree, resolve, typecheck + test, then `git push origin HEAD:main`. Never run a conflicting merge in the shared `D:\studio` checkout.
11. Start the independent reviewer subagent while the next stills round renders (they don't depend on each other) — saves ~30 min. Its first verdict was FAIL 7/10 on fixable things, again.
12. Semrush MCP had no API units: check demand with web search / competing videos instead; don't block on it.
13. Big patch edits: write a Python fix script to a file and run it; shell heredocs broke twice on quotes/newlines.
14. Channel B start pattern: copy `brands/scale-science/episodes/001-biggest-animal/` (build_timeline.py → timeline.json, scenes.ts helpers for you/bus/whale/court, ROW/DT tables), render with `media_release=media-b001` (or a new per-episode release) and `concurrency=2` when a 3D custom scene is in it.

## From Aymen's feedback on Scale & Science 001 (15 Nov 2026) — CRITICAL
1. **Flat silhouettes kill interest.** Aymen: "big fish, small fish, medium fish — 0 realistic images, why would anyone watch?" Size videos need REAL-looking animals on the scale stage, not shapes. Silhouettes are allowed only as a "?" mystery or a tiny legend icon.
2. Fix (to build): scale stage shows licensed realistic art as cut-outs at exact scale — PD NOAA/Smithsonian illustrations and CC BY / CC0 paleoart (e.g. megalodon: Mary Parrish/Smithsonian PD, O. Demuth CC BY 4.0, H. Salais CC BY 4.0; Argentinosaurus: Nobu Tamura CC BY 3.0; Ichthyotitan: CC0 lateral view) — background removed in CI, gentle swim/sway motion, real photo/footage b-roll (NOAA PD video) between scale shots, realistic 3D (licensed models) for hero shots.
3. Judge a stage by a phone thumbnail test: would a stranger stop scrolling for this frame? If it looks like an infographic, it fails.

## From Scale & Science 002 (giant waves, 16 Nov 2026)
1. Realism without animals: real photos of the actual places (USGS/NASA PD) + real CC0 landmark photos cut out by U-2-Net (`"cutout": true` in media.json) + animated water. Check before choosing a cut-out photo that the object stands free to the ground (skyscrapers almost never do → shaded profile instead).
2. "Last August" in a script dated later is wrong on frame 1: always write the year ("In August 2025").
3. A run-up is not a wave height: titles/thumbnails must say "climbed", not "a wave taller than". Modelled numbers say "modelled".
4. "Every X ever" titles invite the one you forgot (Vajont) — list the set in sources.md and check it against Wikipedia's list before writing.
5. Never draw a measurement line at an arbitrary height on a perspective photo; use a label chip ("trimline, approx.") instead.
6. Caption year rule: "two thousand people" must stay a count (2,000); year format only after "in/since/by…".
7. Eyewitness numbers: quote them exactly as the source gives them (Ulrich: ~30 m mid-bay, 15–23 m at his boat).
8. Photo Ken Burns ran at ~50 % of runtime before review; keep a count while storyboarding (≤ 30–35 %).
9. ScienceBase (USGS data releases) sits behind a Cloudflare bot check: don't bypass; ask Aymen for a one-time manual download if the footage is essential.

## From Money & Maps 002 (Siberian curse, 16 Nov 2026)
1. Kokoro int8 broke on the 16 Nov runner image (inf/NaN → "silent", `overflow encountered in square` in kokoro_onnx.trim); cached lines hide it. Use `voice.model: "fp32"` for any new narration.
2. Compressed voice + 20 dB ducking pushed true peak to −0.4 dBTP through the −3 dBFS sample limiter + AAC. Use `mix.tp_oversample` (limit at 4× rate) whenever `voice.chain` is on.
3. Ranges must stay ranges on screen: a share bar of "15–18 %" drawn at 16.5 rounded to "17 % / 84 %" (sums to 101 %, invented midpoint). Use `BarDatum.valueText` ("15–18%") and never a midpoint; counters that tick up must not be used for ranges.
4. Picture must match the sentence's time and season: a 1910 photo under "under Stalin"/1953, an August wildfire image under "−37 °C in January" — both reviewer findings. Check every art scene's date against the line.
5. Dimmed list/quote cards over maps add up fast (18 of 71 scenes in round 1). Prefer a chart, a labelled map or a photo; keep text cards for recaps and the one key quote.
6. Mixed-area charts mislead (land/people for Siberia + Far East vs oil for "Western Siberia", which is mostly the Ural district). One chart = one area definition, or use a map with separate labelled layers.
7. Text that fades with `fillOpacity` but a full-strength stroke reads as a black smear mid-fade; fade the whole text (`opacity`). Fixed in the engine for city notes.
8. NASA Black Marble needs a crop of the 43200 px original (`crop`, `max`) and a gamma lift (`gamma: 1.9`) to read on a phone; circle the one light you talk about (`art.points`) or viewers can't find it.
9. `tools/package_episode.py` takes every `- ` line in sources.md as a description source: keep "do not use" lists as `* ` and end sources.md with a "For the description" list.
10. Second independent review is worth it: it found 4 new Important issues (counter timing, an illegible promise label, a misleading payoff chart) after the first round was "fixed".

## From published videos (fill after 48 h per upload)
| Video | CTR | Avg % viewed | 30-s drop | Viewed vs swiped | Lesson |
|---|---|---|---|---|---|
| A001 Hannibal v2 (14 Nov, ~44 h: 1.1K impr., 27 views, +2 subs) | **0.1 %** | **39 %** (AVD 4:35 of 11:44) | not shared yet | 15 browse / 5 suggested / 7 other; 71 % Tunisia | Clarity Kit works for retention (39 % vs B001 10 %); packaging fails: dark, faceless, generic thumbnail + generic title. Design the thumbnail (face/figure, bright, one number) before the script; Test & Compare 3. Details: `docs/analytics/history-maps.md` |
| B001 biggest animal (14 Nov, ~34 h: 650 impr., 22 views, 0 subs) | **1.5 %** | **10 %** (AVD 1:14 of 12:19) | not shared yet | 14 suggested / 3 browse / 5 other | Flat silhouettes + context-first opening + flat voice lost viewers in the first minute; crowded topic + weak thumbnail → low CTR. Fixed in B002 (real photos/cut-outs, promise in 7 s, less-saturated angle). Details: `docs/analytics/scale-science.md` |
| B002 giant waves (16 Nov, ~39 h: 809 impr., 32 views, 0 subs) | **1.5 %** | **34 %** (AVD 3:55 of 11:14) | not shared | 22 suggested / 7 browse / 3 other | Real photos + promise in 7 s tripled retention (10 → 34 %). CTR unchanged → thumbnails/titles are now the bottleneck: show the size contrast itself, test 3 variants. |
| C001 Switzerland (14 Nov, ~33 h: 477 impr., 27 views, +2 subs, 2.1 h watch) | **1.7 %** | **39 %** (AVD 4:40 of 11:57) | not shared yet | 19 suggested / 4 direct / 4 other | Retention good for 12 min (same 39 % as A001): charts + money context + clarity work. Packaging is the bottleneck: CTR 1.7 % on a crowded topic. Next: thumbnail with one big surprising number + real image, title with a specific paradox, run Test & Compare. Details: `docs/analytics/money-maps.md` |
| C002 Russia Arctic city (16 Nov, ~25 h: 712 impr., 73 views, 0 subs, 2.0 h watch) | **2.0 %** | **36 %** (AVD 3:53 of 10:41) | not enough data yet | 41 browse / 27 suggested / 5 other | Number-led paradox title + bright number thumbnails: CTR 1.7 → 2.0 % and 2.7× the views of C001 in less time; Browse (home page) now the top source, so YouTube is testing it with new viewers. Retention held (36 %). Still below 4 % CTR target. Details: `docs/analytics/money-maps.md` |
