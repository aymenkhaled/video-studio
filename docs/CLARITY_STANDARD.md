# Clarity Standard — every history / map episode (adopted 2026-11-13)

Test: a viewer with **zero background** must never ask "where is this?", "who is that?", "what does that word mean?" or "when was this?" — and must never be bored for more than 15 s.
Engine pieces live in `packages/engine/src/map/clarity.tsx`, `clarity-logic.ts`, `map.tsx`, `ui.tsx`; they switch on with `HistoryEpisode clarity={...}` and per-scene `MapSpec.modern` / `avoidLabels`.

| # | Rule | Engine piece | How the reviewer checks it (contact sheet / stills) |
|---|---|---|---|
| 1 | Every map shows faint modern borders + modern country names under the ancient layer. | `MapSpec.modern = {labels}` | Every map still: dashed borders visible, ≥ 1 modern country name readable. |
| 2 | First time a place appears, say where it is today. | `City.today` ("today: near Tunis, Tunisia") | First still of each new city shows the "today:" line. |
| 3 | Captions on screen for every spoken word (≤ 2 lines, numbers as numerals, factions in colour) + `captions.srt` uploaded. | `MapCaptions` (auto from voice timing) | Every still with narration shows a caption; no caption covers the timeline bar or a key label. |
| 4 | Colour legend always visible on maps. | `Legend` (from `clarity.factions`) | Every map still: legend top-right, colours match territories. |
| 5 | "Who's who" card the first time a person appears. | overlay `character` | Each named person has a card at first mention. |
| 6 | Pop-up meaning for any word a 12-year-old wouldn't know (≤ 70 chars). | overlay `glossary` | Terms like Senate, consul, siege, province, indemnity, talent, citadel are explained once. |
| 7 | Dates made human: year + "about N years ago" on the timeline bar. | `TimelineBar now` | Every map still with a year shows the "years ago" line. |
| 8 | A one-sentence "So far…" recap at the end of each chapter (≤ 120 chars). | overlay `recap` | One recap card per chapter. |
| 9 | Something changes on screen every 6–15 s; one fun/surprise beat per chapter (myth-bust, comparison, question). | `tools/check_episode.mjs` (scene ≤ 15 s) + script review | Validator PASS; reviewer names the fun beat of each chapter. |
| 10 | No overlapping labels; ancient territories called "approximate" in the description. | `MapSpec.avoidLabels`; `package.json` credits | No text overlaps on any still; credits line present in `UPLOAD.md`. |

A history episode fails review if any rule fails on the stills, unless `review.md` records why the rule does not apply to that scene.
