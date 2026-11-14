# LESSONS — read before every new script

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

## From Scale & Science 001 (biggest animal, 14 Nov 2026)
1. Size-comparison stages need label rules, not hand placement: labels avoid the title, chips, tracker AND other animals' bodies; fall back inside their own body; hide when the subject's top is off-frame; leader line when lifted. Without this a label landed on the wrong animal (reviewer Critical).
2. Log-space pull-backs (krill → whale, you → whale) spend most of their time zoomed in: add a mid key so the big subject is in frame by ~50 % of the scene, or the payoff line plays over empty sea.
3. Never show mid-animation numbers ("22.3 m") while an estimate grows; show the sourced range. Never round a sourced value to a "nicer" one (114 → 115 slipped in once); round only conversions.
4. Narration and on-screen units must match exactly ("each line is one metre" vs a 50 cm grid; "33 m" vs "33.5 m"; tons vs tonnes) — the reviewer catches all of them.
5. Discovery stories need the paper, not the press: Ichthyotitan was found first by a collector, then by a girl and her father.
6. Per-channel media releases (`media_release` input) so one channel's media rebuild never breaks another's renders.
7. Fat silhouettes read as sunfish: check proportions on the first stills (shark depth ≈ 0.2 × length).

## From published videos (fill after 48 h per upload)
| Video | CTR | Avg % viewed | 30-s drop | Viewed vs swiped | Lesson |
|---|---|---|---|---|---|
