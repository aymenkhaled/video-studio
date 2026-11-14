# Viewer clarity feedback — from Aymen after watching episode 001 (Hannibal), 13 Nov 2026

Applies to EVERY episode on every channel (episode 002 Carthage first, then the Hannibal upgrade).
Goal: a viewer with **zero background knowledge**, watching on a **phone**, possibly **muted**, possibly **not a native English speaker**, understands every detail and stays entertained. If anything needs prior knowledge, the video failed.

## A. Aymen's direct feedback (must fix)
1. **The first 5 seconds are bad.** Squares, triangles and rectangles mean nothing to a new viewer. The opening must show something real and dramatic, and say in plain words WHO, WHERE, WHEN and WHY IT MATTERS.
2. **Make it realistic.** Replace abstract shapes with real-looking armies and people: real historical paintings, engravings, museum photos of real objects, illustrated soldier figures. Use the free resources available (rules in section D).
3. **Not clear for someone without general knowledge.** Every name, place, term and number must be explained or shown the moment it appears.
4. **No link between then and now.** Always show where things are TODAY: modern country names and faint modern borders, "then → now" names (Carthage → near Tunis, Tunisia; Cannae → Puglia, Italy; New Carthage → Cartagena, Spain), a small locator globe, distances in km.
5. **Captions are missing.** Burn in large, readable captions for the whole video (many people watch muted, many are not native speakers).
6. **Best possible user experience.** The viewer should never have to pause, guess, or calculate.

## B. Additional gaps found in the episode 001 audit (Claude, main chat)
**Opening & structure**
7. Cold open has no hook image, no place/time card, no stakes. → Open on a real painting/artefact with slow parallax, a plain-language line ("216 BC. Southern Italy. Rome is about to lose its biggest army ever."), then the title.
8. No "where are we in the story" marker. → Persistent small chapter tracker (chapter number + name) and a years-ago timeline ("216 BC = about 2,240 years ago"). Explain once that BC years count down.
9. No recaps. → 1-line "So far" recap card at the end of each chapter, plus open loops into the next ("But this victory hid a fatal mistake…").
10. Chapter cards are bare text. → Chapter card with an image (painting/artefact), chapter question, and year range.
11. End has no designed end-screen area. → Last 20 s: clean layout with space for YouTube end-screen elements, next-video teaser line.

**People & terms**
12. Too many names, introduced too fast: Hamilcar, Hasdrubal (son-in-law) AND Hasdrubal (brother) — two different Hasdrubals!, Mago, Maharbal, Scipio father AND son, Paullus, Varro, Flaminius, Fabius, Masinissa. → Character cards on first mention (name, role, side colour, portrait from a PD coin/bust/painting if one exists, one-line "who is this"), a Barca family tree, and the same side colour for that person every time.
13. Terms never explained: legion, consul, dictator, Numidian, Punic, Iberian, Gaul, talent, siege engine, envelopment. → Glossary pop-up on first use (≤8 words).
14. Ancient units: "10,000 talents" means nothing. → Convert with a hedged, sourced modern equivalent (e.g. weight of silver in tonnes) or a clear comparison.

**Maps**
15. Flat land: the Alps and the Pyrenees are invisible, there are no rivers, yet the story is about crossing mountains and rivers. → Add shaded relief and rivers (Natural Earth, public domain); label the Ebro, Rhône, Po, Trebia and Aufidus where the story uses them.
16. No legend on maps. → Legend explaining colours, symbols, routes and arrows whenever they first appear.
17. No scale. → Scale bar in km, and route lengths ("≈ 1,500 km on foot").
18. Labels collide (army marker over region names, cities overlapping) and are too small for a phone (source chips 24 px). → Automatic label avoidance; minimum on-screen text size 34 px at 1080p, 44+ px for key information.
19. Territories are approximate hand drawings. → Say "approximate" on screen the first time and in the description; use sourced boundary data where the licence allows.

**Battles**
20. Units are NATO-style boxes. → Illustrated figures: infantry with shields and spears, cavalry riders, elephants, sized by army size, each with a label and a number.
21. No phase titles. → "Phase 1 — The trap is set", "Phase 2 — The center bends", "Phase 3 — Surrounded", with a one-line explanation of what to watch.
22. No terrain realism; the title plates hide units at the bottom; arrows stay after the move is over. → Terrain texture (fields, river, hills), plates moved or made smaller, arrows fade after the move.
23. Numbers have no context. → Relatable comparisons ("70,000 people ≈ a full large football stadium"), side-coloured counters.

**Sound**
24. Kokoro voice is clear but monotone for 10 minutes. → Evaluate better free commercial-licence TTS; add pauses and emphasis; vary pacing per scene type.
25. Music is generic and SFX are sparse. → SFX tied to every visual action (marching, hooves, elephants trumpeting, arrows, clash, crowd); per-scene ambience; music that rises toward each battle. Listen on a phone speaker before delivery.

**Visual variety & thumbnails**
26. 70 % of the runtime is the same parchment map. → Mix in PD paintings, engravings and museum artefacts with 2.5D parallax (Depth-Anything-V2-Small, Apache-2.0), close-ups and matched cuts every 6–15 s.
27. Thumbnails have no face or figure. → Use a PD bust/coin/painting of the main character, ≤3 words, very high contrast.

**Accessibility**
28. Rome red vs Carthage amber is weak for colour-blind viewers. → Check with a colour-blind simulator; add a second cue (pattern, icon or label), not colour alone.

## C. Captions spec (burned in)
- Always on, bottom-center, inside the safe area; max 2 lines, max ~42 characters per line; ≥ 54 px bold with a dark box or stroke.
- Numerals not words ("216 BC", "70,000"); names in their side colour; the current word or phrase highlighted.
- Synced from the voice word timings; never covering a key map element (move up when needed).
- The uploaded `captions.srt` must match the burned-in text.

## D. Resource rules for realism (unchanged licence policy)
- Allowed: public domain (paintings and engravings by artists dead > 70 years, PD-art scans on Wikimedia Commons), CC0 (Met Museum Open Access, Smithsonian Open Access, Rijksmuseum), CC BY (with credit; e.g. game-icons.net icons, verify each). Record every asset in `docs/LICENSES.md` and the description credits.
- Not allowed: CC BY-SA, NC, ND, unknown licence, film/TV/game footage, modern artists' work.
- No AI-generated realistic people or soldiers (YouTube labelling rules + channel policy). Realism comes from real art, real artefacts and illustrated figures.
- Example candidates to verify: J. M. W. Turner, "Snow Storm: Hannibal and his Army Crossing the Alps" (1812); 18th–19th-century engravings of Cannae and Zama; Carthaginian coins with elephants (museum open access).

## E. Definition of done (every episode)
- [ ] First 5 s: real image + who/where/when/why in plain words; no diagram before context.
- [ ] A zero-background viewer can explain each chapter afterwards (test: summarise each chapter in one sentence from the visuals alone).
- [ ] Every person, place, term and number is explained on first appearance; then-vs-now shown for every place.
- [ ] Burned-in captions everywhere; text readable on a phone; no label collisions.
- [ ] Battles: figures not boxes, phase titles, legend, numbers with context.
- [ ] Visual change every 6–15 s; at least 3 kinds of visuals (map, art/artefact, battle).
- [ ] Sound checked on a phone speaker; SFX for every action.
- [ ] Independent reviewer PASS on facts, licences, policy and clarity.
