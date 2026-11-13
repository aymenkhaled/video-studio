# 000-stage-demo — review (engine test, not for upload)

Final: render 43465248751, 20.0 s 1080×1920 30 fps, AAC 48 kHz stereo, −14.0 LUFS, −1.7 dBTP, QA PASS (black/freeze/silence clean). Render: 10 chunks × 2 tabs, 0.88 fps/job mean, ~6 min wall total.

Scores /10: hook 6 · clarity 6 · visuals 5 · motion 6 · sound 6 (not heard on a phone speaker yet) · originality 5 → **6/10 as engine test**.

Works: person + T. rex together on frame 1; gait-matched walk (no sliding); live counters, brackets, comparison bars; voice-synced word captions; loudness compliant.

Top 3 weaknesses:
1. Framing: T. rex head cropped in hook and pass shots; at 3.3 s it fills the frame and hides the person.
2. The 12.3 m bracket runs off-screen in the pass shot — full rex vs bus length never visible in one frame.
3. Lower ~30 % of the frame is still empty ground in several shots.

Engine lessons: alpha-texture foliage is ~6× slower on software WebGL; 2 tabs per 4-vCPU job for 3D.
