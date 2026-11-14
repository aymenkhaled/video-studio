# STUDIO STATUS

_Updated 13 Nov 2026. Any session (Claude Code / OpenCode) continues from here._

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
