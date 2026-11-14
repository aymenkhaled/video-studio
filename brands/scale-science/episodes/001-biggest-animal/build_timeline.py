"""Source of timeline.json (voice-first script). Edit here, run `python build_timeline.py`, commit both.

Spoken numbers are written as words for the TTS; captions turn them back into numerals (clarity-logic numeralize).
"""
import json
from pathlib import Path

S = []


def sc(id, lines, music=None, amb=None, sfx=None, **kw):
    d = {"id": id, "lines": lines}
    if music:
        d["music"] = music
    if amb:
        d["ambience"] = {"type": amb, "gain": 0.3 if amb == "ocean" else 0.22}
    if sfx:
        d["sfx"] = [dict(type=t, at=a, duration=du, gain=g) for t, a, du, g in sfx]
    d.update(kw)
    S.append(d)


W = ("whoosh", 0.1, 0.8, 0.35)
PAGE = [("page", 0.2, 0.4, 0.5)]
# ---------- cold open ----------
sc("o1", ["This is a blue whale, the biggest animal alive today.", "The largest ones can grow to about thirty-three metres. That is one hundred ten feet."], "wonder", "ocean", [("whale", 1.0, 4.0, 0.35)], lead=0.4)
sc("o2", ["Imagine you are swimming right next to one.", "You would need about nineteen people, lying head to toe, to match its length."], "wonder", "ocean", [("bubbles", 0.5, 2.0, 0.3)])
sc("o3", ["It is longer than two city buses parked end to end,", "and longer than a basketball court."], "wonder", "ocean", [W])
sc("o4", ["But is it the biggest animal that has ever lived?", "Three giants from the past have challenged it."], "tension", "ocean", [("riser", 0.5, 3.0, 0.25)])
sc("o5", ["A monster shark. Dinosaurs that may have been even longer.", "And a fossil whale from Peru that scientists once thought was even heavier."], "tension", None, [("impact", 0.3, 1.2, 0.35)])
sc("o6", ["Today we measure every one of them, side by side,", "next to a person and a bus, to find the true champion."], "reveal", None, [W])
# ---------- 1 blue whale ----------
sc("c1", ["Chapter one. The blue whale."], "wonder", "ocean", PAGE, min=4.5)
sc("c1b", ["Blue whales live in every ocean on Earth.", "They are mammals, like us. They breathe air, and they feed their babies milk."], "wonder", "ocean")
sc("c1c", ["Let's measure. On our grid, each line is one metre.", "Here is a person, one point seven five metres tall. And a city bus, twelve metres long."], "wonder", "ocean", [("tick", 2.0, 0.2, 0.4), ("tick", 5.0, 0.2, 0.4)])
sc("c1d", ["And here is the blue whale.", "The very largest, in the cold seas around Antarctica, reach about thirty-three metres. Most are a bit smaller."], "reveal", "ocean", [("whale", 0.8, 3.5, 0.3)])
sc("c1b2", ["Blue whales may live for eighty to ninety years.", "And they are not monsters. They eat almost nothing but tiny animals."], "wonder", "ocean", [("whale", 1.5, 3.0, 0.25)])
sc("c1e", ["But length is only half the story.", "To know who is truly biggest, we also have to weigh them."], "wonder", None, [W])
sc("c1e2", ["We measure weight in tonnes. One tonne is one thousand kilograms.", "An adult male African elephant weighs about six tonnes."], "wonder", None, [("tick", 1.0, 0.2, 0.4)])
sc("c1f", ["The largest blue whales can weigh about one hundred fifty tonnes.", "That is roughly as heavy as twenty-five adult male African elephants."], "reveal", None, [("counter", 1.0, 2.5, 0.3)])
sc("c1g", ["How does an animal get that heavy?", "By eating some of the smallest animals in the sea: krill."], "wonder", "ocean", [("bubbles", 1.0, 2.0, 0.3)])
sc("c1g2", ["Krill are small, shrimp-like animals, up to about six centimetres long.", "Alone they are tiny. But they gather in huge swarms, and that is a feast."], "wonder", "ocean", [("bubbles", 0.5, 2.0, 0.3)])
sc("c1h", ["A blue whale takes a giant gulp of water full of krill.", "Then it pushes the water out through bristly plates called baleen, and swallows the food."], "wonder", "ocean", [("bubbles", 0.4, 3.0, 0.35)])
sc("c1i", ["The biggest blue whales may eat up to six tons of krill in a single day,", "about the weight of a large elephant, every day."], "wonder", None, [("counter", 0.8, 2.0, 0.3)])
sc("c1r", ["So far: the blue whale can reach thirty-three metres and one hundred fifty tonnes.", "But twenty million years ago, something with much bigger teeth ruled the sea."], "tension", None, PAGE)
# ---------- 2 megalodon ----------
sc("c2", ["Chapter two. Megalodon."], "tension", None, PAGE, min=4.5)
sc("c2b", ["Megalodon was a giant shark.", "It lived from about twenty-three million years ago until about three point six million years ago."], "tension")
sc("c2c", ["To feel how long ago that is:", "people like us have existed for only about three hundred thousand years. Megalodon vanished more than ten times earlier."], "tension")
sc("c2d", ["We know megalodon mostly from its teeth.", "A shark's skeleton is made of cartilage, the bendy material in your ears and nose, and it rarely becomes a fossil."], "tension", "ocean")
sc("c2e", ["The largest megalodon teeth are about eighteen centimetres long, roughly the length of a hand.", "This jaw is a modern model, sized from teeth like these."], "tension", "ocean")
sc("c2e2", ["Megalodon was a hunter.", "One study suggests an adult could eat prey as large as a killer whale."], "tension", "ocean")
sc("c2f", ["Now, the size. Here is a great white shark, the biggest hunting shark alive today.", "It reaches about six metres."], "tension", "ocean", [("bubbles", 0.5, 1.5, 0.25)])
sc("c2g", ["Megalodon estimates range from about sixteen metres to as much as twenty-four.", "Scientists still argue, because only teeth and a few backbones survive."], "build", "ocean", [("riser", 0.3, 2.5, 0.22)])
sc("c2g2", ["The best clue is a row of megalodon backbones found in Belgium, about eleven metres long.", "But the head and the tail are missing, so scientists must estimate them."], "build", "ocean")
sc("c2g3", ["Some scientists think megalodon was chunky, like a great white.", "Others think it was slimmer and longer, more like a lemon shark."], "build", "ocean")
sc("c2h", ["Even at its largest estimate, megalodon was shorter than the biggest blue whales."], "reveal", "ocean", [W])
sc("c2i", ["And it was lighter. A sixteen-metre megalodon may have weighed about sixty tonnes.", "Even a twenty-four-metre one was probably under one hundred."], "reveal", None, [("counter", 1.0, 2.0, 0.3)])
sc("c2r", ["So far: megalodon was a true giant, but shorter and lighter than the biggest blue whales.", "On land, though, some animals grew even longer."], "tension", None, PAGE)
# ---------- 3 sauropods ----------
sc("c3", ["Chapter three. Titans on land."], "build", "land", PAGE, min=4.5)
sc("c3b", ["These are sauropods: plant-eating dinosaurs with long necks and long tails, walking on four legs.", "This one is Apatosaurus."], "build", "land", [("footstep", 1.0, 0.6, 0.6)])
sc("c3c", ["Apatosaurus was about twenty-two metres long, nearly two buses.", "And it was not even one of the biggest."], "build", "land")
sc("c3d", ["The true giants came later, in what is now Argentina,", "about one hundred million years ago, in the Cretaceous period."], "build")
sc("c3d2", ["The Cretaceous was the last period of the dinosaurs.", "It ended sixty-six million years ago, when a huge asteroid hit the Earth."], "build")
sc("c3e", ["Meet Argentinosaurus. This skeleton is a full-size cast, a copy.", "It was rebuilt from just a handful of real bones: some backbones, ribs and a leg bone."], "wonder", "land")
sc("c3f", ["Because so few bones survive, its length is uncertain: about thirty to thirty-five metres.", "That may match, or even beat, the blue whale."], "reveal", "land", [("riser", 0.3, 2.5, 0.22)])
sc("c3g", ["Its relative Patagotitan was first estimated at thirty-seven metres.", "Later studies shrank it to about thirty-one."], "wonder", "land")
sc("c3h", ["But on the scale, the dinosaurs lose.", "Most estimates put them between about fifty and ninety-six tonnes, well below a big blue whale."], "reveal", None, [("counter", 1.0, 2.0, 0.3)])
sc("c3i", ["Why not heavier? On land, every kilogram must be carried by legs.", "Sauropods had pillar-like legs and bones filled with air pockets. But gravity still sets a limit."], "wonder", "land", [("footstep", 0.5, 0.6, 0.5), ("footstep", 2.0, 0.6, 0.5)])
sc("c3r", ["So far: the longest dinosaurs may have matched the blue whale for length, but weighed far less.", "Then, in twenty twenty-three, a fossil whale claimed the crown."], "tension", None, PAGE)
# ---------- 4 challengers ----------
sc("c4", ["Chapter four. The challengers."], "tension", None, PAGE, min=4.5)
sc("c4b", ["In twenty twenty-three, scientists described Perucetus colossus,", "an ancient whale that lived about thirty-nine million years ago, in what is now Peru."], "tension")
sc("c4c", ["Its bones were incredibly thick and heavy.", "From them, the team estimated a weight of eighty-five to three hundred forty tonnes."], "tension", "ocean", [("impact", 1.0, 1.2, 0.3)])
sc("c4c2", ["Only a few of its bones have been found: thirteen backbones, four ribs and part of a hip.", "No skull. So its shape and size are partly a guess."], "tension", "ocean")
sc("c4d", ["In the middle of that range, it would beat the largest blue whale.", "Headlines called it a contender for the heaviest animal ever."], "build", None, [("riser", 0.3, 2.5, 0.22)])
sc("c4e", ["But a year later, two other scientists checked the math again.", "Heavy bones, they argued, do not mean a heavy body. Their estimate: sixty to one hundred fourteen tonnes."], "reveal", None, [("counter", 1.5, 2.0, 0.3)])
sc("c4f", ["Huge, but lighter than the biggest blue whales.", "The crown stayed where it was."], "reveal", "ocean")
sc("c4g", ["One more challenger. In England, a girl and her father found pieces of a giant jawbone on a beach.", "It belonged to Ichthyotitan, a sea reptile from two hundred two million years ago."], "wonder", "ocean")
sc("c4g2", ["Ichthyosaurs were sea reptiles shaped a bit like dolphins.", "They breathed air, but they never came onto land."], "wonder", "ocean")
sc("c4h", ["From two jawbones, scientists estimate it was up to about twenty-five metres long.", "With so few bones, nobody knows its weight. And it still falls short of the blue whale."], "wonder", "ocean", [("bubbles", 0.5, 1.5, 0.25)])
sc("c4r", ["So far: no fossil challenger has beaten the blue whale on weight.", "So why is the biggest animal ever alive right now, and not in the past?"], "tension", None, PAGE)
# ---------- 5 why now ----------
sc("c5", ["Chapter five. Why now?"], "wonder", "ocean", PAGE, min=4.5)
sc("c5b", ["First, water. In the sea, water pushes up on a body and supports its weight.", "So a whale does not need legs to carry one hundred fifty tonnes."], "wonder", "ocean", [("bubbles", 0.5, 2.0, 0.3)])
sc("c5c", ["Second, food. About three million years ago, ocean currents changed.", "Cold water rising from the deep fed huge, packed swarms of krill in some seasons."], "wonder")
sc("c5d", ["Bigger whales could swim farther between these feasts, and take in more food with every gulp.", "Over time, whales grew into giants."], "build", "ocean", [("whale", 1.0, 3.0, 0.25)])
sc("c5d2", ["Could whales grow even bigger one day?", "Studies of feeding whales suggest the biggest are close to the limit of how much food they can gather."], "wonder", "ocean")
sc("c5e", ["So the giant whales are recent.", "For most of their history, baleen whales were much smaller."], "wonder")
sc("c5f", ["Which means something surprising.", "You live at the same time as the biggest animal that has ever lived. Not in the past. Right now."], "reveal", "ocean", [("whale", 2.0, 3.5, 0.3)])
sc("c5g", ["But in the last century, whalers hunted blue whales almost to extinction.", "Today they are protected, and slowly coming back."], "tension", "ocean")
sc("c5r", ["So far: water carries the whale's weight, and seasonal krill feasts feed it.", "Now, let's put every giant side by side."], "wonder", None, PAGE)
# ---------- 6 final ----------
sc("c6", ["Chapter six. The final line-up."], "build", None, PAGE, min=4.5)
sc("c6b", ["Here they all are, to the same scale.", "A person. A bus. A great white shark. Megalodon. Ichthyotitan. Perucetus."], "build", "ocean", [W])
sc("c6c", ["And on land, Argentinosaurus.", "Some may have been as long as the blue whale. As far as we know, none was as heavy."], "reveal", "land")
sc("c6c2", ["On length, it is close. Argentinosaurus, maybe thirty-five metres. The blue whale, about thirty-three.", "Patagotitan, about thirty-one. Ichthyotitan, up to twenty-five. Megalodon, up to twenty-four."], "build", None, [("tick", 1.0, 0.2, 0.4), ("tick", 4.0, 0.2, 0.4)])
sc("c6d", ["On the scale: the blue whale, up to about one hundred fifty tonnes.", "Every challenger lands below it."], "reveal", None, [("counter", 0.8, 2.0, 0.3)])
sc("c6e", ["The biggest animal that has ever lived is alive today: the blue whale.", "But fossils keep surprising us. One new bone could change this ranking."], "wonder", "ocean", [("whale", 1.5, 4.0, 0.35)])
sc("c6f", ["So here is my question for you:", "which of these giants would you most like to see alive, up close? Tell me in the comments."], "wonder", "ocean")
sc("end", ["Next: the deadliest animals on Earth, ranked by how many people they really kill."], "wonder", "ocean", min=20, endscreen=True)

tl = {
    "id": "001-biggest-animal", "comp": "BiggestAnimal", "title": "How Big Was the Biggest Animal Ever?", "fps": 24, "seed": 33,
    "voice": {"engine": "kokoro", "voice": "bm_george", "speed": 0.95, "language": "en-gb", "gap": 0.42},
    "music": {"key": "C", "tempo": 66}, "ambience": {"type": "air", "gain": 0.08}, "scenes": S,
}
Path(__file__).with_name("timeline.json").write_text(json.dumps(tl, indent=1, ensure_ascii=False), encoding="utf8")
print(len(S), "scenes")
