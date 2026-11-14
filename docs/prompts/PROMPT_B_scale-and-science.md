Work in D:\studio (repo aymenkhaled/video-studio). You are making the FIRST long-form video for a NEW channel: **Channel B — "Scale & Science"** (biggest / deadliest creatures, prehistoric life, natural disasters, space — documentary style, focused on SIZE and COMPARISON). This is a test of a new category, so it must be our best video yet.

## 0. Read first (mandatory, before anything else)
- docs/LESSONS.md (all sections, especially "From Aymen's feedback + episodes 001 v2 / 002" and the old dinosaur-Shorts lessons) and docs/STATUS.md
- docs/VIEWER_CLARITY_FEEDBACK.md (Aymen's checklist A–E) and docs/CLARITY_STANDARD.md
- CLAUDE.md (rules: render/QA only in GitHub Actions, licences, policy) and docs/BENCHMARK.md (3D is ~6 fps/job — plan render cost)
- packages/three (the 3D stage built for this channel: actors, scale objects person/bus/grid, labels, brackets, counters, comparison bars, word captions) and brands/scale-power/episodes/000-stage-demo/review.md (it scored only 6/10 — read why)
- brands/history-maps/episodes/002-carthage/ as the pattern for script, sources.md, package.json, review
Work on a new branch + git worktree (never on main); merge only when the video passes QA and review.

## 1. Goal
A 10–15 min, 1920×1080 video that a viewer with ZERO background, on a PHONE, possibly MUTED, possibly NOT a native English speaker, fully understands and enjoys. Pick the topic yourself (recommended candidates: "How big was the biggest animal that ever lived?" (blue whale vs Megalodon vs sauropods), "The deadliest animals ranked by how many people they kill", "What if the asteroid that killed the dinosaurs hit today?"). Check search interest and pick the strongest; say why in one line.

## 2. Mistakes we already made — never repeat them
1. Opening on a diagram/abstract shapes or a dark, unreadable close-up (old dinosaur films: belly close-up, empty landscape). → First 5 s: the subject big, bright and readable on a phone + a plain line saying what, how big, why it matters — captioned.
2. Assuming knowledge. → Every creature, period, place and term (Cretaceous, apex predator, magnitude, light-year…) explained the moment it appears: card, ≤ 8-word pop-up, numbers with a human comparison (a person, a bus, a football pitch, a building). Explain "millions of years ago" with a simple timeline marker.
3. Scale without reference. → Always show a known reference object next to the subject (person 1.75 m, school bus, Statue of Liberty…), with a measured bracket and the number in metres AND feet.
4. Abstract boxes / recoloured duplicates / sliding without walking (old films). → Real locomotion, distinct silhouettes, contrast + rim light (no fog flattening low-poly).
5. No captions. → Burned-in captions everywhere (engine: 46 px, pop-ups ~32 px — Aymen said bigger was too big), numerals not words, SRT built from the same cues.
6. Scenes 20+ s with nothing new; static frames. → Every scene ≤ 15 s (`tools/check_episode.mjs`), constant camera motion.
7. Unsourced superlatives / disputed sizes stated as fact (Megalodon size estimates vary a lot). → sources.md row for every number, ranges shown as ranges ("15–18 m, estimates vary"), cite the paper/museum.
8. Fetching images during every render (Wikimedia 429, timeouts). → Add photos/art to assets/media.json, rebuild once with `render.yml mode=media` (release media-v1).
9. Audio true-peak failure from new SFX. → Keep the −3 dBFS limiter after loudnorm.
10. Pop-up > 8 words crashes the render guard; contact sheet with one leftover still (fixed); `gh run watch` can drop — check `gh run view`.
11. Working silently for long. → Short progress lines, fast answers; when Aymen says "don't ask", take the recommended option.

## 3. Channel-specific needs
- **Hybrid render plan**: 3D only for short hero clips (render a reusable 3D clip library once), the rest in cheap 2D (comparison bars, silhouettes to scale, timelines, maps, real photos) so a 12-min video renders in reasonable time.
- **Realism**: real photos (museum fossils, NOAA/NASA public-domain images, CC0 museum open access, CC BY with credit — no BY-SA/NC/ND), PD scientific illustrations, licensed CC0 3D models (Quaternius etc., already in assets-v1). Scientific reconstructions must say "reconstruction". No AI realistic people.
- **Size-comparison scene template** (reusable): subjects side by side on a ground grid with a person and a bus, height/length brackets, metric + imperial, and a slow camera pull-back.
- Non-graphic: no gore, nothing graphic in the first 7 s, disasters shown with maps/data, not suffering.
- Space/disasters: NASA/USGS/NOAA public-domain imagery and data, dated.

## 4. Process (do not skip)
1. Research → sources.md. 2. Script (voice-first timeline.json, 1,500–2,000 words, open loops, a "So far" recap per chapter, 20 s end screen). 3. Scenes + engine features (opt-in, reusable). 4. `check_episode.mjs` PASS, typecheck, `npm test`. 5. Benchmark one 3D clip before committing to many. 6. Cloud stills, look at EVERY sheet against the checklist, max 3 rounds. 7. Fresh independent reviewer subagent (facts, licences, policy, clarity) — fix every Critical/Important finding once, verify on stills. 8. Full render → QA PASS. 9. Package (3 titles, 3 thumbnails with a real image of the creature/object + ≤ 3 words, description with chapters/sources/credits, SRT, pinned question). 10. Copy final.mp4 + package into D:\deep-time-fables\<channel>-episode-001\ and send the files. 11. Update docs/STATUS.md, WORKLOG.md, LESSONS.md.
Also make simple channel art (profile 800×800, banner 2560×1440, text inside the central 1546×423) as in src/channel/ChannelArt.tsx.

## 5. Future improvements to keep pushing (do what fits this video, log the rest)
- Better free commercial-licence voice than Kokoro (evaluate Chatterbox, MIT); phone-speaker check by Aymen before upload.
- Faster 3D (clip cache, simpler scenes) and more distinct animal models with licences checked.
- Track CTR / average % viewed / 30-s retention after 48 h in docs/LESSONS.md.
