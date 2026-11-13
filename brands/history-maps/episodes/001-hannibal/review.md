# 001-hannibal — review

Final render: run 43517087620 — 10:30 (630.3 s), 1920×1080, 24 fps, AAC 48 kHz stereo, −14.5 LUFS, −2.1 dBTP. **Automated QA PASS** (black/freeze/silence clean; 3 s static end screen allowed). Independent reviewer: FAIL → all 7 required fixes applied (superlatives softened, figures attributed, Appian for elephants, treaty wording, licences, thumbnails, numeral captions) before this render.

Measured cost: plan (voice-first layout + cached TTS + score + mix + bundle) ≈ 4 min; 20 render jobs, 15,128 frames at 12.3 fps/job ≈ 2.5 min each incl. setup; combine + QA ≈ 2 min → **≈ 10–12 min wall per full re-render**. First TTS of a 10-min script without cache ≈ 17 min.

Scores /10 (honest): hook 6 · clarity 7 · visuals 6.5 · motion 6 · sound 5.5 (Kokoro voice is clear but flat over 10 min; music is simple; not yet heard on a phone) · originality 7 → **6.5/10**.

Top 3 weaknesses:
1. Voice: Kokoro `am_michael` is intelligible but monotone for long-form; retention risk. Test better free TTS (licence-checked) before episode 002.
2. Visual variety: ~70 % of the runtime is the same parchment map style; no terrain relief, no artwork/portrait cards, no 2.5D. Needs a third visual layer (period art, relief, illustrated cut-outs).
3. Battle diagrams are readable but schematic (blocks, no unit motion texture, labels occasionally under the bottom plates); the cold open could hit harder in the first 5 s.

Process lessons: QA gates caught 15 → 0 freezes (cards, eased starts on featureless zooms); fixes are now in the engine (absolute-time drift, scene-tied battle push, card scale, fine land grid). The independent review caught 4 factual overstatements the builder missed — keep it mandatory.
