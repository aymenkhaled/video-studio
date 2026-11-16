# Scale & Science 002 — "Every Giant Wave Ever Measured, Shown to Scale" — review

Final: render 43812381258, 11:13 (673.1 s), 1920×1080 @ 24 fps, AAC 48 kHz stereo, −14.1 LUFS, −2.4 dBTP, QA PASS on the first full render (black / freeze / silence clean). 70 scenes, 1,373 words, every scene ≤ 15 s, typecheck clean, 20/20 tests, `tools/caption_numbers.mjs` read line by line.

## Process (PLAYBOOK followed)
- Packaging gate before the script (`packaging.md`): YouTube outlier check showed ≥ 1M demand (1.5M, 1.26M, 1.19M) but the straight "Tracy Arm explained" angle already taken → our angle: every giant wave on one to-scale ladder.
- Promise ledger (`promises.json`), promise in the first 7 s, second hook before 0:30, a "So far" recap with a question per chapter.
- Realism (Aymen's 15 Nov rule): 16 real USGS / NASA photos of the actual places, real CC0 photo cut-outs of the Statue of Liberty and Eiffel Tower at exact height (new U-2-Net background removal in `fetch_media.py`), animated water, shaded building profiles where no free full-height photo exists (ESB, Burj Khalifa). No animal silhouettes.
- 3 stills rounds, every sheet checked. Independent reviewer: FAIL 6.5/10 (3 Critical, 9 Important). All Critical/Important fixed and checked on round-3 stills: "last August" → "In August 2025"; Vajont 1963 added; Ulrich's estimates corrected (~30 m mid-bay, 15–23 m at his boat); titles/thumbnail made honest (run-up "climbed", "a fjord cruise ships visit every day"); no fake horizontal lines on photos; Greenland labelled "modelled"; headroom on payoff frames; 5 photo scenes replaced by maps/stages/list; shaded buildings.
- Caption bug found and fixed in the engine: "two thousand people" became "2000" (year rule) → year format only after a date word; test added.

## Scores /10 (honest)
hook 8 · clarity 8 · visuals 7.5 · motion 7 · sound 6 (not heard on a phone speaker) · accuracy 8.5 · originality 8 → **7.8/10**

## Top 3 weaknesses
1. The water on the scale stage is a clean graphic, not a real wave; no real video footage (the USGS CC0 helicopter video exists but ScienceBase sits behind a Cloudflare bot check, which we must not bypass — Aymen could download it once by hand).
2. Lituya Bay 1958 photos are small (700–750 px): shown framed, they still look soft next to the 2025 photos; thumbnail 2 is soft at 4K.
3. Voice: Kokoro is clear but flat over 11 minutes, and the music ducking/voice chain items from PLAYBOOK §6 are still not done.

## Next (logged)
- Manual one-time download of the USGS Tracy Arm video zip (CC0) → real footage in a re-cut or Shorts later.
- PLAYBOOK §6 voice chain + 18–24 dB ducking; TTS benchmark.
