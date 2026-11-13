# Episode 002 — "Why Rome Destroyed Carthage" + the Zero-Background Clarity Standard

Status: DRAFT for Aymen's approval · 13 Nov 2026 · Channel A (History in Maps)

## 1. Intent (why)
Second video on the History channel, uploaded after 001-Hannibal, so the channel gets two strong, consistent
videos before any new category is tested. Aymen's review of Hannibal: maps were pure design (no modern countries),
no captions, many missing details. **A viewer with zero background must understand every second, and enjoy it.**
The fixes are built once into the shared map engine, so every later episode (and the Money & Maps pilot) inherits them.

## 2. Goals / non-goals / anti-goals
- Goals: (a) a 12–15 min episode that is the natural "watch next" after Hannibal; (b) a reusable Clarity Kit in
  `packages/engine`; (c) a written Clarity Standard checklist every episode must pass in QA.
- Non-goals: Shorts; 3D scenes; re-rendering Hannibal (it can adopt the kit later, Aymen's call).
- Anti-goals (fail even if it renders): a viewer asks "where is this?", "who is that?", or "what does that word mean?";
  any on-screen number without a source; graphic violence (siege end is told, not shown); slideshow feel.

## 3. Story (draft arc — every fact verified in research step, sources.md before script lock)
Cold open (0–40 s): a living, rich city — then the line "Rome had already beaten it… so why burn it to the ground 50 years later?"
1. **After Hannibal (201 BC)** — peace terms: fleet cut, war only with Rome's permission, a 50-year payment. Carthage gets rich anyway.
2. **The fig** — Cato the Elder, a fresh fig from Carthage in the Senate, "Carthage must be destroyed".
3. **The neighbour** — Masinissa of Numidia (today: Algeria/Tunisia) keeps grabbing land; Carthage finally fights back without permission.
4. **The trap (149 BC)** — Carthage hands over weapons and hostages; then Rome demands the city move inland, away from the sea. Carthage refuses.
5. **The siege (149–146 BC)** — three years, walls, harbour, Scipio Aemilianus; the fall told with restraint.
6. **Myth vs fact** — "Rome salted the earth": no ancient source says so (modern invention) — a fun reveal for beginners.
7. **Then vs now** — Roman Carthage rebuilt by Caesar/Augustus; today ruins in the suburbs of Tunis, a UNESCO site. End on the same coastline as the cold open.

## 4. The Clarity Standard (new, applies to every episode)
| # | Rule | Engine piece |
|---|---|---|
| 1 | Every map shows **modern countries + names** faintly under the ancient layer; first time a place appears: "Carthage → today near Tunis, Tunisia". | `ModernLayer` (Natural Earth countries, public domain via world-atlas) + `ThenNowLabel` |
| 2 | **Burned-in captions** for every spoken word (phrase-by-phrase, 2 lines max, key names highlighted in faction colour) **plus** an SRT for YouTube CC. | reuse word-caption timing from voice-first pipeline → `Captions` |
| 3 | **Colour legend** always visible on maps ("■ Carthage ■ Rome ■ Numidia"). | `Legend` |
| 4 | **Who's who card** the first time a person appears (portrait silhouette, name, role, one line). | `CharacterCard` |
| 5 | **Word pop-up** for any term a 12-year-old wouldn't know (Senate, indemnity, siege…). | `GlossaryPop` |
| 6 | **Dates made human**: "149 BC · about 2,170 years ago", timeline bar always shows "you are here". | timeline bar upgrade |
| 7 | **Recap card** at each chapter end: one sentence "So far…". | `RecapCard` |
| 8 | **Change every 6–15 s**, at least one "wow/fun" beat per chapter (myth-bust, comparison to a modern thing, a question to the viewer). | script rule + QA |
| 9 | Label collision avoidance (Hannibal weakness #2). | label layout pass |
| 10 | Historical territories labelled "approximate" when hand-drawn; sourced boundaries where a licence-clean source exists. | data + description note |

## 5. Approaches considered
- **A. Clarity Kit in the engine, then the episode (chosen).** Research + script first (it decides which kit pieces are needed),
  then build the kit, then the episode scenes. Slower start, every future video benefits.
- B. Hand-make the extras inside this one episode. Faster once, but Hannibal's problems return in episode 3. Rejected.
- C. Burned-in captions only, no SRT. Rejected: SRT is cheap (we have the timings) and helps search + non-English auto-translate.

## 6. Constraints
- Rules in `D:\studio\CLAUDE.md`: render/QA only in GitHub Actions, deterministic animation, licences in `docs/LICENSES.md`,
  every number sourced, non-graphic violence, 1920×1080 · 24 fps (same as Hannibal), −14 LUFS.
- **Another session is rendering 001-Hannibal in `D:\studio`.** This work goes on its own branch/worktree
  (`ep/002-carthage`); engine changes must keep Hannibal rendering unchanged (new components opt-in).
- Voice: Kokoro `am_michael` like Hannibal, for channel consistency.

## 7. Decisions — Claude's calls (Aymen can override)
Topic choice (Aymen approved), captions burned-in + SRT, modern layer always on (faint), length 12–15 min (~1,900–2,200 words),
same voice and palette as Hannibal plus a third faction colour for Numidia.

## 8. Left to the builder
Exact scene list and timings (voice-first), card visual design inside the existing parchment style, glossary word list,
caption typography (must pass phone-size readability on the contact sheet).

## 9. Done means
Rendered in CI with QA PASS; contact sheet reviewed against the Clarity Standard table; independent reviewer PASS on facts
vs `sources.md`; `UPLOAD.md` package (3 titles, 3 thumbnails, chapters, sources, SRT); honest /10 score + 3 weaknesses.
