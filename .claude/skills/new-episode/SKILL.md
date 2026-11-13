---
name: new-episode
description: Produce one video episode end to end (research → outline → facts → script → shots → storyboard → render → QA → package). Use when starting any new long video or Short.
---

# new-episode

Inputs: brand (`scale-power` | `maps-empire`), working title, format (long | short), target length.
Output folder: `brands/<brand>/episodes/<YYYYMMDD>-<slug>/`.

1. **Read first:** `docs/LESSONS.md`, `docs/STATUS.md`, the brand README. Check no existing episode is a near-duplicate.
2. **Demand check:** run `topic-research` (or reuse its saved result). Record the outlier evidence (views ÷ subs ≥ 3, last 2 years) in `research.md`. No evidence means pick another topic.
3. **Outline** (`outline.md`): hook in the first 15 s (Shorts: subject + motion on frame 1), open loops, chapters every ~2 min (long), payoff, end-screen target. One line on why a viewer keeps watching each segment.
4. **Fact sheet** (`sources.md` + `data.json`): every number has a source URL + access date; prefer primary/museum/peer-reviewed. Mark uncertain values and hedge them in the script.
5. **Script** (`script.md`): original wording, spoken-English rhythm, ≤ 2.6 words/s. Long videos: mark for Aymen's voice. No graphic violence; nothing graphic in the first 7 s.
6. **Shot list** (`shots.json`): per shot id, start/end s, engine (2d | three | map), camera move, on-screen text, SFX events. Change every 4–8 s (Shorts) / 6–15 s (long).
7. **Storyboard stills:** run `render-cloud` with `mode=stills`; build the contact sheet; look at every frame yourself. **Show Aymen and wait for OK.**
8. **Render:** `render-cloud` with `mode=full`.
9. **QA:** `qa-video`, plus an independent reviewer subagent (did not build it) → PASS/FAIL. Max 3 fix rounds, then record the blocker.
10. **Package:** `package-upload`.
11. Record honest scores /10 (hook, clarity, visuals, motion, sound, originality), top 3 weaknesses, and measured render time vs estimate in `review.md`; update STATUS/WORKLOG.
