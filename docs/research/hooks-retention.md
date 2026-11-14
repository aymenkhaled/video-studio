# Hooks, Retention & Story Structure: research for the long-form template

Accessed: 2026-11-14 (all sources). Scope: 10–15 min, 1920x1080, AI-voiced (Kokoro), Remotion-animated long-form for
A "History in Maps", B "Scale & Science", C "Money & Maps". Only general techniques are extracted. No channel's characters, look or script is copied.

Evidence labels used below:
- **[OFFICIAL]**: YouTube Help / YouTube staff (Creator Insider, Creator Liaison).
- **[STUDY]**: peer-reviewed research.
- **[DATA]**: real retention graphs or view numbers published by a named analyst. Single cases, not controlled.
- **[LEAK]**: the 2024 "How to Succeed in MrBeast Production" document. Authenticity is not officially confirmed.
- **[OPINION]**: creator or strategist advice, or vendor blogs. Treat as hypotheses.

> Method caveat: the video breakdowns in section 3 come from published transcripts, chapter lists and summary pages (mostly rosetta.to), not from frame-by-frame viewing. Visual details are therefore limited. Where the transcript pages had broken chapter timestamps, this is flagged.

---

## 1. Summary

1. **The first 30 s is the only retention number YouTube itself names.** The "Intro" key moment is the percentage still watching at 0:30. YouTube's two fixes are packaging that matches the content, and a reworked opening [S1, S2]. YouTube does not publish a target. The often-quoted "50% at 30 s" or "70% at 30 s" figures come from vendors [S3, S20].
2. **The best-documented opening pattern** (MrBeast leak, Paddy Galloway, Nick DiGiovanni, Veritasium) has three parts:
   - "Confirm the click" in about 7 s: show the thing the title and thumbnail promised.
   - A second hook, question or stakes by about 30 s.
   - A minimal-context run straight into the first story beat [S4, S5, S6, S7].
   **Our opening fails this test.** We lead with who/where/when/why *context* on a painting. That is clear, but it is not the title's *promise*.
3. **Curiosity is an information gap with an inverted-U shape.** It is strongest when the viewer knows a bit but not the answer, and it improves memory [S8, S9]. Practical rule: **never give the answer in the hook.** In one documented case, a hook that gave everything away lost about 45% of viewers in the first 30 s and ended at 14.9% average viewed [S10].
4. **Satisfaction beats raw minutes.** YouTube's growth director said in 2025–2026 that not all watch time is valuable. YouTube weighs surveys, likes and dislikes because a viewer who waits for a payoff that never comes is not a satisfied viewer [S11, S12]. So every promise needs a planned payoff. **We have no explicit promise/payoff design. This is the biggest structural gap.**
5. **Mid-video, pace comes from new problems, not cuts** [S6]. Practical tools:
   - "but/therefore" causal links [S6].
   - Restating the stakes [S13].
   - Re-engagement beats around minute 3 and minute 6 [S4].
   - A teased open loop every 2–3 min, placed *before* transitions, because transitions are where people leave [S14].

   Our chapter recaps and open loops partly cover this. They are "summary then pause" beats, and those are classic dip points unless the recap card itself carries the new question.
6. **Endings:** the payoff is the last major beat, followed by a fast exit. Long outros and recaps get dropped [S4, S6, S10, S15]. Our 20 s end screen is fine mechanically [S16]. The narration over it must be a *specific* tease, not a goodbye.
7. **Educational research adds two cheap wins:**
   - **Misconception-first** framing produced learning gains with d ≈ 0.8 in Derek Muller's study [S17].
   - **Signaling**, meaning highlighting key terms, has d ≈ 0.69 [S18].

   One caution: the redundancy principle says that full on-screen text duplicating narration *can* hurt learning [S18, S19]. Our full burned-in captions should be A/B-tested against keyword-only captions once we have data.
8. **We have no retention data yet.** Item 21 below defines the review loop for the first uploads: predicted dips versus actual key moments, measured over 90 days [S12].

---

## 2. Techniques

Format per item: **What** · **Evidence** · **Impact / Effort** · **Channels** · **Status** · **Apply** (Remotion pipeline and script template).
Status is based on the brief: DOING / PARTIAL / MISSING.

### T1. Confirm the click in ≤7 s (show the promise, not the background)
- **What:** The first frame and sentence show the exact thing the title and thumbnail promised: the biggest animal at true scale, the Swiss wealth number, or Hannibal's army on the map. Context comes after.
- **Evidence:**
  - [OFFICIAL] YouTube links a high Intro % to a thumbnail and title that match the content [S1, S2].
  - [LEAK] The memo calls the first minute "the most important minute". It says the opening must match the title and thumbnail, and that front-loading reduces early drop-off [S4].
  - [OPINION] Galloway and DiGiovanni both say to confirm the click in about the first 7 s [S6, S7].
  - Example: Johnny Harris, *Gold Explained, Finally* (5.1M views, 2025-10-24) opens on a visual of all gold ever mined, before any history [S22].
- **Impact:** HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL. We open on a real PD painting or photo with who/where/when/why. That is context. It is not the promise unless the painting *is* the promise.
- **Apply:**
  - New scene kind `promise` (≤7 s) at index 0. Its visual is the thumbnail's subject in motion: a `BigCounter`, a scale-compare shot, or a map with the key move.
  - Narration is one sentence that restates the title's claim as a concrete fact or number.
  - Move the who/where/when painting to 0:20–0:40.
  - QA rule: the frame at 0:01 must contain the thumbnail's main object.

### T2. Second hook by ~30 s: a question-then-promise roadmap
- **What:** After the click is confirmed:
  - Raise one to three sharp questions the video will answer.
  - Say why they matter to the viewer.
  - Give a one-line roadmap ("by the end you'll see…").
- **Evidence:**
  - [OPINION] Galloway's framework: confirm the click in 7 s, then a new hook and a promise of payoff by about 30 s. He also suggests the first minute deserves 20–30% of production attention on a 10-minute video [S6].
  - OutlierKit's three 10-second beats: proof, why it matters, roadmap [S14].
  - DiGiovanni: make it personal by about 10 s, new hook by 15–30 s [S7].
- **Impact:** HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** MISSING as an explicit beat.
- **Apply:**
  - Script template `## HOOK` block with fixed slots: `promise (0–7s)`, `twist/stakes (7–20s)`, `questions+roadmap (20–35s)`.
  - Render the questions as a `ListCard` with up to 3 items. Each item becomes a promise in the ledger (T5).

### T3. Never give away the answer in the hook (prime, don't satisfy)
- **What:** Give a "priming dose" of information so the viewer knows enough to want the answer, but withhold the answer itself.
- **Evidence:**
  - [STUDY] Kang et al. 2009: curiosity follows an inverted U against confidence, activates reward circuitry, and improves recall [S8].
  - [STUDY] Gruber et al. 2014: curiosity states improve hippocampus-dependent memory, including for incidental material, after 24 h [S9].
  - [DATA] Blackman RR#2: a hook that revealed everything lost about 45% of viewers in the first 30 s and ended at 14.9% average viewed [S10].
  - [OPINION] A summary attributed to Muller says that giving the answer away in the first 30 s removes the reason to stay [S23]. This is secondary and unverified.
- **Impact:** HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL. Our "why" in the first 5 s risks stating the answer.
- **Apply:**
  - Script linter (`tools/`): flag if any sentence in the first 35 s contains the final-answer keywords listed in the ledger's `answer` field.
  - Example (C): "Switzerland had no coal, no sea and no empire. So where did the money come from?" Do not open with "banks and neutrality".

### T4. Context budget: just-in-time background, not a preamble
- **What:** Put at most about 10 s of setup before the first story beat. Deliver everything else at the moment it is needed.
- **Evidence:**
  - [DATA/OPINION] Blackman RR#8 flags a hook that was "way too slow" because it gave the full history first [S13].
  - The 5-mistakes post names "bland start" and "false start" (restating the title) [S15].
  - Galloway: enough context but not too much, then straight into the first story beat [S6].
  - A strategist summary says removing the opening explanation and leading with intrigue flattens the early retention curve [S24].
- **Impact:** HIGH · **Effort:** MED. There is a real tension with our zero-background Clarity Standard.
- **Channels:** A C (B less so)
- **Status:** PARTIAL. Clarity tools exist, but the risk is front-loading them.
- **Apply:**
  - Keep `CharacterCard`, `GlossaryPop` and then→now labels, but trigger them inside story scenes when a term first appears, not in an intro block.
  - CLARITY_STANDARD check: "every term explained" is satisfied at first use, not at 0:00.
  - Budget: ≤2 pop-ups in 0:00–0:45.

### T5. Promise/payoff ledger (keep the promise delta ≈ 0)
- **What:** A table in each episode folder listing:
  - every promise: title, thumbnail, hook questions, each chapter's open loop;
  - its planned payoff timestamp;
  - the line that pays it off.

  No promise goes unpaid. No payoff gets oversold.
- **Evidence:**
  - [OFFICIAL] Beaupré on time spent waiting for a payoff that never arrives; satisfaction signals over raw minutes [S11, S12].
  - [OPINION] Promise delta = payoff − promise, aiming for about 0 [S25].
  - Veritasium's argument for accurate "legit" clickbait over misleading clickbait [S26].
  - Linus Sebastian: "Plan for the payoff" [S7].
  - [LEAK] The memo says unmet thumbnail expectations lower AVD [S4].
- **Impact:** HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** MISSING
- **Apply:**
  - Add `promises.json` with entries `{id, promise, setAt, payoffAt, payoffLine}`.
  - The reviewer subagent fails the episode if any promise has no `payoffAt`, or if `payoffAt − setAt` exceeds 6 min without an intermediate partial payoff (T10).
  - Link it to UPLOAD.md: every title variant must be paid off by the script.

### T6. Re-engagement beats at about 3 min and 6 min
- **What:** A deliberately strong beat placed where attention sags: the best visual set piece, a shocking number, or a reveal.
- **Evidence:**
  - [LEAK] The memo prescribes a re-engagement around minute 3 and another around minute 6. It says viewers who reach minute 6 are very likely to finish [S4].
  - [OPINION] MrBeast clip in a creator compilation: plan side stories and a re-engagement point at about the halfway mark [S7].
- **Impact:** HIGH · **Effort:** MED (needs one "hero" shot per slot).
- **Channels:** A B C
- **Status:** PARTIAL. Our "fun beat per chapter" is spread evenly. Re-engagements are not planned peaks.
- **Apply:**
  - Timeline tags `reengage: true` on the scenes at about 2:45–3:15 and about 5:45–6:15.
  - These get the episode's highest-effort visuals: a 3D scale shot (B), the big map move (A), the money chart that bends (C).
  - The contact sheet must include these frames.

### T7. Open loops placed before transitions, every 2–3 min
- **What:** A forward tease ("the strangest part is still ahead…", "but there was a problem nobody in Rome saw") right *before* a chapter change or other likely drop point. Close each loop later.
- **Evidence:**
  - [OPINION] OutlierKit: tease the next part every 2–3 min; most mid-video drop-off happens at transitions [S14].
  - Rene Ritchie (YouTube liaison) recommends cliffhangers [S11].
  - [STUDY] The information-gap mechanism [S8].
  - Example: PolyMatter, *Why the Average Japanese Farmer is 70* (229K views, 2025-03-14) raises a food-security threat early and delays the explanation [S27].
- **Impact:** HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL. We have chapter-end open loops. They are not yet checked against the ledger and do not escalate.
- **Apply:**
  - Rule: the last sentence before every `ChapterCard` is a loop. The `ChapterCard.question` must be that loop's question, not a topic label.
  - Each loop must be bigger than the last.
  - Track loops in `promises.json`.

### T8. Recaps that move forward ("So far" plus a new question, ≤5 s)
- **What:** Keep the recap, but make it a springboard: one line of "so far", then the new unanswered question in the same breath.
- **Evidence:**
  - [DATA/OPINION] Recaps and repeated reflections are where drop-off happened in Blackman's outro case [S10].
  - The "outro = CTA only" rule [S15].
  - Blackman supports *restating stakes* in long videos [S13].
- **Impact:** MED · **Effort:** LOW · **Channels:** A C (B: a short "scale so far" ladder)
- **Status:** PARTIAL. The `RecapCard` has `next`, but recap length and wording aren't constrained.
- **Apply:**
  - `RecapCard`: text ≤12 words, `next` required and phrased as a question, scene ≤5 s.
  - Narration pattern: "So far: X. But that raises a bigger problem: Y?"

### T9. "But / therefore" causal chaining (problem → solution → new problem)
- **What:** Link every beat to the previous one with "but" or "therefore", never "and then". Keep introducing new problems.
- **Evidence:**
  - [OPINION] Colin & Samir: the "this happened, but then…, therefore…" rule [S7].
  - Blackman: pace is driven by the "pace of new problems", not by fast cuts [S7].
  - Cinema-style "intention + obstacle, cause + effect" for YouTube [S28].
  - Example: Wendover, *Why Wyoming is so Weirdly Wealthy* (1.9M views, 2024-06-11) is a chain of paradox → cause → new paradox (beauty → tax → inequality) [S29].
- **Impact:** HIGH · **Effort:** MED (rewriting skill)
- **Channels:** A B C
- **Status:** PARTIAL
- **Apply:**
  - Script linter counts sentence-initial connectives per chapter. Warn if "and then"-style narration dominates, or if a chapter has no "but".
  - Each chapter in the outline must state its `problem` and `turn`.

### T10. Small payoffs throughout (release tension before the end)
- **What:** Pay off part of the big question in each chapter. Hold back only the final synthesis.
- **Evidence:**
  - [DATA/OPINION] Blackman RR#2: viewers who wait too long for resolution leave; add mini-payoffs [S10].
  - [OFFICIAL] YouTube advises moving compelling content earlier when top moments come late, because audience size shrinks over time [S2].
- **Impact:** MED-HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL
- **Apply:** Each chapter closes at least one ledger promise (a `payoffAt` inside it) and opens a new one.

### T11. Put the top moment at about the 2/3 mark, not the last minute
- **What:** The single most impressive visual or reveal lands at about 65–75% of runtime. The ending is the *answer*, not the spectacle.
- **Evidence:**
  - [OFFICIAL] Top-moments guidance: move compelling content earlier [S2].
  - [OPINION] OutlierKit: place the best moment about two-thirds through [S14].
  - [LEAK] The memo says not to signal the ending early, except to hype the payoff [S4].
- **Impact:** MED · **Effort:** LOW · **Channels:** A B C
- **Status:** MISSING (not designed)
- **Apply:**
  - Timeline tag `top: true` on one scene between 7:30 and 9:00 of a 12-min episode.
  - Example: the full-scale lineup in B, the battle climax in A, the "you in Switzerland" calculation in C.

### T12. Misconception-first framing ("most people think X…")
- **What:** State a common wrong belief explicitly, let it seem reasonable, then overturn it with evidence.
- **Evidence:**
  - [STUDY] Muller et al. 2008: videos that voiced the misconception before correcting it beat plain exposition, with d ≈ 0.79–0.83. Low-prior-knowledge learners gained most [S17].
  - [OPINION] Myth framing also wins on titles: Veritasium's audience preferred "The Biggest Myth in Education" [S26].
- **Impact:** HIGH (both retention and learning) · **Effort:** LOW · **Channels:** B C, and A for battle myths
- **Status:** MISSING
- **Apply:**
  - Hook slot `twist (7–20s)` should be a misconception if one exists. Examples:
    - B: "a dinosaur was bigger than the blue whale"
    - C: "Swiss wealth is just banks"
    - A: "the Alps were Hannibal's biggest problem"
  - Every misconception must be sourced in `sources.md` as a *commonly held belief*, and the correction must be sourced too.

### T13. Midpoint reframe (change the question)
- **What:** About halfway through, reveal that the original question was framed wrongly, and open a deeper version of it.
- **Evidence:**
  - Examples:
    - Kurzgesagt, *The Largest Star in the Universe – Size Comparison* (35.5M views, 2020-09-22, older): after climbing by mass, it reveals that mass is not what makes the biggest stars, and that the largest are swollen dying stars [S30].
    - Wendover's Wyoming video shifts from "beauty" to "tax structure" [S29].
    - Harris's gold video shifts from utility to collective belief [S22].
  - [LEAK] Mid-video re-engagement logic [S4].
- **Impact:** HIGH · **Effort:** MED · **Channels:** A B C
- **Status:** MISSING
- **Apply:**
  - Outline field `reframe` at about 5:30–6:30. It doubles as re-engagement 2 (T6).
  - Visual: a camera pull-back or "rewind" to the opening image, now relabeled.

### T14. Scale escalation ladder with anchors (B core, useful in A and C)
- **What:** Climb from familiar to extreme in steps. Each step uses a familiar anchor (a person, a bus, a house), and each step is bigger than the last.
- **Evidence:**
  - Kurzgesagt's largest-star video is structured as a ladder (planets → main sequence → giants → hypergiants), ending with comparisons and travel times for perspective [S30].
  - Thoughty2's blue-whale video asks viewers to guess the rank before the reveal [S31].
  - [OPINION] Galloway: "biggest"/superlative and versus framing open curiosity gaps; tiered comparisons are a reusable structure [S6].
- **Impact:** HIGH (B) · **Effort:** MED · **Channels:** B (also C for money comparisons)
- **Status:** PARTIAL. We do size comparisons, but there is no explicit "guess first" step or monotonic escalation rule.
- **Apply:**
  - `packages/engine/src/scale/compare.tsx`: add an optional `guessPause` (1.5 s silhouette with "?" before the reveal).
  - Lint: compared sizes must rise within a chapter. Any step down must be a deliberate reframe.

### T15. Stakes stated early and restated
- **What:** Say what is at risk: lives, a city, a fortune, a species, the viewer's own money. Remind viewers mid-video with a visual cue.
- **Evidence:**
  - [OPINION/DATA] Blackman: hooks need recognisable, urgent stakes; restate them in long videos; low stakes × likely outcome = no tension [S13, S10].
  - Kings and Generals' 2025 Cannae episode opens on dread: omens and repeated Roman defeats [S32].
- **Impact:** MED-HIGH · **Effort:** LOW · **Channels:** A C (B: survival or extinction stakes)
- **Status:** PARTIAL
- **Apply:** Persistent HUD element per episode: A army counts on the `ChapterTracker`, C a running wealth meter, B "how many of you" counter. Update it on each chapter card.

### T16. Characters with intention + obstacle (A especially)
- **What:** Each chapter follows one decision-maker: what they want, what blocks them, what they choose.
- **Evidence:**
  - [OPINION] Cinema mechanics for YouTube retention: intention + obstacle, cause + effect [S28].
  - Historia Civilis' Cannae (1.8M views, 2015, older) builds tension through commanders' choices and criticises the consuls' positioning [S33].
  - OverSimplified's Second Punic War Part 1 personalises Hamilcar and Hannibal [S34].
- **Impact:** MED-HIGH · **Effort:** MED · **Channels:** A (C: a founder or an institution as a "character")
- **Status:** PARTIAL. We have `CharacterCard`. It shows identity, not want/obstacle.
- **Apply:**
  - Extend `CharacterCard` with `wants` and `problem` lines (≤6 words each).
  - Outline per chapter: `who`, `wants`, `blocked by`, `chooses`.

### T17. Personal relevance: put "you" in the story
- **What:** Convert the topic into the viewer's terms: their salary in Swiss francs, their height next to the whale, their city overlaid on Carthage.
- **Evidence:**
  - [OPINION] DiGiovanni: make it personal within about 10 s [S7].
  - OutlierKit's "why it matters to the viewer" beat [S14].
  - Our own Switzerland chapter "You, in Switzerland" already does this. Keep it.
- **Impact:** MED · **Effort:** LOW · **Channels:** C B (A: then→now place names)
- **Status:** PARTIAL (C001 has it; it isn't in the template)
- **Apply:**
  - Template slot `you_beat` in the hook (one sentence) and one full scene in the back half.
  - Engine: `BigCounter` with a `context` line in viewer units.

### T18. Visual change cadence of 5–10 s inside scenes
- **What:** Something meaningful changes on screen every 5–10 s: a camera move, a label, a counter, a layer.
- **Evidence:**
  - [OPINION] OutlierKit says faceless videos should change the visual every 5–10 s, and that a still of about 30 s drives viewers away [S14].
  - [LEAK] The memo calls for quick scene changes in minutes 3–6 [S4].
  - A counter-view says over-aggressive "retention editing" is overused [S35].
- **Impact:** MED · **Effort:** MED · **Channels:** A B C
- **Status:** PARTIAL. Scenes are ≤15 s. Changes within a scene aren't enforced; CLAUDE.md says nothing static >3 s for Shorts.
- **Apply:** QA: an ffmpeg scene and freeze probe on the contact sheet. A long-form rule of "no visual delta >8 s" is computed from overlay start times in `timeline.json`.

### T19. Ending: final payoff last, callback, abrupt exit
- **What:**
  - Answer the opening question explicitly, in one or two lines, with a callback to the opening image.
  - Then a single forward line, then the end screen.
  - No long recap and no "thanks for watching" monologue.
- **Evidence:**
  - [LEAK] The memo calls for a satisfying payoff and an abrupt ending, and says not to signal the end early [S4].
  - [OPINION] Try Guys: viewers leave once the reveal is done, so the reveal is last [S7].
  - [DATA/OPINION] Blackman: repeated reflections caused end drop-off; "outro = CTA only" [S10, S15].
  - Example: Historia Civilis closes Cannae on a scale-of-loss number plus a "bigger lesson" turn, without a long outro [S33].
- **Impact:** MED (protects AVD and satisfaction) · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL
- **Apply:**
  - Template slots `payoff (≤30 s)` → `callback image` → `bridge (1 sentence)` → `EndScreen 20 s`.
  - Lint: no sentence after the payoff that only restates earlier chapters.

### T20. End screen and next-video bridge
- **What:**
  - End screens can run in the last 5–20 s, with up to 4 elements.
  - Narration over the end screen poses a *specific* open question that the linked video answers.
- **Evidence:**
  - [OFFICIAL] End-screen rules: 5–20 s, ≤4 elements, plan the last 20 s in edit. End screens don't show on made-for-kids videos or mobile web [S16].
  - [OFFICIAL] Ritchie: cliffhangers make viewers eager for the next video [S11].
  - [OPINION] Galloway: every video should make the viewer want the next one [S6].
  - Series parts (OverSimplified) stop mid-campaign [S34].
- **Impact:** MED (session time) · **Effort:** LOW · **Channels:** A B C
- **Status:** DOING (20 s end screen teasing the next video). Check that the tease is a question, not a title read-out.
- **Apply:** `EndScreen.teaser` must end with "?". Keep the `not made for kids` setting, or end screens disappear.

### T21. Retention review loop (predict → measure → fix)
- **What:**
  - Before upload, write down the predicted dips and peaks.
  - After 48 h, 7 d and 28 d, read the key moments (Intro %, Top moments, Spikes, Dips) and compare them against the channel's typical retention.
  - Log causes and patch the template.
- **Evidence:**
  - [OFFICIAL] Key moments definitions. Spikes can mean either an engaging segment *or* confusion. Typical retention is compared against the channel's own similar-length videos [S1, S2].
  - [OFFICIAL] Judge over 90+ days; dips and seasonality are normal [S12].
  - [OPINION] Galloway warns against over-reacting to micro-dips [S36].
  - Jay Clouse says to fix bigger things before nitpicking graphs [S37].
- **Impact:** HIGH long-term · **Effort:** LOW · **Channels:** A B C
- **Status:** MISSING (no uploads yet)
- **Apply:**
  - `brands/<b>/episodes/<id>/retention.md` with a prediction table filled in at render time.
  - Manual export of key moments after upload. The WORKLOG milestone is "first 3 uploads reviewed".
  - Don't chase vendor benchmarks: published "good AVP" figures range from 20% to 60% depending on the source [S3, S38].

### T22. Package first, then script the hook to match
- **What:**
  - Write the title and thumbnail candidates *before* the script. Galloway suggests 30+ title variants.
  - Pick the package, then script T1–T3 to pay it off.
  - Retitle later if CTR is weak.
- **Evidence:**
  - [OPINION/DATA] Veritasium: a retitle plus new thumbnail took an asteroid video past 10M views after a weak start, and later retitles created second peaks [S26].
  - Galloway on variants, exaggerate-then-pull-back, superlatives and versus framing [S6].
  - Cleo Abram: title and thumbnail should tell one story and leave room for curiosity [S7].
- **Impact:** HIGH · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL (UPLOAD.md has 3 titles and 3 thumbnails, written after the build)
- **Apply:** Move the `UPLOAD.md` title/thumbnail section to step 1 of the new-episode skill. The chosen title's claim becomes the `promise` slot.

### T23. Cold open in the middle of the action (history)
- **What:** Start inside a vivid, specific moment (an omen, a launch, a crossing), then pull back.
- **Evidence:**
  - Kings and Generals' Cannae (1.1M views, 2025-04-03) opens on a run of ominous portents in Rome before any strategy [S32].
  - LEMMiNO's *Shouting at Stars* (4.0M views, 2025-10-31) opens on a specific launch and object, then poses the "has anyone answered?" question in about 2 min [S39].
  - Fall of Civilizations' *Carthage* (5.9M views, 2023) opens with a teaser of the city's despair before the chronology [S40].
- **Impact:** MED-HIGH · **Effort:** LOW · **Channels:** A (C: a moment in a vault or factory, as an illustration)
- **Status:** PARTIAL. Our painting opener is static context.
- **Apply:** Make the PD painting the *moment*: a slow push-in with a dated caption, plus a sentence in present tense ("Summer, 216 BC. Rome is terrified."). The who/why card comes 10 s later.

### T24. Signaling: highlight the few words and numbers that matter
- **What:** Use color, weight and highlighting only on key terms and numbers, and keep the rest neutral.
- **Evidence:**
  - [STUDY] Mayer's signaling principle: effect about 0.69 in 15 of 16 tests [S18].
  - The Mayer chapter itself returned HTTP 403 on 2026-11-14. The figure is from secondary summaries [S18, S41].
- **Impact:** MED · **Effort:** LOW · **Channels:** A B C
- **Status:** DOING (a `highlight` map exists in `ClarityConfig`)
- **Apply:** Keep it. Limit to ≤2 highlighted tokens per caption line.

### T25. Caption redundancy test (full captions vs keyword captions)
- **What:** Full on-screen text that duplicates narration can raise cognitive load. Test keyword or phrase captions against full burned-in captions.
- **Evidence:**
  - [STUDY] Mayer's redundancy principle: a reported median d ≈ 0.86 in 16 of 16 tests for *printed text duplicating narrated graphics*.
  - A later table puts the effect for *captions* at only 0.10 (8 of 12).
  - Boundary conditions favor captions when words are unfamiliar or technical [S19].
  - Captions also serve mobile viewers watching with sound off. This is opinion, not tested here.
- **Impact:** LOW-MED (uncertain) · **Effort:** LOW · **Channels:** A B C
- **Status:** DOING full captions. The test is MISSING.
- **Apply:** Decision for Aymen once data exists. Until then, keep captions, keep them short (≤2 lines), and rely on YouTube SRT for the full transcript.

### T26. Respect valued time: cut anything that doesn't move a promise
- **What:** Every scene must open, advance or close a ledger promise. Otherwise cut it. Keep length set by content, not by a target.
- **Evidence:**
  - [OFFICIAL] Beaupré: not all time is valuable; surveys separate time spent from satisfaction [S11, S12].
  - [DATA/OPINION] Blackman: the core idea must justify the length [S10].
- **Impact:** MED · **Effort:** LOW · **Channels:** A B C
- **Status:** PARTIAL
- **Apply:** Reviewer subagent checklist item: "list scenes with no ledger link". Target is 0.

---

## 3. Video breakdowns (paraphrased, based on transcripts and summaries)

Views and dates are as listed on the source page at access time.

### 3.1 Kurzgesagt: *The Largest Star in the Universe – Size Comparison* (35.5M views, 11:59, 2020-09-22; older) [S30]
- **0–16 s:** Three stacked questions: what is the biggest star, why, and what is a star?
- **~16–30 s:** Starts from Earth as the anchor and moves to Jupiter, "the closest thing to a star here, but nowhere near".
- **30–60 s:** Introduces "failed stars" (brown dwarfs) and an early counter-intuitive fact: adding mass makes them denser, not bigger. This is an instant mini-payoff.
- **Structure:** A monotonic ladder (main sequence → giants → hypergiants).
  - *Midpoint reframe:* the biggest stars are not the most massive but swollen dying ones.
  - Repeated "is this the rule?" questions keep the loop open.
  - Uncertainty is flagged honestly at the top end.
- **Ending:** Comparisons in human terms (travel times), then the Sun's life cycle as an emotional close, then an app promo. **Takeaway for B:** ladder + reframe + honest uncertainty.

### 3.2 Thoughty2: *Blue Whales Shouldn't Exist. So Why Do They?* (1.4M views, 16:00, 2025-11-20) [S31]
- **0–11 s:** Superlative claim: largest animal alive, probably ever.
- **11–60 s:** Says people underestimate it. Shows a ranking graphic of the heaviest creatures and **asks the viewer to guess** where the whale sits.
- **~60–75 s:** Reveal (about twice any other animal), then a "scientists couldn't explain this" open loop. The sponsor read follows at about 1:15.
- **Structure:**
  1. Size stats.
  2. Evolution from a small land mammal.
  3. Lunge feeding.
  4. Ocean upwelling → gigantism, which is the mechanism payoff.
  5. Krill.
  6. Threats.
- **Ending:** Whaling cut the population by about 99%; partial recovery; the future depends on people. **Takeaway for B:** the "why" mechanism is the real payoff. The size facts are just the hook.

### 3.3 Historia Civilis: *The Battle of Cannae (216 B.C.E.)* (1.8M views, 9:10, 2015-06-29; older) [S33]
- **0–60 s:** Places Cannae as the third and decisive battle in a series. Names Rome's grievance (Hannibal "cheats") and Rome's intention to force an open-field fight. Intention and conflict are set up within a minute.
- **Structure:**
  1. Forces (numbers in context).
  2. Each side's plan.
  3. Execution.
  4. Encirclement at about 6:12–7:14.
  5. Aftermath.
- A recurring critical thread (where the consuls stood) gives the narrator a point of view.
- **Ending:** The scale of loss (about 20% of adult men in a day), then a turn: Rome still won, and military victory has limits. **Takeaway for A:** plan → execution → consequence → bigger lesson, under 10 min.

### 3.4 Kings and Generals: *Hannibal's Masterpiece – Cannae 216 BC* (1.1M views, ~20+ min, 2025-04-03) [S32]
- **0–67 s:** A cold open on omens and public fear in Rome, plus "Hannibal has been one step ahead". Dread first, logistics later.
- **Chapters:**
  - 1:07 strategy and mobilisation
  - 4:13 leadership quarrel (alternating command)
  - 8:04 provocations
  - 10:04 deployment
  - 16:50 encirclement
- **Ending:** It stops at the moment the trap closes. The climax is near the end, with a short tail. **Takeaway for A:** a mood cold open, and character friction (two commanders) as the mid-video engine.

### 3.5 OverSimplified: *The Second Punic War, Part 1* (≥26 min; views and date not shown on the source page) [S34]
- **0–65 s:** Sponsor and merch first. This is a channel-specific luxury that only an established audience tolerates; don't copy it.
- **Structure:**
  1. Aftermath of the previous war.
  2. Hamilcar's grudge and plan.
  3. Hannibal's rise.
  4. Saguntum crisis.
  5. War declared.
  6. Alpine crossing.
- Characters carry the story, and comedy comes from character voice.
- **Ending:** Stops mid-campaign after the Alps; Part 2 continues. **Takeaway:** a series cliffhanger works when the story has momentum, and character motive (a grudge) drives a long runtime.

### 3.6 Fall of Civilizations: *Carthage – Empire of the Phoenicians* (5.9M views, ~3 h, 2023-04-11) [S40]
- **Opening:** A teaser of the city's darkest hour before rewinding to origins. A literary frame (Flaubert) is listed as the intro chapter.
- **Structure:** Long chronological chapters (origins → golden age → wars → fall).
- **Ending:** A reflective close: ruins, lost libraries, a poem, and a "what if it were your city" turn. **Takeaway for A:** end on the emotional "so what" rather than a summary. Long-form tolerance exists for slow, immersive history, but our 12-min format needs faster beats.

### 3.7 Wendover Productions: *Why Wyoming is so Weirdly Wealthy* (1.9M views, 19:55, 2024-06-11) [S29]
- **0–60 s:** Argues the opposite of the title: the state is objectively unattractive (winters, wind, few jobs, poor land, low population). The paradox is set up with no answer given.
- **1:21:** Payoff of the paradox's first layer (billionaire concentration).
- **Then:** Each answer opens a new question (scenery → tax structure → inequality → housing → future of extraction).
- **Ending:** A one-line thesis about where the wealth goes, an unresolved future question, then a sponsor. **Takeaway for C (directly transferable to "Why is X rich"):** open on the *contradiction*, then peel layers with a but/therefore chain.

### 3.8 Johnny Harris: *Gold Explained, Finally* (5.1M views, 34:04, 2025-10-24) [S22]
- **0–60 s:** A striking visual answers "how much gold exists?" and is surprisingly small. Then where it goes (jewelry, vaults), then a news hook (record prices, central-bank buying), then the thesis: gold never left.
- **Chapters:**
  - 1:38 origins
  - 4:05 gold as money (with history set pieces)
  - 13:27 gold standard
  - 16:49 the Fed
  - 24:52 "gold strikes back"
  - 29:52 the new surge
- The sponsor is placed mid-video, not in the intro.
- **Ending:** A return to the opening question (why buy gold now), closing the loop. **Takeaway for C:** a visual-quantity hook, a present-day relevance hook, and a bookend ending.

### 3.9 PolyMatter: *Why the Average Japanese Farmer is 70 Years Old* (229K views, 19:47, 2025-03-14) [S27]
- **0–60 s:** A shocking statistic, its implication (half are near 80), no successors, the count halved since 2000, and a stakes projection (could run out in about 15 years).
- **Structure:** Moves from farming to food and energy dependence to security and geopolitics. The topic *widens*, which is a reframe: the farmer is a symptom.
- **Ending:** A strategic conclusion, then a sponsor. **Takeaway for C:** number → implication → stakes in 60 s; the reframe widens the lens.

### 3.10 LEMMiNO: *Shouting at Stars: A History of Interstellar Messages* (4.0M views, 2:27 h, 2025-10-31) [S39]
- **0–2:08 (intro):** One concrete object and launch, what it tried to say, then the uncomfortable fact (no reply) and a wry question that sets the episode's tension.
- **Structure:** 20+ titled chapters, one per message. The video moves from "how was it encoded" to "should we transmit at all". A recurring loop (has anyone answered?) is revisited (Wow! signal, Lone Signal).
- **Ending:** A dedicated debate chapter. The final minutes were not visible in the transcript page, so they are unverified. **Takeaway:** an anthology structure with one through-line question survives very long runtimes. For us: a ladder or list format plus one recurring question.

**Cross-video patterns:**
- (a) All ten state a paradox, superlative or dread within 60 s.
- (b) None opens with the channel introducing itself.
- (c) At least five use a reframe that widens or flips the question mid-video.
- (d) The strongest endings return to the opening image or question (Harris, Kurzgesagt, Historia Civilis).

---

## 4. Reusable script skeleton: 12-minute episode (~1,500 words, ~125 wpm)

Generic and original. Word counts are targets. Tags map to `timeline.json` and `promises.json`.

| Time | Beat | Words | Purpose | Pipeline tag / component |
|---|---|---|---|---|
| 0:00–0:07 | **PROMISE**: show the title's subject in motion and state the claim as a concrete fact or number | 15 | Confirm the click (T1) | `promise` scene, `BigCounter` / scale-compare / map hero |
| 0:07–0:20 | **TWIST**: misconception or paradox ("most people think X, but…") | 30 | Curiosity gap without the answer (T3, T12) | `QuoteCard` or split-screen |
| 0:20–0:35 | **QUESTIONS + ROADMAP + YOU**: 2–3 questions, why they matter to the viewer, "by the end…" | 35 | Second hook (T2, T17) | `ListCard` → ledger P1–P3 |
| 0:35–0:50 | **MOMENT**: PD painting or photo as an in-the-moment cold open with date/place; minimal context | 30 | Grounding without preamble (T4, T23) | `art` push-in, `CharacterCard` with wants/problem |
| 0:50–2:40 | **CH1 Setup**: character/system + intention + obstacle; first mini-payoff; fun beat | 230 | Story engine (T9, T10, T16) | `ChapterCard(question)`, `GlossaryPop` at first use |
| 2:40–3:15 | **RE-ENGAGE 1**: best early visual or number; close one small loop | 70 | Minute-3 sag (T6) | `reengage:true` |
| 3:15–3:20 | Recap ≤5 s + new question | 12 | Forward recap (T8) | `RecapCard(next="…?")` |
| 3:20–5:30 | **CH2 Complication**: "but…" escalation; stakes restated with HUD | 270 | New problems (T9, T15) | HUD counter |
| 5:30–6:30 | **REFRAME / RE-ENGAGE 2**: "everything so far assumed X; actually…" | 120 | Midpoint flip (T13, T6) | camera rewind to opening image, relabeled |
| 6:30–6:35 | Recap + bigger question | 12 | | `RecapCard` |
| 6:35–8:40 | **CH3 Deepening**: consequences; the second-biggest payoff | 260 | Partial payoffs (T10) | chart / map move |
| 8:00–8:40 (inside CH3) | **TOP MOMENT** at ~2/3 | (incl.) | Peak (T11) | `top:true` hero shot |
| 8:40–10:40 | **CH4 Now / You**: then→now, the viewer's terms, the modern map or number | 250 | Relevance (T17) | then→now labels, `BigCounter` with context |
| 10:40–11:25 | **PAYOFF**: answer the opening question in 1–2 lines; callback to the frame from 0:00 | 90 | Close the ledger (T5, T19) | opening shot reused, final label |
| 11:25–11:40 | **BRIDGE**: one sentence that opens the next video's question | 25 | Session (T20) | — |
| 11:40–12:00 | **END SCREEN** (20 s): the narrated tease continues, ending in "?" | 30 | ≤4 elements (T20) | `EndScreen(teaser)` |

**Hard rules for the template** (enforce in the linter and reviewer subagent):
1. The frame at 0:01 contains the thumbnail's subject.
2. No final-answer keyword in the first 35 s.
3. ≤2 glossary pop-ups before 0:50.
4. Every chapter has a `problem`, a `turn` ("but"), and at least one closed promise.
5. Every `ChapterCard.question` and `EndScreen.teaser` ends with "?".
6. Recap scenes are ≤5 s.
7. One `top` scene between 60% and 75% of runtime.
8. Nothing after the payoff except the bridge.
9. `promises.json` has 0 unpaid entries.
10. No visual-delta gap >8 s.

**Channel variants:**
- **A (History):**
  - The twist is a "what you were taught" myth or a dread cold open.
  - Chapters follow a commander's decisions.
  - The HUD shows army strength.
  - The payoff is "why it mattered" plus a then→now map.
- **B (Scale):**
  - The promise is a true-scale reveal against a human.
  - Chapters climb a size ladder with "guess first" pauses.
  - The reframe is the mechanism ("why it *can* be this big").
  - The payoff is the limit: why nothing bigger exists.
- **C (Money):**
  - The promise is the wealth number in viewer units.
  - The twist is a "no resources" paradox or a myth ("it's just banks").
  - Layers peel in a but/therefore chain.
  - The payoff is "the formula", with a callback to the opening map.

---

## 5. Sources (all accessed 2026-11-14)

| # | Source | Type | Date |
|---|---|---|---|
| S1 | YouTube Help, "Content tab analytics tips": https://support.google.com/youtube/answer/12942217?hl=en | OFFICIAL | current |
| S2 | YouTube Help, "Measure key moments for audience retention": https://support.google.com/youtube/answer/9314415?hl=en | OFFICIAL | current |
| S3 | Creator Essentials glossary, "Intro Retention" / "Typical Retention": https://www.creatoressentials.com/glossary/intro-retention/ · https://www.creatoressentials.com/glossary/typical-retention/ | OPINION (vendor) | n.d. |
| S4 | "How to Succeed in MrBeast Production" (leaked memo), reproduced at https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/ · commentary https://simonwillison.net/2024/Sep/15/how-to-succeed-in-mrbeast-production/ | LEAK | 2024-09 |
| S5 | Creator Handbook, takeaways from the memo: https://www.creatorhandbook.net/leaked-document-allegedly-reveals-mrbeasts-secrets-to-youtube-success-the-key-takeaways/ | OPINION | 2024 |
| S6 | Colin & Samir with Paddy Galloway, "The New Rules of YouTube (2025)", edited transcript: https://thetranscriptdesk.substack.com/p/the-new-rules-of-youtube-2025-edited | OPINION | 2025 |
| S7 | "The YouTube Playbook in 37 Minutes", edited compilation transcript (Galloway, DiGiovanni, Abdaal, Linus, Blackman, MrBeast, Try Guys, Cleo Abram, Colin & Samir): https://thetranscriptdesk.substack.com/p/the-youtube-playbook-in-37-minutes | OPINION | 2025 |
| S8 | Kang et al. 2009, "The Wick in the Candle of Learning", *Psychological Science* 20(8): https://www.cmu.edu/dietrich/sds/docs/loewenstein/WickCandleLearning.pdf · https://neuroecon.berkeley.edu/papers/papers_files/Kang_PsychSci_2009.html | STUDY | 2009 |
| S9 | Gruber, Gelman & Ranganath 2014, *Neuron* 84(2): https://orca.cardiff.ac.uk/96033 · coverage https://neurosciencenews.com/curiosity-memory-learning-neuroscience-1388 | STUDY | 2014 |
| S10 | George Blackman, Retention Review #2, "Payoff, Outro, Core Concept": https://georgeblackman.substack.com/p/retention-review-2-payoff-outro-core | DATA/OPINION | 2022–23 |
| S11 | Search Engine Journal, "YouTube algorithm insights" (Ritchie/Beaupré): https://www.searchenginejournal.com/youtube-algorithm-insights-from-creator-liaison-renee-ritchie/493901/ · Buffer summary https://buffer.com/youtube-algorithm/ · PPC Land on Beaupré, Creator Insider 2026-09-01: https://ppc.land/subscribers-skip-90-of-uploads-in-their-feed-youtube-director-says/ | OFFICIAL (secondary report) | 2025–2026 |
| S12 | Search Engine Journal, "How YouTube's recommendation system works in 2025" (Beaupré interview): https://searchenginejournal.com/how-youtubes-recommendation-system-works-in-2025/538379 | OFFICIAL (secondary report) | 2025-01-27 |
| S13 | George Blackman, RR#5 "Why Should I Care?": https://georgeblackman.substack.com/p/retention-review-5-why-should-i-care · RR#8 "Study this hook edit": https://georgeblackman.substack.com/p/rr8-study-this-hook-edit · RR#11: https://georgeblackman.substack.com/p/rr11-were-all-trapped | DATA/OPINION | 2023 |
| S14 | OutlierKit, "How do I write hooks that keep people watching, and hold retention mid-video?": https://outlierkit.com/resources/youtube-hooks-and-retention/ | OPINION (vendor, with dated data pulls) | 2026-09 |
| S15 | George Blackman, "5 Retention-Killing YouTube Mistakes To Avoid": https://georgeblackman.substack.com/p/5-retention-killing-youtube-mistakes | OPINION | n.d. |
| S16 | YouTube Help, "Add end screens to videos": https://support.google.com/youtube/answer/6388789?hl=en | OFFICIAL | current |
| S17 | Muller, Bewes, Sharma & Reimann 2008, "Saying the wrong thing: improving learning with multimedia by including misconceptions" (as reported): https://thejournal.com/articles/2015/05/05/watching-videos-does-not-necessarily-lead-to-learning.aspx · https://rosetta.to/u/veritasium/khan-academy-and-the-effectiveness-of-science-videos | STUDY (secondary) | 2008 / 2015 |
| S18 | Mayer, evidence-based multimedia principles (effect sizes via summaries): https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-research-based-principles-for-designing-multimedia-instruction-mayer.pdf · https://researchschool.org.uk/durrington/news/what-does-evidence-tell-us-about-multimedia-learning | STUDY (summary) | various |
| S19 | Redundancy and caption boundary conditions: https://par.nsf.gov/servlets/purl/10061485 · https://www.cambridge.org/core/books/multimedia-learning/modality-principle/E5CD6E01CEA0B568CE260F66A3CD0D1F | STUDY | various |
| S20 | AIR Media-Tech, "How to read your YouTube retention graph": https://air.io/en/youtube-hacks/how-to-read-youtube-retention-graph | OPINION (vendor) | n.d. |
| S21 | Search Engine Journal, "YouTube typical audience retention": https://www.searchenginejournal.com/youtube-typical-audience-retention/421700/ | OFFICIAL (secondary) | 2021 (older) |
| S22 | Johnny Harris, *Gold Explained, Finally* (transcript page): https://rosetta.to/u/johnnyharris/gold-explained-finally · channel list https://rosetta.to/u/johnnyharris | Example | 2025-10-24 |
| S23 | Gist summary attributing a "first thirty seconds" principle to Muller: https://gist.ly/youtube-summarizer/the-secrets-behind-veritasiums-viral-success | OPINION (unverified secondary) | n.d. |
| S24 | Social Media Examiner, story structure and retention: https://www.socialmediaexaminer.com/how-to-use-story-to-boost-your-youtube-views/ | OPINION | n.d. |
| S25 | Justin Kuiper, "The psychology of clickbait" (promise delta): https://justinkuiper.substack.com/p/the-psychology-of-clickbait · Boing Boing note https://boingboing.net/2025/12/09/clickbait-isnt-the-problem-broken-promises-are.html | OPINION | 2025 |
| S26 | Veritasium, *Clickbait is Unreasonably Effective* (2021, older), reported by GIGAZINE: https://gigazine.net/gsc_news/en/20210830-clickbait-effective | DATA (creator's own) | 2021 |
| S27 | PolyMatter, *Why the Average Japanese Farmer is 70 Years Old*: https://rosetta.to/u/polymatter/why-the-average-japanese-farmer-is-70-years-old | Example | 2025-03-14 |
| S28 | VideoToBlog, "Cinema story principles for better YouTube retention": https://videotoblog.ai/blog/youtube-retention-cinema-story-mechanics-show-intention-obstacle-cause-effect | OPINION | n.d. |
| S29 | Wendover Productions, *Why Wyoming is so Weirdly Wealthy*: https://rosetta.to/u/wendoverproductions/why-wyoming-is-so-weirdly-wealthy · channel list https://rosetta.to/u/wendoverproductions | Example | 2024-06-11 |
| S30 | Kurzgesagt, *The Largest Star in the Universe – Size Comparison*: https://rosetta.to/u/kurzgesagt/the-largest-star-in-the-universe-size-comparison · process page https://kurzgesagt.org/youtube/ | Example | 2020-09-22 (older) |
| S31 | Thoughty2, *Blue Whales Shouldn't Exist. So Why Do They?*: https://rosetta.to/u/thoughty2/blue-whales-shouldn-t-exist-so-why-do-they | Example | 2025-11-20 |
| S32 | Kings and Generals, *Hannibal's Masterpiece – Cannae 216 BC*: https://rosetta.to/u/kingsandgenerals/hannibal-s-masterpiece-cannae-216-bc-second-punic-war-documentary | Example | 2025-04-03 |
| S33 | Historia Civilis, *The Battle of Cannae (216 B.C.E.)*: https://rosetta.to/u/historiacivilis/the-battle-of-cannae-216-b-c-e | Example | 2015-06-29 (older) |
| S34 | OverSimplified, *The Second Punic War – Part 1* (timestamped summary): https://videohighlight.com/v/lsbcN9-jU1Y | Example | date not verified |
| S35 | vidIQ, "Retention Editing is DEAD" (counter-view): https://rosetta.to/u/vidiq/retention-editing-is-dead | OPINION | n.d. |
| S36 | Paddy Galloway profile and interview summary: https://recapio.com/digest/meet-the-youtube-expert-behind-10-billion-views-paddy-galloways-full-story-by-karat · https://podcast.creatorscience.com/paddy-galloway/ | OPINION | 2024–25 |
| S37 | Creator Science (Jay Clouse) with Jake Thomas: https://podcast.creatorscience.com/jake-thomas/ · https://podcast.creatorscience.com/office-hours-100k/ | OPINION | 2024 |
| S38 | vidIQ, "YouTube Audience Retention: What's a Good Rate": https://vidiq.com/ru/blog/post/increase-audience-retention-youtube/ · Teleprompter.com guide https://www.teleprompter.com/blog/youtube-audience-retention | OPINION (vendor) | 2025 |
| S39 | LEMMiNO, *Shouting at Stars*: https://rosetta.to/u/lemmino/shouting-at-stars-a-history-of-interstellar-messages · channel https://rosetta.to/u/lemmino | Example | 2025-10-31 |
| S40 | Fall of Civilizations, *Carthage – Empire of the Phoenicians*: https://rosetta.to/u/fallofcivilizations/17-carthage-empire-of-the-phoenicians-2023-04-11 | Example | 2023-04-11 |
| S41 | Mayer's 12 principles summaries: https://medicine.nus.edu.sg/medixperience/scholarly-article/mayers-12-principles-of-multimedia-instruction/ · https://services.dartmouth.edu/TDClient/1806/Portal/KB/PrintArticle?ID=171655 | STUDY (summary) | 2025 |
| S42 | Economics Explained, *Does Switzerland Deserve to Be the Richest Economy in the World?* (description only; topic overlap with C001, not analysed): https://ms.player.fm/series/economics-explained-2780780/does-switzerland-deserve-to-be-the-richest-economy-in-the-world | Example (thin) | 2024-09 |

**Gaps and limits:**
- No primary Paddy Galloway, Jake Thomas or Veritasium retention graph was found. Their advice is via interviews and transcripts.
- No controlled study exists on YouTube chapters' effect on retention. Vendor claims of +8–30% are unverified.
- The Mayer chapter (pressbooks) returned HTTP 403, so effect sizes come from summaries.
- The authenticity of the MrBeast memo is unconfirmed.
- No retention graph for any of the analysed videos is public. Breakdowns are structural, not graph-based.
