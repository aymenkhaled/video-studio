"""Money & Maps 002 — "Russia Built Cities Where No Economy Should Exist" (the Siberian curse).
Voice-first script: edit the SCRIPT list, run `python build_timeline.py` → timeline.json.
Every number line maps to a row in sources.md (ids in the comments). Numbers are spelled for the TTS;
the caption converter turns them into numerals (check with tools/caption_numbers.mjs).
Never put two number words next to each other (LESSONS B001 #8)."""
import json
from pathlib import Path

W = lambda at=0.1: {"type": "whoosh", "at": at, "duration": 0.7, "gain": 0.28}
POP = lambda *ts: [{"type": "pop", "at": t, "duration": 0.3, "gain": 0.22} for t in ts]
COIN = lambda at: {"type": "coin", "at": at, "duration": 0.4, "gain": 0.25}
IMPACT = lambda at=0.2: {"type": "impact", "at": at, "duration": 1.4, "gain": 0.32}
RISER = lambda at=0.2, d=3: {"type": "riser", "at": at, "duration": d, "gain": 0.22}
TRAIN = lambda at=0.3: {"type": "train", "at": at, "duration": 4, "gain": 0.18}
COLD = {"type": "wind", "gain": 0.22}

# (id, music, lines, extra)
SCRIPT = [
    # ---------- 0:00–0:50 promise → twist → second hook (PLAYBOOK 4.1) ----------
    ("o1", "calm", ["This is Russia at night, seen from space.",
                    "Most of the lights are in the west. But far out here, in the dark, there are cities."], {"sfx": [RISER()], "lead": 0.4}),
    ("o2", "tension", ["Like Norilsk: about one hundred seventy-four thousand people, well above the Arctic Circle.",  # D6, NO1
                       "No road and no railway connect it to the rest of Russia."], {"sfx": [W()]}),  # NO2
    ("o3", "tension", ["Or Yakutsk, where the average January day is about minus thirty-seven degrees."], {"sfx": POP(0.8), "ambience": COLD}),  # Y2
    ("o4", "tension", ["Most people think Russia is empty simply because it is cold.",
                       "The strange part is the opposite. Russia has more large cities in cold places than any other country."], {"sfx": [IMPACT(2.6)]}),  # H9
    ("o5", "epic", ["So why build cities where no market ever would?",
                    "What does it cost to keep them alive, every winter?"], {"sfx": POP(0.2, 2.6)}),
    ("o5b", "epic", ["And when a World Bank loan helped pay people to leave, why did most of them stay?"], {"sfx": POP(0.3)}),  # B3
    ("o6", "epic", ["By the end, you will see Russia's map the way an economist does.",
                    "And it starts with a name: the Siberian curse."], {"tail": 1.2, "sfx": [IMPACT(3.2)]}),
    # ---------- chapter 1: big, but where do people live? ----------
    ("c1", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c1a", "calm", ["Russia is the largest country on Earth, about seventeen million square kilometres.",  # R1
                     "More than one hundred forty-three million people live there, according to the World Bank."], {}),  # R2
    ("c1b", "calm", ["Siberia and the Russian Far East make up about two thirds of that land."], {}),  # R3
    ("c1b2", "calm", ["But only about one Russian in six lives there."], {"sfx": POP(1.2)}),  # R3
    ("c1c", "calm", ["Canada has the same cold north, and a very different map.",
                     "Two in three Canadians live within one hundred kilometres of the United States border, the warmest strip of the country."], {"sfx": [W()]}),  # C1
    ("c1d", "calm", ["Canada's three northern territories hold less than one percent of Canadians."], {}),  # H10
    ("c1e", "tension", ["Russia went the other way.",
                        "Novosibirsk, in Siberia, had about eight thousand people in eighteen ninety-seven.",  # C5
                        "In twenty twenty-one, it had about two hundred times as many."], {"sfx": POP(3.0, 6.2)}),  # C5 CALC
    ("c1f", "calm", ["In January, Novosibirsk is about as cold as Winnipeg, Canada's coldest big city: around minus seventeen degrees."], {"ambience": COLD}),  # C3 C4
    ("c1g", "calm", ["The difference is not one cold city. It is how many big cities Russia built in places like this."], {}),
    ("c1r", "calm", ["So far: most Russians live in the west, yet Siberia is full of big cities. Why build them there?"], {"tail": 1.0}),
    # ---------- chapter 2: why build there? ----------
    ("c2", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c2a", "calm", ["It started with a railway.",
                     "The Trans-Siberian was begun in eighteen ninety-one and finished in nineteen sixteen."], {"sfx": [TRAIN()]}),  # T2
    ("c2b", "calm", ["It runs about nine thousand three hundred kilometres, from Moscow to Vladivostok.",  # T1
                     "Even today, the fastest train takes about a week."], {"sfx": [TRAIN(0.1)]}),  # T3
    ("c2c", "tension", ["The tsars placed forts, villages and towns along it.",
                        "Then, in the words of Brookings researchers Fiona Hill and Clifford Gaddy, the Soviets built cities of over a million."], {}),  # H8, H1
    ("c2d", "tension", ["In their book, The Siberian Curse, they argue that communist planners put factories, machines and people in the wrong places."], {}),  # H1
    ("c2e", "somber", ["Under Stalin, the state did not ask where people wanted to live. It decided.",
                       "Factories followed the coal, the metals and the gold."], {}),
    ("c2f", "somber", ["Much of the first work was done by prisoners.",
                       "Some eighteen to twenty million people passed through the Gulag camps in just over two decades, Hill and Gaddy write."], {}),  # G1
    ("c2g", "somber", ["Norilsk began in nineteen thirty-five, when prisoners of the Norillag camp started building its mines and metal plant.",  # G3
                       "At its peak, the camp held tens of thousands of people."], {"ambience": COLD}),  # G4 (hedged)
    ("c2h", "somber", ["Far to the east, a trust called Dalstroy mined gold in Kolyma and built the port of Magadan.",  # G5
                       "In nineteen fifty-two, it held nearly two hundred thousand prisoners."], {}),  # G5
    ("c2i", "tension", ["At their height, the camps produced an estimated fifteen to eighteen percent of Russian industrial output."], {}),  # G2
    ("c2j", "tension", ["When the camps were shut down after Stalin's death in nineteen fifty-three, the cities stayed.",
                        "Now someone had to keep them running, and warm."], {"sfx": [COIN(3.4)]}),
    ("c2r", "calm", ["So far: a railway, a plan and prison labour put big cities in the coldest places. But what does keeping them alive cost?"], {"tail": 1.0}),
    # ---------- chapter 3: the price of cold ----------
    ("c3", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c3a", "calm", ["Hill and Gaddy measure the problem with one simple idea: temperature per capita.",  # H2
                     "Take the January temperature where each person lives, and average it over everyone."], {}),  # H2
    ("c3b", "calm", ["On their charts, the average Russian lives at around minus eleven to minus twelve degrees in January.",  # H4
                     "The average Canadian, between minus nine degrees and minus ten."], {"sfx": POP(2.0, 5.0)}),  # H4
    ("c3c", "tension", ["And it moved the wrong way.",
                        "From nineteen twenty-six to nineteen ninety, Russia's number fell by almost one full degree, while Canada's rose by even more."], {}),  # H3
    ("c3d", "tension", ["Cold is not just uncomfortable. It is expensive.",
                        "Buildings need heat for much of the year, and almost everything travels thousands of kilometres to arrive."], {"ambience": COLD}),
    ("c3e", "tension", ["In the coldest big cities, Hill and Gaddy found living costs up to four times higher than in the rest of Russia."], {"sfx": [COIN(2.4)]}),  # H7
    ("c3f", "calm", ["So Russia still pays people to live there.",
                     "By law, northern jobs earn a regional bonus on top of the salary: eighty percent extra in Norilsk, seventy percent in Magadan."], {"sfx": [COIN(3.0), COIN(6.0)]}),  # W1
    ("c3g", "calm", ["Years of service add a northern allowance that can reach another hundred percent.",  # W2
                     "Together, a salary can double, or more than double."], {"sfx": [COIN(1.6)]}),  # W2 CALC
    ("c3h", "tension", ["Every summer, before the rivers and seas freeze, Russia runs the northern delivery.",  # N1
                        "In twenty twenty-four, it shipped about three point four million tonnes of cargo north, about seventy percent of it fuel."], {}),  # N1
    ("c3i", "tension", ["In the early two thousands, winter fuel for the coldest regions cost the state at least seven hundred million dollars a year."], {"sfx": [COIN(3.0)]}),  # N4
    ("c3j", "calm", ["And in Yakutsk, built on frozen ground, many buildings stand on concrete piles, so their heat does not thaw the earth below."], {"ambience": COLD}),  # Y3
    ("c3r", "calm", ["So far: the cold costs Russia every single year, in heat, wages and shipping. So why not just move people out?"], {"tail": 1.0}),
    # ---------- chapter 4: paid to leave ----------
    ("c4", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c4a", "somber", ["In nineteen ninety-one, the Soviet Union collapsed, and so did the money that kept many northern towns alive.",
                       "People began to leave on their own."], {}),
    ("c4b", "somber", ["Magadan region had more than three hundred eighty-five thousand people in nineteen eighty-nine.",  # D1
                       "By twenty twenty-one, only about one hundred thirty-six thousand remained."], {"sfx": POP(2.6, 6.0)}),  # D1
    ("c4c", "somber", ["Next door, Chukotka fell from more than one hundred fifty-seven thousand people to about forty-seven thousand.",  # D2
                       "Its population shrank by nearly seventy percent."], {}),  # D2 CALC
    ("c4d", "somber", ["Across the whole Far East, about a quarter of the people have gone since nineteen eighty-nine."], {}),  # D4
    ("c4e", "tension", ["Then, in two thousand one, the World Bank lent Russia eighty million dollars to test a bold idea:",  # B1
                        "help people move out of the far north."], {"sfx": [COIN(2.0)]}),
    ("c4f", "tension", ["The pilot chose three places: Norilsk, Vorkuta and Susuman."], {"sfx": POP(1.6, 2.4, 3.2)}),  # B2
    ("c4g", "tension", ["Planners expected about ten thousand four hundred households to leave.",  # B3
                        "Only about four thousand five hundred did."], {"sfx": [IMPACT(3.2)]}),  # B3
    ("c4h", "tension", ["In Norilsk, only about one in seven of the planned families went."], {}),  # B3 (623 / 4,599)
    ("c4i", "somber", ["More than half of the loan was never spent. About forty-five million dollars was cancelled,",  # B4
                       "and the World Bank's own evaluators rated the project moderately unsatisfactory."], {}),  # B4
    ("c4j", "epic", ["Why would people stay somewhere that expensive?",
                     "Because for many of them, it paid. In Norilsk, the evaluators noted, living standards were relatively high."], {"sfx": [IMPACT(2.4)]}),  # B5
    ("c4k", "epic", ["Everything so far assumed the cold is only a cost.",
                     "But the cold is also where Russia keeps its money."], {"sfx": [RISER(0.2, 4)]}),
    ("c4r", "calm", ["So far: people left the far north on their own, but paying them to leave mostly failed. Is the curse really a curse?"], {"tail": 1.0}),
    # ---------- chapter 5: cold money (top moment ~65 %) ----------
    ("c5", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c5a", "epic", ["Look at Norilsk again.",
                     "In twenty twenty-four, Russia mined about thirty-nine percent of the world's palladium, a metal used in car exhaust cleaners, much of it from around Norilsk."], {"sfx": [COIN(3.0)]}),  # NO4
    ("c5b", "epic", ["Western Siberia produced about eighty-seven percent of Russia's crude oil in twenty twenty-three, according to Rystad Energy data.",  # X2
                     "The Khanty-Mansi region alone pumps about forty percent."], {"sfx": POP(1.0, 4.4)}),  # X3
    ("c5c", "epic", ["And Yamal, in the Arctic, produces the large majority of Russia's natural gas."], {"ambience": COLD}),  # X4
    ("c5d", "epic", ["In twenty twenty-four, oil and gas brought Russia's federal budget more than eleven trillion rubles.",  # X5
                     "That was about thirty percent of all its revenue."], {"sfx": [COIN(1.4), COIN(4.6)]}),  # X5
    ("c5e", "calm", ["So the curse is also the treasure chest, and some cold cities are growing.",
                     ], {}),
    ("c5e2", "calm", ["Surgut, an oil city, grew from about two hundred eighty-five thousand people in two thousand two to about three hundred ninety-six thousand."], {}),  # X7
    ("c5f", "calm", ["And Yakutsk, at minus thirty-seven in January, grew by more than half."], {"sfx": POP(2.4)}),  # Y5, Y2
    ("c5g", "calm", ["Not everyone agrees with the curse idea.",
                     "Critics say it is overstated: January temperature is only one way to measure cost, and Canada's people also hug their warm south."], {}),  # H12
    ("c5h", "tension", ["Hill and Gaddy's own answer was that Russia should shrink.",
                        "Not its territory, but its economic geography: fewer people in the coldest places, more in the warmer west."], {}),  # H11
    ("c5r", "calm", ["So far: the cold north costs Russia a fortune, and also earns much of it. So what is the real answer?"], {"tail": 1.0}),
    # ---------- chapter 6: the answer + callback ----------
    ("c6", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c6a", "epic", ["So why is Russia so big, but so empty?",
                     "Because its land, its people and its money sit in three different places."], {"sfx": [IMPACT(3.0)]}),
    ("c6b", "calm", ["Soviet planners pushed millions of people into the cold.",
                     "Left to markets, Hill and Gaddy argue, most would have stayed closer to the warm west, the way Canadians hug their southern border."], {}),  # H1, C1
    ("c6c", "calm", ["Today Russia pays twice: once to keep people warm in the cold, and once to pull its riches out of it."], {"sfx": [COIN(2.0), COIN(4.4)]}),
    ("c6d", "epic", ["Look at the night map one last time.",
                     "Many of those lights in the dark are not an accident of nature. They were planned, and the bill still arrives every winter."], {"tail": 1.6, "sfx": [RISER(0.4, 4)]}),
    ("end", "calm", ["Next on Money and Maps: borders that disappeared a hundred years ago, and still decide who is rich.",
                     "Which cold city would you never leave, even for a bonus? Tell us in the comments."], {"min": 20.0, "tail": 2.0, "endscreen": True}),
]

timeline = {
    "id": "002-siberian-curse",
    "comp": "SiberianCurse",
    "title": "Russia Built Cities Where No Economy Should Exist",
    "fps": 24,
    "seed": 643,
    "voice": {"engine": "kokoro", "voice": "af_heart", "speed": 0.96, "language": "en-us", "gap": 0.4, "prosody": True, "chain": True, "model": "fp32"},
    "music": {"key": "D", "tempo": 72},
    "mix": {"duck_db": 20, "tp_oversample": True},
    "ambience": {"type": "wind", "gain": 0.06},
    "scenes": [],
}
for sid, music, lines, extra in SCRIPT:
    sc = {"id": sid, "lead": extra.get("lead", 0.3), "lines": lines}
    if music:
        sc["music"] = music
    for k in ("tail", "min", "sfx", "ambience", "speed", "endscreen"):
        if k in extra:
            sc[k] = extra[k]
    timeline["scenes"].append(sc)

out = Path(__file__).with_name("timeline.json")
out.write_text(json.dumps(timeline, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
words = sum(len(l.split()) for _, _, ls, _ in SCRIPT for l in ls)
print(f"{len(SCRIPT)} scenes, {words} words -> ~{words / 2.35 / 60:.1f} min of speech")
