# REUSE PLAN — what carries into the studio (13 Nov 2026)

Rule: copy, never move. Originals stay in `D:\deep-time-fables`. Large binaries are never committed; they live in an `assets` GitHub Release and are fetched in CI.

## Carry over
| Target | Source | Notes / required fixes |
|---|---|---|
| `packages/three/loader` | backup `src/lib.jsx` + `src/field/rig.mjs` | FBX/GLB load, ground + scale, eye quads, AnimationMixer sampling by **frame**, clip blending. Port to TS; add GLB path for Gobkit. |
| `packages/three/acting` | `film.jsx` (blinks, throat/breath, head turns, 5-bone tail wave), `whip.jsx` (anticipation → sweep → settle, per-bone lag, tip tracking) | Make each a reusable hook: `useBlink`, `useTailWave`, `useTailLift`, `useJawClose`, `useBreath`. |
| `packages/three/renderer` | `noPost` setup + `--gl=swangle`, fog, blob shadows, fake AO (`bakeAO`), HDRI IBL | Always no post (DOF/bloom/SMAA ≈ 80 % of render time). N8AO stays off (black under swangle). |
| `packages/three/env` | backup `env.jsx`, `src/field/World.tsx` | Instanced MegaKit + LPN scatter with clear lanes; seeded `random()`. |
| `packages/engine/hud` | HUD/captions from `film.jsx`/`whip.jsx` (REC timecode, "RECONSTRUCTION", mic meter, speed counter, citation tag, word captions) | Generalise into Brand-A "measurement" overlays + counters. |
| `packages/audio` | `tools/make_field_audio.py` (event-synced stems, pretty_midi → FluidSynth), backup `make_audio*.py` (ducking, foley, reverb), `make_sfx.py` synth functions, `mix.py` | Remove `/home/claude/*` paths; single `loudnorm` stage to -14 LUFS / -1.5 dBTP; original melodies only. |
| `packages/audio/voice` | `make_vo*.py` (Kokoro `am_michael`) | Kokoro for drafts/Shorts; Aymen's voice for long-form. Model files fetched + cached in CI. |
| `packages/audio/qa` + `tools/qa` | `tools/qa_field_media.py` (ffprobe, loudness, Whisper recall), `make_contact_sheet.py`, `field_stills.py` | Fix: QA warnings must fail the job (`qa_stills.py` returns 0 on WARN today). Add black/freeze/silence detect. |
| `.github/workflows` | `field-film.yml` (apt ffmpeg/fluidsynth, Kokoro/Whisper cache, swangle) | Base for matrix `render.yml` + `combine` + `qa` + Release upload. |
| Pinned deps | `package.json` | remotion 4.0.543, three 0.169, r3f 8.18, React 18.3.1 — re-check latest stable in Phase 1. |
| Assets | Quaternius 6 dinos (FBX), Gobkit 10 dinos (GLB, after LICENSE check), MegaKit, LPN, 4 Poly Haven HDRIs, Freesound 410609/427414/132149 (CC BY, credit) + 507066/529462 (CC0) | Upload once to an `assets` Release; manifest with SHA256 + licence row each. |
| Docs | MASTER_STRATEGY_v2, WINNING_PLAN, REFERENCE_AUDIT (→ LESSONS), LICENSES rows, selected bible sections (shot grammar, QA rubric, hook rules) | Copy into `studio/docs/`. |
| Lessons (from the films) | All 8 reviewed films | Subject readable on frame 1; no black end card (loop instead); fill the frame (no letterbox, no empty bottom 40 %); real walk cycles, not slides; one model ≠ two characters; QA gates must fail. |

## Dropped
| Item | Why |
|---|---|
| Paper-cut engine (`src/engine/paper.tsx`) and the five fable compositions | Wrong format for Brand A/B; CSS camera is not a real camera; output scored 1–5/10. |
| Wordless/paper-cut canon in `AGENTS.md` + bible | Contradicts the new strategy (voice, captions, 3D/maps). |
| `tools/validate_story.py` | Checks self-reported fields, not quality; replace with episode schema + real QA. |
| `make_music.py` hardcoded arrangement | Replaced by `make_field_audio.py` approach. |
| TRex_Project_Backup_v4 (v3 code) | Subset of the full backup. |
| `out/` (864 MB) intermediates | Disposable; archiving/deleting needs your OK. |
| OpenMontage | AGPL-3.0: reading only, no code copied. |
| PixVerse clip, `kay/` models | Watermarked AI clip / no licence file. |

## Not found (cannot reuse)
`labvideo.jsx`, `clips.jsx`, case-01 2D lab pipeline, `case01_long_video.md`, `handoff_status.md`, `assets_and_licenses.md`, `strategy_2026-11-09.md`, `OPENCODE_PROMPT_Deep_Time_Fables.md`, Kokoro model files, PhyloPic SVGs. The Brand B map engine and 2D chart engine start from scratch.
