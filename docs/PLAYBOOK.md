# PLAYBOOK — the single source of truth for every video, every channel

_Built 2026-11-14 from 5 parallel research passes (`docs/research/*.md`, ~230 sources, all accessed 2026-11-14) + every lesson from our 4 finished episodes (`docs/LESSONS.md`). Read this before every new script, video or packaging job. When a new lesson is learned, add a row here (and the raw note in LESSONS.md)._

**Channels:** A = History in Maps · B = Scale & Science · C = Money & Maps.
**Columns:** Impact H/M/L · Effort S (≤1 day) / M (2–4 days) / L (≥1 week) · Status vs our work: **DOING** / **PARTIAL** / **MISSING**.
**Evidence:** short tag + pointer into the research file (`HR` hooks-retention, `PK` packaging, `VM` visuals-motion, `VS` voice-sound, `CG` channel-growth, `L` LESSONS.md). [E] = data or official source, [O] = creator/strategist opinion, [OWN] = learned on our own episodes.

---

## 0. The five things that change strategy (read first)

1. **YPP bar doubles for us.** From **1 Feb 2027** new channels need **1,000 subs + 8,000 watch hours / 365 d** (or 20M Shorts views / 90 d). We have not uploaded yet, so plan for 8,000 h ≈ ~115k long-form views per channel per year. Verified on the official page: https://support.google.com/youtube/answer/12843009 (2026-11-14). → One person cannot push 3 channels equally: run all 3 for 6 weeks, then give ~60 % of capacity to the lead channel (CG T1). "Active" from Feb 2027 = 2 long videos / 90 d, so the other two stay alive cheaply.
2. **Our opening fails "confirm the click".** We open on context (painting + who/where/when). Top videos open on the *promise* of the title/thumbnail in ≤ 7 s, then a second hook by 30 s (HR T1–T2). Context moves to 0:20–0:50.
3. **We have no promise/payoff design.** YouTube weighs satisfaction (surveys, likes) over raw minutes; an unpaid promise costs us (HR T5, Beaupré). Every episode gets a `promises.json` ledger the reviewer checks.
4. **Packaging decides the topic, not the other way round.** Same channel, same topic: "The Fall of Carthage (146 BC) DOCUMENTARY" 0.8× vs "Rome's Stalingrad – The Siege of Carthage" 6.1× (Invicta, PK §3). Title + thumbnail are written and outlier-checked before the script; topics that cannot be packaged are dropped (PK P1–P3).
5. **Delivery, not engine, is the voice problem.** Music ducks only ~9 dB (guides: 18–24 dB), no voice EQ/compression, one speed per scene, one chord progression for every video (VS §1). Fix the chain first, then benchmark Kyutai Pocket TTS (MIT code, CC BY 4.0 weights) and Chatterbox (MIT, now unmaintained, PerTh watermark) against Kokoro.

---

## 1. Top 20 tricks we're missing (ranked by impact ÷ effort)

| # | Trick | Area | Impact | Effort | Ch | Status | Section |
|---|---|---|---|---|---|---|---|
| 1 | Packaging-first gate: 3 titles + 3 thumbnail sketches + outlier check **before** the script; drop unpackageable topics | Packaging | H | S | ABC | MISSING | 3.1 |
| 2 | Promise frame in first 7 s (thumbnail subject at frame 1, title claim as one concrete line); painting/context moves to 0:20 | Hooks | H | S | ABC | PARTIAL | 4.1 |
| 3 | Promise/payoff ledger `promises.json`, reviewer FAILs unpaid promises | Structure | H | S | ABC | MISSING | 4.2 |
| 4 | Plan for the 8,000-h YPP bar: 6-week discovery on all 3, then pick a lead channel (60 % capacity) | Growth | H | S | ABC | MISSING | 2.1 |
| 5 | Outlier-validated idea bank per brand (`docs/ideas/<brand>.md`, ≥ 5× outlier within 12 months to green-light) + `tools/outliers.py` | Growth/Packaging | H | M | ABC | MISSING | 2.2 |
| 6 | Repeatable series format per channel with a fixed title frame (distinct storyline each time) | Growth | H | M | ABC | MISSING | 2.3 |
| 7 | Thumbnails must show the size/stakes contrast itself at phone size (B002 v3: water surging up a photo-textured mountain past landmarks to scale), never a plain landscape photo; honest to the claim (run-up = water climbing a slope) | B001/B002 CTR 1.5 % [OWN] | H | S | ABC | DOING |
| Test & Compare on every long video with 3 *different reasons to click* (winner = watch time) | Packaging | H | S | ABC | PARTIAL | 3.2 |
| 8 | Music ducking 18–24 dB under voice + phone-speaker voice chain (HPF 90 Hz, −300 Hz mud cut, de-ess, 3:1 comp, light room) | Sound | H | S | ABC | DOING (opt-in, C002) | 6.2 |
| 9 | Analytics loop at 48 h / 7 d / 28 d into `docs/analytics/<brand>.md` and LESSONS table | Growth | H | S | ABC | MISSING | 2.6 |
| 10 | Second hook by 0:30: 2–3 questions + why it matters to *you* + "by the end…" roadmap (ListCard feeds the ledger) | Hooks | H | S | ABC | MISSING | 4.1 |
| 11 | Misconception-first framing ("most people think X…") as hook twist and chapter engine | Structure | H | S | ABC | MISSING | 4.3 |
| 12 | Fly-to map camera (d3 `interpolateZoom` zoom-out-then-in arc, bearing/pitch, holds) replacing cuts between places | Visuals | H | S | AC | DOING (`CamKey.fly`, C002) | 5.1 |
| 13 | Match cuts / shared-element transitions + fixed transition vocabulary (≤ 4 types per episode) | Visuals | H | M | ABC | MISSING | 5.1 |
| 14 | Camera inside the chart + staged chart morphs (axis → marks → shape) instead of static panels | Visuals | H | M | C (A,B) | MISSING | 5.3 |
| 15 | Midpoint reframe + re-engagement peaks at ~3 min and ~6 min + top moment at 60–75 % of runtime | Structure | H | S | ABC | MISSING | 4.3 |
| 16 | Per-sentence prosody variation (speed ±4–8 % by role) + rule-based pauses (reveal 0.8–1.5 s) + reveal grammar (build → 1 s silence → stinger) | Voice | H | M | ABC | PARTIAL | 6.1 |
| 17 | TTS benchmark in CI: Pocket TTS vs Chatterbox Nano/Turbo vs Kokoro (RTF, Whisper WER ≤ 3 %, pitch variance ≥ 1.3× Kokoro, 12-min drift), then Aymen's blind phone ranking | Voice | H | M | ABC | MISSING | 6.1 |
| 18 | Three map registers per episode (context globe / tilted story map with relief / flat data map) + licence-clean satellite (EOX Sentinel-2 cloudless **2016**, CC BY 4.0) | Visuals | H | M | AC | MISSING | 5.2 |
| 19 | Per-channel sound identity (mode, tempo, instruments, 2–3 s sound logo) + automatic SFX sync to visual events | Sound | H | M | ABC | MISSING | 6.3 |
| 20 | Translated titles/descriptions + auto-dubbing / multi-language audio after 28 days (Arabic, Spanish, Portuguese first) | Growth | M | S | ABC | MISSING | 2.5 |

Runners-up: "follow-up to your best video" within 2–4 weeks of a ≥ 3× hit (CG T4); cross-niche formats ("True Size of [battle]", PK P8); textured/shaded silhouettes (VM T23); Posts with polls (CG T13); channel home + trailer (CG T12); script lint for the ear + 140–155 wpm check (VS); thumbnails at 3840×2160 (PK).

---

## 2. Strategy and channel growth  (research: `docs/research/channel-growth.md`)

### 2.1 Targets and capacity
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Plan against **8,000 h / 365 d + 1k subs** (new applicants from 1 Feb 2027); 4,000 h only if YPP is reached before then (unrealistic) | Official YPP changes page [E] (CG S2) | H | S | ABC | MISSING |
| Days 1–42 equal split (each channel 1 upload / 7–9 days); day 42 pick the lead channel on browse+suggested impressions trend, median % viewed, best outlier ratio, subs per 1k views; others drop to ≥ 2 long videos / 90 d | CG §5; vidIQ: 1k subs in year 1 ≈ 31 % at 52+ videos/yr vs 8.7 % at 12–51 [E] | H | S | ABC | MISSING |
| Day 90: watch-hour run-rate × 365 vs 8,000; < 25 % → change format/topic on the weakest channel | CG §5 | M | S | ABC | MISSING |
| Tunisia is eligible for YPP but **not** for the 500-sub expanded tier (fan funding/Shopping only — small loss) | Official country lists [E] (CG S3, S4) | — | — | ABC | fact |
| Length 10–15 min, always ≥ 8 min (mid-rolls) | CG T8 [E] | M | S | ABC | DOING |
| Cadence: consistent, sustainable; education channels peak at 2–5 uploads/month | CG T7 [E] | M | S | ABC | DOING |
| Realistic expectations: median new long-form video < 300 views in 30 days for the first 10 uploads; one 10–50× outlier changes everything | CG §5 [O/E] | — | — | ABC | fact |

### 2.2 Topic selection
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Outlier method: 3–5 benchmark channels per brand, flag ≥ 3× (study ≥ 5×) of channel median; green-light only with a ≥ 5× outlier on the topic/format in 12 months | 1of10, Galloway [O]; vidIQ first-10-videos [E] (CG T2, PK P2) | H | M | ABC | MISSING (ad hoc) |
| Find the unclaimed angle: straight "Switzerland" angle is saturated (PolyMatter 0.3×, Johnny Harris 0.9×) → paradox angle | PK P9, outlier table | H | S | ABC | MISSING |
| Borrow frames across niches (scale × history: "True Size of the Battle of Cannae" 5.6×) | PK P8 [E: Invicta] | H | S | AB | MISSING |
| Strongest proven demand first (our C001: 199K vs 18K views on comparable videos) | [OWN] L C001 | H | S | ABC | DOING |

### 2.3 Formats and series
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| 1–2 repeatable series per channel, fixed title frame, distinct storyline/research/visuals each time (policy: "similar formats" OK if each has a distinct storyline) | Genius History top 5 = "The ENTIRE History of X" 4–10×; Real Science "The Insane Biology of…" 2.5–3.2× (CG T3, PK P7) | H | M | ABC | MISSING |
| Follow-up to any ≥ 3× video within 2–4 weeks, same format, adjacent subject, linked both ways | CG T4 [O] | H | S | ABC | MISSING |
| Playlists = series; end screens + cards both ways | CG T9 | M | S | ABC | PARTIAL (end screens DOING) |
| Compilations once a series has ≥ 5 episodes | CG T20 | L | S | ABC | MISSING |

### 2.4 Channel surface
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Handle, banner, About (what, sources policy, upload day), 2SV, **advanced features** (needed for Test & Compare and YPP) | CG T12, PK P4 [E] | M | S | ABC | PARTIAL (art rendered) |
| Trailer for non-subscribers after 3 videos; featured video for subscribers; one section per series | CG T12 [E] | L | S | ABC | MISSING |
| Posts 1–2 / week (polls on next topic, "which is bigger?" quizzes); no subscriber minimum | CG T13 [E] | L | S | ABC | MISSING |
| Pinned question comment; reply to all comments in 48 h | L Aymen #10 | M | S | ABC | DOING |

### 2.5 Reach beyond English
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Auto-dubbing / multi-language audio after ~28 days; check Arabic numbers by ear | YouTube: >25 % of watch time from other languages for adopters [E] (CG T14) | M | S | ABC | MISSING |
| Translated titles + descriptions (appear in other-language search) | PK P13 [E] | M | S | ABC | MISSING |
| Cross-post the *original* map/chart (not a link) to subreddits that allow OC, disclose authorship | CG T15 [O] | M | M | ABC | MISSING |
| Shorts: ON (Aymen, 17 Nov 2026): 2 Shorts per long video, cut by `tools/make_shorts.py` (render.yml mode=shorts, spec per brand in `brands/<brand>/shorts/`), Related video = the long one; they feed discovery, not watch hours | CG T18 [E], Aymen [OWN] | M | S | ABC | DOING |

### 2.6 Analytics loop (template in CG §6)
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| First data point (B001, 34 h): CTR 1.5 %, AVD 10 % — retention is the first thing to fix: real imagery from frame 1, promise in 7 s, no slow context opening; log every upload in `docs/analytics/<brand>.md` and ask Aymen for the 0:30 retention number | [OWN] B001 analytics | H | S | ABC | DOING |
| 48 h: impressions, CTR vs our own median, 30-s intro %, Test & Compare leader. 7 d: AVD, % viewed, key-moment dips vs predicted dips, traffic sources. 28 d: returning viewers, subs/1k views, run-rate vs 8,000 h | CG §6, HR T21 | H | S | ABC | MISSING |
| Compare CTR only against our own videos (official: half of channels sit at 2–10 %) | PK P14 [E] | M | S | ABC | MISSING |
| Before upload, write predicted dip points; after 7 d compare with the retention graph and log the lesson | HR T21 | H | S | ABC | MISSING |

---

## 3. Titles, thumbnails, packaging  (research: `docs/research/packaging.md`)

### 3.1 Packaging first
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Gate: 3 titles + 3 thumbnail sketches before the script; the hook (first 7 s) is written to confirm them | PK P1, HR T22; MrBeast memo [O/leak] | H | S | ABC | MISSING (UPLOAD.md written after the build) |
| Title = a tension, not a label: scale, reversal, modern analogy, "why didn't…", specific superlative (sourced). No yes/no questions (vidIQ: question-ending titles 0.82×) | PK P3 [E/O] | H | S | ABC | PARTIAL |
| Short, readable titles; test length rather than fix it (1of10 and Eden datasets disagree) | PK P10 | M | S | ABC | PARTIAL |
| Every title variant must be paid off by the script (anti-clickbait; "legit clickbait") | PK P15, HR T5, Veritasium | H | S | ABC | MISSING |
| Title formula banks per channel: PK §4 (10 original templates each) | PK §4 | M | S | ABC | MISSING |

### 3.2 Testing
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Test & Compare on every long video: up to 3 variants (title, thumbnail or both), ~2 weeks, winner by **watch time**; desktop only, needs advanced features; title testing global since 2025-12-04 | Official help [E] (PK P4, CG T5) | H | S | ABC | PARTIAL (3+3 prepared, never run) |
| Variants test *different reasons to click*, not colour tweaks | PK P4 | H | S | ABC | MISSING |

### 3.3 Thumbnails
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| One subject + one tension device; ≤ 3 words that don't repeat the title; bright, high contrast, readable at phone size | PK P5 + checklist | H | S | ABC | PARTIAL |
| Faceless is not a handicap (faces ≈ no faces in 1of10; Eden 507K videos: < 4-pt gaps). Use a "character" subject: bust, coin, animal, map shape | PK P6 [E] | M | S | ABC | DOING (PD bust/coin) |
| Render at **3840×2160** (≥ 1920×1080); any variant below 720p drops all to 480p in tests | Official help [E] (PK) | M | S | ABC | MISSING (check current size) |

### 3.4 Description and metadata
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Description: 2 hook lines, chapters, sources, credits (CC BY), "approximate" note for ancient borders, not-financial-advice line on C | PK P11, CG §4 | M | S | ABC | DOING (add C disclaimer) |
| Tags: 3–8, minimal impact | PK P12 [E] | L | S | ABC | DOING |
| SRT from the same cues as the burned-in captions | L 002 | M | S | ABC | DOING |
| Not made for kids, category Education | CG §4 [E] | M | S | ABC | DOING |

---

## 4. Hooks, retention, story structure  (research: `docs/research/hooks-retention.md`, skeleton in its §4)

### 4.1 Opening (0:00–0:50)
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| **0:00–0:07 Promise**: thumbnail subject in motion at frame 1 + the title's claim as one concrete fact/number | YouTube Intro metric [E]; MrBeast memo; Galloway [O] (HR T1) | H | S | ABC | PARTIAL |
| **0:07–0:20 Twist**: misconception/paradox; never give the answer in the hook (14.9 % avg viewed when it did) | Kang 2009, Gruber 2014 [E] (HR T3, T12) | H | S | ABC | PARTIAL |
| **0:20–0:35 Second hook**: 2–3 questions + why it matters to *you* + "by the end…" | HR T2, T17 | H | S | ABC | MISSING |
| **0:35–0:50 Moment**: PD painting/photo cold open in the middle of the action, with where/when/who | HR T23, L Aymen #1 | H | S | A (BC) | DOING (move later) |
| Context budget: ≤ 10 s preamble, ≤ 2 glossary pop-ups before 0:50, rest just-in-time | HR T4 | M | S | ABC | PARTIAL |
| Frame 1 readable on a phone; never open on a diagram | L old #1, Aymen #1 [OWN] | H | S | ABC | DOING |

### 4.2 Promise ledger
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| `promises.json` `{id, promise, setAt, payoffAt, payoffLine}` covering title variants, thumbnail, hook questions, chapter loops; reviewer FAILs any unpaid entry or a gap > 6 min without a partial payoff | Beaupré on satisfaction [E]; HR T5 | H | S | ABC | MISSING |

### 4.3 Middle
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| "But / therefore" chaining: pace comes from new problems, not faster cuts | HR T9 [O] | H | S | ABC | PARTIAL |
| Open loop before every transition, every 2–3 min, escalating; `ChapterCard.question` = the loop, ends in "?" | HR T7 | H | S | ABC | PARTIAL |
| Recap ≤ 5 s and carries the next question (recaps without a question are dip points) | HR T8 | M | S | ABC | PARTIAL |
| Re-engagement peaks at ~3 min and ~6 min using the best visual/number | HR T6, MrBeast memo | H | S | ABC | PARTIAL |
| Midpoint reframe: change the question ("everything so far assumed X…") | HR T13 (Kurzgesagt largest star, Wendover Wyoming) | H | S | ABC | MISSING |
| Top moment at 60–75 % of runtime, small payoffs throughout | HR T10, T11 | M | S | ABC | MISSING |
| Characters with intention + obstacle, not just identity (A) | HR T16 | M | S | A | PARTIAL |
| Stakes stated early and restated (HUD counter) | HR T15 | M | S | ABC | PARTIAL |
| Personal relevance ("you", viewer units) in the template | HR T17 | M | S | ABC | PARTIAL (C001 only) |
| Scale ladder with "guess first" pauses and monotonic escalation (B core) | HR T14 | H | S | B | PARTIAL |
| Cut anything that doesn't move a promise | HR T26 | M | S | ABC | PARTIAL |
| Every scene ≤ 15 s (`tools/check_episode.mjs`); visual change inside scenes every 5–10 s | L Aymen #6 [OWN], HR T18 | H | S | ABC | DOING / PARTIAL |
| One fun/surprise beat per chapter | CLARITY #9 [OWN] | M | S | ABC | DOING |

### 4.4 Ending
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Payoff is the last beat (1–2 lines) + callback to the frame at 0:00, then a fast exit; no long outro | HR T19 | H | S | ABC | PARTIAL |
| 20 s end screen, ≤ 4 elements, narrated tease ends in "?"; the teased video must exist next | HR T20, L Aymen #6, C001 note | M | S | ABC | DOING |
| No black end cards | L old #2 [OWN] | M | S | ABC | DOING |

---

## 5. Visuals and motion  (research: `docs/research/visuals-motion.md`; variety budget in its §4)

### 5.1 Camera and transitions
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Fly-to camera: one continuous map move with holds, `d3.interpolateZoom` (van Wijk) arc, bearing/pitch | Johnny Harris workflow [O]; van Wijk [E] (VM T1) | H | S | AC | PARTIAL |
| Globe → region → site in one shot (orthographic rotate, then cross-fade to flat) | VM T2 | H | M | ABC | PARTIAL |
| Match cut / shared element (country outline → bar, silhouette → metre axis) | VM T3 | H | M | ABC | MISSING |
| Transition vocabulary ≤ 4 per episode (continuous camera, match cut, border/front-line wipe, chapter push) via `TransitionSeries`; > 2 hard cuts in a row flagged | VM T7 | H | M | ABC | MISSING |
| Whip pan without blur (motion-streak shapes, frame-derived) | VM T4 | M | S | ABC | MISSING |
| Eased keyframes + absolute-time drift on **every** scene kind (maps, charts, stages) or freezedetect fails | L 001 #13, C001 #1, B001 [OWN] | H | S | ABC | DOING |

### 5.2 Maps
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Three registers: context (globe/locator, muted), story (tilted 2.5D, hillshade, glow routes), data (flat choropleth); change register ≥ every ~60 s | VM T13 | H | M | AC | MISSING |
| Tilted 2.5D map (CSS perspective) + three.js terrain from SRTM/GEBCO (PD/credit) for hero shots | VM T6 | H | M | AC | MISSING |
| Satellite blend: EOX Sentinel-2 cloudless **2016 only** (CC BY 4.0; 2018+ is NC-SA) | VM T14 [E licence page] | H | M | AC | MISSING |
| Glow routes without blur (layered strokes), ink/paper stroke-draw reveals | VM T8, T15 | M | S | AC | MISSING |
| Modern borders + names under ancient maps; "today:" names; locator globe; km scale; relief + rivers | CLARITY #1–2, L Aymen #3–4 [OWN] | H | — | AC | DOING |
| Label rules: bounded shifts, `maxShift` + `drop`, panels are obstacles, off-screen anchors hidden; tiny countries get a city marker only where needed | L Aymen #5, C001 #2 [OWN] | H | — | ABC | DOING |
| Label typography system (hierarchy, letter-spacing for regions, halo) | VM T17 | M | S | ABC | PARTIAL |
| Legend always visible; colour + second cue (pattern/icon) for colour-blind viewers | CLARITY #4, L Aymen #28 [OWN] | M | — | ABC | DOING |
| Ancient territories say "approximate" on screen + description | CLARITY #10 | M | — | A | DOING |

### 5.3 Charts and data
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Camera inside the chart: push in on the bar that matters, grey the rest, annotation draws on | VM T20 | H | M | C (AB) | MISSING |
| Staged morphs between chart types (axis → marks → shape) | Heer & Robertson 2007 [E] (VM T18) | H | M | C | MISSING |
| Unit/Isotype charts with an axis; kinetic numbers | VM T19, T27 | M | S | BC | PARTIAL (pictogram exists) |
| Bar races only with ≤ 10 bars and a clear point | VM T21 | L | S | C | — |
| Source + year in frame; "how to read" line; never show mid-animation numbers, show the sourced range | C001, B001 #3 [OWN] | H | — | ABC | DOING |

### 5.4 Art, photos, silhouettes
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Real PD/CC0/CC BY art with 2.5D parallax (Depth-Anything-V2-**Small** only = Apache-2.0; Base/Large are NC) | L Aymen #3 [OWN]; VM licence note | H | — | ABC | DOING (verify checkpoint) |
| Modern imagery from NASA/USGS/NOAA (PD), Met/Smithsonian/Rijksmuseum (CC0 items only), LoC (per item), Openverse filtered CC0/BY. **Reject** Unsplash/Pexels (custom licences), ESA (CC BY-SA IGO), Google Earth Studio | VM §3 [E licence pages] | H | S | ABC | PARTIAL (few modern photos) |
| Ken Burns with intent (move toward the detail being narrated); photo-in-map pins | VM T24, T26 | M | S | ABC | PARTIAL |
| Prefer high-res museum scans (Tate/NG/NYPL originals); low-res engravings look soft full-frame | 002 review [OWN] | M | S | A | PARTIAL |
| Textured silhouettes: two-tone shading, rim line, texture pattern per species; check proportions on first stills | VM T23, B001 #7 [OWN] | H | M | B | MISSING |
| Scale reveal always anchored to a human; mid-key so the big subject is in frame by ~50 % of a log pull-back | VM T22, B001 #2 [OWN] | H | S | B | PARTIAL |
| Illustrated figures, never NATO boxes; phase titles; arrows fade after the move | L Aymen #20–22 [OWN] | H | — | A | DOING |
| No AI-generated realistic people | CLAUDE.md | — | — | ABC | DOING |

### 5.5 Living frame and cadence
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Living background: static paper/sea texture plate + slow drift, deterministic `noise2D(seed, frame)` particles, frame-driven light sweep, static grain plate cycled by frame (no animated blur/turbulence) | VM T9–T12 | M | S | ABC | MISSING |
| Parallax depth stack (2–3 layers) on every hero shot | VM T5, CLAUDE.md | M | S | ABC | PARTIAL |
| Variety budget: no shot type > 30 % of runtime; type change every 6–15 s; hero shot every ~90 s (~8 per episode); C charts up to 30 %, B scale stage up to 35 % | VM §4 | H | S | ABC | PARTIAL |
| Cadence checks on the contact sheet: ≥ 3 shot types per 60 s window, no > 15 s window without a type change | VM §4 | M | S | ABC | MISSING |
| One grade per register | VM T28 | L | S | ABC | MISSING |

### 5.6 Captions and on-screen text
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Burned-in captions 46 px (Aymen: 54 too big), pop-ups ~32 px, numerals not spelled numbers, max 2 lines | L Aymen #4, 001 #15 [OWN] | H | — | ABC | DOING |
| Avoid narration that the caption converter can't render ("point" decimals, "oh" years) | L C001 #3 [OWN] | M | S | ABC | DOING |
| Never put two number words next to each other ("one twenty-four" became "25"); run `tools/caption_numbers.mjs <timeline.json>` before every render and read every line against sources.md | L B001 #8 [OWN] | H | S | ABC | DOING |
| Signaling: highlight the few key words/numbers | Mayer, d ≈ 0.69 [E] (HR T24) | M | S | ABC | DOING |
| Later A/B: full captions vs keyword captions (redundancy principle) once data exists | HR T25 [E mixed] | M | S | ABC | MISSING (deliberately deferred) |
| Shorts safe zone if Shorts ever return: nothing key in bottom 420 px / right 120 px | CLAUDE.md | — | — | — | n/a |

---

## 6. Voice, music, sound  (research: `docs/research/voice-sound.md`)

### 6.1 Voice
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| TTS shortlist: (1) **Kyutai Pocket TTS** — MIT code, CC BY 4.0 weights (credit line), ~2.3–2.5× real time on 4 vCPU (vendor), no watermark; only CC0/CC BY voice folders (reject `expresso/`, `ears/` NC). (2) **Chatterbox** Nano/Turbo — MIT, exaggeration control, retired Aug 2026 (pin version + SHA), PerTh watermark. (3) **Kokoro** baseline (RTF ≈ 1.6 measured). | VS §2 (model cards, 2026-11-14) | H | M | ABC | MISSING (benchmark) |
| Rejected TTS: F5, Spark, MaskGCT, Fish/OpenAudio (NC), XTTS (licence page 404), IndexTTS-2, Supertonic (custom), VibeVoice (research-only, spoken disclaimer), Piper (GPL code); on hold Orpheus/Higgs (Llama licence) | VS §2 | — | — | — | decision |
| CI benchmark gates: ≥ real time, Whisper WER ≤ 3 %, pitch variance ≥ 1.3× Kokoro, zero silent/NaN chunks, 12-min drift test; then Aymen's blind ranking on his phone | VS §5 | H | M | ABC | MISSING |
| Per-sentence prosody: speed ±4–8 % by sentence role (hook, fact, reveal, aside); rule-based pauses (sentence 300–450 ms, paragraph 0.7–1 s, before reveal 0.8–1.5 s) | VS techniques | H | M | ABC | PARTIAL (per-scene speed only) |
| Script for the ear: sentence-length mix, lint for numbers/abbreviations, 140–155 wpm pace check | VS | H | S | ABC | MISSING |
| Second voice for quotes; Aymen's own voice on long videos when possible (also inauthentic-content defence) | VS, CG §4, CLAUDE.md | M | M | AC | MISSING |
| Each channel its own voice (A history voice, B `bm_george`, C `af_heart`) | [OWN] | M | — | ABC | DOING |
| Kokoro silence guard: cache + jitter + sentence-split fallback; cache all TTS lines | L 001 #14 [OWN] | M | — | ABC | DOING |

### 6.2 Mix
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Duck music 18–24 dB under voice (now ~9 dB) | VS T1 | H | S | ABC | PARTIAL |
| Voice chain for phone speakers: HPF 90 Hz, −2–3 dB at ~300 Hz, de-ess, 3:1 compression, light room reverb | VS | H | S | ABC | MISSING |
| Loudness −14 ±1 LUFS, true peak ≤ −1.5 dBTP, −3 dBFS limiter after loudnorm (SFX transients broke TP once) | CLAUDE.md, L Aymen #8 [OWN] | H | — | ABC | DOING |
| Phone-speaker simulation render in CI (band-limited mono) + Aymen listens on his phone before upload | VS, L old #7 [OWN] | H | S | ABC | MISSING |

### 6.3 Music and SFX
| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Keep the original MIDI score (zero Content ID risk) but give each channel a palette (mode, tempo, instruments) + 2–3 s sound logo + leitmotifs; stop using one i–VI–iv–v progression everywhere | VS music | H | M | ABC | MISSING |
| Reveal grammar: build → ~1 s silence → stinger on the reveal word, synced to word timings; music rises toward each battle/payoff | VS, L Aymen #25 | H | S | ABC | PARTIAL |
| SFX auto-synced to visual events: whoosh on camera moves, thud on map pins, ticks on counters, clash/march/hooves on battle actions | VS SFX, L Aymen #25 | H | M | ABC | PARTIAL (hand-listed) |
| Per-scene ambience | VS | M | — | ABC | DOING |
| Allowed outside sources: YouTube Audio Library (YouTube only), Incompetech (CC BY), FMA CC BY/CC0 only, Kenney (CC0), Freesound CC0/CC BY 4.0. Reject Pixabay music, MusicGen (NC weights), Stable Audio Open (custom), BBC RemArc (NC) | VS §4 [E licence pages] | M | S | ABC | decision |
| PD compositions can still match Content ID via a specific recording → only PD/CC0 recordings or our own renders | CG §4 | M | — | ABC | DOING |

---

## 7. Facts, sources, licences, policy

| Rule | Evidence | Imp | Eff | Ch | Status |
|---|---|---|---|---|---|
| Every on-screen number has a row in `sources.md` with URL; in-frame attribution; contested numbers show both sources | CLAUDE.md, L 001 #11–12 [OWN] | H | — | ABC | DOING |
| Superlatives must be sourced or cut; "had no X law" claims checked against a primary/academic source | L 001 #11, C001 #5 [OWN] | H | — | ABC | DOING |
| Money numbers need the definition + year + currency (exports excl. gold, attributed industry claims); no year → drop it | L C001 #4 [OWN] | H | — | C | DOING |
| Never round a sourced value to a nicer one; round only conversions; narration units = on-screen units exactly | L B001 #3–4 [OWN] | H | — | ABC | DOING |
| Discovery stories from the paper, not the press | L B001 #5 [OWN] | M | — | B | DOING |
| Balance on sensitive stories (one sourced critical-record line) | L C001 #6 [OWN] | M | — | ABC | DOING |
| Licences: PD, CC0, CC BY (credit), OFL, MIT, BSD, Apache; reject NC, ND, BY-SA, unknown. Row in `docs/LICENSES.md` per asset | CLAUDE.md | H | — | ABC | DOING |
| Inauthentic content (renamed 15 Jul 2025): each episode a distinct storyline/concept; no two consecutive episodes sharing > ~30 % of script skeleton; enforcement is channel-level, pattern-based | Official policy [E] (CG §4) | H | S | ABC | PARTIAL (add reviewer check) |
| No AI persona posing as a human expert on finance/health/legal/politics (Jul 2026 guidance) → C narrates as an explainer, never advice; "not financial advice" line | CG §4 [E via Tubefilter] | H | S | C | MISSING |
| Altered/synthetic disclosure only for realistic content that could mislead; animated visuals + generic TTS narrator: not required (not addressed explicitly; disclosing never reduces reach) | Official help [E] (CG §4, VS) | M | — | ABC | DOING |
| Violence non-graphic, nothing graphic in first 7 s, never "made to shock" | CLAUDE.md | H | — | A | DOING |
| Media fetched once into per-channel releases (`media-v1`, `media-b001`); Wikimedia originals, paced, generic User-Agent | L Aymen #3, B001 #6 [OWN] | M | — | ABC | DOING |

---

## 8. Clarity (zero-background viewer)  (`docs/CLARITY_STANDARD.md`, `docs/VIEWER_CLARITY_FEEDBACK.md`)

All DOING via the Clarity Kit — keep them; they are our differentiator: character card at first mention (watch duplicate names), ≤ 8-word glossary pop-ups (now *just in time*, max 2 before 0:50), then→now names, numbers with relatable context (one consistent comparison per number), chapter tracker, years-ago timeline, "So far" recaps (≤ 5 s, with a question), legend, km scale, locator globe. Source: [OWN] L Aymen #2, CLARITY #1–10.

---

## 9. Process and QA (how we work)

| Rule | Evidence | Imp | Status |
|---|---|---|---|
| Format contract first; packaging gate (3.1) before script; read this playbook + LESSONS before every new script | L old #8, CLAUDE.md | H | DOING (playbook new) |
| Start from the latest pattern folder of the channel (A: 002-carthage, B: 001-biggest-animal, C: 001-switzerland) | L [OWN] | M | DOING |
| Stills rounds, every sheet looked at; QA fails the job (no warnings with exit 0) | L old #6 [OWN] | H | DOING |
| Fresh independent reviewer before final render (facts vs sources, licences, policy, clarity, **promise ledger**, variety cadence) — every episode so far failed the first review (6.5–7.0) on fixable things | L Aymen #7 [OWN] | H | DOING (add ledger + cadence) |
| Run a second independent review after fixes when time allows (never done yet) | 002/C001 reviews [OWN] | M | MISSING |
| Start the reviewer subagent while the next stills round renders (saves ~30 min) | L B001 #11 [OWN] | M | DOING |
| Parallel sessions: merge `origin/main` into your branch inside your own worktree, typecheck + test, then push; never a conflicting merge in the shared `D:\studio` checkout | L B001 #10 [OWN] | M | DOING |
| Demand check without Semrush: web search + competing videos' outlier ratios; don't block on API units | L B001 #12 [OWN] | M | DOING |
| Big patch edits via a Python script file, not shell heredocs | L B001 #13 [OWN] | L | DOING |
| After `git merge origin/main`, if `git diff --name-only --diff-filter=U` lists anything, STOP: resolve, `grep` for `<<<<<<<`, typecheck + test, only then commit/push (a marker-filled make_shorts.py reached main once) | B Shorts 18 Nov [OWN] | H | DOING |
| Work fast, report early, short answers | L Aymen #9 [OWN] | M | DOING |
| Anything blocked for automation (bot-checked sites, logins, big archives — e.g. the USGS ScienceBase CC0 video zip): **ping Aymen with the exact link, file name, size and where to save it** instead of skipping it; never bypass bot checks | Aymen 16 Nov 2026 [OWN] | M | DOING |
| Realism: no flat silhouettes for animals/subjects; real PD/CC0/CC BY photos, cut-outs at exact scale (`cutout: true`), real footage when available | Aymen 15 Nov 2026, B001 analytics [OWN] | H | DOING |

---

## 10. Decisions waiting for Aymen (logged in STATUS)
1. Allow **Copernicus Sentinel / Copernicus DEM** terms (free, attribution-only, not Creative Commons)?
2. Allow **Unsplash / Pexels** licences (custom, not CC0)?
3. Allow **Sonniss GDC** SFX bundles (royalty-free, custom licence)?
4. Turn on **advanced features** on all 3 channels (needed for Test & Compare and YPP).
5. Confirm the **lead-channel rule** at day 42 (60 % of capacity to the best channel).

## 10b. Added from Money & Maps 002 (16 Nov 2026)  [OWN]
| Rule | Evidence | Imp | Status |
|---|---|---|---|
| New narration: `voice.model: "fp32"` (int8 Kokoro returns NaN on the current runner image) | L C002 #1 | H | DOING |
| `voice.chain` / deep ducking on → also `mix.tp_oversample` (true peak −0.4 → −3.5 dBTP) | L C002 #2 | H | DOING |
| Ranges on screen as ranges (`valueText`), never midpoints or ticking counters | L C002 #3 | H | DOING |
| Art date/season must match the narrated line; reviewer checks it | L C002 #4 | M | DOING |
| ≤ ~10 % of scenes as dimmed text cards; one area definition per chart | L C002 #5–6 | M | DOING |
| Fly-to camera (`CamKey.fly`) between far places; circled points on photos (`art.points`) | trick #12, L C002 #8 | H | DOING (was PARTIAL) |
| Phone voice chain + 18–24 dB ducking + per-sentence prosody shipped opt-in (`voice.chain`, `mix.duck_db`, `voice.prosody`) | tricks #8, #16 | H | DOING (not yet heard on a phone) |
| Thumbnails render at 1920×1080 | PK 3.3 | M | DOING |
| Always run a second independent review after fixes | L C002 #10 | M | DOING |

## 11. How to keep this file alive
- New lesson from an episode → one row in the right section with `[OWN]` + the raw note in `docs/LESSONS.md`.
- After each upload's 7-day review → fill the LESSONS "From published videos" table and promote any confirmed pattern here.
- Volatile facts (YPP thresholds, licences, TTS model status) older than 30 days → re-verify before relying on them (CLAUDE.md).
