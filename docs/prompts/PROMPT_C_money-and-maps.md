Work in D:\studio (repo aymenkhaled/video-studio). You are making the FIRST long-form video for a NEW channel: **Channel C — "Money & Maps"** (economics and geography explained: why countries are rich or poor, trade routes, borders, resources). This is a test of a new category, so it must be our best video yet.

## 0. Read first (mandatory, before anything else)
- docs/LESSONS.md (especially the section "From Aymen's feedback + episodes 001 v2 / 002") and docs/STATUS.md
- docs/VIEWER_CLARITY_FEEDBACK.md (Aymen's checklist A–E) and docs/CLARITY_STANDARD.md
- CLAUDE.md (rules: render/QA only in GitHub Actions, licences, policy)
- brands/history-maps/episodes/002-carthage/ as the working pattern (timeline.json, scenes.ts, sources.md with a "For the description" bullet list, package.json, review.md)
Work on a new branch + git worktree (never on main); merge only when the video passes QA and review.

## 1. Goal
A 10–15 min, 1920×1080 video that a viewer with ZERO background, on a PHONE, possibly MUTED, possibly NOT a native English speaker, fully understands and enjoys. If anything needs prior knowledge, it failed. Pick the topic yourself (recommended order: "Why is Switzerland so rich?", "Why Russia is so big but so empty", "Why 95% of Egyptians live on 5% of the land"). Check search interest and pick the strongest; say why in one line.

## 2. Mistakes we already made — never repeat them
1. Opening on a diagram/abstract shapes. → First 5 s: something REAL (a photo, a PD painting, a striking map with real terrain) + plain WHO/WHERE/WHEN/WHY-IT-MATTERS line, captioned.
2. Assuming knowledge. → Every person, place, term (GDP, tariff, export, inflation, central bank, per capita…) and number explained the moment it appears: character card, ≤ 8-word glossary pop-up, "today:" names, numbers with context (e.g. "$100 billion ≈ the cost of X", "≈ a sold-out stadium").
3. No link to today / unclear places. → Faint modern borders + country names, locator globe, km scale, rivers + shaded relief (Natural Earth, PD).
4. No captions. → Burned-in captions everywhere (engine: 46 px — Aymen said 54 px was too big; pop-ups ~32 px), numerals not words, SRT built from the same cues.
5. Labels placed next to the WRONG dot / overlapping / off-screen country names pinned to the frame edge. → Use `avoidLabels` (bounded shifts, panels are obstacles); look at every still.
6. Scenes 20+ s with nothing new on screen. → Every scene ≤ 15 s (`node tools/check_episode.mjs <episode>`), split two-line scenes.
7. Unsourced superlatives and contradictory comparisons (two different "stadium" numbers), wrong chronology. → Every on-screen fact has a row in sources.md; hedge ("about", "according to"); economic data must cite a dated source (World Bank, IMF, OECD, national statistics, year stated on screen).
8. Fetching images from Wikimedia during every render → rate-limited (HTTP 429) and timeouts. → Add art/photos to assets/media.json, rebuild once with `render.yml mode=media` (release media-v1), renders download that.
9. Audio true-peak failure from new SFX transients. → Keep the −3 dBFS limiter after loudnorm; QA gate ≤ −1.5 dBTP.
10. Pop-up longer than 8 words crashed a render (guard throws). → Count words before rendering.
11. Contact sheet failed with one leftover still (fixed in render.yml). Long `gh run watch` can drop — check `gh run view` before assuming failure.
12. Working silently for long. → Aymen wants short progress lines and fast answers; when he says "don't ask", take the recommended option.

## 3. Channel-specific needs (build into the shared engine, opt-in, reusable)
- **Chart engine** (does not exist yet): animated bar / line / proportional-area charts and "1 icon = N people/dollars" pictograms, side-coloured, with source + year on screen and a short "how to read this chart" line the first time.
- **Choropleth maps** (countries coloured by a value, with a legend scale) using Natural Earth countries + a sourced dataset; colour-blind-safe palette + a second cue (pattern/labels).
- **Money context**: convert big numbers to per-person and to relatable comparisons; show currency and year ("2024 US$").
- **Real visuals**: PD/CC0/CC BY photos of places, products, ports, mines (Wikimedia Commons with checked licence — no BY-SA/NC/ND; museum open access CC0; government PD photos). No AI realistic people. Record every asset in docs/LICENSES.md and the description credits.
- Neutral, factual tone: no political opinions, no "this country is bad".

## 4. Process (do not skip)
1. Research → sources.md (every number dated + linked). 2. Script (voice-first timeline.json, 1,500–2,000 words, open loops, a "So far" recap per chapter, 20 s end screen). 3. Scenes + engine features. 4. `check_episode.mjs` PASS, typecheck, `npm test`. 5. Cloud stills (`render.yml mode=stills stills=scenes`), look at EVERY sheet against the checklist, max 3 rounds. 6. Fresh independent reviewer subagent (facts vs sources, licences, policy, clarity) — fix every Critical/Important finding once, verify on stills. 7. Full render `mode=full chunks=12` → QA PASS. 8. Package (3 titles, 3 thumbnails with a real image + ≤ 3 words, description with chapters/sources/credits, SRT, pinned question). 9. Copy final.mp4 + package into D:\deep-time-fables\<channel>-episode-001\ and send the files. 10. Update docs/STATUS.md, WORKLOG.md, LESSONS.md with any new lesson.
Also make simple channel art (profile 800×800, banner 2560×1440 with text inside the central 1546×423) as in src/channel/ChannelArt.tsx.

## 5. Future improvements to keep pushing (do what fits this video, log the rest)
- Better free commercial-licence voice than Kokoro (evaluate Chatterbox, MIT); Kokoro is clear but flat over 12 min. Phone-speaker check by Aymen before upload.
- Higher-resolution PD art sources (museum originals instead of small Wikimedia copies).
- Reusable chart + choropleth templates so the next Money & Maps video is faster.
- Track CTR / average % viewed / 30-s retention after 48 h in docs/LESSONS.md.

## 6. Optional inspiration (not required): a reel Aymen found interesting
Aymen shared a Storyhub-style animated reel only as an idea source. Use these ideas only where they make THIS video better; skip any that don't fit. Never copy its characters or look.
Ideas that probably suit Money & Maps:
- "You" moments to make numbers personal ("You earn the average Swiss salary… here is where it goes").
- Smooth camera moves between map → chart → map instead of hard cuts.
- Small pop/count-up animations on icons and numbers; light ambient motion on map backgrounds.
- End on a question that invites comments.
