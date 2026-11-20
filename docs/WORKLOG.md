# WORKLOG

- 2026-11-18 Money & Maps C003 map-data licence research: wrote `docs/research/c003-map-data-licences-2026-11-18.md` with URL/verdict table, verbatim geoBoundaries licence metadata, Natural Earth/Census caveats, and GDAL subsetting commands. Selected public-domain Natural Earth admin-1 + Census 2025 county boundaries; geoBoundaries restricted to ROU ADM2 CC BY 4.0 and USA ADM2 public domain.
- 2026-11-18 Money & Maps C003 media+geometry research: wrote `docs/research/c003-media-geo.md` (324 lines) with licence-verified geometry URLs, subsetting commands, verdicts for MPIDR/DARE/Pleiades/AWMC/OSM historic borders, hand-digitised PD-map waypoint arrays, 14 verified Commons assets, and paste-ready JSON; all JSON blocks validated.
- 2026-11-18 History in Maps research: recorded 25 recent below-200K-channel outliers in `docs/research/history-outliers-2026-11-18.md`; public vidIQ snapshots and YouTube pages supplied dates/counts, and competitor thumbnails were inspected. Candidate selection in progress.
- 2026-11-18 History in Maps selection: Vinland's missing southern route wins at 33/35; added 15 story comparisons, a 12:30 beat outline, three titles/thumbnails, misconception hook and eight scholarly/institutional sources. Replaced one generic prehistory example with the verified Aksum outlier (French-origin, explicitly labelled).

- 2026-11-13 Phase 0: environment check, inventory of `D:\deep-time-fables` (+ zips), 8 videos probed and reviewed, REUSE_PLAN written.
- 2026-11-13 Phase 1: created `D:\studio` (public monorepo), copied docs, extracted old 3D backup into `_import/` (gitignored), skeleton + CLAUDE.md + skills + CI.
- 2026-11-13 Phase 1 verified (check green, 4-chunk Smoke render + QA PASS), assets-v1 Release (6 zips incl. Gobkit CC0). Phase 2 benchmark: 2D 24.1 / 3D-simple 6.2 / 2.5D-displaced 2.0 fps per 4-vCPU job.
- 2026-11-13 Brand-A 3D stage + timeline soundtrack engine; StageDemo engine test rendered (QA PASS, 6/10). 3D perf fix 0.13 -> 0.88 fps/job. Decision: long-form only, AI voice, 3 channels (LONGFORM_PLAN.md).
- 2026-11-13 Map engine v1 + voice-first timing; Hannibal 64 s demo QA PASS at 15.8 fps/job (10x after culling/LOD). Kokoro silence fallback, AAC peak headroom.
- 2026-11-13 Episode 001 Hannibal (10:21, 40 scenes, 60 lines): script + sources (Polybius 15.11/15.18 verified on primary text), battle engine, episode player, per-scene storyboard (2 review rounds, 6.5/10), packaging step (thumbs, chapters, SRT, UPLOAD.md), TTS line cache. Awaiting Aymen's storyboard OK before full render.
- 2026-11-13 Episode 001 Hannibal delivered: 10:30, QA PASS after freeze fixes (15 -> 0), independent review fixes applied, 6.5/10. Full re-render ~10-12 min wall with cached TTS.

## 2026-11-14 — Episode 002 Carthage + Clarity Kit (branch ep/002-carthage)
- Clarity Kit in the engine (captions, legend, tracker, globe, scale, cards, glossary, recaps, end screen, figures, phases, PD art with 2.5D parallax, relief, patterns), media pipeline (release media-v1), new SFX/ambience.
- Final render 43536415513 QA PASS; independent review fixes applied; score 7/10.

## 2026-11-14 — Money & Maps 001 "Why Is Switzerland So Rich?" (branch ep/c001-money-maps)
- Topic picked on proven demand (199K vs 18K views on comparable videos). 49-row sources.md, 1,584-word voice-first script, 87 scenes, 12 PD/CC0 images (NASA, LoC photochroms, Hodler, Turner, Calvin, Met CC0 watch).
- Engine: chart scene kind (bar/line/share/area/pictogram), choropleths, money captions, label drop, SFX train/clock/pop/wind. Tests 14/14.
- 3 stills rounds; independent review FAIL 6.5 → all Critical/Important fixed; full render 1 failed freezedetect on static charts → living camera on charts; render 43616583892 QA PASS (11:58, −14.5 LUFS, −2.2 dBTP). Channel art rendered. Score 7.5/10. Delivered to D:\deep-time-fables\money-maps-episode-001\.
- 2026-11-14 Channel B "Scale & Science" episode 001 "How Big Was the Biggest Animal Ever?" (branch ep/b001-biggest-animal): new opt-in scale/compare/deeptime/custom scene kinds, original silhouettes, 3D Apatosaurus hero shot, media release media-b001, 4 stills rounds, independent review (FAIL 7/10 → all Critical/Important fixed), channel art.

## 2026-11-14 — Master playbook (branch research/master-playbook)
- 5 research subagents in parallel → `docs/research/{hooks-retention,packaging,visuals-motion,voice-sound,channel-growth}.md` (all sources dated 2026-11-14).
- `docs/PLAYBOOK.md`: every trick/rule by area with evidence, impact, effort, channels, DOING/PARTIAL/MISSING; top-20 missing; LESSONS merged; CLAUDE.md rule added.

- 2026-11-16 Scale & Science 002 giant waves delivered: packaging gate + outlier check, promise ledger, real USGS/NASA photos + CC0 landmark cut-outs, Vajont added after review, QA PASS first full render.
- 2026-11-18 Promo Shorts: vertical ShortEpisode template + 12 re-narrated Shorts (2 per long video), 2 stills rounds, full renders with QA; delivered to `D:\deep-time-fables\shorts\<channel>-<episode>-short-<n>\`.
- 2026-11-16 Money & Maps 002 Siberian curse delivered: topic scout (14 candidates, 3 parallel scouts), packaging gate + promise ledger, sources ~75 rows, NASA night lights + Prokudin-Gorsky + Landsat, fly-to camera, circled lights, range bars, phone voice chain / 20 dB ducking / prosody, fp32 Kokoro, true-peak-safe limiter; 2 independent reviews; QA PASS (render 43825916074).

- 2026-11-20 C003 phantom borders delivered (render 44740760073, QA PASS, 7.7/10). Engine: regional choropleth + ghost borders + shared-edge extraction; media build reuses earlier packs (`media_base`) + `<release>-src` hand-fetched sources; plan timeout 90 min (fp32 TTS); soundtrack carries music through mood-less scenes.
