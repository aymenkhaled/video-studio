# STUDIO STATUS

_Updated 13 Nov 2026. Any session (Claude Code / OpenCode) continues from here._

## Done
- Phase 0: environment check, `INVENTORY.md`, `REUSE_PLAN.md`, 8 videos reviewed (frames in `docs/review/`, gitignored).
- Phase 1: `D:\studio` monorepo (public GitHub repo `aymenkhaled/video-studio`), CLAUDE.md, docs, 5 project skills, `check.yml`, `render.yml` (plan → matrix chunks → combine → QA → optional Release), `tools/plan.mjs`, `render_chunk.mjs`, `render_stills.mjs`, `qa_video.py`. Old 3D backup + DTF code extracted to `_import/` (gitignored).

## Open issues
- System ffmpeg, ImageMagick, 7-Zip still not installed locally (winget finds none). Remotion's bundled ffmpeg/ffprobe used for read-only probing.
- gh token lacks `workflow` scope; pushing over SSH works and `gh workflow run` needs only `repo`.
- Gobkit inner LICENSE unverified (needs 7-Zip); `kay/` models unlicensed → unused.

## Decisions (with reasons)
- 2026-11-13 Repo: public (free unlimited 4-vCPU runners). Location `D:\studio` (sibling, not nested in the old repo).
- 2026-11-13 Pins: remotion 4.0.543 (latest), three 0.169 / r3f 8.18 / React 18.3 / TS 5.9 — the combination proven in Horn Lock CI; majors (three 0.187, r3f 9, React 19, TS 7) not adopted without a reason and tests.
- 2026-11-13 Chunks render **muted** (`h264-ts`) and join with ffmpeg concat stream copy; soundtrack is muxed once with `loudnorm`. Reason: audio comes from the Python engine, not Remotion, so `combineChunks` AAC stitching adds nothing.
- 2026-11-13 Scene cache v1 = per-chunk cache keyed by hash(all render code + props + chunk layout). Any code change re-renders all chunks; true per-scene keys come with the episode shot format (Phase 2).
- 2026-11-13 Bundle once in `plan` job, shared as artifact (saves ~60 s bundling per chunk job).
- Local frame extraction/probing allowed (read-only); all rendering in Actions.

## Next
1. Verify `check` CI and a `render` Smoke run with 4 chunks (end-to-end proof).
2. Upload `assets-v1` Release (Quaternius FBX, MegaKit subset, LPN, HDRIs, Freesound) + `assets/manifest.json`.
3. Phase 2: benchmark compositions (2D map/charts, 3D no-post, 2.5D parallax) → `docs/BENCHMARK.md`.
