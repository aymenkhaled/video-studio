"""Money & Maps 003 — "Borders That Vanished Still Decide Who's Rich" (phantom borders).
Voice-first script: edit SCRIPT, run `python build_timeline.py` → timeline.json.
Every number line maps to a row in sources.md (ids in comments). Numbers are spelled for the TTS; no "point" decimals,
no "oh" years, never two number words next to each other (LESSONS B001 #8, C001).
Structure: promise (Germany money map) → 5 ghost borders, each OLDER than the last → why some fade and some stay."""
import json
from pathlib import Path

W = lambda at=0.1: {"type": "whoosh", "at": at, "duration": 0.7, "gain": 0.28}
POP = lambda *ts: [{"type": "pop", "at": t, "duration": 0.3, "gain": 0.22} for t in ts]
COIN = lambda at: {"type": "coin", "at": at, "duration": 0.4, "gain": 0.25}
IMPACT = lambda at=0.2: {"type": "impact", "at": at, "duration": 1.4, "gain": 0.32}
RISER = lambda at=0.2, d=3: {"type": "riser", "at": at, "duration": d, "gain": 0.22}
TRAIN = lambda at=0.3: {"type": "train", "at": at, "duration": 4, "gain": 0.18}

# (id, music, lines, extra)
SCRIPT = [
    # ---------- 0:00–0:45 promise → twist → second hook ----------
    ("o1", "tension", ["This is Germany's money map: how much each state produces per person.",
                       "Now watch what happens when we draw a border that was erased thirty-six years ago."], {"sfx": [RISER(0.2, 4)], "lead": 0.4}),  # G1, G2
    ("o2", "tension", ["It fits almost perfectly.",
                       "Not one of the five eastern states produces as much per person as the poorest western state."], {"sfx": [IMPACT(0.3)]}),  # G3
    ("o3", "epic", ["Germany is not alone. All over the world, borders that vanished long ago still show up in today's money."], {"sfx": POP(1.2)}),
    ("o3b", "epic", ["Some are a hundred years old. One was built by Rome.",
                     "And one is a coastline from the age of dinosaurs, that you can still see from space."], {"sfx": POP(0.4, 2.0, 3.8)}),  # P1, R1, B1
    ("o4", "epic", ["So why do some dead borders keep deciding who is rich, while others fade away?",
                    "We will go back in time, one border at a time, each one older than the last."], {"tail": 1.0, "sfx": [IMPACT(3.4)]}),

    # ---------- chapter 1: Germany, 1990 ----------
    ("c1", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c1a", "somber", ["For forty years, this fortified line split Germany in two: a market economy in the west, a communist one in the east."], {}),  # G1
    ("c1a2", "somber", ["In nineteen eighty-nine the Berlin Wall fell. A year later, the country was one again."], {"sfx": [IMPACT(1.4)]}),
    ("c1b", "calm", ["At first the gap was huge. In nineteen ninety-one, a full-time worker in the east earned less than half of a western wage."], {}),  # G5
    ("c1c", "calm", ["Since then the east has caught up a lot. Thuringia's output per person, after inflation, has more than doubled."], {"sfx": [COIN(2.4)]}),  # G8
    ("c1d", "tension", ["But in twenty twenty-five, the five eastern states still produced only about seventy percent as much per person as the west."], {}),  # G4
    ("c1e", "calm", ["And full-time workers there still earn about a fifth less."], {"sfx": POP(1.0)}),  # G5
    ("c1e2", "calm", ["In twenty twenty-five, the typical full-time worker in the east earned about forty-six thousand euros a year.",
                      "In the west, about fifty-five thousand."], {"sfx": [COIN(1.0)]}),  # G6
    ("c1f", "calm", ["Why so slow? Start with the head offices.",
                     "When the east opened up, almost no big company moved its headquarters there."], {}),  # G9
    ("c1g", "calm", ["Today, not one company in Germany's top stock index is based in the five eastern states.",
                     "Only about sixteen of the country's five hundred largest firms are."], {"sfx": POP(1.6, 4.4)}),  # G9, G10
    ("c1h", "somber", ["Head offices mean research jobs and high salaries. So young people followed them.",
                       "Since then, well over a million more people have moved from east to west than the other way."], {}),  # G11 (1.2 m)
    ("c1i", "calm", ["Saxony-Anhalt has lost about a quarter of its people since nineteen ninety."], {"sfx": POP(1.4)}),  # G11
    ("c1j", "calm", ["Output per worker in the east has climbed from about a third of the western level to about eighty-five percent.",
                     "Close, but not equal."], {}),  # G7 (HEDGE)
    ("c1r", "calm", ["So a border can vanish from the map, and still sit inside every paycheck. Now let's go back a century."], {"tail": 1.0}),

    # ---------- chapter 2: Poland, 1918 ----------
    ("c2", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c2a", "calm", ["For more than a hundred years, there was no Poland on the map.",
                     "Its land was split between three empires: Russia, Prussia and Austria."], {}),  # P1
    ("c2b", "calm", ["Each empire ran its part differently. Prussia built factories and a dense web of railways.",
                     "Russia, in its part, built far fewer."], {"sfx": [TRAIN(0.4)]}),  # P3
    ("c2b2", "calm", ["Russia also pressed hard on the Catholic Church. Austria, by contrast, let Poles run much of their own local government."], {}),  # P3 paper §2
    ("c2c", "tension", ["In nineteen eighteen, Poland was reborn and the borders disappeared.",
                        "So, a century later, is the old Prussian side still richer?"], {}),
    ("c2d", "epic", ["Economists Irena Grosfeld and Ekaterina Zhuravskaya checked, village by village, on both sides of the old lines."], {}),  # P1
    ("c2d2", "epic", ["Here is the surprise. Differences in income, education and corruption have disappeared."], {"sfx": [IMPACT(1.2)]}),  # P2
    ("c2e", "calm", ["What did not disappear were things built into the ground and into families.",
                     "The railways the empires laid are still denser on the old Prussian side."], {"sfx": [TRAIN(0.6)]}),  # P3
    ("c2e2", "calm", ["And people on the old Russian side still go to church less, a trace of Russia's long pressure on the Church."], {}),  # P4
    ("c2f", "calm", ["You may have seen viral maps where Polish elections follow the old border perfectly."], {}),
    ("c2f2", "calm", ["Careful: the researchers found that much of that split is a smooth slope across the country, not a sudden jump at the line."], {}),  # P5
    ("c2r", "calm", ["Lesson one: money can cross a dead border. Railways and habits cross much more slowly."], {"tail": 1.0}),

    # ---------- chapter 3: Habsburg, 1918 ----------
    ("c3", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c3a", "calm", ["The same year another empire died: the Habsburgs of Austria-Hungary.",
                     "Its old eastern edge now cuts through five countries: Poland, Ukraine, Romania, Serbia and Montenegro."], {}),  # H1
    ("c3b", "calm", ["The Habsburgs were known for a slow but fairly honest bureaucracy: courts, police and paperwork that followed written rules."], {}),
    ("c3c", "tension", ["A team led by economist Sascha Becker compared people living within two hundred kilometres of that line, inside the same country today."], {}),  # H2
    ("c3d", "epic", ["On the old Habsburg side, people trust courts and police more.",
                     "And they are more likely to say they never pay bribes, by roughly five to seven percentage points."], {"sfx": [COIN(4.0)]}),  # H3
    ("c3c2", "calm", ["The survey was taken in two thousand six, almost ninety years after the empire fell."], {}),  # H1 (LiTS 2006)
    ("c3d2", "calm", ["Business owners in a separate survey said the same: on the old Habsburg side, courts seem fairer."], {}),  # H2 (IZA DP §VIII)
    ("c3e", "calm", ["And when the researchers moved the line a hundred kilometres either way, as a test, the effect vanished. It sits on the real border."], {"sfx": POP(3.0)}),  # H4
    ("c3r", "calm", ["Lesson two: an empire can leave behind trust. Or the lack of it. Now let's go back almost two thousand years."], {"tail": 1.0}),

    # ---------- chapter 4: the Roman Limes ----------
    ("c4", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c4a", "calm", ["This is the Limes, the frontier of the Roman Empire across Germany: about five hundred fifty kilometres of wall, ditches and watchtowers."], {}),  # R1
    ("c4a2", "calm", ["Rome gave it up more than seventeen hundred years ago.",
                      "That makes it by far the oldest human border in this story."], {"sfx": [W(0.2)]}),  # R5
    ("c4b", "tension", ["Economist Fabian Wahl looked at Germany from space at night, and compared both sides of that line."], {}),
    ("c4b2", "tension", ["On the old Roman side, the lights are brighter: about five percent by the strictest method, and twenty percent or more by others."], {"sfx": POP(1.0)}),  # R2
    ("c4c", "calm", ["Cities close to the line are about half again as big on the Roman side."], {}),  # R3
    ("c4d", "epic", ["The reason is roads. Romans paved roads between their towns.",
                     "Later rulers kept using them, towns grew along them, and many became today's highways."], {"sfx": [W(2.0)]}),  # R4
    ("c4e", "calm", ["Roman towns like Mainz and Trier never stopped being important. Their bishops and markets kept them alive after Rome fell."], {}),  # R4 (Wahl intro)
    ("c4r", "calm", ["Lesson three: a road outlives the empire that built it. And our last border is not even human."], {"tail": 1.0}),

    # ---------- chapter 5: the Cretaceous coastline ----------
    ("c5", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c5a", "calm", ["This dark curve across Alabama and Mississippi is visible from space.",
                     "It is called the Black Belt."], {}),  # B1
    ("c5b", "somber", ["In the age of dinosaurs, more than sixty-six million years ago, the sea reached all the way up here."], {}),  # B2, B3
    ("c5b2", "somber", ["Tiny plankton shells piled up on the sea floor and became chalk.",
                        "That chalk weathered into some of the richest soil in the South."], {}),  # B2
    ("c5c", "somber", ["In the nineteenth century that soil made cotton, and cotton made Alabama one of the ten richest states.",
                       "That wealth was made by enslaved people."], {"sfx": [COIN(3.2)]}),  # B9
    ("c5c2", "somber", ["By eighteen sixty, almost half of everyone in Alabama was enslaved, most of them on these black soils."], {}),  # B5 (HEDGE: 45 %)
    ("c5d", "somber", ["Slavery ended. But the land stayed with the plantation owners, and the soil wore out."], {}),  # B8
    ("c5d2", "somber", ["Today, nineteen of the twenty-four Black Belt counties are still in what the Census calls persistent poverty."], {"sfx": POP(1.2)}),  # B6
    ("c5e", "tension", ["Poverty there averages about one person in four, against about one in seven in the rest of Alabama."], {"sfx": POP(2.6)}),  # B6
    ("c5e2", "calm", ["And only about half of adults there have a job or are looking for one, against nearly two in three across the United States."], {}),  # B10
    ("c5e3", "somber", ["These are the same counties the civil rights marchers crossed, from Selma to Montgomery."], {}),  # B6 (UA EPC)
    ("c5f", "calm", ["The soil did not make people poor. What people built on it did.",
                     "But the line of that ancient coast still shows where."], {}),  # balance
    ("c5r", "calm", ["Five dead borders. So why do some fade, and others refuse to die?"], {"tail": 1.0}),

    # ---------- chapter 6: the answer ----------
    ("c6", None, [], {"min": 3.4, "tail": 0.6, "lead": 0.2, "sfx": [W()]}),
    ("c6a", "epic", ["Look at what lasted. Railways in Poland. Roads in Germany. Trust in the Habsburg lands. Land and poverty in Alabama."], {"sfx": [IMPACT(4.0)]}),
    ("c6a2", "epic", ["Things that are built into the ground, or passed down in families, stay."], {}),
    ("c6b", "calm", ["Things that money can move, like wages and schools, slowly level out.",
                     "That is what happened to Poland's income gap. Germany is still in the middle of it."], {}),  # P2, G5
    ("c6c", "calm", ["None of this is destiny. These are averages, and the researchers test them with fake borders that show nothing."], {}),  # H4
    ("c6c2", "calm", ["But next time you see a strange line on a money map, ask what used to be there."], {}),
    ("c6d", "epic", ["Because the past does not stay in history books. Sometimes it stays in the map."], {"tail": 1.6, "sfx": [RISER(0.4, 4)]}),
    ("end", "calm", ["Which ghost border runs through your country? Tell us in the comments.",
                     "And subscribe for more of the money behind the map."], {"min": 20.0, "tail": 2.0, "endscreen": True}),
]

timeline = {
    "id": "003-phantom-borders",
    "comp": "PhantomBorders",
    "title": "Borders That Vanished Still Decide Who's Rich",
    "fps": 24,
    "seed": 1918,
    "voice": {"engine": "kokoro", "voice": "af_heart", "speed": 0.96, "language": "en-us", "gap": 0.4, "prosody": True, "chain": True, "model": "fp32"},
    "music": {"key": "A", "tempo": 70},
    "mix": {"duck_db": 20, "tp_oversample": True},
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
