# Review round 2: Money & Maps 002 "Siberian Curse"

**Verdict: FAIL, 7.0/10** (up from 6.5). The script fixes are clean and every number checks against sources.md. But 7 of the 14 Critical/Important items from round 1 are not fixed or only partly fixed, and the payoff scene (c6a) is still weak.

## Round-1 items
| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | c2i 17/84 | FIXED | Shows "15–18%" with no remainder. The bar still ends at the single point 18 (minor). |
| 2 | o6 title | FIXED | Full title, subtitle above the caption. |
| 3 | c3e/f/h headers | FIXED | "Coldest cities". No unit/source collision. |
| 4 | Fire image | FIXED | o3 uses winter ice. c5f is a map. |
| 5 | c2e/c2j tsarist photos | FIXED | Both are 1935/1956 maps now. |
| 6 | c2j "pay them to come" | FIXED | Now "keep them running, and warm." |
| 7 | c2f/c2h numbers | FIXED | Static 18–20 million. "Nearly 200,000". |
| 8 | Title 3 | PARTLY | "The World Bank Tried to Move Russians Out…" still names the Bank as the one acting. It is acceptable, because 57% of planned households didn't go (B3). |
| 9 | Regions drawn | NOT FIXED | c1b, c1d, c5b and c5c still use text labels only. There is no Chukotka/Magadan locator before c4b/c4c. |
| 10 | Overlaps | PARTLY | Still broken: c4d counter covers "RUSSIAN FAR EAST". c1f Winnipeg label at y≈0–20. c1g Yakutsk note runs into Magadan. |
| 11 | c1b Ural legend | PARTLY | The arrow is gone. SIBERIA is still stacked under RUSSIA. |
| 12 | c5b counter timing | WORSE | See N1. |
| 13 | Cadence | PARTLY | Dim text cards went from 18 to about 12. c3b is a chart now. c3c, c4j (Norilsk still about 85% dimmed) and c6c are still lists or quotes. |
| 14 | c6a payoff | NOT FIXED | It is a bar chart, not the three-layer map. See N4. |
| 15 | c3j locator/piles | PARTLY | The locator is fine. The dark shape bottom-right is still unexplained. There is no pile diagram. |
| 16 | o1/c6d callback | NOT FIXED | No Russia outline and no circled light in o1 or c6d. Thumbnail 2 circles a light the video never shows. |
| 17 | c5e repetition | FIXED | Tyumen/Krasnoyarsk, then Surgut, then Yakutsk. |

## New findings
**Important**
- **N1 c5b**: no counter is on screen at mid-scene while the VO says the 87% line (still f012009). On paper, the windows (0.05–0.6 and then 0.62–0.98) also put "40%" up before "Khanty-Mansi" is spoken. Fix: check that the counter renders, and time each window to its sentence from the word timings.
- **N2 o2**: the Norilsk note "69° north, no road or railway in" is an illegible black smear. This is title 1's promise. The counter box also covers "ARCTIC CIRCLE 66.6° N". Fix: render the note in plain caption type at ≥30 px, and move the Arctic Circle label to the right of the box.
- **N3 c2f**: the citation box cuts off "Vorkuta" ("…rkuta"). **c1c**: "Vancouver" and "Calgary" run into each other. Fix: run avoidLabels against the citation boxes and the city labels.
- **N4 c6a**: the bar notes ("Siberia + Far East") are overdrawn by the next bar. The chart also misleads. Land and people are measured for the Siberian and Far Eastern federal districts (R3). "Western Siberia" oil (X2) mostly comes from the Ural FD (Khanty-Mansi, Yamal), so it is a different area, yet viewers will read it as inside "Siberia". The "People" bar shows the east's 16.8%, which contradicts the how-to line "people in the west". Fix: build the three-layer map (east tint, western population dots, Khanty-Mansi/Yamal fields), each with its own label.

**Minor**
- How-to highlight box is offset in every chart ("How to re|ad"). Fix the highlight anchor.
- c3f: the "+70%" note sits under the Norilsk bar.
- c5e: Tyumen's growth is partly from boundary changes (S9 hedge). Add "boundaries changed" to the source line.
- c5a: "much of it from this area" plays over a chart, and Norilsk isn't shown (r1 #21).
- c2a: the Tsar glossary appears before the word is spoken (c2c). One-word caption fragments remain ("rubles.", "failed.").
- c2c: Hill & Gaddy's card uses the Russia faction colour. Use a neutral colour.
- Thumbnail 3: sea ice + "2× PAY" doesn't match pay (r1 #25). Thumbnail 2: the circle sits at fixed pixel coordinates (850, 302), and I couldn't check that it lands on Yakutsk because there is no thumbnail render.

## Checklist
- **Facts**: all on-screen and spoken numbers match sources.md (D1, D2, B3, B4, W1, NO4, X5, Y5 rechecked). PASS.
- **Packaging**: 3 titles, each paid off (o2/c4h, c2c–c2j, c4g). 3 thumbnails, each ≤3 words, all numbers sourced. PASS, apart from the Thumbnail 3 mismatch.
- **Policy**: balance line (c5g), not-advice credit, non-graphic Gulag. PASS.

**To pass**: fix N1, N2, N3, N4 and items 9, 10 and 16.
