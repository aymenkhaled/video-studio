# WORKLOG

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
