# STUDIO STATUS

_Updated 13 Nov 2026. Any session (Claude Code / OpenCode) continues from here._

## Done
- Phase 0: environment check, `INVENTORY.md`, `REUSE_PLAN.md`, 8 videos reviewed (frames in `docs/review/`, gitignored).
- Phase 1: `D:\studio` monorepo (public GitHub repo `aymenkhaled/video-studio`), CLAUDE.md, docs, 5 project skills, `check.yml`, `render.yml` (plan → matrix chunks → combine → QA → optional Release), `tools/plan.mjs`, `render_chunk.mjs`, `render_stills.mjs`, `qa_video.py`. Old 3D backup + DTF code extracted to `_import/` (gitignored).

- Phase 1 verified: `check` CI green; `render` Smoke run 43447937883 (4 chunks → concat → QA PASS). `assets-v1` Release live (6 zips, SHA256-verified fetch).
- Phase 2 step 1: benchmark run 43448786029 → `docs/BENCHMARK.md` (2D 24.1 fps/job, 3D simple 6.2, 2.5D displaced 2.0 on 4 vCPU).
- Gobkit CC0 confirmed (LICENSE.txt read) and added to assets.
- `docs/MANUAL_TASKS.md` lists Aymen's tasks (tools, API key steps, channel, W-8BEN, bank, voice).

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

- 2026-11-13 2.5D: drop single displaced plane (2 fps + edge smear); use 3–5 cut-out layer planes (rembg + Depth-Anything-V2-Small for layer order) — re-benchmark.

## Next (Phase 2 remainder)
1. Brand-A measurement stage v1: proper framing (subject fills frame, head in safe zone), human/bus/building references, height markers, counters, MegaKit environment, acting hooks ported from film.jsx/whip.jsx; re-benchmark with the real scene.
2. Audio engine port (make_field_audio.py → packages/audio) + soundtrack step in render.yml.
3. Captions + HUD + thumbnail still (1280×720, 3 variants).
4. Map engine v1 (Brand B) — after Brand A's first episode.
