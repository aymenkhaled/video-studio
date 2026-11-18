"""Source of timeline.json (voice-first script). Edit here, run `python build_timeline.py`, commit both.

Scale & Science 003 "The Biggest Living Thing Isn't a Whale". Facts: docs/research/B003-facts.md, rows in sources.md.
Spoken numbers are words (TTS); captions turn them into numerals. Never put two number words next to each other
(LESSONS B001 #8). No "point" decimals (C001 #3): decimals are shown on screen, narration rounds with "about".
Wording rules from the fact pack: the seagrass clone SPANS 180 km in fragmented meadows (never "a 180 km plant/blade");
200 km² is an estimated meadow area; 4,500 years is a model maximum; Pando age = 2026 study, evidence "incomplete".
"""
import json
from pathlib import Path

S = []


def sc(id, lines, music=None, amb=None, sfx=None, **kw):
    d = {"id": id, "lines": lines}
    if music:
        d["music"] = music
    if amb:
        d["ambience"] = {"type": amb, "gain": 0.26}
    if sfx:
        d["sfx"] = [dict(type=t, at=a, duration=du, gain=g) for t, a, du, g in sfx]
    d.update(kw)
    S.append(d)


W = ("whoosh", 0.1, 0.8, 0.35)
PAGE = [("page", 0.2, 0.4, 0.5)]
RISER = ("riser", 0.4, 3.0, 0.22)
HIT = ("impact", 2.0, 1.0, 0.3)

# ---------- hook: promise (≤ 7 s), twist, second hook ----------
sc("h1", ["This is one single plant.", "Its meadows stretch across more than one hundred eighty kilometres of seabed in Western Australia."], "tension", "sea", [RISER], lead=0.3)
sc("h2", ["And this is a blue whale, the biggest animal that has ever lived, at the same scale.", "You can barely see it."], "reveal", "sea", [W])
sc("h3", ["Most people think the biggest living thing on Earth is a whale, or a giant tree.", "It isn't even close."], "tension", None)
sc("h4", ["So how can one plant cover an area about twice the size of Paris?", "Is it really one living thing? And what else out there is bigger than a whale?"], "build", None, [("riser", 0.5, 3.0, 0.2)])
sc("h5", ["By the end of this video, you will see the biggest living things on Earth side by side, on real satellite images, to scale."], "reveal", None, [W])

# ---------- 1 the biggest animal ----------
sc("c1", ["Chapter one. The biggest animal."], "wonder", "sea", PAGE, min=4.5)
sc("c1b", ["Let's start with the champion everyone knows.", "An adult blue whale is usually twenty to thirty metres long."], "wonder", "sea")
sc("c1c", ["The biggest are longer than two city buses parked end to end.", "The heaviest one ever recorded was estimated at about one hundred ninety tonnes."], "build", "sea", [HIT])
sc("c1d", ["In our first video, we lined it up against megalodon and the giant dinosaurs.", "The whale still won."], "wonder", "sea")
sc("c1e", ["But it is not the longest animal."], "tension", "sea", [("riser", 0.2, 2.0, 0.18)])
sc("c1f", ["In April twenty twenty, off Ningaloo in Western Australia, researchers filmed a siphonophore coiled in a giant spiral,", "deep below the surface."], "wonder", "sea")
sc("c1g", ["Its outer ring was estimated at about forty-seven metres.", "Longer than the blue whale."], "reveal", "sea", [W])
sc("c1h", ["And it isn't one animal in the usual sense.", "It's a colony of many small bodies, joined together, each with its own job: catching food, swimming, or reproducing."], "wonder", "sea")
sc("c1i", ["So what counts as one living thing?", "Keep that question in mind. It's going to matter."], "tension", None)
sc("c1r", ["So far: the blue whale is the heaviest animal, but a colony animal can be longer.", "Can anything alive get much bigger?"], "tension", None, PAGE)

# ---------- 2 the giant trees ----------
sc("c2", ["Chapter two. The giant trees."], "wonder", "wind", PAGE, min=4.5)
sc("c2b", ["On land, the giants are trees.", "Hyperion, a coast redwood in California, was measured at about one hundred sixteen metres tall."], "build", "wind", [W])
sc("c2c", ["Stand a thirty-metre whale on its tail next to it,", "and the tree is almost four times taller."], "reveal", "wind")
sc("c2d", ["But height isn't everything.", "The biggest single tree by volume is General Sherman, a giant sequoia, also in California."], "wonder", "wind")
sc("c2e", ["Its trunk alone is estimated to hold almost fifteen hundred cubic metres of wood.", "That's about eight times the volume of the heaviest blue whale ever recorded."], "reveal", "wind", [HIT])
sc("c2f", ["Yet even these are single trees.", "What if one living thing could be a whole forest?"], "tension", "wind")
sc("c2r", ["So far: trees beat the whale on height and on volume.", "But could one living thing be a whole forest?"], "tension", None, PAGE)

# ---------- 3 the forest that is one tree ----------
sc("c3", ["Chapter three. The forest that is one tree."], "wonder", "wind", PAGE, min=4.5)
sc("c3b", ["In the mountains of Utah stands Pando, a grove of quaking aspen.", "From the air, it looks like an ordinary forest."], "wonder", "wind")
sc("c3c", ["But every trunk grew from the same roots.", "Genetically, its forty-seven thousand or so stems are copies of one single individual."], "reveal", "wind", [W])
sc("c3d", ["Scientists call each trunk a ramet, and the whole clone a genet:", "one individual, many bodies."], "wonder", "wind")
sc("c3e", ["Pando covers about forty-three hectares.", "That's around sixty football pitches."], "build", "wind", [W])
sc("c3e2", ["At its widest, the clone is about two kilometres across.", "Walking from one side to the other would take you around twenty-five minutes, and every tree you pass is the same individual."], "wonder", "wind")
sc("c3f", ["Its total weight has been estimated at about six thousand tonnes.", "More than thirty of the heaviest blue whales."], "reveal", "wind", [HIT])
sc("c3g", ["And it may be ancient. A study published in twenty twenty-six estimates Pando is at least twelve thousand years old.", "Other scientists say that evidence is still incomplete."], "wonder", "wind")
sc("c3h", ["Today, Pando is struggling: deer and cattle eat the young shoots", "before they can replace the old trunks."], "somber", "wind")
sc("c3r", ["So far: a whole forest can be one living thing.", "But what if most of a giant is hidden underground?"], "tension", None, PAGE)

# ---------- 4 the humongous fungus ----------
sc("c4", ["Chapter four. The humongous fungus."], "tension", "wind", PAGE, min=4.5)
sc("c4b", ["In the Blue Mountains of Oregon, in the Malheur National Forest,", "trees were dying in patches."], "tension", "wind")
sc("c4c", ["The killer was a honey fungus.", "In autumn, you can see its golden mushrooms at the foot of the trees."], "tension", "wind")
sc("c4d", ["But the mushrooms are only the fruit.", "The fungus itself is a web of dark, root-like strands, under the bark and in the soil."], "build", "wind")
sc("c4d2", ["Those strands are called rhizomorphs. They creep through the soil from root to root,", "and the fungus slowly feeds on the trees it infects."], "tension", "wind")
sc("c4e", ["Scientists sampled it across the forest and tested its DNA.", "One single individual had spread across about nine hundred sixty-five hectares."], "reveal", "wind", [W, HIT])
sc("c4f", ["That's almost ten square kilometres.", "More than twenty times the size of Pando."], "reveal", "wind")
sc("c4g", ["From how fast it spreads, they estimated it is at least nineteen hundred years old,", "and possibly more than eight thousand."], "wonder", "wind")
sc("c4h", ["For years, it was called the largest organism on Earth."], "wonder", "wind")
sc("c4i", ["Notice the pattern. At every step, the giant got harder to see.", "And the biggest one of all is hiding underwater."], "build", "sea", [("riser", 0.5, 3.0, 0.22)])
sc("c4r", ["So far: a single fungus covers almost ten square kilometres.", "So what could be bigger, under the sea?"], "tension", None, PAGE)

# ---------- 5 the plant that spans 180 km ----------
sc("c5", ["Chapter five. One plant, one hundred eighty kilometres."], "wonder", "sea", PAGE, min=4.5)
sc("c5b", ["Shark Bay, on the coast of Western Australia.", "A shallow, sheltered bay at the edge of the desert, full of underwater meadows."], "wonder", "sea")
sc("c5c", ["These meadows are seagrass. Not seaweed:", "a flowering plant, with roots, leaves and flowers, that lives under the sea."], "wonder", "sea")
sc("c5d", ["One species here is called Poseidon's ribbon weed.", "Scientists sampled ten of its meadows across the bay, to see how genetically different they were."], "build", "sea")
sc("c5e", ["They expected many different plants.", "Instead, all but one of those meadows turned out to be the same plant. One clone."], "reveal", "sea", [W, HIT])
sc("c5f", ["From one end to the other, it spans at least one hundred eighty kilometres.", "The researchers called it the most widespread known clone on Earth."], "reveal", "sea", [W])
sc("c5f2", ["To picture that distance: driving it on a motorway would take you almost two hours."], "wonder", "sea")
sc("c5g", ["Its meadows were estimated to cover about two hundred square kilometres.", "That's roughly twice the size of Paris."], "reveal", "sea", [HIT])
sc("c5h", ["And it is old. From how fast this seagrass grows,", "the researchers estimated it took up to about four thousand five hundred years to spread this far."], "wonder", "sea")
sc("c5i", ["If that's right, it started growing around the time the first great pyramids were built in Egypt."], "wonder", "sea")
sc("c5j", ["How did it get so big? Its cells carry four sets of chromosomes instead of two.", "Forty, where its relatives have twenty."], "build", "sea")
sc("c5k", ["The researchers think it began when two kinds of seagrass crossed,", "and that the doubled genome helped it cope with the bay's salty, hot water."], "build", "sea")
sc("c5l", ["It seems to set little or no seed. Instead, it grows sideways,", "between fifteen and thirty-five centimetres a year, shoot by shoot, for thousands of years."], "wonder", "sea")
sc("c5m", ["Now let's put them all on one map, to scale.", "A blue whale. A football pitch. Pando."], "reveal", "sea", [W, ("riser", 2.0, 4.0, 0.2)], min=9)
sc("c5m2", ["The honey fungus.", "And the Shark Bay seagrass, spanning more than one hundred eighty kilometres."], "reveal", "sea", [W, HIT], min=9)
sc("c5r", ["So far: one seagrass clone spans at least one hundred eighty kilometres.", "So is it the biggest living thing on Earth?"], "tension", None, PAGE)

# ---------- 6 so which is the biggest? ----------
sc("c6", ["Chapter six. So which is the biggest?"], "tension", None, PAGE, min=4.5)
sc("c6b", ["Here's the twist. In the Baltic Sea, in Northern Europe,", "scientists found one seaweed clone at six sites spread along more than six hundred kilometres of coastline."], "tension", "sea", [W])
sc("c6c", ["That's a longer spread than the seagrass.", "But nobody has measured how much area it covers. Spread is not the same as size."], "build", "sea")
sc("c6d", ["So the answer depends on how you measure.", "Tallest: a redwood. Heaviest animal: the blue whale. Largest known area: the Shark Bay seagrass."], "reveal", None, [("tick", 2.5, 0.2, 0.3), ("tick", 4.5, 0.2, 0.3), ("tick", 7.0, 0.2, 0.3)])
sc("c6c2", ["Remember the question from chapter one: what counts as one living thing?", "Biologists say: everything that grew from one first seed is one individual, even in separate pieces."], "wonder", None)
sc("c6e", ["And none of these giants is safe.", "After a marine heatwave in early twenty eleven, more than a thousand square kilometres of seagrass disappeared from Shark Bay."], "somber", "sea")
sc("c6e2", ["The giant clone was hit too.", "Some of its meadows have since grown back, but nobody knows how many more heatwaves it can survive."], "somber", "sea")
sc("c6f", ["So here's my question: is a clone, spread over one hundred eighty kilometres, really one living thing?", "Tell me in the comments."], "wonder", "sea")
sc("end", ["Want to see the blue whale against every giant that ever lived? Watch this next."], "wonder", "sea", min=20, endscreen=True)

tl = {
    "id": "003-biggest-living-thing", "comp": "BiggestLivingThing", "title": "The Biggest Living Thing Isn't a Whale", "fps": 24, "seed": 303,
    "voice": {"engine": "kokoro", "voice": "bm_george", "speed": 0.96, "language": "en-gb", "gap": 0.4, "prosody": True, "chain": True, "model": "fp32"},
    "music": {"key": "E", "tempo": 64}, "mix": {"duck_db": 20, "tp_oversample": True}, "ambience": {"type": "air", "gain": 0.07}, "scenes": S,
}
Path(__file__).with_name("timeline.json").write_text(json.dumps(tl, indent=1, ensure_ascii=False), encoding="utf8")
print(len(S), "scenes")
