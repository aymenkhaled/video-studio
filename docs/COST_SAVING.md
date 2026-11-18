# Cost saving — where the Claude usage goes and how to cut it (18 Nov 2026)

Measured on the long C001 chat (Money & Maps 001 + everything after): **660,000 tokens of context**. Every new message re-sends the whole chat, so one more message in that chat costs ~660k tokens of input (cached input is cheaper, but still counts toward the Pro 5-hour / weekly limits). After 1 video + follow-ups the 5-hour window was at 66 %.

## Where the usage goes (biggest first)
| # | Cost driver | Why it is expensive | Fix |
|---|---|---|---|
| 1 | **Long chats** | Each turn re-reads all earlier messages; late turns cost 10–20× early turns. Status notes from side sessions also wake the long parent chat. | One chat per video, end it at delivery. Start the next video in a fresh chat (the repo + PLAYBOOK + memory carry the knowledge). Don't use a 500k+ chat as a "control room". |
| 2 | **Web research output** | One web search returns 10–20k tokens of excerpts; topic + source research used ~25 searches per video. | Narrow queries, fewer of them; let a cheaper model (OpenCode/GPT, or a Sonnet/Haiku subagent) do the bulk search and write a compact `research.md`; Claude reads only that file. |
| 3 | **Plugin / tool overhead** | ~60k tokens of tool, skill and agent descriptions are loaded on every request in every session (dozens of installed plugins: Shopify, Zoom, bio-research, sales, etc.). | Disable plugins not used for video work (Claude Code settings → plugins). Saves ~40k tokens per request. |
| 4 | **Reviewer subagent** | One independent review used ~216k tokens (reads all files + all stills + web checks). | Keep it (it catches real errors), but run it on a cheaper model, give it only `sources.md`, `timeline.json`, `scenes.ts` and 4–6 contact sheets, and cap web checks to the 10 most important claims. Or let GPT in OpenCode do a first review and Claude only the final one. |
| 5 | **Reading whole files and long logs** | Big `scenes.ts`, `timeline.json`, CI logs. | Read sections; CI scripts print only the QA summary; never paste full logs. |
| 6 | **Stills rounds** | 15 contact sheets per round × 3 rounds (images ≈ 1.5k tokens each) + fix cycles. | Fewer, denser sheets; check map-label problems with an automatic test instead of by eye; max 2 rounds. |
| 7 | **Re-renders from avoidable bugs** | Crashes (legend), freezedetect, true-peak, label drift each cost a full CI cycle + tokens to diagnose. | Most are now fixed in the engine; add pre-render checks (`check_episode.mjs`: glossary ≤ 8 words, caption-number patterns, chart static time). |

## Split the work: OpenCode (GPT) vs Claude
OpenCode reads `AGENTS.md` in the repo (this repo now has one that points to the same rules as `CLAUDE.md`).

| Step | Best tool | Why |
|---|---|---|
| Topic scouting, bulk web research, collecting view counts | **OpenCode / GPT** | Mechanical, token-heavy reading; output = a short ranked `docs/research/topic-scout-*.md`. |
| Sources table draft (numbers + URLs + dates) | **OpenCode / GPT**, Claude spot-checks | Lots of fetching; Claude verifies the 10 most important numbers. |
| Licence-checked image search (Commons / Met / LoC API) | **OpenCode / GPT** | Repetitive API calls; output = entries for `assets/media.json`. |
| Script (timeline.json) + scene design + engine features | **Claude** | Story, clarity and code quality matter most here. |
| Running CI, waiting, downloading artifacts, copying deliverables | **OpenCode** (or a plain script) | Zero judgement needed; must not run in a long Claude chat. |
| Stills review + independent review | Claude (one round) after a GPT first pass | Second opinions are cheap on GPT; Claude makes the final call. |
| Packaging (UPLOAD.md is generated), docs updates | OpenCode | Template work. |

Handoff format: each step writes one file (`docs/research/...md`, `sources.md`, `assets/media.json`), so the next tool reads a small file instead of a long chat.

## Target per video
Fresh chat per video, research done by OpenCode first, plugins trimmed, 2 stills rounds, 1 Claude review on a lean input: expected **~40–60 % less Claude usage** per video than C001/C002 (estimate, not yet measured — measure the next video with `/context` at the end and record it here).

## How Claude Code and OpenCode connect (tested 18 Nov 2026)
No editor link is needed: both work in the same folder (`D:\studio`) and the same git repo, and Claude can run OpenCode directly from its shell:
```
opencode run -m <provider/model> "task… write the result to docs/research/<file>.md"
```
OpenCode (GPT) does the work, writes the file, and Claude reads only that file. OpenCode 1.19.5 is installed at `C:\Users\khale\AppData\Roaming\npm\opencode`.

Test result: the bridge works, but **no GPT account is usable right now**:
- `opencode/gpt-*` (OpenCode Models, pay-as-you-go): "Insufficient balance" — needs credits.
- `opencode-go/*` (incl. `gpt-6-luna`): "An active OpenCode Go subscription is required".
- `agentrouter-openai/gpt-5.6-sol`: "invalid token" — the AgentRouter key has expired or is wrong.
Fix one of these (Aymen), then re-run the one-line test above.

## Working models (tested 18 Nov 2026) and the helper
All three answered the one-line test from Claude's shell:
| Tier | Model | Use for |
|---|---|---|
| heavy | `agentrouter-responses/gpt-6.1-sol` | deep topic research, sources table drafts, first-pass review |
| mid | `agentrouter/gpt-5.6-sol` | image/licence search (Commons, Met, LoC), collecting view counts, packaging text |
| free | `opencode/big-pickle` | quick lookups, summaries, CI waiting/downloading, simple file edits |

Helper: `tools/gpt.sh <heavy|mid|free> <output-file> "task"` — runs OpenCode with that model (falls back down the chain on failure), the model writes its result to the file, and only one status line comes back to Claude. Example:
```
tools/gpt.sh heavy docs/research/topic-scout-2026-11-20.md "Find 12 rare, high-demand topics for Money & Maps… score them…"
```
Claude then reads only the result file, checks the most important facts, and does script, scenes, code and the final review.

Note: the output file must be inside the repo (e.g. `docs/research/…`); OpenCode refuses to write outside `D:\studio`. Tested end to end 18 Nov: `free` tier wrote the file and returned one status line.
