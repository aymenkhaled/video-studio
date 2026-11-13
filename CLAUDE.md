# Studio — standing rules

Faceless YouTube studio for Aymen (Tunisia). Goal: views → YPP. Brand A "Scale & Power" first, Brand B "Maps of War & Empire" later. English for code, files, on-screen text, and replies.

## Working style
- Be critical: rate work /10 with top 3 weaknesses. Never claim done without proof (file, log, frame, number).
- Verify volatile facts (policy, licences, versions, prices) on the web if older than 30 days; cite URL + date.
- Measure before estimating. Time estimates use `docs/BENCHMARK.md` numbers only.
- Ask Aymen only for his decisions; otherwise decide, record in `docs/STATUS.md` (Decisions), continue.
- Quota is limited: read files in sections, keep chat short, long notes go to files.
- After two identical failures: record the blocker in STATUS and stop retrying.
- Update `docs/STATUS.md` after every step; append milestones to `docs/WORKLOG.md`. Read `docs/LESSONS.md` before every new script.

## Repo rules (public repo)
- Never commit secrets, videos, `.env`, Mixamo files, or anything under `_import/`.
- Big assets live in the `assets-v1` GitHub Release, listed with SHA256 + licence in `assets/manifest.json`; CI fetches them.
- Rendering, media generation, loudness QA run only in GitHub Actions. Locally: edit, git/gh, read-only probing.
- Deterministic animation: Remotion `random(seed)`, frame-derived motion; never `Math.random()`/`Date.now()`.
- 3D always renders without post-processing (`noPost`, `--gl=swangle`). No animated CSS blur / SVG turbulence.

## Content policy
- Licences allowed: PD, CC0, CC BY (credit), OFL, MIT, BSD, Apache, GPL data only with credit. Reject NC, ND, unknown. Every asset gets a row in `docs/LICENSES.md`.
- Never: film/TV/sports/news footage, copyrighted music, celebrity photos, realistic AI people, re-uploads of failed Shorts.
- Violence non-graphic; nothing graphic in the first 7 s; no "made to shock". Explosives: scale/history only, never how-to.
- Inauthentic-content defence: original research and script, varied custom visuals, Aymen's voice on long videos when possible, no near-duplicates. "Altered/synthetic" disclosure only for realistic AI.
- Every number on screen has a source URL in the episode's `sources.md`. Hedge uncertain science.

## Quality gates (every video)
- Technical: ffprobe res/fps/duration; ebur128 −14 ±1 LUFS, true peak ≤ −1.5; blackdetect, freezedetect (>2 s), silencedetect clean; metadata stripped. Any failed check fails the CI job.
- Visual: 12–24-frame contact sheet that you actually look at. Subject readable on a phone on frame 1; Shorts safe zone (nothing key in bottom 420 px / right 120 px); no broken edges, empty frame areas, text overlaps; motion rules (nothing static >3 s, eased moves, 2–3 parallax layers, change every 4–8 s Shorts / 6–15 s long).
- Independent review: a reviewer subagent that did not build it checks contact sheet, facts vs `sources.md`, licences → PASS/FAIL.
- Packaging per video: `UPLOAD.md` (3 titles, 3 thumbnails, description with chapters/sources/credits, 3–5 hashtags, SRT, not-for-kids, category Education, pinned question, Shorts links, cross-post captions).

## Layout
`packages/engine` (2D Remotion components) · `packages/three` (3D) · `packages/audio` (Python audio/voice) · `brands/<brand>/episodes/<id>/` · `tools/` · `.claude/skills/` (new-episode, render-cloud, qa-video, package-upload, topic-research).
