"""Promo Shorts: one source of truth for the 12 vertical Shorts (2 per finished long video).

Writes, per Short, brands/<brand>/shorts/<slug>/timeline.json (voice-first narration for packages/audio/soundtrack.py)
and UPLOAD.md (title, description with long-video link placeholder + sources, hashtags, related video, schedule).
Visuals (shots, hook text) live in src/shorts/defs.tsx under the same comp id; scene ids are s1..sN in both.
Every number below is a line already reviewed for the long video (same sources.md rows); nothing new is claimed.

Run: python tools/build_shorts.py   (then: render.yml comp=<comp> timeline=brands/.../timeline.json)
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

VOICE = {  # same voice per channel as the long videos; fp32 Kokoro (int8 returns NaN on the 16 Nov runner image)
    "history-maps": {"engine": "kokoro", "voice": "am_michael", "speed": 1.0, "language": "en-us"},
    "scale-science": {"engine": "kokoro", "voice": "bm_george", "speed": 1.0, "language": "en-gb"},
    "money-maps": {"engine": "kokoro", "voice": "af_heart", "speed": 1.0, "language": "en-us"},
}
CHANNEL = {"history-maps": "History in Maps", "scale-science": "Scale & Science", "money-maps": "Money & Maps"}
MUSIC = {"history-maps": {"key": "D", "tempo": 84}, "scale-science": {"key": "E", "tempo": 84}, "money-maps": {"key": "D", "tempo": 84}}

LONG = {
    "A001": ("Hannibal: The Man Who Nearly Destroyed Rome", "uploaded 14 Nov 2026, https://youtu.be/DQ783JjY98Q"),
    "A002": ("Why Rome Destroyed Carthage", "uploaded, https://youtu.be/v7h91oBTKSc"),
    "B001": ("How Big Was the Biggest Animal Ever? (Blue Whale vs Megalodon vs Dinosaurs)", "uploaded 14 Nov 2026"),
    "B002": ("Every Giant Wave Ever Measured, Shown to Scale", "uploaded 16 Nov 2026"),
    "C001": ("Why Is Switzerland So Rich? (No Sea, No Oil, Mostly Mountains)", "uploaded 14 Nov 2026, https://youtu.be/WXPLXCk0KyM"),
    "C002": ("174,000 People Live in This Arctic City. No Road Leads There", "uploaded 16 Nov 2026, https://youtu.be/L-RbnEd-oR8"),
}


def S(lines, music="tension", sfx=None, lead=0.15, tail=0.35, min_=3.0):
    return {"lines": lines if isinstance(lines, list) else [lines], "music": music, "sfx": sfx or [], "lead": lead, "tail": tail, "min": min_}


W = lambda at=0.05, g=0.25: {"type": "whoosh", "at": at, "duration": 0.6, "gain": g}  # noqa: E731
POP = lambda at=0.5, g=0.22: {"type": "pop", "at": at, "duration": 0.3, "gain": g}  # noqa: E731
RISER = {"type": "riser", "at": 0.0, "duration": 2.5, "gain": 0.18}
END = "full story linked below"

SHORTS = [
    # ---------------- History in Maps ----------------
    dict(brand="history-maps", ep="A001", n=1, slug="a001-short-1-cannae", comp="ShortA001Cannae",
         title="Outnumbered 2 to 1, Hannibal Surrounded Rome's Army",
         alt=["How 40,000 Men Surrounded 80,000 at Cannae", "The Trap Military Schools Still Study (216 BC)"],
         tags=["#shorts", "#history", "#hannibal", "#ancientrome", "#maps"],
         scenes=[
             S("In two hundred sixteen B C, one man surrounded an army almost twice the size of his own.", "build", [RISER], lead=0.1),
             S("Polybius counts eighty thousand Roman infantry at Cannae. Hannibal had around forty thousand.", "tension", [W(), POP(1.5)]),
             S("So he did something strange. He pushed his center forward in a curve, and put his best troops at the ends of the line.", "tension", [W()]),
             S("The Romans smashed into the curve. It bent backward, step by step, exactly as planned.", "build", [{"type": "clash", "at": 0.4, "duration": 1.2, "gain": 0.2}]),
             S("Then the veterans turned inward, and his cavalry hit the Romans from behind. They were packed so tightly that many could not raise their weapons.", "build", [{"type": "hooves", "at": 0.6, "duration": 2.0, "gain": 0.22}]),
             S("Polybius says around seventy thousand Romans died. Hannibal lost under six thousand.", "reveal", [POP(0.8)]),
             S("Military schools still study this battle today. The full story of the man who nearly destroyed Rome is linked below.", "somber", [W()]),
         ],
         sources=["Polybius, Histories 3.113–117 (Loeb, LacusCurtius): https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Polybius/3*.html",
                  "Livy 22.49 (Roman dead ~50,000; figures disputed)", "Britannica, Battle of Cannae: https://www.britannica.com/event/Battle-of-Cannae"]),
    dict(brand="history-maps", ep="A001", n=2, slug="a001-short-2-alps", comp="ShortA001Alps",
         title="Hannibal Lost Half His Army Before the First Battle",
         alt=["37 War Elephants Over the Alps. What Was Left?", "He Crossed the Alps in Winter. Then the Numbers Came In"],
         tags=["#shorts", "#history", "#hannibal", "#alps", "#maps"],
         scenes=[
             S("Hannibal marched an army, and thirty-seven war elephants, from Spain to Italy. Over the Alps.", "build", [RISER], lead=0.1),
             S("Polybius says he set out with about ninety thousand infantry, and twelve thousand cavalry. Historians think that is inflated.", "tension", [W(), POP(1.2)]),
             S("At the river Rhone, his men floated the elephants across on rafts covered with earth.", "wonder", [W(), {"type": "elephant", "at": 1.5, "duration": 1.5, "gain": 0.16}]),
             S("Then came the Alps, late in the year. Snow on the passes. Ambushes from mountain tribes. Men and animals slid off icy paths.", "somber", [{"type": "wind", "at": 0.0, "duration": 6.0, "gain": 0.2}]),
             S("Polybius quotes Hannibal's own inscription for what was left: twenty thousand infantry, and six thousand cavalry.", "reveal", [POP(1.0)]),
             S("More than half his army was gone, before a single major battle in Italy. And still, he beat Rome three times in a row.", "build", [W()]),
             S("How he did it, and how Rome finally won, is in the full story linked below.", "somber", [W()]),
         ],
         sources=["Polybius 3.35 (setting out), 3.46 (rafts), 3.56 (Hannibal's inscription): https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Polybius/3*.html",
                  "Appian, Hannibalic War 1.4 (37 elephants)", "Livius.org, Hannibal Barca: https://www.livius.org/articles/person/hannibal-3-barca/"]),
    dict(brand="history-maps", ep="A002", n=1, slug="a002-short-1-fig", comp="ShortA002Fig",
         title="A Fig Started the End of Carthage",
         alt=["One Fig, One Senator, and the End of a 600-Year-Old City", "Why a Roman Senator Showed the Senate a Fig"],
         tags=["#shorts", "#history", "#carthage", "#ancientrome", "#maps"],
         scenes=[
             S("In one hundred forty-six B C, Rome burned Carthage to the ground. And the story starts with a fig.", "build", [RISER], lead=0.1),
             S("Around one hundred fifty-three B C, the Roman senator Cato visited Carthage. Rome had beaten it fifty years earlier.", "tension", [W()]),
             S("He found full markets, busy harbours, and a city getting rich again.", "tension", [{"type": "crowd", "at": 0.3, "duration": 2.5, "gain": 0.14}]),
             S("Back in Rome, the story goes, he dropped a fresh fig in front of the Senate. This fig, he said, grew only three days' sail from here.", "reveal", [POP(1.0)]),
             S("From then on, ancient writers say, he ended every speech with the same words: Carthage must be destroyed.", "build", [W()]),
             S("Historians think the fig story was polished over the centuries. But the fear behind it was real. And Rome soon found its excuse.", "somber", [W()]),
             S("How Rome disarmed Carthage step by step, and then destroyed it, is in the full story linked below.", "somber", [W()]),
         ],
         sources=["Plutarch, Life of Cato the Elder 27: https://cts.perseids.org/read/greekLit/tlg0007/tlg025/perseus-eng2/27.1-27.5",
                  "Pliny, Natural History 15.20 (versions of the fig story differ)", "Wikipedia, Carthago delenda est: https://en.wikipedia.org/wiki/Carthago_delenda_est"]),
    dict(brand="history-maps", ep="A002", n=2, slug="a002-short-2-salt", comp="ShortA002Salt",
         title="Rome Never Salted Carthage. Here's Where the Myth Came From",
         alt=["The Salt Myth Everyone Believes About Carthage", "Did Rome Really Salt the Earth? No Ancient Writer Says So"],
         tags=["#shorts", "#history", "#carthage", "#mythbusting", "#maps"],
         scenes=[
             S("You've probably heard it. After Rome destroyed Carthage, it covered the ground with salt, so nothing would ever grow there again.", "tension", [RISER], lead=0.1),
             S("It's a great story. But no ancient writer tells it. Not Polybius, who was there and watched the city burn. Not Appian. Nobody.", "build", [{"type": "fire", "at": 0.2, "duration": 3.0, "gain": 0.16}]),
             S("Historians traced the salt story to modern history books, from the early twentieth century.", "reveal", [POP(0.8)]),
             S("It probably got mixed up with salt curses in other ancient stories.", "wonder", [{"type": "page", "at": 0.3, "duration": 0.6, "gain": 0.22}]),
             S("What Rome really did is simpler. The land became a Roman province, called Africa. And according to Appian, Scipio cursed anyone who would rebuild the city.", "somber", [W()]),
             S("The curse failed. About a hundred years later, Rome built a new city on the very same spot.", "wonder", [W()]),
             S("So why did Rome destroy Carthage at all? The full story is linked below.", "somber", [W()]),
         ],
         sources=["R. T. Ridley, To Be Taken with a Pinch of Salt, Classical Philology 81 (1986): https://www.journals.uchicago.edu/doi/10.1086/366973",
                  "Appian, Punica 135 (province of Africa; Scipio's curse)", "Wikipedia, Salting the earth: https://en.wikipedia.org/wiki/Salting_the_earth"]),
    # ---------------- Scale & Science ----------------
    dict(brand="scale-science", ep="B001", n=1, slug="b001-short-1-megalodon", comp="ShortB001Megalodon",
         title="Megalodon Was Smaller Than an Animal Alive Today",
         alt=["Megalodon vs Blue Whale, to Scale: It's Not Close", "The Biggest Shark Ever Still Loses to This"],
         tags=["#shorts", "#megalodon", "#bluewhale", "#science", "#toscale"],
         scenes=[
             S("Megalodon, the biggest shark that ever lived, was still smaller than an animal alive today.", "build", [RISER], lead=0.1),
             S("We know megalodon mostly from its teeth. The largest are about eighteen centimetres long, roughly the length of a hand.", "tension", [W()]),
             S("Here is a great white shark, about six metres. Now, megalodon.", "tension", [W(), POP(1.6)]),
             S("Estimates range from about sixteen metres to as much as twenty-four. Scientists still argue, because only teeth and a few backbones survive.", "build", [{"type": "underwater", "at": 0.0, "duration": 6.0, "gain": 0.14}]),
             S("Now the blue whale. The largest ones reach about thirty-three metres.", "reveal", [{"type": "whale", "at": 0.8, "duration": 2.0, "gain": 0.18}]),
             S("And on the scale, a sixteen-metre megalodon may have weighed about sixty tonnes. The biggest blue whales: about one hundred fifty.", "reveal", [POP(1.2)]),
             S("The biggest animal ever is alive right now. The full line-up, dinosaurs included, is linked below.", "wonder", [W()]),
         ],
         sources=["Smithsonian Ocean, Megalodon (teeth up to ~18 cm): https://ocean.si.edu/ocean-life/sharks-rays/megalodon",
                  "NOAA Fisheries, White Shark: https://www.fisheries.noaa.gov/species/white-shark",
                  "Cooper et al. 2022, Science Advances (16 m, ~61 t): https://www.science.org/doi/10.1126/sciadv.abm9424",
                  "Shimada et al. 2025, Palaeontologia Electronica (up to 24.3 m): https://palaeo-electronica.org/content/2025/5442-megalodon-body-form",
                  "NOAA Fisheries, Blue Whale (up to ~33 m, ~150 t): https://www.fisheries.noaa.gov/species/blue-whale"]),
    dict(brand="scale-science", ep="B001", n=2, slug="b001-short-2-alive-now", comp="ShortB001AliveNow",
         title="The Biggest Animal Ever Is Alive Right Now",
         alt=["Bigger Than Any Dinosaur, and It's Alive Today", "33 Metres, 150 Tonnes: The Biggest Animal in History"],
         tags=["#shorts", "#bluewhale", "#dinosaurs", "#science", "#toscale"],
         scenes=[
             S("The biggest animal that has ever lived is not a dinosaur. It's alive right now.", "build", [RISER], lead=0.1),
             S("The blue whale. The largest reach about thirty-three metres. That's about nineteen people, lying head to toe.", "wonder", [W(), {"type": "whale", "at": 1.2, "duration": 2.0, "gain": 0.16}]),
             S("And up to about one hundred fifty tonnes, roughly as heavy as twenty-five adult male elephants.", "reveal", [POP(1.0)]),
             S("Some dinosaurs, like Argentinosaurus, may have matched it for length. But most estimates put them between fifty and eighty-three tonnes.", "tension", [W(), {"type": "footstep", "at": 0.8, "duration": 1.0, "gain": 0.2}]),
             S("In twenty twenty-three, a fossil whale from Peru was called a contender. A year later, a new estimate put it below the biggest blue whales.", "tension", [W()]),
             S("Why now? Water carries its weight, and krill swarms feed it. Whales became giants only in the last few million years.", "wonder", [{"type": "bubbles", "at": 0.4, "duration": 2.0, "gain": 0.16}]),
             S("You live at the same time as the biggest animal ever. The full line-up is linked below.", "wonder", [W()]),
         ],
         sources=["NOAA Fisheries, Blue Whale: https://www.fisheries.noaa.gov/species/blue-whale",
                  "Paul 2019, Acta Palaeontologica Polonica (Argentinosaurus): https://doi.org/10.4202/app.00585.2018",
                  "Sellers et al. 2013, PLOS ONE (up to ~83 t): https://doi.org/10.1371/journal.pone.0078733",
                  "Bianucci et al. 2023, Nature (Perucetus): https://www.nature.com/articles/s41586-023-06381-1",
                  "Motani & Pyenson 2024, PeerJ (Perucetus 60–114 t): https://peerj.com/articles/16978/",
                  "Goldbogen et al. 2019, Science (feeding limits): https://doi.org/10.1126/science.aay1832",
                  "Slater et al. 2017, Proc. R. Soc. B (recent gigantism): https://doi.org/10.1098/rspb.2017.0546"]),
    dict(brand="scale-science", ep="B002", n=1, slug="b002-short-1-tracy-arm", comp="ShortB002TracyArm",
         title="This Wave Climbed 481 Metres. Higher Than the Empire State",
         alt=["A Wave Climbed Higher Than a Skyscraper in 2025", "Almost Nobody Saw Alaska's 481-Metre Wave"],
         tags=["#shorts", "#tsunami", "#alaska", "#science", "#toscale"],
         scenes=[
             S("In August twenty twenty-five, a wave in Alaska climbed four hundred eighty-one metres up a mountain.", "build", [RISER], lead=0.1),
             S("A melting glacier had been holding up this slope. When the ice pulled back, about sixty-four million cubic metres of rock fell into the fjord.", "tension", [{"type": "rumble", "at": 1.5, "duration": 3.0, "gain": 0.24}]),
             S("Computer models show a breaking wave about one hundred metres tall, racing at more than two hundred forty kilometres per hour.", "build", [{"type": "waves", "at": 0.2, "duration": 4.0, "gain": 0.2}]),
             S("When it hit the far side, the water kept climbing. You can still see where the trees end.", "tension", [W()]),
             S("Higher than the Statue of Liberty, the Eiffel Tower, and the Empire State Building.", "reveal", [POP(0.6), POP(1.6)]),
             S("On summer days, cruise ships carry thousands of people into these fjords. That morning, by luck, none was in Tracy Arm.", "somber", [W()]),
             S("And it's only the second-tallest ever measured. Every giant wave, to scale, is linked below.", "wonder", [W()]),
         ],
         sources=["Shugar et al. 2026, Science (481 m run-up): https://pubs.usgs.gov/publication/70276630",
                  "USGS, 2025 Tracy Arm landslide-generated tsunami: https://www.usgs.gov/programs/landslide-hazards/science/2025-tracy-arm-landslide-generated-tsunami",
                  "UAF Geophysical Institute (2026): https://www.gi.alaska.edu/news/study-2025-alaska-landslide-and-tsunami-contains-warnings",
                  "Empire State Building facts (443 m to the tip): https://www.esbnyc.com/about/facts-figures"]),
    dict(brand="scale-science", ep="B002", n=2, slug="b002-short-2-lituya", comp="ShortB002Lituya",
         title="A Father and Son Survived the Tallest Wave Ever Recorded",
         alt=["Water Climbed 524 Metres. Two People Rode It Out", "Lituya Bay 1958: The Record Wave, to Scale"],
         tags=["#shorts", "#tsunami", "#alaska", "#history", "#toscale"],
         scenes=[
             S("July nineteen fifty-eight, Lituya Bay, Alaska. Water rose higher than anywhere ever recorded. Two people rode it out.", "build", [RISER], lead=0.1),
             S("An earthquake shook loose about thirty million cubic metres of rock.", "tension", [{"type": "rumble", "at": 0.6, "duration": 3.0, "gain": 0.24}]),
             S("That evening, Howard Ulrich and his seven-year-old son were anchored in their fishing boat. A wall of water rushed toward them.", "tension", [{"type": "waves", "at": 1.0, "duration": 4.0, "gain": 0.2}]),
             S("The boat rode up the wave. Ulrich estimated it at fifteen to twenty-three metres when it reached them. Both survived.", "build", [W()]),
             S("Afterwards, geologist Don Miller found where the forest had been torn away. It reached five hundred twenty-four metres up the mountain.", "reveal", [POP(2.0)]),
             S("Higher than the Empire State Building. Still the tallest wave run-up ever recorded.", "reveal", [W()]),
             S("In twenty twenty-five, Alaska came close to beating it. Every giant wave, to scale, is linked below.", "wonder", [W()]),
         ],
         sources=["Miller 1960, USGS Professional Paper 354-C (524 m trimline; Ulrich's estimates): https://pubs.usgs.gov/pp/0354c/report.pdf",
                  "Empire State Building facts (443 m to the tip): https://www.esbnyc.com/about/facts-figures",
                  "Shugar et al. 2026, Science (Tracy Arm 481 m): https://pubs.usgs.gov/publication/70276630"]),
    # ---------------- Money & Maps ----------------
    dict(brand="money-maps", ep="C001", n=1, slug="c001-short-1-watches", comp="ShortC001Watches",
         title="China Sells 40x More Watches. Switzerland Earns 10x More",
         alt=["How Switzerland Earns More From 15 Million Watches Than China From 595 Million", "$4 vs $1,837: The Swiss Watch Trick"],
         tags=["#shorts", "#economics", "#switzerland", "#watches", "#money"],
         scenes=[
             S("China exports almost forty times more watches than Switzerland. Switzerland earns more than ten times as much money from them.", "build", [RISER], lead=0.1),
             S("In twenty twenty-four, China exported about five hundred ninety-five million watches. Switzerland, about fifteen million.", "tension", [W(), {"type": "tick", "at": 0.5, "duration": 2.0, "gain": 0.18}]),
             S("But the average Chinese watch was exported for about four dollars. The average Swiss watch, for about eighteen hundred dollars.", "reveal", [POP(2.6)]),
             S("Add it up, and Swiss watches earned more than ten times as much.", "reveal", [{"type": "coin", "at": 1.0, "duration": 0.6, "gain": 0.22}]),
             S("It started in Geneva, in the fifteen hundreds. A strict Protestant city frowned on jewellery, so goldsmiths turned to watches.", "wonder", [W()]),
             S("That's the trick. If your country is hard to reach, sell things that are small, light, and expensive. Then transport costs barely matter.", "wonder", [W()]),
             S("It's one of the reasons Switzerland got so rich. The full story is linked below.", "calm", [W()]),
         ],
         sources=["Federation of the Swiss Watch Industry, World watchmaking industry 2024: https://www.fhs.swiss/documents/statistics/eng/world-watchmaking-2024.pdf",
                  "Our calculation from FH: 595.5 M x ~$4 = ~$2.4 bn; 15.3 M x $1,837 = ~$28.1 bn"]),
    dict(brand="money-maps", ep="C001", n=2, slug="c001-short-2-not-banks", comp="ShortC001NotBanks",
         title="Switzerland's Biggest Export Isn't Banking. It's Medicine",
         alt=["Banks Are Only 9% of the Swiss Economy. So What Made It Rich?", "53% of Swiss Exports Come From One Industry"],
         tags=["#shorts", "#economics", "#switzerland", "#pharma", "#money"],
         scenes=[
             S("Everyone thinks Switzerland got rich from its banks. Its biggest export is something you swallow.", "build", [RISER], lead=0.1),
             S("Banks and insurance together make only about nine percent of the Swiss economy.", "tension", [W(), POP(1.4)]),
             S("The real champion is chemicals and medicines: about one hundred forty-nine billion francs of exports in twenty twenty-four.", "reveal", [{"type": "coin", "at": 1.6, "duration": 0.6, "gain": 0.22}]),
             S("That's about fifty-three percent of everything Switzerland exports.", "reveal", [POP(0.8)]),
             S("It started in Basel, where factories made dyes for cloth. Until nineteen hundred seven, Swiss patents did not protect chemical inventions, so Basel firms could legally copy dyes invented abroad.", "wonder", [W()]),
             S("The chemists who made colours learned to make medicines. Today, Basel is home to Roche and Novartis.", "wonder", [W()]),
             S("Small, light, valuable: the same trick as Swiss watches. The full story is linked below.", "calm", [W()]),
         ],
         sources=["State Secretariat for International Finance (SIF), key figures 2026: https://www.sif.admin.ch/dam/en/sd-web/iwKtRqzjc946/kennzahlen-sif-2026-en.pdf",
                  "Federal Office for Customs and Border Security (BAZG), annual report 2024: https://www.bazg.admin.ch/",
                  "Swiss patents excluded chemical inventions until 1907 (see the long video's sources)"]),
    dict(brand="money-maps", ep="C002", n=1, slug="c002-short-1-norilsk", comp="ShortC002Norilsk",
         title="174,000 People Live Here. No Road Leads There",
         alt=["Russia Pays People 80% Extra to Live in This City", "The Arctic City Built by Gulag Prisoners"],
         tags=["#shorts", "#economics", "#russia", "#arctic", "#maps"],
         scenes=[
             S("About one hundred seventy-four thousand people live in this Arctic city. And no road leads there.", "build", [RISER], lead=0.1),
             S("This is Norilsk, far above the Arctic Circle. No road and no railway connect it to the rest of Russia.", "tension", [W(), {"type": "wind", "at": 0.0, "duration": 5.0, "gain": 0.2}]),
             S("It began in nineteen thirty-five, when prisoners of a Gulag camp started building its mines and metal plant.", "somber", [W()]),
             S("Today, life in Russia's coldest big cities can cost up to four times more than in the rest of the country.", "tension", [POP(2.0)]),
             S("So Russia pays people to stay. By law, a job in Norilsk earns an eighty percent bonus on top of the salary.", "reveal", [{"type": "coin", "at": 1.6, "duration": 0.6, "gain": 0.22}]),
             S("Why keep it? Russia mines about thirty-nine percent of the world's palladium, much of it from around Norilsk.", "reveal", [POP(1.2)]),
             S("Why Russia built cities like this is in the full story linked below.", "calm", [W()]),
         ],
         sources=["Rosstat 2021 census via citypopulation.de (Norilsk 174,453): https://www.citypopulation.de/en/russia/cities/",
                  "Hill & Gaddy, The Siberian Curse (Brookings, 2003): https://www.brookings.edu/wp-content/uploads/2016/07/siberiancurse_chapter.pdf",
                  "Labour Code art. 316, regional coefficients (Norilsk 1.8): https://ppt.ru/art/zp/koefficenti-po-regionam",
                  "USGS Mineral Commodity Summaries 2025, platinum-group metals: https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-platinum-group.pdf"]),
    dict(brand="money-maps", ep="C002", n=2, slug="c002-short-2-paid-to-leave", comp="ShortC002PaidToLeave",
         title="World Bank Paid Russians to Leave the Arctic. Most Stayed",
         alt=["$80 Million to Move People Out. Only 1 in 7 Left Norilsk", "Why People Stay in Russia's Coldest Cities"],
         tags=["#shorts", "#economics", "#russia", "#worldbank", "#maps"],
         scenes=[
             S("The World Bank lent Russia eighty million dollars to help people leave the frozen north. Most of them stayed.", "build", [RISER], lead=0.1),
             S("In two thousand one, the loan paid for a test: move families out of three Arctic places. Norilsk, Vorkuta, and Susuman.", "tension", [W()]),
             S("Planners expected about ten thousand four hundred households to leave. Only about four thousand five hundred did.", "reveal", [POP(2.4)]),
             S("In Norilsk, only about one in seven of the planned families went.", "reveal", [POP(1.0)]),
             S("More than half the loan was never spent. About forty-five million dollars was cancelled.", "tension", [{"type": "coin", "at": 1.2, "duration": 0.6, "gain": 0.2}]),
             S("Why stay somewhere that cold, and that expensive? For many, it paid. In Norilsk, living standards were relatively high.", "wonder", [W()]),
             S("Russia still pays every winter to keep these cities alive. The full story is linked below.", "calm", [W()]),
         ],
         sources=["World Bank IEG review, Russia Northern Restructuring Project (P064238): https://documents.worldbank.org/curated/en/190251475098672694/text/000020051-20140624161420.txt",
                  "Hill & Gaddy, The Siberian Curse (Brookings, 2003): https://www.brookings.edu/wp-content/uploads/2016/07/siberiancurse_chapter.pdf"]),
]

# posting plan: 1 Short per channel per day, from 19 Nov 2026, at the channel's usual upload hour; Carthage Shorts wait for its long video
SCHEDULE = {
    "a001-short-1-cannae": "Thu 19 Nov 2026", "a001-short-2-alps": "Fri 20 Nov 2026",
    "a002-short-1-fig": "Sat 21 Nov 2026", "a002-short-2-salt": "Sun 22 Nov 2026",
    "b001-short-1-megalodon": "Thu 19 Nov 2026", "b002-short-1-tracy-arm": "Fri 20 Nov 2026",
    "b001-short-2-alive-now": "Sat 21 Nov 2026", "b002-short-2-lituya": "Sun 22 Nov 2026",
    "c002-short-1-norilsk": "Thu 19 Nov 2026", "c001-short-1-watches": "Fri 20 Nov 2026",
    "c002-short-2-paid-to-leave": "Sat 21 Nov 2026", "c001-short-2-not-banks": "Sun 22 Nov 2026",
}


def timeline(s):
    return {
        "id": s["slug"], "comp": s["comp"], "title": s["title"], "fps": 30, "seed": 900 + len(s["slug"]) * 7 + s["n"],
        "voice": {**VOICE[s["brand"]], "gap": 0.28, "prosody": True, "chain": True, "model": "fp32"},
        "music": MUSIC[s["brand"]], "mix": {"duck_db": 20, "tp_oversample": True},
        "scenes": [{"id": f"s{i + 1}", **sc} for i, sc in enumerate(s["scenes"])],
    }


def upload_md(s):
    long_title, long_state = LONG[s["ep"]]
    first = s["scenes"][0]["lines"][0]
    url = next((w for w in long_state.split() if w.startswith("https://youtu.be/")), "")
    desc = "\n".join([
        first,
        "",
        f"Full story: {url}" if url else f"Full story: [LINK TO LONG VIDEO: \"{long_title}\"]",
        "",
        "Sources:",
        *[f"- {x}" for x in s["sources"]],
        "",
        " ".join(s["tags"]),
    ])
    return f"""# UPLOAD — Short: {s['title']}

Channel: **{CHANNEL[s['brand']]}** · Short {s['n']} of 2 for {s['ep']} · File: `final.mp4` (1080×1920, 30 fps) · Cover: `cover.jpg`

## Title (≤ 60 characters)
{s['title']}  ({len(s['title'])} chars)

Alternatives (swap if views stall after 48 h): {' · '.join(s['alt'])}

## Description
```
{desc}
```

## Hashtags
{' '.join(s['tags'])}

## Related video (set in Studio)
YouTube Studio → upload → Details → **Related video** → pick: **{long_title}** ({long_state}).
This puts a tappable link to the long video under the Short. Also pin a comment: "Full story here 👉 <long-video URL>".

## Schedule
Post: **{SCHEDULE[s['slug']]}** (1 Short per channel per day; same hour as the channel's long uploads). Do not post two Shorts for the same long video on the same day.

## Notes
- Made for YouTube only (no other platforms). Altered/synthetic content: AI voice narration only, no realistic people → answer "No" unless YouTube's form changes.
- Every number on screen carries its source in-frame; script lines are the same reviewed lines as the long video.
"""


def main():
    for s in SHORTS:
        d = ROOT / "brands" / s["brand"] / "shorts" / s["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "timeline.json").write_text(json.dumps(timeline(s), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        (d / "UPLOAD.md").write_text(upload_md(s), encoding="utf-8")
        words = sum(len(l.split()) for sc in s["scenes"] for l in sc["lines"])
        assert len(s["title"]) <= 60, s["title"]
        print(f"{s['comp']:24s} {words:4d} words ~ {words / 2.7:4.1f} s  {s['slug']}")


if __name__ == "__main__":
    main()
