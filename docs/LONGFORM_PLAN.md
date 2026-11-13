# LONG-FORM PLAN — 3 channels, 8 min – 2 h, AI voice (decided 13 Nov 2026)

Aymen's decisions: long videos only (no Shorts), AI narration (no own recording), test 3 categories on 3 channels and keep the winner(s).

## The 3 channels
| | Channel A — History in Maps | Channel B — Scale & Science | Channel C — Money & Maps |
|---|---|---|---|
| Content | Wars, battles, empires, ancient civilizations, rise & fall | Biggest/deadliest creatures, prehistoric life, disasters, space — documentary style | Economics & geography explained (why countries are rich/poor, trade routes, borders) |
| Length | 15–40 min; 1–2 h compilations of own episodes | 10–25 min; 1 h compilations | 10–20 min |
| Main engine | 2D map engine (d3-geo) + 2.5D artwork cards | 3D stage (built) + 2D charts | Map engine + chart engine |
| Render cost (measured) | ~24 fps/job → 30 min video ≈ 10 min wall | 3D ≈ 6 fps/job (simple) → render a reusable 3D clip library, cut long videos mostly in 2D | ~24 fps/job |
| Why | Highest watch time, loyal audience | High curiosity, reuses 3D work | Highest ad pay (RPM) |
| Risk | Violence → keep non-graphic, no gore in first 7 s | Facts disputed → hedge, cite | Must stay factual, no politics opinion |

Launch order: A and C share the map engine → build it once. B reuses the stage already built. Publish rhythm target: 1 long video / channel / week once the pipeline is stable.

## AI voice and the "inauthentic content" policy
Synthetic narration alone is not the problem; mass-produced, templated videos with stock/slideshow visuals and little human input are (policy renamed from "repetitious content", July 2025; enforced per channel). Our defence:
- Original researched script with sources on screen and in the description.
- Custom animated visuals (maps, charts, 3D) — never stock loops or static slideshows.
- Each episode structurally different (not the same template with words swapped).
- Voice: the best free commercial-licence TTS available, with natural pacing; evaluate options (Kokoro Apache-2.0 now; test alternatives before Channel A launch, licence-checked).
- Altered/synthetic disclosure only if realistic AI people/events appear (they won't).

## Saving time and compute
1. **Script → timeline automatically**: one `script.md` with scene markers produces the timeline (voice lines, shot list, SFX), so audio and captions sync without hand timing.
2. **Voice first**: generate narration first; scene durations follow the real audio (no re-timing).
3. **Scene cache**: unchanged scenes are never re-rendered (hash of scene code + data).
4. **2D-first**: long videos are ~80 % map/chart scenes (cheap); 3D only for short highlight clips from a reusable clip library.
5. **Parallel chunks**: up to 20 jobs → a 1 h 2D video renders in ~10–15 min wall (BENCHMARK.md).
6. **Templates per format, not per video**: battle template, empire-timeline template, ranking template, explainer template — each episode fills data, Claude adds custom scenes.

## Build order
1. Finish the 3D stage test render (engine proof) — in progress.
2. Map engine v1 (shared by A and C): projections, virtual camera, borders/territories, animated arrows, unit blocks, labels, timeline bar, chapter cards.
3. Long-form pipeline: script → timeline → voice → render → QA → package (chapters, 3 thumbnails, description, SRT).
4. One pilot episode per channel (A, then C, then B), each 10–15 min.
5. Aymen: YouTube API key (topic demand), 3 channels, advanced features.
