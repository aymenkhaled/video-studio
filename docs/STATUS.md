# STUDIO STATUS

## Scale & Science 003 "The Biggest Living Thing" — branch `b003-biggest-living-thing` (worktree `D:\studio-b003`), 18 Nov 2026
- 2026-11-18 Aymen approved the topic: the biggest living thing isn't a whale (Shark Bay seagrass 180 km, Pando, honey fungus). Pays off B002's end-screen tease.
- Cost rule: bulk research via `tools/gpt.sh` (facts heavy, images mid, demand heavy, satellite licences mid) → `docs/research/B003-*.md`. Claude: script, scenes, code, review.
- Goal "better videos": packaging gate first (CTR is the bottleneck at 1.5 %), new hero shot = real satellite zoom-out (pitch → 180 km), voice chain + prosody + 20 dB ducking (C002 settings), second independent review.
- 2026-11-19 **Delivered B003: QA PASS** (11:14, -14.3 LUFS, -3.6 dBTP, no black/freeze/silence) render 44464149947, release `render-BiggestLivingThing-44464149947`; files in `D:\deep-time-fables\scale-science-episode-003\` (final.mp4, thumbs 1-3, UPLOAD.md, captions.srt, contact_sheet, sources, promises, review).
- Media release `media-b003` (+ `src.zip` of Commons originals downloaded locally: Wikimedia 429-blocks the runner). Media mode now seeds from ALL media-* releases and fetches only new ids.
- Independent review FAIL 7/10 (0 critical, 7 major, 10 minor) -> all fixed. 2 stills rounds, 2 full renders (1st failed freezedetect: static camera in c1c).
- Honest score 7.5/10. Weaknesses: (1) thumb_1 lacks the 180 km ruler line (thumbnail code kept the old off-frame ruler y); (2) satellite close-ups over open water are soft (Sentinel-2 10 m/px upscaled); (3) voice/ducking never heard on a phone.
- Waiting on Aymen: phone listen + upload per UPLOAD.md; approve merging branch `b003-biggest-living-thing` into main (push to main was blocked by the permission classifier).
- 2026-11-18 Satellite licence research complete: `docs/research/B003-satellite.md`. Use EOX 2016 `s2cloudless_3857` (CC BY 4.0, z0–14, credit burned in); 2018+ EOX and Esri World Imagery rejected; NASA EO/GIBS + USDA NAIP (PD) as wide/close-up sources. No local rendering; read-only tile probes only.

## Promo Shorts — branch `shorts/promo-v1` (worktree `D:\studio-shorts`), 18 Nov 2026
- 2026-11-17 **Aymen reversed "long-form only": make promo Shorts (2 per finished long video) to pull viewers to the long videos.**
Decisions (Claude; Aymen away, "don't ask"):
- 2026-11-18 The quick ffmpeg cut on main (`tools/make_shorts.py`, render.yml `mode=shorts`, 4 files in `D:\deep-time-fables\shorts\*.mp4`) letterboxes the 16:9 video over a blurred copy — breaks LESSONS old-Shorts #3 (fill 9:16). Superseded by re-narrated Remotion Shorts; the old tool stays for emergencies, its 4 files are not to be uploaded.
- 2026-11-18 12 Shorts, 2 per long video: A001 Cannae / Alps, A002 fig / salt myth, B001 megalodon / alive-now, B002 Tracy Arm / Lituya, C001 watches / not-banks, C002 Norilsk / paid-to-leave. Only lines and numbers already reviewed for the long videos (same sources.md rows); no new claims.
- 2026-11-18 Same channel voices at speed 1.0, fp32 Kokoro, voice chain + prosody, 20 dB ducking, 4× true-peak limiter (C002 settings). 30 fps.
- 2026-11-18 Posting: 1 Short per channel per day from Thu 19 Nov; Related video = its long video; Carthage is live (v7h91oBTKSc), its Shorts post Sat 21 + Sun 22 Nov. Titles number-led paradox (C002 lesson).
- Files: engine `packages/engine/src/shorts/short.tsx`, shots `src/shorts/defs.tsx`, scripts + packaging `tools/build_shorts.py` → `brands/<brand>/shorts/<slug>/{timeline.json,UPLOAD.md}`. Render: `render.yml mode=full comp=Short… timeline=…/timeline.json media_release=<episode release>`.
- 2 stills rounds (round 2 fixes: hook size, crop band, art cover, battle zoom, charts as vertical bars, Alps first frame).
- 2026-11-18 **Delivered: 12 Shorts, all QA PASS** (45.5–54.3 s, −14.2…−14.7 LUFS, −3.0…−3.9 dBTP, black/freeze/silence clean) in `D:\deep-time-fables\shorts\<channel>-<episode>-short-<n>\` (final.mp4, cover.jpg, contact_sheet.jpg, qa.json, UPLOAD.md). The parent session's 4 quick cuts moved to `shorts\_superseded-quick-cuts\` (do not upload).
  Renders: A001 44285775019 / 44293673495 · A002 44285789879 / 44285796288 · B001 44285802290 / 44285808879 · B002 44293678777 / 44293811503 · C001 44285829762 / 44285837953 · C002 44285843167 / 44290522298. Two full-render fixes: vertical bars froze (no living camera) → fixed; Lituya 59 s → narration trimmed to 53.8 s.
  Honest score: 7/10 overall (Money & Maps bar Shorts 7.5, paintings/maps 7, scale-stage crops 6.5). Weaknesses: (1) 16:9 scale stages cropped to 9:16 still cut edge labels ("Great whi…", "Mi…"); a vertical-native scale stage is the next engine step. (2) Nobody has phone-listened (voice at speed 1.0 + 20 dB ducking). (3) No measured Shorts→long click data yet: check "Related video" clicks after 7 days before making more.
- 2026-11-18 Overlap: a parallel session also delivered 4 quick-cut Scale & Science Shorts (`brands/scale-science/shorts/shorts-001.json`, files in `D:\deep-time-fables\scale-science-episode-00{1,2}\`). Decision: upload the re-narrated Shorts from `D:\deep-time-fables\shorts\` (fill 9:16, own narration, in-frame sources); keep the quick cuts only as a fallback. Never upload both sets for the same long video.
- Waiting on Aymen: upload per UPLOAD.md (set Related video in Studio, schedule from Thu 19 Nov, Carthage Shorts only after the Carthage long video is live).

_Updated 14 Nov 2026. Any session (Claude Code / OpenCode) continues from here._

## Done
- Phase 0: environment check, `INVENTORY.md`, `REUSE_PLAN.md`, 8 old videos reviewed (frames in `docs/review/`, gitignored).
- Phase 1: public repo `aymenkhaled/video-studio` at `D:\studio`; CLAUDE.md, docs, 5 project skills; `check.yml`, `render.yml` (plan → matrix chunks → combine → QA → optional Release), `benchmark.yml`; `assets-v1` Release (6 licensed zips, SHA256-verified fetch). Smoke render 4 chunks → QA PASS.
- Phase 2: benchmark (`docs/BENCHMARK.md`); Brand-A 3D stage (gait-matched actor, acting hooks, env scatter, person/bus/grid, overlays: labels, brackets, counters, comparison bars, word captions); timeline-driven soundtrack (Kokoro voice, original MIDI score via FluidSynth, foley/SFX, ducking, two-pass loudnorm). StageDemo engine test: QA PASS, 6/10 (`brands/scale-power/episodes/000-stage-demo/review.md`).
- `docs/MANUAL_TASKS.md`: Aymen's tasks. `docs/LONGFORM_PLAN.md`: 3-channel long-form plan.

## Open issues
- Local ffmpeg, ImageMagick, 7-Zip still not installed (winget finds none). Remotion's bundled ffmpeg/ffprobe used for read-only probing.
- gh token lacks `workflow` scope (SSH push works).
- `kay/` models unlicensed → unused. Bus length (12 m) needs a primary source before any publication.
- Kokoro once returned a silent line (nondeterministic); guarded with retry + clear error.
- Never edit UTF-8 files with PowerShell 5.1 `Get-Content`/`Set-Content` (it corrupted text once); use the Edit/Write tools.

## Decisions (with reasons)
- 2026-11-13 Repo public (free unlimited 4-vCPU runners), location `D:\studio`.
- 2026-11-13 Pins: remotion 4.0.543, three 0.169, r3f 8.18, React 18.3, TS 5.9 (proven combination).
- 2026-11-13 Chunks render muted (`h264-ts`), joined by ffmpeg stream copy; soundtrack generated in the plan job (so captions use real voice timings) and muxed once.
- 2026-11-13 Scene cache v1 = per-chunk cache keyed by hash(code + props + layout).
- 2026-11-13 2.5D: no single displaced plane (2 fps + smear); use 3–5 cut-out layer planes.
- 2026-11-13 3D rules: no alpha-texture foliage (6.5× slower on software WebGL); 2 tabs per 4-vCPU job for 3D; 240 s first-frame timeout.
- 2026-11-13 **Aymen: long-form only (8 min – 2 h), no Shorts; AI voice; test 3 categories on 3 channels** (A History in Maps, B Scale & Science, C Money & Maps). Synthetic narration alone is not what the inauthentic-content policy targets; mass-produced templated/stock/slideshow content is.

- Map engine v1 done (camera keys + living push, territories clipped to land with growth, routes with unit markers, cities, region labels, timeline bar, chapter card, citations, counters) + voice-first scene timing. Hannibal demo: QA PASS, 15.8 fps/job, 6.5/10 (`brands/history-maps/episodes/000-hannibal-demo/review.md`).

- **Episode 001 "Hannibal: The Man Who Nearly Destroyed Rome" DELIVERED** (10:30, QA PASS, independent review fixes applied, 6.5/10): `brands/history-maps/episodes/001-hannibal/` (script, sources, scenes, package.json, review.md). Video + thumbnails + captions + UPLOAD.md copied to `D:\deep-time-fables\hannibal-episode-001\` (videos never committed). Waiting on Aymen: channel creation + upload.

## Next
1. Better free TTS evaluation (licence-checked) vs Kokoro; then a third visual layer (period art / relief / portrait cards).
2. Label collision avoidance; stronger cold-open template; sourced historical boundary data.
3. Long-form pipeline: `script.md` with scene markers → timeline (voice lines, scenes, SFX) → voice-first timing → render → QA → package (chapters, 3 thumbnails, description, SRT).
3. Evaluate best free commercial-licence TTS vs Kokoro (licence-checked).
4. Pilot episodes: A (10–15 min) → C → B.
5. Aymen: YouTube API key, create 3 channels, advanced features.

## Episode 002 "Why Rome Destroyed Carthage" — branch `ep/002-carthage` (worktree `D:\studio-002`)
Spec `docs/superpowers/specs/2026-11-13-002-carthage-design.md` · plan `docs/superpowers/plans/2026-11-13-002-carthage.md` · standard `docs/CLARITY_STANDARD.md` + Aymen's `docs/VIEWER_CLARITY_FEEDBACK.md` (main).

New engine features (all opt-in; Hannibal renders unchanged without `clarity`):
- `HistoryEpisode clarity={...}`: 54 px phrase captions (numerals, side colours, current word underlined, SRT built from the same cues by `tools/captions_srt.mjs`), chapter tracker, source chip, legend with colour-blind patterns + symbols, locator globe, km scale bar, years-ago timeline, character cards (PD portraits), ≤8-word glossary pop-ups, recap cards with open loops, image chapter cards with a question, end-screen layout.
- Scene kind `art`: real PD/CC0/CC BY paintings, engravings, photos and coins with 2.5D parallax (Depth-Anything-V2-Small ONNX, Apache-2.0) — `tools/fetch_media.py`, `assets/media.json`.
- `MapSpec`: `modern`, `avoidLabels`, `relief` (Natural Earth shaded relief), `rivers`, `minText`; `Route.km`; `Territory.pattern`; illustrated figure badges.
- `BattleShot clarity`: illustrated figures (original drawings) instead of boxes, phase banners, arrows fade after the move, small plates; `Terrain.lakes/walls`.
- Audio: march, hooves, crowd, fire, waves, clash, oars, forge, coin, page, elephant SFX; per-scene ambience and voice pacing.

Decisions (Claude, Aymen asleep, told to take the recommended option):
- 2026-11-14 Script ~1,500 words (~12 min) instead of 1,900–2,200: no padding with weakly sourced material.
- 2026-11-14 Siege shown as a schematic city plan (labelled "schematic plan") + real engravings; 1:50m coastline too coarse at city zoom.
- 2026-11-14 Wikimedia downloads: originals (not custom thumbnails, which are throttled), paced with backoff; generic User-Agent without personal details.
- 2026-11-14 TTS: kept Kokoro for this episode (per-scene speed, pauses). Best candidate to evaluate next: Chatterbox (MIT, emotion control) — CPU cost must be benchmarked in CI first. Phone-speaker listening cannot be done by Claude; disclosed in review.md.
- 2026-11-14 **Episode 002 delivered on the branch:** render 43536415513 QA PASS (11:43, −14.6 LUFS, −2.1 dBTP); independent review findings fixed and verified on stills; 7/10 (`brands/history-maps/episodes/002-carthage/review.md`). Media for renders comes from release `media-v1` (`render.yml mode=media` rebuilds it from `assets/media.json`).
- **Branch `ep/002-carthage` is ready to merge** into main (typecheck clean, 8/8 engine tests, episode validator PASS, Hannibal stills unchanged). After merging, episode 001 can opt in with `clarity={...}` plus `MapSpec.modern/avoidLabels/relief/minText` and `art` scenes.
- 2026-11-14 **Episode 001 Hannibal v2** (branch `ep/001-hannibal-v2`): full Clarity Kit upgrade, independent review fixes, see `brands/history-maps/episodes/001-hannibal/review-v2.md`. Engine: captions/pop-ups ~15 % smaller (Aymen: "too big"), bounded label shifts, battle field lifted above captions with the battle name in the phase banner, family-tree card, −3 dBFS limiter after loudnorm. Episode 002 re-rendered with the smaller UI (run 43566364600, QA PASS).

## Money & Maps 001 "Why Is Switzerland So Rich?" — branch `ep/c001-money-maps` (worktree `D:\studio-c001`)
- 2026-11-14 Decision: topic Switzerland (strongest proven demand). Voice Kokoro `af_heart` (distinct from the history channel). Channel look: light paper land on navy sea, Okabe–Ito/viridis colour-blind-safe palette.
- 2026-11-14 Engine (opt-in, reusable for the next Money & Maps video): `kind: 'chart'` (bar/line/share/area/pictogram), `MapSpec.choropleth`, money captions, label `drop`, timeline "today / N years ago", SFX train/clock/pop/wind; `src/channel/MoneyArt.tsx` (MoneyAvatar, MoneyBanner).
- 2026-11-14 **Delivered:** render 43616583892 QA PASS (11:58), independent review fixes applied, 7.5/10 (`brands/money-maps/episodes/001-switzerland/review.md`). Files in `D:\deep-time-fables\money-maps-episode-001\`. Merged into main.
- Waiting on Aymen: phone-speaker listen, create the Money & Maps channel (profile + banner ready), upload with UPLOAD.md. Next Money & Maps video: "Why is Russia so big but so empty?" (teased in the end screen).
- Logged for later: Chatterbox voice benchmark; modern PD/CC0 photos (most modern Swiss photos are CC BY-SA); stronger relief on the light map theme; Swiss border overlay on satellite images.
## Channel B "Scale & Science" — episode 001 "How Big Was the Biggest Animal Ever?" — branch `ep/b001-biggest-animal` (worktree `D:\studio-b001`)
Folder `brands/scale-science/episodes/001-biggest-animal/` (build_timeline.py → timeline.json, scenes.ts, sources.md, package.json). Composition `BiggestAnimal` (1920×1080@24), thumbs `BiggestAnimalThumb1-3`, channel art `BiggestAnimalChannel1` (800×800) / `2` (2560×1440).

New reusable engine (opt-in SceneDef kinds, `packages/engine/src/scale/`): `scale` (2D measuring stage: original silhouettes, metre/cm grid, person/bus/court references, brackets in m + ft, ranges as solid + dashed ghost, growing estimates, living ocean/land backgrounds, label stacking, eased camera + drift), `compare` (weight/length bars with ranges + icon tally), `deeptime` (millions-of-years line with periods, markers, humans sliver), `custom` (any component, e.g. the 3D `SauropodWalk`). Captions: decimals and small numbers before units now become numerals.

Decisions (Claude; Aymen away, "don't ask"):
- 2026-11-14 Topic: biggest animal ever (blue whale vs megalodon vs sauropods + Perucetus/Ichthyotitan) — evergreen size-comparison demand, core of the channel, non-graphic, PD NOAA photos. Semrush had no API units; demand judged from the many competing videos and articles on the topic.
- 2026-11-14 Hybrid render: 2 short 3D scenes (licensed CC0 Apatosaurus walking past bus + person), everything else 2D. No 3D clip library yet (logged as next step).
- 2026-11-14 Own media release `media-b001` (new `media_release` input) so channel B never overwrites `media-v1` that channels A/C use.
- 2026-11-14 Voice: Kokoro `bm_george` (en-gb) to give channel B its own voice; Chatterbox evaluation still pending.
- 2026-11-14 Blue whale size shown as NOAA's "largest ones" (~33 m / 150 t), not typical size; all fossil sizes as ranges.
- 2026-11-14 **Episode delivered:** render (final) QA PASS — 12:25, −14.2 LUFS, −1.9 dBTP, black/freeze/silence clean; 4 stills rounds; independent review FAIL 7/10 → all Critical/Important fixed and verified; self-score 7.5/10 (`brands/scale-science/episodes/001-biggest-animal/review.md`). Files in `D:deep-time-fablesscale-science-episode-001` (video never committed). Waiting on Aymen: phone-speaker listen, create channel B, upload with UPLOAD.md.

## Master playbook — branch `research/master-playbook` (2026-11-14)
- 5 parallel research passes (hooks/retention, packaging, visuals/motion, voice/sound, channel growth; ~230 sources) → `docs/research/*.md`; merged with all LESSONS into **`docs/PLAYBOOK.md`** (single source of truth, top-20 missing tricks). CLAUDE.md now requires reading it before every new script/video.
- Key finding (verified on the official page 2026-11-14): from 1 Feb 2027 new YPP applicants need 1,000 subs + **8,000 watch hours / 365 d**. Plan for it.
Decisions (Claude; Aymen away, "don't ask"):
- 2026-11-14 Plan against the 8,000-h bar: 6-week discovery on all 3 channels, then ~60 % of capacity to the lead channel at day 42 (others ≥ 2 long videos / 90 d). Aymen can overrule.
- 2026-11-14 Next episode on any channel follows the playbook skeleton: promise in ≤ 7 s, second hook by 0:30, context at 0:20–0:50, `promises.json` ledger checked by the reviewer, packaging (3 titles + 3 thumbnails + outlier check) before the script.
- 2026-11-14 Before the next render: audio quick wins (18–24 dB ducking, phone voice chain), then CI TTS benchmark Pocket TTS vs Chatterbox vs Kokoro.
- 2026-11-14 Licence rejections recorded in the playbook: Unsplash/Pexels/ESA/Google Earth Studio, Pixabay music, MusicGen, Stable Audio Open, BBC RemArc, NC TTS weights; only EOX Sentinel-2 cloudless 2016 (CC BY) for satellite; Depth-Anything-V2 Small only.
- Waiting on Aymen: Copernicus terms? Unsplash/Pexels? Sonniss GDC? advanced features on all 3 channels (Test & Compare).
- 2026-11-15 **Aymen: realistic animals required** (silhouettes = "0 interest"). Decision: episode 001 stays as delivered; the next channel-B video must use realistic licensed art cut-outs + real footage + realistic 3D (see `docs/prompts/PROMPT_B_scale-and-science.md`, LESSONS).
- 2026-11-16 **Scale & Science 002 "Every Giant Wave Ever Measured, Shown to Scale" delivered** (branch `ep/b002-tracy-arm`): 11:13, QA PASS (−14.1 LUFS, −2.4 dBTP), independent review FAIL 6.5 → all Critical/Important fixed, self-score 7.8/10 (`brands/scale-science/episodes/002-giant-waves/review.md`). Files: `D:\deep-time-fables\scale-science-episode-002\`. New engine: photo cut-outs (U-2-Net), fjord stage + water + level lines + height axis, art marks, survey mode, shaded building profiles. Media release `media-b002`. Waiting on Aymen: phone listen + upload; optional manual download of the USGS CC0 helicopter video zip (ScienceBase is behind a bot check).

## Money & Maps 002 "Russia Built Cities Where No Economy Should Exist" — branch `ep/c002-siberian-curse` (worktree `D:\studio-c002`)
Research `docs/research/topic-scout-2026-11-15.md` (14 candidates, 3 parallel scouts). Folder `brands/money-maps/episodes/002-siberian-curse/` (build_timeline.py → timeline.json, scenes.ts, sources.md ~70 rows, promises.json, package.json). Composition `SiberianCurse`, thumbs `SiberianCurseThumb1-3`, media release `media-c002`.
Decisions (Claude; Aymen away, "don't ask"):
- 2026-11-15 Topic: Siberian curse (33/35): Russia-geography demand 7.4M / 5.3M / 745K views on big channels, but nobody covers the economics of the cold; pays off the C001 end-screen tease. Runners-up kept: Norse America (A, 72× outlier), phantom borders (C), Gibraltar tunnel (B). Channel B skipped: parallel session on giant waves.
- 2026-11-15 Packaging gate before the script (3 titles, 3 thumbnail ideas) + `promises.json` ledger (10 promises) — PLAYBOOK tricks #1, #3; misconception-first twist at 0:15 (#11), second hook by 0:30 (#10), midpoint reframe c4k (#15), top moment ~65 % (cold money).
- 2026-11-15 Audio quick wins (opt-in per timeline): `mix.duck_db` 20 (music ducked ~20 dB, gaps < 0.9 s bridged so it does not pump), `voice.chain` (HPF 90 Hz, mud cut, de-esser, 3:1 compressor, light room), `voice.prosody` (speed/pause by sentence role, ~0.9 s beat before reveals). Older episodes unchanged.
- 2026-11-15 Engine (opt-in): `CamKey.fly` van Wijk fly-to arc (tested), `City.dot` + `City.note` (data dots, e.g. January means), `fetch_media` `crop`/`max`/`src` (NASA Black Marble 43200 px → Russia crops). Mercator now rotates to the camera longitude (identical picture, antimeridian seam behind the viewer — Chukotka stays attached). Media geo bbox widened to 180°E / 82°N.
- 2026-11-15 Unverifiable claims dropped (sources.md "do not use"): "23 of 25 coldest cities", any cost-of-cold % of GDP, exact TPC values, 2 M Vorkutlag. Gulag kept non-graphic (no camp photos; Dalstroy album skipped: US PD status unclear).
- 2026-11-15 Next Money & Maps video teased in the end screen: phantom borders ("borders that vanished 100 years ago still decide who is rich").
- 2026-11-16 **Delivered:** render 43825916074 QA PASS (10:40, −14.7 LUFS, −3.5 dBTP, black/freeze/silence clean). 3 stills rounds + 1 verification round; two independent reviews (FAIL 6.5 → FAIL 7.0), all Critical/Important fixed except region outlines (no admin-1 data); self-score 7.5/10 (`brands/money-maps/episodes/002-siberian-curse/review.md`). Files in `D:\deep-time-fables\money-maps-episode-002\` (video never committed). Merged into main.
- 2026-11-16 Kokoro **int8** returns inf/NaN on the current runner image (new lines only; cache unaffected) → `voice.model: "fp32"` (opt-in). First final failed true peak (−0.4 dBTP: compressed voice + deep ducking) → `mix.tp_oversample` (4× oversampled limiter, opt-in). Packager takes every `- ` line of sources.md as a description source → keep "do not use" lists as `* ` and add a "For the description" list.
- Waiting on Aymen: phone-speaker listen (new voice chain + 20 dB ducking), upload with UPLOAD.md + Test & Compare (3 thumbnails). Next Money & Maps video: phantom borders (teased in the end screen).
- 2026-11-18 Scale & Science: 3 new B002 thumbnails (v3, size contrast; `GiantWavesThumbsV2`, render mode=stills stills=3) and 4 Shorts (2 per B001/B002, `brands/scale-science/shorts/shorts-001.json`) delivered to `D:\deep-time-fables\scale-science-episode-00{1,2}\`. make_shorts.py fixed (box glyph after line 1; channel name option). Shorts are now ON (Aymen 17 Nov).

## Scale & Science B003 — fact-check research (OpenCode, 18 Nov 2026)
- In progress: primary-source measurement audit for the whale → clonal seagrass size ladder; deliverable `docs/research/B003-facts.md`.
- Decision: distinguish length, height, trunk volume, biomass, occupied area and clone span; qualify the title's record by area and the genet definition.
- Source-access note: Google returned JavaScript-only pages on two searches; use other search/index endpoints. Royal Society's article page returned HTTP 403; seek the open-access manuscript and bibliographic metadata.
- Primary-source pass: Edgeloe 2022 full text verified through PMC; the 180 km figure is clone span, the 200 km² estimate uses pre-2010/11 meadow area, and 4500 years is a model-derived maximum. Ferguson 2003 gives 1900–8650 years, distinct from the popular 2400-year lower bound. NPS/GWR and the 2026 Hyperion field report verified.
- Newer-study lead: Pando's 2024 age headline is superseded by a March 2026 eLife Reviewed Preprint (~12,000–37,000 years), whose public assessment calls the age evidence incomplete. Baltic Fucus clones reported across >600 km of coastline challenge an unrestricted “most widespread clone” claim.
- Access blockers recorded: DuckDuckGo produced two CAPTCHA pages; USDA/Forest Service and Wiley full-text endpoints returned repeated HTTP 403; guessed GWR record routes returned 404. Stop those routes; use verified article metadata, accessible author manuscripts, and clearly labelled secondary estimates.
- Challenger pass complete: checked recent Posidonia genomics, the 2024 somatic clock, 2023/2025 Bahamas studies, 2026 global seagrass mapping and global fungal biomass. Regional meadows and global fungal totals are not single genets. The 2022 Pando charcoal paper explicitly does not identify the ancient Pando genotype; it cannot prove a 9000-year minimum age for this individual.
- Writing the complete pack with primary/secondary provenance, dated numbers, uncertainty, phone-readable wording, hooks and misconception corrections.
- 2026-11-18 Image licence research complete: `docs/research/B003-images.md` — 2–4 verified real/satellite image options per subject (blue whale, siphonophore, redwoods, General Sherman, Pando, Armillaria, Posidonia/Shark Bay, scale refs), with creator, exact licence, credit lines, resolution, fit note and dated file-page URLs. CC BY-SA options marked `SA-FLAG`; NC/ND/unknown, EOX 2018+, Esri and Unsplash/Pexels-derived assets rejected. Wiki policy conflict noted for Aymen.
