# BENCHMARK — measured render speed (use these for every estimate)

Runner: GitHub `ubuntu-latest`, public repo → **4 vCPU** (confirmed `os.cpus()=4`). Remotion 4.0.543, Chrome headless shell, `--gl=swangle`, JPEG frames, h264-ts, concurrency 4.
Run: benchmark 43448786029 (13 Nov 2026), 300 frames 1080×1920 each, one job per composition.

| Engine (composition) | fps / job | 300 frames | Job wall time (setup incl.) | Notes |
|---|---|---|---|---|
| 2D map + chart (`Bench2D`) | **24.1** | 12.4 s | 1 m 53 s | d3-geo world (110m), SVG camera, route draw, units, bar counters |
| 3D, no post (`Bench3D`) | **6.2** | 48.6 s | 2 m 32 s | 1 skinned T. rex + ground + grid + 2048 shadow map. **Simple stage only** — a full MegaKit forest is heavier (old 2-vCPU forest film ≈ 0.7 fps); re-benchmark the real Brand-A stage before estimating episodes |
| 2.5D displaced plane (`Bench25D`) | **2.0** | 150.3 s | 3 m 48 s | 117k-vertex displaced plane. Slow **and** smears edges → use 3–5 cut-out layer planes instead (to re-benchmark) |
| Smoke 2D, 4 chunks (render 43447937883) | 14.8–18.4 | 90 frames | — | chunk split + concat + QA proven end to end |

Fixed overhead per render job ≈ **1.5–2 min** (checkout, npm ci, browser, bundle download). `plan` job (bundle) ≈ 1.5 min. Combine + QA ≈ 1–3 min depending on length.

## Formula
`wall_minutes ≈ plan 1.5 + setup 2 + frames ÷ (fps_job × 60 × chunks) + combine/QA 3` (chunks ≤ 20 run concurrently; more chunks queue).

## Estimates at 30 fps (measured fps above; 20 chunks)
| Length | Frames | 2D (24 fps) | 3D simple (6.2 fps) |
|---|---|---|---|
| 60 s Short | 1,800 | 1 chunk: ~1.3 min render → ~8 min wall | 4 chunks: ~1.2 min → ~8 min wall |
| 10 min | 18,000 | ~0.6 min render → ~7 min wall | ~2.4 min → ~9 min wall |
| 1 h | 108,000 | ~3.8 min → ~10 min wall | ~14.5 min → ~21 min wall |
| 3 h | 324,000 | ~11 min → ~18 min wall | ~44 min → ~51 min wall (single job would be 14.5 h → over the 6 h limit) |

Visual check of the benchmark frames: 3D model, walk clip and shadows render correctly (camera framing cuts the head — framing fix belongs to the Brand-A stage); 2D map correct (bar labels wrap, bars overlap map — layout only); 2.5D shows displacement smearing.
