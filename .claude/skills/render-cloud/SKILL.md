---
name: render-cloud
description: Render a composition on GitHub Actions (stills or full distributed render), monitor it, download and verify the output. Use for every render; never render locally.
---

# render-cloud

1. Commit and push the code to render (CI renders the pushed ref).
2. Estimate first from `docs/BENCHMARK.md`: `minutes ≈ frames ÷ (fps_per_job × 60) ÷ chunks + ~5 min setup`. Pick `chunks` so each job stays under ~45 min and ≤ 20 concurrent.
3. Trigger:
   `gh workflow run render.yml -f comp=<CompositionId> -f chunks=<n> -f mode=<stills|full> -f props=<path-or-empty>`
4. Find the run id: `gh run list --workflow=render.yml -L 1 --json databaseId,status`. Wait with `gh run watch <id> --exit-status` in the background; do not poll in a loop.
5. On failure: `gh run view <id> --log-failed | tail -n 60`. Fix the root cause. After 2 identical failures, record it in STATUS and stop.
6. Download: `gh run download <id> -D out/<id>` (artifacts) or the Release asset for finals.
7. Verify before claiming success: the `qa` job passed, `ffprobe` duration/res/fps match, and you have looked at the contact sheet.
8. Log the measured wall time and fps per job in `docs/BENCHMARK.md` (measured vs estimated).
