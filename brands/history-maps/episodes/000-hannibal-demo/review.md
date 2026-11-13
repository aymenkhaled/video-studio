# 000-hannibal-demo — review (map engine test, not for upload)

Final: render 43488948171 — 63.9 s, 1920×1080, 24 fps, AAC 48 kHz stereo, −14.3 LUFS, −2.2 dBTP, QA PASS (black/freeze/silence clean). 4 chunks, **15.8 fps/job**, whole run ≈ 6 min (plan with voice ≈ 3 min).

Voice-first timing worked: 10 narration lines → 5 scenes → 63.9 s, no manual timing.

Scores /10: hook 5 · clarity 7 · visuals 7 · motion 6 · sound 6 (Kokoro voice; not phone-tested) · originality 6 → **6.5/10 as engine test**.

Works: clean parchment map style; territories grow and clip to coastlines; route draws with the army marker at its tip; claimed-vs-counted numbers with on-screen Polybius citations; timeline bar; cross-dissolves.

Top 3 weaknesses:
1. Hook: frame 0 is a quiet wide map — needs a stronger cold open (a question, a number, motion) in the first 5 s.
2. Label collisions (army marker over "CISALPINE GAUL") — needs automatic label avoidance.
3. Territories are hand-drawn approximations; for real episodes use sourced historical boundary data (check licence) and say "approximate" in the description.

Engine lessons (QA caught them): constant camera push needed (freezedetect); AAC adds ~0.4–0.8 dB true peak → normalise to −2.5 dBTP; geometry culling + LOD = 10× speed; Kokoro int8 intermittently returns silence → jitter/sentence-split fallback.
