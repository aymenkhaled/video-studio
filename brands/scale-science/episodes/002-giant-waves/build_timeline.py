"""Source of timeline.json (voice-first script). Edit here, run `python build_timeline.py`, commit both.

Spoken numbers are words (TTS); captions turn them into numerals. Never put two number words next to each other
(LESSONS B001 #8) — times/dates that would merge are shown on screen instead of spoken.
"""
import json
from pathlib import Path

S = []


def sc(id, lines, music=None, amb=None, sfx=None, **kw):
    d = {"id": id, "lines": lines}
    if music:
        d["music"] = music
    if amb:
        d["ambience"] = {"type": amb, "gain": 0.28}
    if sfx:
        d["sfx"] = [dict(type=t, at=a, duration=du, gain=g) for t, a, du, g in sfx]
    d.update(kw)
    S.append(d)


W = ("whoosh", 0.1, 0.8, 0.35)
PAGE = [("page", 0.2, 0.4, 0.5)]
RUMBLE = ("rumble", 0.3, 3.0, 0.5)
SURGE = ("waves", 0.5, 4.0, 0.5)

# ---------- hook: promise (≤ 7 s), twist, second hook ----------
sc("h1", ["Last August, a wave in Alaska climbed four hundred eighty-one metres up a mountain.", "That is higher than the Empire State Building."], "tension", "sea", [SURGE], lead=0.3)
sc("h2", ["And almost nobody saw it.", "It struck early in the morning, in a fjord where cruise ships carry thousands of people on summer days."], "tension", "sea")
sc("h3", ["How can water rise higher than a skyscraper? Was this the tallest wave ever measured?", "And could it happen again, with a ship full of people in the way?"], "build", None, [("riser", 0.5, 3.0, 0.22)])
sc("h4", ["By the end of this video, you will see every giant wave ever measured, side by side, to scale."], "reveal", None, [W])
sc("h5", ["This is Tracy Arm, a fjord in southeast Alaska,", "about one hundred thirty kilometres from the city of Juneau."], "wonder", "wind")

# ---------- 1 the empty morning ----------
sc("c1", ["Chapter one. The empty morning."], "wonder", "wind", PAGE, min=4.5)
sc("c1b", ["At the end of the fjord sits the South Sawyer Glacier.", "For years it had been melting back. And in early August, it suddenly retreated faster."], "wonder", "wind")
sc("c1c", ["That ice had been holding up the mountainside above it, like a wall holding back a pile of sand.", "When the ice pulled away, the slope lost its support."], "tension", "wind")
sc("c1d", ["The mountain gave warnings. For days, seismometers picked up tiny tremors.", "In the last hours, they came every thirty to sixty seconds."], "tension", None, [("tick", 2.0, 0.2, 0.35), ("tick", 3.0, 0.2, 0.35), ("tick", 4.0, 0.2, 0.35)])
sc("c1d2", ["About two hours before the collapse, the tremors merged into one continuous vibration.", "The slope was already sliding."], "tension", None, [("rumble", 0.5, 4.0, 0.25)])
sc("c1e", ["Then, on the morning of the tenth of August, the slope collapsed.", "About sixty-four million cubic metres of rock fell into the water."], "build", None, [RUMBLE, ("impact", 2.5, 1.2, 0.45)])
sc("c1f", ["That is a cube of rock about four hundred metres on each side,", "dropped into the fjord like a giant stone thrown into a bathtub."], "build", "sea", [("impact", 1.0, 1.2, 0.35)])
sc("c1g", ["Computer models show a breaking wave about one hundred metres tall,", "racing at more than two hundred forty kilometres per hour."], "build", "sea", [SURGE, W])
sc("c1g2", ["That is roughly as tall as a thirty-storey building, moving twice as fast as a car on a motorway."], "build", "sea", [W])
sc("c1h", ["That first wave alone was taller than the Statue of Liberty."], "reveal", "sea", [SURGE])
sc("c1i", ["When it hit the far side of the fjord, the water kept climbing up the mountain.", "Scientists call this the run-up: the highest point the water reaches on land."], "tension", "sea", [SURGE])
sc("c1j", ["Here, it climbed to four hundred eighty-one metres, stripping the forest off the slope.", "You can still see the line where the trees end."], "reveal", "wind")
sc("c1k", ["Put the Statue of Liberty, the Eiffel Tower and the Empire State Building side by side.", "The water went higher than all three."], "reveal", "sea", [SURGE])
sc("c1l", ["Kayakers camping near the mouth of the fjord had their gear swept away.", "Even far away in Juneau, the sea level jumped by thirty-six centimetres."], "wonder", "sea")
sc("c1m", ["On a typical summer day, more than twenty boats, including large cruise ships, sail these fjords.", "That morning, by luck, none was in Tracy Arm."], "tension", "sea")
sc("c1n", ["Several cruise lines have since changed their routes to avoid the area."], "tension", "sea")
sc("c1r", ["So far: a melting glacier let a mountain fall into a fjord, and the water climbed four hundred eighty-one metres.", "But why don't ocean tsunamis get this tall?"], "tension", None, PAGE)

# ---------- 2 not a normal tsunami ----------
sc("c2", ["Chapter two. Not a normal tsunami."], "tension", None, PAGE, min=4.5)
sc("c2b", ["Most people picture a tsunami as a wave that crosses a whole ocean after an earthquake.", "Those waves are fast and powerful, but much lower."], "tension", "sea")
sc("c2c", ["For scale, the biggest wave ever surfed was about twenty-six metres, off Nazaré in Portugal."], "wonder", "sea", [SURGE])
sc("c2d", ["The highest run-up of the great tsunami in Japan, in twenty eleven, was about forty metres.", "A huge disaster, but still far below Tracy Arm."], "tension", "sea")
sc("c2d2", ["Forty metres is less than half the height of the Statue of Liberty."], "wonder", "sea")
sc("c2e", ["Fjord waves are different. They start with one gigantic splash in deep, narrow water.", "The energy has almost nowhere to spread, so the water surges up the opposite wall."], "build", "sea", [SURGE])
sc("c2e2", ["Think of dropping a brick into a bathtub. The splash hits the side and climbs the wall.", "Now make the brick a piece of a mountain."], "build", None, [("impact", 0.8, 1.0, 0.3)])
sc("c2f", ["So the tallest waves on Earth don't happen on open ocean coasts.", "They happen in quiet, narrow fjords."], "reveal", "wind")
sc("c2r", ["So far: the tallest waves are splash waves in fjords, not ocean tsunamis.", "And Tracy Arm is not the only one."], "tension", None, PAGE)

# ---------- 3 the ladder of giants ----------
sc("c3", ["Chapter three. The ladder of giants."], "build", None, PAGE, min=4.5)
sc("c3b", ["Twenty fifteen. Taan Fiord, Alaska.", "A slope weakened by a shrinking glacier slid into the water, with nobody watching."], "tension", "wind", [RUMBLE])
sc("c3c", ["Scientists only found out from seismometers and satellite photos.", "The water had climbed one hundred ninety-three metres."], "reveal", "wind")
sc("c3d", ["That is about twice the height of the Statue of Liberty."], "reveal", "sea", [SURGE])
sc("c3e", ["Twenty twenty-three. Dickson Fjord, in eastern Greenland.", "Twenty-five million cubic metres of rock and ice crashed into the water."], "tension", "wind", [RUMBLE])
sc("c3f", ["The wave reached about two hundred metres. Then something stranger happened.", "The water kept sloshing from side to side, like water in a bathtub."], "build", "sea", [SURGE])
sc("c3g", ["For nine days, seismometers all over the world recorded a strange, regular signal.", "Nobody knew what it was, until scientists traced it to this fjord."], "wonder", None, [("tick", 1.0, 0.2, 0.3), ("tick", 2.5, 0.2, 0.3), ("tick", 4.0, 0.2, 0.3)])
sc("c3h", ["Nineteen eighty. When Mount Saint Helens erupted, a huge landslide crashed into Spirit Lake.", "The water surged about two hundred sixty-five metres up the hills."], "tension", "wind", [RUMBLE])
sc("c3i", ["All of these are enormous. But none of them reaches the top of the Eiffel Tower.", "Only two waves in recorded history have gone higher."], "build", "sea")
sc("c3r", ["So far: Taan Fiord, Greenland and Spirit Lake all passed one hundred ninety metres.", "So which wave holds the record?"], "tension", None, PAGE)

# ---------- 4 the record ----------
sc("c4", ["Chapter four. The record."], "tension", None, PAGE, min=4.5)
sc("c4b", ["Nineteen fifty-eight. Lituya Bay, another narrow bay on the coast of Alaska."], "tension", "wind")
sc("c4c", ["A powerful earthquake shook loose about thirty million cubic metres of rock,", "which fell from high above the water."], "build", None, [RUMBLE, ("impact", 2.0, 1.2, 0.4)])
sc("c4d", ["That evening, Howard Ulrich and his seven-year-old son were anchored in their fishing boat, the Edrie."], "tension", "sea")
sc("c4e", ["They saw a wall of water rushing toward them. The boat was lifted onto the wave.", "And somehow, both of them survived."], "build", "sea", [SURGE])
sc("c4e2", ["Ulrich later estimated that the wave passing his boat was up to thirty metres high, and that was out in the middle of the bay."], "tension", "sea")
sc("c4f", ["Afterwards, geologist Don Miller measured the line where the forest had been torn away.", "It reached five hundred twenty-four metres."], "reveal", "wind")
sc("c4f2", ["Along that line, trees were ripped out by their roots or stripped of their bark."], "wonder", "wind")
sc("c4g", ["Higher than the Empire State Building. Higher than Tracy Arm.", "It is the tallest wave run-up ever recorded."], "reveal", "sea", [SURGE, ("impact", 3.0, 1.0, 0.3)])
sc("c4r", ["So far: the record is Lituya Bay, five hundred twenty-four metres, and Tracy Arm is second.", "So will there be more?"], "tension", None, PAGE)

# ---------- 5 why there will be more ----------
sc("c5", ["Chapter five. Why there will be more."], "tension", None, PAGE, min=4.5)
sc("c5b", ["All these giants share one cause: steep slopes falling into deep water.", "And in Alaska and Greenland, melting glaciers are uncovering more of those slopes."], "tension", "wind")
sc("c5c", ["A study of Glacier Bay in Alaska found that rock avalanches there have been getting bigger in recent decades."], "tension", "wind")
sc("c5c2", ["In Greenland, scientists linked the Dickson Fjord slide to a glacier below it that had been thinning for decades."], "tension", "wind")
sc("c5d", ["Right now, scientists are watching a slope above Barry Arm, in Prince William Sound.", "It is creeping slowly toward the water."], "build", "wind")
sc("c5e", ["If it fell all at once, models warn of waves over two hundred metres near the slide,", "reaching the town of Whittier in about twenty minutes."], "build", "sea")
sc("c5f", ["The good news: Tracy Arm showed that these mountains can warn us first.", "Scientists say Alaska now needs to watch its slopes the way it already watches earthquakes and volcanoes."], "wonder", "wind")
sc("c5r", ["So far: shrinking glaciers mean more falling slopes, and more giant waves.", "Now, let's put every giant side by side."], "wonder", None, PAGE)

# ---------- 6 every giant wave, to scale ----------
sc("c6", ["Chapter six. Every giant wave, to scale."], "build", None, PAGE, min=4.5)
sc("c6b", ["Taan Fiord, one hundred ninety-three metres. Greenland, about two hundred.", "Spirit Lake, two hundred sixty-five."], "build", "sea", [SURGE])
sc("c6c", ["Tracy Arm, four hundred eighty-one.", "And the record, Lituya Bay, five hundred twenty-four metres."], "reveal", "sea", [SURGE, ("impact", 2.0, 1.0, 0.3)])
sc("c6d", ["For comparison: the Statue of Liberty is ninety-three metres tall.", "The Empire State Building reaches four hundred forty-three to the tip."], "wonder", None, [("tick", 1.0, 0.2, 0.3), ("tick", 4.0, 0.2, 0.3)])
sc("c6e", ["And even the record is less than two thirds of the Burj Khalifa, the tallest building on Earth."], "wonder", None)
sc("c6e2", ["So what would it take to send water to the top of the Burj?", "Nobody knows. And let's hope we never find out."], "wonder", None)
sc("c6f", ["So here is my question: knowing all this, would you still take a cruise into an Alaskan fjord?", "Tell me in the comments."], "wonder", "sea")
sc("end", ["Next: the biggest living thing on Earth is not a whale. It is a single plant, longer than a hundred kilometres."], "wonder", "sea", min=20, endscreen=True)

tl = {
    "id": "002-giant-waves", "comp": "GiantWaves", "title": "Every Giant Wave Ever Measured, Shown to Scale", "fps": 24, "seed": 202,
    "voice": {"engine": "kokoro", "voice": "bm_george", "speed": 0.95, "language": "en-gb", "gap": 0.42},
    "music": {"key": "D", "tempo": 62}, "ambience": {"type": "air", "gain": 0.08}, "scenes": S,
}
Path(__file__).with_name("timeline.json").write_text(json.dumps(tl, indent=1, ensure_ascii=False), encoding="utf8")
print(len(S), "scenes")
