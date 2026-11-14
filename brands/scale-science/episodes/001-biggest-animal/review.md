# Scale & Science 001 — "How Big Was the Biggest Animal Ever?" — review

Final: render 43620053530, 12:25 (745.0 s), 1920×1080 @ 24 fps, AAC 48 kHz stereo, −14.2 LUFS, −2.7 dBTP, QA PASS (black / freeze / silence clean). 72 scenes, 1,519 words, every scene ≤ 15 s (`check_episode.mjs` PASS), typecheck clean, 15/15 engine tests.
Render cost: 20 chunks × 2 tabs, 14.9 fps/job mean (the 3D chunk ~5.6 fps), ≈ 9 min wall with cached TTS (`docs/BENCHMARK.md`).

## Process
- Topic: biggest animal ever (blue whale vs megalodon vs sauropods + Perucetus / Ichthyotitan). Semrush had no API units; chosen for evergreen size-comparison demand, fit with the channel, non-graphic subject and PD NOAA imagery.
- Stills: 4 cloud rounds (one per scene, 72 stills each), every sheet inspected. Round 1 → label system rebuilt (obstacles, inside fallback, leader lines, avoid other bodies), slimmer sharks, wider sauropod frames, 3D camera; round 2 → hidden labels for off-frame subjects, label pills; round 3/4 → reviewer fixes verified.
- Independent reviewer (fresh subagent): FAIL 7/10 with 1 Critical + 11 Important. All Critical/Important fixed and verified on stills: wrong label on whale (c4f), grid vs narration, empty frames mid pull-back, 33 vs 33.5 m, krill in tons, Argentinosaurus mass capped at sourced 65–83 t, Patagotitan 37 m sourced to the AMNH cast, Ichthyotitan discovery (collector first, then a girl and her father) and 22–26 m range, label collisions, source chips 26 → 30 px. Item 11 (raise all text to ≥ 34 px) only partly applied: Aymen asked for smaller UI after episode 002, so source chips are 30 px, scale labels 30–40 px. Item 12 (3D perspective) kept: the 3D shot is a hero moment, followed immediately by side-on 2D scale stages.
- Full render 1 failed QA (freezedetect: compare bars and one deep-time line went still after animating) → constant slow push + drift added to both kinds → render 2 PASS.

## Scores /10 (honest)
hook 7 · clarity 8 · visuals 7 · motion 7 · sound 6 (not heard on a phone speaker; Kokoro bm_george, synthesised SFX) · accuracy/sourcing 8 · originality 7 → **7.5/10**

## Top 3 weaknesses
1. 2D silhouettes are clean but flat: no texture or lighting on the animals, so long stretches look like an infographic; only ~25 s is 3D and the Apatosaurus walks with its head low and reads small in part A.
2. Voice: Kokoro is clear but flat over 12 minutes; nobody has listened on a phone speaker yet (Aymen to check before upload). Chatterbox (MIT) still not evaluated.
3. Some frames are busy: wide line-ups (c6b, c6f) have many labels with leader lines and small far subjects; chapter cards over scale scenes (c4, c6) have no photo.

## Next (logged)
- Textured / shaded silhouettes (gradient + rim light per species), more 3D hero clips via a cached clip library once a longer 3D budget is needed.
- Chatterbox voice evaluation; phone-speaker check by Aymen.
- Track CTR / average % viewed / 30-s retention after 48 h in `docs/LESSONS.md`.
