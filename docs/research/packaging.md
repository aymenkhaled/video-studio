# Packaging research — titles, thumbnails, Test & Compare, metadata, localisation

Researched 2026-11-14. All URLs accessed 2026-11-14. Channels: A = History in Maps, B = Scale & Science, C = Money & Maps.
Rule applied: general techniques only. No channel's look, palette, mascot, typeface or signature layout is to be copied.

Evidence labels: **[E-official]** YouTube Help or YouTube blog · **[E-data]** large observational dataset (correlation, not cause) · **[E-ours]** our own measurement on 2026-11-14 (section 3) · **[O]** opinion or practice of a strategist or creator, or our inference.

---

## 1. Summary

1. **Packaging decides whether the idea gets a chance at all.** YouTube says title, thumbnail and description matter much more for discovery than tags [S5]. Strategists treat an idea that cannot be titled and thumbnailed clickably as "not an idea" [S10, S11] **[O]**. We write packaging *after* the video. That order is backwards. Fix: a packaging-first gate before the script (section 5).
2. **The same topic varies 5–7× depending on its frame.** Our own scrape (section 3) **[E-ours]**: Invicta's *"The Fall of Carthage (146 BC) DOCUMENTARY"* got 86K views (0.8× its channel median). The same channel's *"Rome's Stalingrad – The Siege of Carthage"* got 626K (6.1×), and *"True Size of the Battle of Cannae"* got 575K (5.6×). These are exactly our A topics. The plain "Name: descriptor" title we used for Hannibal (`Hannibal: The Man Who Nearly Destroyed Rome`) is the frame that underperforms.
3. **Outlier frames that recur in our niches:** a scale or "true size" reframe, a modern analogy ("X's Stalingrad", "the mega-corporations that ruled Rome"), a reversal or paradox ("Why the Taliban are begging the US to come back"), a "Why didn't X…?" counterfactual, a specific superlative ("The Longest Year in Human History"), and completeness ("The Entire History of…"). Underperformers are yes/no questions ("Can Switzerland Stay Neutral?" 0.3×), vague lists, and channel-news videos.
4. **Thumbnail style details barely separate winners from losers.** Eden's 507K-video study found under 4-point differences between breakout and underperformer thumbnails on faces, text, brightness and colour [S13] **[E-data]**. 1of10 found faces neutral on average [S12, S14]. What does differ is the *idea and frame*. Thumbnail work should go into **one clear subject plus one tension**, not into decoration. Faceless is not a handicap.
5. **Test & Compare is live for titles AND thumbnails** (title testing went global on 2025-12-04) [S2]. It allows 3 variants and runs up to 2 weeks. **It picks the winner on watch time, not CTR** [S1, S2]. It needs Advanced Features, works on desktop only, and does not work for Shorts or made-for-kids videos [S1]. We already prepare 3 titles and 3 thumbnails, so running it costs almost nothing. It is still MISSING.
6. **Localisation is the cheapest reach multiplier.** Creators with multi-language audio got >25% of watch time from non-primary-language views [S7] **[E-official]**. Auto-dubbing covers 27 languages (third-party report, Feb 2026) [S8]. Translated titles and descriptions also show in other-language search [S6] **[E-official]**. We have only "enable auto-dubbing" in the checklist. We have no translated titles.
7. **CTR benchmark (official):** half of all channels and videos sit at 2–10% impressions CTR [S3]. There is no official niche breakdown. Vendor "face = +38%"-style numbers are unverifiable, so we ignore them. Track CTR only *against our own videos* over time [S3].

Self-rating of this research: **7/10**. Weaknesses: (1) the outlier ratios use each channel's last 30 long-form uploads, with rounded view counts and mixed video ages, not lifetime medians, so treat them as indicative; (2) the large datasets (1of10, Eden, vidIQ) are observational and partly contradict each other on title length and thumbnail text; (3) we could not scrape Epimetheus, Hoog or Atlas Pro (handle mismatch), so the newest fast-growing faceless science channels are under-sampled.

---

## 2. Techniques

Legend: Impact H/M/L on views. Effort S (≤½ day per episode or one-off ≤1 day), M (1–3 days one-off), L (≥1 week). Status: DOING / PARTIAL / MISSING.

### P1. Packaging-first gate (title + thumbnail sketch before the script)
- **What:** for every candidate topic, write 10+ titles and 3 thumbnail concepts *before* the outline. Kill or reframe topics that cannot be packaged. The script must then pay off the promise of the chosen package in the first 30 s.
- **Evidence:** Galloway: "If we can't title and thumbnail an idea that can be clickable … it's not an idea anymore" [S10, S11] **[O]**. Top creators spend ~30% of their time on ideation and packaging versus ~5% for small creators [S10] **[O]**. Veritasium's "Clickbait is Unreasonably Effective" calls packaging "at least half the job", and a repackaged video took off after the title and thumbnail changed [S15] **[O, secondary summaries]**. MrBeast's onboarding memo ranks CTR first among the three metrics that matter (CTR, AVD, AVP) [S16] **[O]**.
- **Impact H · Effort S · A B C · Status MISSING.**
- **Pipeline:** new file `brands/<b>/episodes/<id>/PACKAGE.md` created by `new-episode` step 0. The chosen title and thumbnail concept are frozen before `script`. `package-upload` then reads PACKAGE.md instead of inventing titles at the end.

### P2. Outlier scan before choosing a topic and a frame
- **What:** for each topic, list 5–10 videos from comparable channels with views ÷ channel median ≥ 2×, plus 3 underperformers on the same topic. Record the *frame*, not the visuals.
- **Evidence:** the Outlier Score (views ÷ channel median) is the standard way to remove channel-size bias [S12, S14] **[E-data]**. Our scrape shows that the same topic on the same channel ranges from 0.8× to 6.1× depending on frame (section 3) **[E-ours]**.
- **Impact H · Effort S per episode (one-off M for the script) · A B C · Status MISSING.**
- **Pipeline:** `tools/outliers.py <handle…>` reads each channel's public uploads page or RSS feed (`youtube.com/feeds/videos.xml?channel_id=…` gives exact views for the last 15 uploads) and prints ratio = views ÷ median(last 30 long-form, excluding newest 3). Output goes to `docs/research/outliers/<topic>.md`. This is read-only probing, so it is allowed locally. Paid alternatives (1of10, vidIQ Outliers) are optional. Semrush is not needed for this.

### P3. Frame the title around a tension, not a label
- **What:** each title needs one of the following: scale shock, reversal or paradox, modern analogy, counterfactual, specific superlative, hidden or inside view, or a consequence. Avoid "Name: descriptor" and yes/no questions.
- **Evidence:** vidIQ (4M+ 2026 uploads): "Turning X into Y" >3×, "Nobody knows" >2.5×, "Inside X" 2.5×, "How X did a surprising thing" ~2×, specific superlative >1.5×, but **question-ending titles 0.82×** and plain how-to 1.07× [S17] **[E-data]**. 1of10: neutral or purely informational titles underperform, and negative titles get ~22% more views [S12] **[E-data]**. Ours: "Why didn't Castro try to retake Guantanamo Bay…" 2.8×, "Why didn't Spain and Portugal continue the Reconquista in Africa?" 3.5×, but "Can Switzerland Stay Neutral?" 0.3× and "Are America's Students Falling Behind?" 0.4× **[E-ours]**.
- **Inference [O]:** "Why/Why didn't" questions that *presuppose* a surprising fact work. Yes/no questions do not.
- **Impact H · Effort S · A B C · Status PARTIAL** (Hannibal option 2 "Outnumbered Almost 2 to 1…" has tension; options 1 and 3 are labels).

### P4. Use Test & Compare on every long video, and test *different reasons to click*
- **What:** upload with 3 titles (title-only test) or 3 title+thumbnail pairs. The variants must differ in *frame* (for example scale vs. paradox vs. character), not in colour.
- **Evidence (official) [S1, S2]:** titles only, thumbnails only, or both; **up to 3**; picks "the title or combination … with the highest watch time"; usually finished "within two weeks"; results are Winner / Performed same / Inconclusive (inconclusive → the first variant stays); editing the title or thumbnail mid-test stops it; "very similar" variants make tests longer and less likely to produce a winner; a variant below 720p downscales all thumbnails to 480p; not available for Shorts, made-for-kids, private or age-restricted videos; desktop Studio only; Advanced Features required. Title testing rolled out globally on 2025-12-04 [S2].
- **Impact H (learning loop) · Effort S · A B C · Status PARTIAL** (we prepare 3+3 but have never run a test, and Advanced Features verification is unconfirmed).
- **Pipeline:** UPLOAD.md gets a "Test plan" block: variant 1 = our favourite (it becomes the default if inconclusive), and the hypothesis for each variant. After the test, log the result in `docs/LESSONS.md` (frame that won, watch-time share). Render thumbnails at **1920×1080 or larger** (the Help page now recommends 3840×2160 and a 640 px minimum [S4]). Never below 1280×720.
- **Aymen decision:** verify phone/ID for Advanced Features on each channel (manual task).

### P5. Thumbnail = one subject + one tension, readable at phone size
- **What:** one dominant subject (PD painting, map shape, 3D render, silhouette at scale) plus one contrast device (size comparison, before/after, arrow or red route, a number). Text ≤ 3 words and *complementary* to the title, never repeating it.
- **Evidence:** 1of10 (300K outliers, 2025): text-bearing thumbnails averaged ~19% fewer views, the best had no text or <10 characters covering <7% of the image, and dark thumbnails underperform [S12] **[E-data]**. Eden (2026): text use, faces and colour differ by <4 points between breakouts and underperformers, and breakouts rarely repeat the title verbatim (6.3%) [S13] **[E-data]**. So the datasets disagree on text. The safe rule is short text or none, and test it.
- **Impact M-H · Effort S · A B C · Status PARTIAL** (≤3 words, PD art and high contrast are DONE; a "tension device" is not a required rule; text sometimes duplicates the title).

### P6. Faceless is fine. Use a "character" subject instead of a face.
- **What:** no AI people (our policy). Use a PD portrait or bust (Hannibal coin or bust), an animal or object at human scale, a country silhouette. Multiple "characters" facing each other (versus layouts) is the closest faceless equivalent of the multi-face finding.
- **Evidence:** faces perform about the same as no faces overall, help mainly channels >200K subs, and multiple faces beat single faces [S12, S14] **[E-data]**. Eden: 84% vs 82% face use, breakout vs underperformer [S13] **[E-data]**. Faceless channels such as Real Science (2.09M subs), MetaBall (1.98M) and Kurzgesagt (25.8M) reach big outliers with drawn or 3D subjects **[E-ours]**.
- **Impact M · Effort S · A B C · Status DOING** (PD art of the main subject).

### P7. Series formulas (repeatable frame per channel)
- **What:** a recognisable frame repeated across episodes, e.g. "The True Size of …" (B, A), "Why Is X So Rich?" (C), "X in Maps" (A).
- **Evidence:** Real Science's "The Insane Biology of: …" series fills 3 of its top 4 recent videos (2.5–3.2×) **[E-ours]**. Galloway: "run it until they stop you", and keep ~80% of videos in proven formats and ~20% experiments [S10] **[O]**.
- **Impact M-H · Effort S · A B C · Status MISSING.**

### P8. Borrow frames across niches (scale × history, money × maps)
- **What:** apply proven formats from other niches: "True size of", "X vs Y", "$1 vs $1 billion", "10 minutes vs 10 years", first-person scale.
- **Evidence:** Galloway: borrow formats from other niches (e.g. "$1 vs $100", "10 minutes vs 24 hours") [S10] **[O]**. Invicta's "True Size of the Battle of Cannae" (5.6×) is a scale-channel frame applied to history **[E-ours]**. MetaBall's first-person scale videos: "MOON IMPACT ► First person view" 31M (~18× its recent median), "The biggest TSUNAMIS in History" 29M **[E-ours]**.
- **Impact H · Effort S · A B C** (A especially: our "History in Maps" can own "true scale of ancient battles") · **Status MISSING.**

### P9. Avoid saturated framings. Find the unclaimed angle.
- **What:** if a big channel already owns the straight version of a topic, change the frame.
- **Evidence:** Switzerland: Johnny Harris "How Switzerland Engineered the Perfect Country" 3.3M (0.9× of his median) and PolyMatter "Can Switzerland Stay Neutral?" 0.3× **[E-ours]**. The topic is covered, so C-001 needs a paradox frame (e.g. resource-poor + landlocked + rich).
- **Impact M · Effort S · A B C · Status MISSING.**

### P10. Title length and wording: keep it short and readable, then test
- **What:** target ≤ 50 characters with the key word in the first ~30. Plain words. No emoji. Avoid ALL-CAPS beyond one word.
- **Evidence (conflicting) [E-data]:** 1of10: titles ≤30 chars get ~60% more views, 5-word titles have the highest median engagement, very readable titles +20%, titles with numbers −11% [S12]. Eden (2026): breakout rate *rises* with title length (26% <30 chars → 36% >75 chars) [S13]. vidIQ: titles with emojis performed worse [S18, secondary]. Mobile truncation favours front-loading **[O]**.
- **Resolution [O]:** the length data conflicts, so front-load the hook and let Test & Compare decide length.
- **Impact M · Effort S · A B C · Status PARTIAL** (skill already says ≤60 chars).

### P11. Description: hook lines, chapters, sources, credits
- **What:** first 2 lines restate the promise with the main search phrase. Chapters with keyword-bearing names. Sources and credits.
- **Evidence (official):** chapters need the first timestamp at 00:00, ≥3 timestamps ascending, each ≥10 s. Manual chapters override automatic ones [S9]. Title, thumbnail and description outrank tags for discovery [S5].
- **Impact M (search, retention navigation) · Effort S · A B C · Status DOING.** Improvement: write chapter titles as mini-hooks ("Cannae: 50,000 dead in an afternoon"), not labels ("Cannae").

### P12. Tags: minimal
- **What:** 3–8 tags: spelling variants, brand name, main entity. No time spent beyond that.
- **Evidence:** YouTube says tags "play a minimal role" and help mainly with commonly misspelled terms [S5] **[E-official]**.
- **Impact L · Effort S · Status PARTIAL** (we use hashtags, and tags are not in UPLOAD.md). Add one line.

### P13. Translated titles and descriptions plus auto-dubbing
- **What:** add translated title and description for the top languages of our audiences (Spanish, Portuguese, French, German, Arabic, Hindi, Indonesian). Enable auto-dubbing. Review dubs for names and numbers.
- **Evidence:** translated titles and descriptions "can show up in YouTube search results for viewers who speak those other languages" [S6] **[E-official]**. Multi-language audio: creators averaged >25% of watch time from non-primary-language views [S7] **[E-official]**. Auto-dubbing: on by default for eligible creators, 120-min limit, dubs cannot be edited (only unpublished or deleted), and lip sync is experimental [S19] **[E-official]**. 27 languages and 6M+ daily viewers watching ≥10 min of dubbed video [S8] **[secondary]**.
- **Impact H for C and B (globally relevant topics), M for A · Effort S (translation by us, checked) · A B C · Status PARTIAL** (auto-dub is in the checklist; translated metadata is MISSING).
- **Pipeline:** `package-upload` writes `metadata_translations.json` (lang → title, description first 2 lines + chapters). Numbers and names are checked against `sources.md`. Kokoro English narration is clean speech, so it should dub well. Spot-check 1 dub per language for unit and number errors.

### P14. Track CTR and first-48h metrics per video, compared to ourselves
- **What:** log impressions, impressions CTR, AVD, % viewed and traffic sources at 48 h and 7 d for every upload, plus any Test & Compare result.
- **Evidence:** half of channels and videos have 2–10% CTR. Home-page traffic naturally lowers CTR. Do not judge immediately after upload. "Compare CTRs between videos over the long-term" [S3] **[E-official]**. High CTR with low AVD signals clickbait [S3]. YouTube's growth lead frames CTR as subordinate to total views and satisfaction ("20% CTR and 10K views or 5% CTR and 100K views?") [S20, secondary].
- **Impact M (enables learning) · Effort S · A B C · Status PARTIAL** (checklist line exists, no data file).
- **Pipeline:** `docs/PERFORMANCE.csv` (video_id, brand, title_frame, thumb_type, 48h_impr, 48h_ctr, 7d_views, avd, test_result). Ask Studio can pull the numbers, but it is English/US-limited and its availability varies [S21].

### P15. Promise–payoff alignment (the anti-clickbait rule)
- **What:** the first 30 s of the video restate and start delivering the exact promise of the title and thumbnail. The thumbnail's subject appears on screen in the first 5 s.
- **Evidence:** Test & Compare ranks on watch time, so packaging that draws the wrong audience loses [S1]. YouTube warns that clickbait shows as high CTR + low AVD [S3]. Veritasium distinguishes accurate-but-intriguing from misleading [S15] **[O]**.
- **Impact H · Effort S · A B C · Status PARTIAL** (cold open exists, but not derived from the package).

### P16. Retire Inspiration tab dependence. Use Ask Studio only as a brainstorming aid.
- **Evidence:** the Inspiration tab is being deprecated from August 2026, and Ask Studio replaces it for ideas, titles and outlines [S21] **[E-official]**.
- **Impact L · Effort S · Status N/A** (never used). Note: AI thumbnails from YouTube carry C2PA metadata [S21]. We do not use them anyway.

---

## 3. Outlier table (measured 2026-11-14)

**Method:** public channel `/videos` page, the 30 most recent long-form uploads. Median = median views of uploads 4–30 (the newest 3 are excluded as unsettled). Ratio = views ÷ that median. View counts are YouTube's rounded display values. For low-frequency channels (Historia Civilis, OverSimplified) the 30-video window spans years. **[E-ours]**, script logic in P2. Subscriber counts are as displayed on the same day.

| # | Channel (subs) | Title | Views | Median (last 30) | Ratio | Pattern |
|---|---|---|---|---|---|---|
| 1 | Invicta (1.67M) | Rome's Stalingrad - The Siege of Carthage (ALL PARTS) | 626K | 103K | **6.1×** | modern analogy + compilation |
| 2 | Invicta | True Size of the Battle of Cannae (FULL DOCUMENTARY) | 575K | 103K | **5.6×** | scale reframe on history |
| 3 | Invicta | The Mega Corporations Who Ruled Rome (DOCUMENTARY) | 380K | 103K | 3.7× | modern concept transplanted |
| 4 | Invicta (contrast) | The Fall of Carthage (146 BC) DOCUMENTARY | 86K | 103K | 0.8× | plain label + date |
| 5 | Knowledgia (2.2M) | The Entire History of the War of 1812 | 672K | 155K | **4.3×** | completeness |
| 6 | Knowledgia | Why didn't Spain and Portugal Continue the Reconquista in Africa? | 538K | 155K | 3.5× | counterfactual "why didn't" |
| 7 | Knowledgia | Why Was France Created in Medieval Times? | 460K | 155K | 3.0× | origin "why" |
| 8 | Kings and Generals (4.22M) | War of the Spanish Succession: All Battles and Events - FULL DOCUMENTARY | 1.0M | 419K | 2.4× | completeness |
| 9 | Kings and Generals | Largest Land Battle Before WWI Caused the First Russian Revolution | 763K | 419K | 1.8× | superlative + consequence |
| 10 | Historia Civilis (1.09M) | The Longest Year in Human History (46 B.C.E.) | 7.3M | 2.0M | 3.6× | superlative + curiosity |
| 11 | History Matters (1.92M) | Why didn't Castro try to retake Guantanamo Bay from America? | 2.5M | 883K | 2.8× | counterfactual |
| 12 | OverSimplified (9.69M) | WW2 - OverSimplified (Part 1) | 105M | 40M | 2.6× | broadest topic + series brand |
| 13 | RealLifeLore (7.93M) | Why The Taliban Are Begging The US To Come Back | 3.7M | 1.2M | **3.1×** | reversal / paradox |
| 14 | Wendover (4.92M) | How the Channel Tunnel Works | 2.3M | 1.1M | 2.1× | megaproject "how it works" |
| 15 | Wendover (contrast) | One Piece of News From Every Country in the World (Pt 2) | 267K | 1.1M | 0.2× | vague list, sequel |
| 16 | PolyMatter (1.93M) | Russia is Running Out of People | 963K | 356K | 2.7× | crisis statement |
| 17 | PolyMatter (contrast) | Can Switzerland Stay Neutral? | 114K | 356K | 0.3× | yes/no question (C topic!) |
| 18 | Economics Explained (2.89M) | Australia May Have Just Solved The Housing Crisis | 1.7M | 597K | 2.8× | surprising solution |
| 19 | Economics Explained | Economics Is A Junk Science | 1.2M | 597K | 2.0× | contrarian claim |
| 20 | CaspianReport (1.85M) | Why America keeps losing wars | 858K | 326K | 2.6× | negative pattern "keeps" |
| 21 | Johnny Harris (8.02M) | The Modern Middle East, Explained | 8.0M | 3.7M | 2.2× | big topic "explained" |
| 22 | Johnny Harris (contrast) | How Switzerland Engineered the Perfect Country | 3.3M | 3.7M | 0.9× | C topic already covered |
| 23 | Kurzgesagt (25.8M) | AI Just Crossed the Terrifying Line - Now What? | 24M | 5.2M | **4.6×** | threshold + stakes |
| 24 | Kurzgesagt | This Woman Cured Her Cancer with an Insane Method | 21M | 5.2M | 4.0× | person + surprising method |
| 25 | Veritasium (21.4M) | The Closest Thing We Have to Alien Technology | 66M | 9.9M | **6.7×** | superlative analogy |
| 26 | Real Science (2.09M) | The Insane Biology of: The Saltwater Crocodile | 3.5M | 1.1M | 3.2× | series formula + animal (B) |
| 27 | Real Science (contrast) | What Happens to the Human Body on Top of Everest | 204K | 1.1M | 0.2× | generic "what happens" |
| 28 | MetaBallStudios (1.98M) | 🌙 MOON IMPACT ► First person view | 31M | 1.7M | ~18× | first-person scale (2 y old) |
| 29 | MetaBallStudios (contrast) | 🏛️ Brutal Scales: The Biggest BUILDINGS seen in first person | 147K | 1.7M | 0.09× | over-familiar subject |
| 30 | Sideprojects (1.36M) | 7 Things the Nazis Invented That You Still Use | 1.1M | 266K | 4.1× | personal relevance "you still use" |

**Patterns (inference [O]):**
- Same channel, same topic, different frame gives 0.8× → 6.1× (rows 1, 2, 4). The frame is the lever we control most.
- Winning frames in our niches: *scale reframe*, *modern analogy*, *reversal*, *counterfactual "why didn't"*, *specific superlative*, *completeness*, *personal relevance*.
- Losing frames: yes/no questions, vague lists, generic "what happens", and topics a giant already covered straight (Switzerland).
- Long "FULL DOCUMENTARY / ALL PARTS" compilations over-perform on history channels (rows 1, 2, 8). Their extra length may explain part of the gap. This fits Eden's breakout-rate rise with duration [S13].

---

## 4. Title formula bank (original generic templates) + thumbnail checklist

Use `{}` slots. Each episode drafts ≥10 titles from ≥4 different templates, then picks 3 *different frames* for Test & Compare.

### A — History in Maps
1. `The True Scale of {battle/empire}` (scale reframe)
2. `How {underdog} Nearly Destroyed {superpower}` (stakes)
3. `Why Didn't {power} Just {obvious action}?` (counterfactual)
4. `{ancient event}: {modern analogy} of the Ancient World` (analogy)
5. `The {superlative} {thing} in {era} History` (e.g. "deadliest afternoon")
6. `{number} Hours That Ended {empire}` (compressed time)
7. `The Entire {war/empire} in {n} Maps` (completeness, owns our brand)
8. `Why {city} Was Built Exactly There` (geography causality)
9. `{empire} vs {empire}: Who Really Won?` (matchup + reversal)
10. `What {empire}'s Borders Looked Like Every {n} Years` (map-native)

### B — Scale & Science
1. `The True Size of {creature/object}` (series)
2. `{thing} Next to Things You Know` (human-scale anchor)
3. `Just How Big Was {extinct thing}?` (scale curiosity; the "why/how" form, not yes/no)
4. `{thing} Is Bigger Than You Think` (correction)
5. `What If {thing} Were {n}× Bigger?` (hypothetical)
6. `The {superlative} {category} That Ever Lived` (superlative)
7. `{small number} vs {huge number}: {category} in Perspective` (matchup)
8. `Why Nothing Can Grow Bigger Than {thing}` (limit, physics)
9. `{thing} Seen From {unusual viewpoint}` (POV, the generic form of first-person)
10. `How We Know {thing}'s Size (Without a Skeleton)` (mystery or method)

### C — Money & Maps
1. `Why Is {country} So Rich? (It Shouldn't Be)` (paradox)
2. `{country} Has No {resource}. So Why Is It So Rich?` (paradox stated)
3. `How {small country} Out-Earns {big country}` (matchup)
4. `The {n} Map Facts That Explain {country}'s Wealth` (map-native list, specific)
5. `Where {country}'s Money Actually Comes From` (inside view)
6. `Why {rich region} Keeps Getting Richer` (pattern)
7. `{country} Is Running Out of {resource}` (crisis statement)
8. `The Geography Trick That Made {country} Rich` (hidden cause)
9. `How {country} Turned {weakness} Into {strength}` (turning X into Y, cf. vidIQ >3× [S17])
10. `{country} vs {country}: Same Start, Different Fate` (fork)

**Banned forms:** "Name: descriptor" alone; yes/no questions; dates as the hook; emojis; any claim the video does not prove in the first 60 s.

### Thumbnail checklist (each of the 3 variants)
- [ ] **One subject** fills ≥40% of the frame (PD portrait/bust, animal, object, country shape). Faceless is fine.
- [ ] **One tension device**: size comparison with a human or bus, a red route or arrow, a before/after split, a VS split, or one big number.
- [ ] **Text ≤ 3 words** (ideally ≤10 characters), never repeating the title. "No text" is a valid variant.
- [ ] Readable at **168×94 px** (phone feed) and at 25% size: render a downscaled preview and look at it.
- [ ] **Bright, high-contrast**, no dark muddy frame (dark thumbnails underperform [S12]). Subject separated from the background by value contrast. Check in greyscale.
- [ ] Bottom-right corner is clear (duration badge covers it). No key element under the progress bar.
- [ ] Variants differ in **reason to click** (e.g. scale vs. character vs. map), not in colour.
- [ ] Rendered at ≥1920×1080 (3840×2160 recommended [S4]), JPG <2 MB for mobile upload [S4]. All 3 the same resolution (≥720p, or all get downscaled [S1]).
- [ ] Licence row in `docs/LICENSES.md` for every image. No realistic AI person, no copyrighted stills.
- [ ] The thumbnail subject appears on screen in the first 5 s of the video.
- [ ] Brand consistency: same font and colour system across a channel. Never copy another channel's look.

---

## 5. Packaging-first workflow for `new-episode` (proposed steps)

0. **Topic intake:** brand, topic, working idea.
1. **Outlier scan (30 min):** run `tools/outliers.py` on 6–10 comparable channels and search the topic on YouTube. Log ≥5 over-performers (≥2×) and ≥3 under-performers on this or adjacent topics with their frames → `PACKAGE.md#evidence`.
2. **Saturation check:** if a channel >1M subs did the straight version in the last 2 years, a *different frame* is mandatory (P9).
3. **Title sprint:** ≥10 titles from ≥4 templates (section 4). Each must contain a tension (P3). Score each 1–5 on curiosity, clarity, truthfulness (provable from `sources.md`) and length.
4. **Thumbnail concepts:** 3 sketches in words (subject + tension device + ≤3 words), each pairing with a top title. Check them against the checklist.
5. **Gate (pass/fail):** at least one title+thumbnail pair scores ≥4 on all criteria. If none does → reframe or drop the topic. Record the decision in `docs/STATUS.md`.
6. **Freeze the package** in `PACKAGE.md`: the primary pair (variant 1 = default) plus 2 challengers with different frames, and a one-sentence *promise*.
7. **Script from the promise:** the cold open (0–30 s) states and starts paying off the promise. The thumbnail subject appears by 5 s. Chapter names written as mini-hooks.
8. **Build and render** (unchanged).
9. **Render thumbnails** as Remotion stills from the frozen concepts (≥1920×1080) plus a 25% preview sheet. The reviewer subagent checks them with the checklist.
10. **package-upload:** description (hook lines from the promise), chapters, sources, credits, 3–8 tags, 3–5 hashtags, `metadata_translations.json`, SRT, test plan.
11. **Upload checklist (Aymen):** Advanced Features on; start Test & Compare with the 3 variants; enable auto-dubbing; add translations; do not touch title or thumbnail during the test.
12. **48 h / 7 d / test end:** log to `docs/PERFORMANCE.csv` and one line in `docs/LESSONS.md` ("frame X beat Y on watch-time share"). Feed the results into the next step 3.

---

## 6. Sources (all accessed 2026-11-14)

- [S1] YouTube Help — A/B test titles and thumbnails (Test & compare): https://support.google.com/youtube/answer/13861714?hl=en
- [S2] Search Engine Journal — "YouTube title A/B testing rolls out globally to creators" (2025-12-04): https://www.searchenginejournal.com/youtube-title-a-b-testing-rolls-out-globally-to-creators
- [S3] YouTube Help — Impressions and click-through rate: https://support.google.com/youtube/answer/7628154?hl=en
- [S4] YouTube Help — Add video thumbnails (specs, verification): https://support.google.com/youtube/answer/72431?hl=en
- [S5] YouTube Help — Tags ("minimal role"; title, thumbnail, description more important): https://support.google.com/youtube/answer/146402?hl=en-GB
- [S6] YouTube Help — Translate video titles and descriptions: https://support.google.com/youtube/answer/4792576?hl=en
- [S7] YouTube Official Blog — Multi-language audio (>25% watch time from non-primary language): https://blog.youtube/news-and-events/multi-language-audio/
- [S8] PPC Land — "YouTube auto dubbing tops 6M daily viewers, expands to 27 languages": https://ppc.land/youtube-auto-dubbing-tops-6m-daily-viewers-expands-to-27-languages
- [S9] YouTube Help — Video chapters: https://support.google.com/youtube/answer/9884579?hl=en
- [S10] Colin and Samir — "The New Rules of YouTube from Paddy Galloway": https://www.colinandsamir.com/resources/the-new-rules-of-youtube-from-paddy-galloway
- [S11] Creator Science podcast #152 — Paddy Galloway: https://podcast.creatorscience.com/paddy-galloway/
- [S12] 1of10 — "What actually makes a YouTube video go viral in 2025" (300K+ outliers, published 2026-02-06): https://1of10.com/blog/what-actually-makes-a-youtube-video-go-viral-in-2025
- [S13] Eden — "What makes a good YouTube thumbnail? We analyzed 507,478 videos" (2026-08-21): https://eden.so/blog/what-makes-a-good-youtube-thumbnail/
- [S14] Search Engine Journal — "Do faces help YouTube thumbnails? Here's what the data says" (2025-12-22): https://www.searchenginejournal.com/do-faces-help-youtube-thumbnails-heres-what-the-data-says/563944/
- [S15] Gigazine summary of Veritasium "Clickbait is Unreasonably Effective": https://gigazine.net/gsc_news/en/20210830-clickbait-effective · Recapio digest: https://recapio.com/digest/clickbait-is-unreasonably-effective-by-veritasium
- [S16] "How to succeed in MrBeast production" (memo text): https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/ · Simon Willison notes: https://feeds.simonwillison.net/2024/Sep/15/how-to-succeed-in-mrbeast-production/
- [S17] vidIQ Research — YouTube title formulas study (4M+ 2026 uploads, July 2026): https://vidiq.com/research/youtube-title-formulas-study/
- [S18] vidIQ video summary on 9M titles (questions, emojis), secondary: https://rosetta.to/u/vidiq/the-one-mistake-that-cost-you-views
- [S19] YouTube Help — Automatic dubbing: https://support.google.com/youtube/answer/15569972?hl=en
- [S20] Search Engine Journal — "How YouTube's recommendation system works in 2025" (Todd Beaupré interview): https://www.searchenginejournal.com/how-youtubes-recommendation-system-works-in-2025/538379/
- [S21] YouTube Help — Explore the Inspiration tab (deprecation from August 2026, Ask Studio): https://support.google.com/youtube/answer/15575509?hl=en
- [S22] 1of10 — Outlier score definition / homepage outliers: https://1of10.com/features/homepage-outliers
- [S23] vidIQ Help — Outliers feature: https://support.vidiq.com/en/articles/9660010-uncover-top-performers-outliers
- [S24] TubeFilter — "YouTube is expanding test and compare titles and thumbnails" (2025-07-16): https://www.tubefilter.com/2025/07/16/youtube-feature-test-and-compare-titles-thumbnails/
- [S25] Search Engine Journal — YouTube Ask Studio for channel analytics: https://www.searchenginejournal.com/youtube-introduces-ask-studio-ai-for-channel-analytics/559399/
- [S26] Upstream — open mouths and YouTube thumbnails (faces not always better): https://upstream.so/blog/open-mouths-and-youtube-thumbnails/
- [S27] Outlier data (ours): public channel pages `https://www.youtube.com/@<handle>/videos` and RSS `https://www.youtube.com/feeds/videos.xml?channel_id=<id>` for @InvictaHistory, @Knowledgia, @KingsandGenerals, @HistoriaCivilis, @HistoryMatters, @OverSimplified, @RealLifeLore, @Wendoverproductions, @PolyMatter, @EconomicsExplained, @CaspianReport, @johnnyharris, @kurzgesagt, @veritasium, @RealScience, @MetaBallStudios, @Sideprojects, @TheInfographicsShow (scraped 2026-11-14).
