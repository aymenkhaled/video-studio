import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {BattleSpec, BUnit} from '../../../../packages/engine/src/map/battle';
import type {CamKey, City, MapSpec, Route, Territory} from '../../../../packages/engine/src/map/map';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import {MARCH} from '../../data/punic';
import {
  AFRICA_146, C3, CARTHAGE_150, CARTHAGE_201, COL3, EMPORIA, MODERN, NUMIDIA, PHOENICIA, PLAN_NOTES, PLAN_SIDES, PLAN_TERRAIN,
  ROMAN_SPAIN, ROME_ITALY, SARD_CORSICA, SICILY, TYSCA,
} from '../../data/punic3';

// Episode 002 "Why Rome Destroyed Carthage" — visual design per scene id (see timeline.json).
// Clarity Standard (docs/CLARITY_STANDARD.md): every map has modern borders + names, label avoidance, a year;
// people get a card at first mention, hard words a pop-up, each chapter ends on a recap card.

export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Carthage', color: COL3.carthage},
    {name: 'Rome', color: COL3.rome, pattern: 'hatch'},
    {name: 'Numidia', color: COL3.numidia, pattern: 'dots'},
  ],
  chapters: {c1: 'After Hannibal', c2: 'The Fig', c3: 'The Neighbour', c4: 'The Trap', c5: 'The Siege', c6: 'Myth or Fact', c7: 'Then and Now'},
  highlight: {
    Carthage: '#f0a650', Carthaginian: '#f0a650', Rome: '#ef6a5e', Roman: '#ef6a5e', Romans: '#ef6a5e',
    Numidia: '#8fc488', Masinissa: '#8fc488',
  },
  now: 2026,
};

// ---------- shared pieces ----------
const ROMAN = [ROME_ITALY, SICILY, SARD_CORSICA, ROMAN_SPAIN];
const B201: Territory[] = [...ROMAN, NUMIDIA, CARTHAGE_201];
const B150: Territory[] = [...ROMAN, NUMIDIA, CARTHAGE_201, EMPORIA, TYSCA];
const B149: Territory[] = [...ROMAN, NUMIDIA, EMPORIA, TYSCA, CARTHAGE_150];
const cam = (a: [number, number], za: number, b: [number, number], zb: number): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb}];
const WEST_MED = cam([9, 38.6], 4.4, [10, 38.2], 5.0);
const TUNISIA = cam([9.6, 36.2], 13, [9.9, 36.4], 16);
const CLOSE = cam([10.2, 36.75], 30, [10.3, 36.82], 38);
const ROME_CLOSE = cam([12.6, 42.0], 12, [12.5, 41.9], 15);

/** Every map in this episode gets the modern layer + label avoidance (Clarity rules 1, 10). */
const M = (spec: Omit<MapSpec, 'modern' | 'avoidLabels'>): MapSpec => ({...spec, modern: {labels: MODERN}, avoidLabels: true, relief: true, minText: 34});
const map = (year: number | undefined, spec: Omit<MapSpec, 'modern' | 'avoidLabels'>, overlays?: Overlay[]): SceneDef => ({kind: 'map', year, map: M(spec), overlays});
const chapter = (n: number, title: string, sub: string, spec: Omit<MapSpec, 'modern' | 'avoidLabels'>, image?: string, question?: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'chapter', n, title, sub, image, question}]});
const recap = (text: string, spec: Omit<MapSpec, 'modern' | 'avoidLabels'>, next?: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'recap', text, next}]});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], object = false): SceneDef => ({kind: 'art', art: {id, title, from, to, object}, overlays});
const route = (id: string, points: [number, number][], draw: [number, number], extra: Partial<Route> = {}): Route => ({id, points, color: COL3.route, draw, ...extra});
const at = (c: City, appear: number, size?: number): City => ({...c, appear, size});

// sea lanes
const CARTHAGE: [number, number] = [10.32, 36.85];
const ROME: [number, number] = [12.48, 41.9];
const SEA_TO_ROME: [number, number][] = [CARTHAGE, [11.2, 38.0], [11.6, 39.6], [12.1, 41.0], ROME];
const SICILY_W: [number, number] = [12.44, 37.8];

// ---------- schematic city plan (BattleShot) ----------
const n = (k: keyof typeof PLAN_NOTES, appear = 0.05, until?: number) => ({...PLAN_NOTES[k], appear, until});
const blk = (id: string, side: 'a' | 'b', keys: BUnit['keys'], label?: string, kind: BUnit['kind'] = 'inf', labelUntil?: number): BUnit => ({id, side, keys, label, kind, labelUntil});
const PLAN = (title: string, extra: Partial<BattleSpec>): BattleSpec => ({title, sides: PLAN_SIDES, terrain: PLAN_TERRAIN, units: [], ...extra});
const DEFENDERS = [
  blk('d1', 'a', [{at: 0, x: 40, y: 20, w: 5, h: 2.6}], 'Defenders'),
  blk('d2', 'a', [{at: 0, x: 42, y: 32, w: 5, h: 2.6}]),
  blk('d3', 'a', [{at: 0, x: 34, y: 26, w: 2.6, h: 5}]),
];
const ROMAN_CAMPS = [
  blk('r1', 'b', [{at: 0, x: 14, y: 20, w: 6, h: 3}], 'Roman camp'),
  blk('r2', 'b', [{at: 0, x: 15, y: 32, w: 6, h: 3}]),
];
const ROMAN_SHIPS = [
  blk('s1', 'b', [{at: 0, x: 86, y: 30, w: 4, h: 1.6, opacity: 0}, {at: 0.3, x: 82, y: 30, opacity: 1}], 'Roman fleet', 'ship'),
  blk('s2', 'b', [{at: 0, x: 84, y: 40, w: 4, h: 1.6, opacity: 0}, {at: 0.35, x: 78, y: 44, opacity: 1}], undefined, 'ship'),
  blk('s3', 'b', [{at: 0, x: 90, y: 18, w: 4, h: 1.6, opacity: 0}, {at: 0.4, x: 84, y: 16, opacity: 1}], undefined, 'ship'),
];

const SIEGE_HOLD = PLAN('Carthage, 149–148 BC (schematic plan)', {
  phases: [{at: 0.0, title: 'Phase 1 — The walls hold', sub: 'Watch the Roman attacks bounce off the land walls'}],
  units: [...ROMAN_CAMPS, ...DEFENDERS],
  arrows: [
    {from: [16, 22], via: [22, 18], to: [26, 20], side: 'b', draw: [0.15, 0.45]},
    {from: [16, 33], via: [22, 34], to: [27, 32], side: 'b', draw: [0.35, 0.65]},
    {from: [36, 25], via: [32, 22], to: [29, 21], side: 'a', draw: [0.6, 0.9]},
  ],
  notes: [n('walls'), n('byrsa'), n('lake')],
  zoom: [{at: 0, cx: 38, cy: 28, s: 1.25}, {at: 1, cx: 34, cy: 28, s: 1.4}],
});

// ---------- the scenes ----------
export const SCENES: Record<string, SceneDef> = {
  // cold open: Carthage on frame 1, Rome's red takes over (conflict visible immediately)
  c0a: art('turner-decline', 'J. M. W. Turner, The Decline of the Carthaginian Empire, 1817', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.48, zoom: 1.22}),
  c0b: map(-201, {camera: WEST_MED, territories: B201, cities: [C3.romePlain, C3.carthagePlain], routes: [route('rc', [ROME, [12.1, 41.0], [11.6, 39.6], [11.2, 38.0], CARTHAGE], [0.1, 0.6], {color: COL3.rome, dashed: true})]}, [
    {type: 'glossary', term: 'BC', meaning: 'years before year 1 — they count down', window: [0.04, 0.5]},
    {type: 'citation', text: 'Treaty of 201 BC — Polybius 15.18', at: [0.5, 0.98]},
  ]),
  c0c: {kind: 'map', map: M({camera: cam([10.5, 37.5], 7, [10.4, 37.2], 8.5), territories: B150, cities: [C3.carthagePlain]}), overlays: [{type: 'list', title: 'Three clues', items: ['A fresh fig', 'A king who was almost 90', 'One impossible order']}]},
  c0d: art('turner-dido', '', {x: 0.5, y: 0.5, zoom: 1.08}, {x: 0.5, y: 0.5, zoom: 1.0}, [{type: 'title', title: 'CARTHAGE', sub: 'WHY ROME DESTROYED IT'}]),

  // 1 — After Hannibal
  c1: chapter(1, 'After Hannibal', '201 – 191 BC', {camera: WEST_MED, territories: B201}, 'turner-dido', 'How did a beaten city get rich again?'),
  c1a: {
    kind: 'map', year: -201,
    map: M({projection: 'globe', camera: cam([12, 28], 1.15, [10.3, 36.6], 7.5), territories: [CARTHAGE_201], cities: [at(C3.carthage, 0.45, 1.3)]}),
  },
  c1b: map(-814, {camera: cam([24, 34.5], 3.0, [20, 35], 3.4), territories: [PHOENICIA, {...CARTHAGE_201, grow: [0.55, 0.85], opacity: 0.5}], cities: [at(C3.tyre, 0.05), at(C3.carthagePlain, 0.5)], routes: [route('found', [[35.2, 33.27], [32, 34.2], [26, 34.6], [20, 35.4], [15, 36.6], CARTHAGE], [0.15, 0.7], {dashed: true, km: true})]}, [
    {type: 'citation', text: 'Founding date is traditional — Britannica', at: [0.05, 0.95]},
  ]),
  c1c: art('ports-1958', "Carthage's round war harbour, seen from the air (1958 postcard)", {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.55, zoom: 1.3}, [
    {type: 'character', name: 'Appian', role: 'Historian, wrote ~300 years later', line: 'Greek writer from Alexandria. Our main source for this war.', window: [0.02, 0.42]},
    {type: 'counter', label: 'WARSHIP SHEDS (APPIAN)', value: 220, window: [0.45, 0.98], context: 'Digs suggest about 170 fit here', top: 200},
    {type: 'citation', text: 'Appian, Punica 96', at: [0.45, 0.98]},
  ]),
  c1d: map(-201, {camera: ROME_CLOSE, territories: ROMAN, cities: [at(C3.rome, 0.05, 1.3)]}, [
    {type: 'glossary', term: 'Republic', meaning: 'a state with elected leaders, no king', window: [0.04, 0.36]},
    {type: 'glossary', term: 'Senate', meaning: "Rome's council of its most powerful men", window: [0.36, 0.68]},
    {type: 'glossary', term: 'Consul', meaning: 'one of two leaders elected each year', window: [0.68, 0.99]},
  ]),
  c1e: map(-202, {camera: cam([4, 41], 4.6, [8, 38.5], 5.2), territories: B201, routes: [route('march', MARCH, [0.05, 0.5], {km: true, unit: {label: 'Hannibal', color: COL3.carthage}})], cities: [at(C3.zama, 0.7)]}, [
    {type: 'character', name: 'Hannibal', role: 'Carthaginian general', line: 'Crossed the Alps, nearly beat Rome. Lost at Zama, 202 BC.', side: 'Carthage'},
    {type: 'glossary', term: 'Punic Wars', meaning: "Rome's 3 wars with Carthage (Punic = Carthaginian)", window: [0.55, 0.98]},
  ]),
  c1f: map(-201, {camera: WEST_MED, territories: [ROME_ITALY, SICILY, SARD_CORSICA, NUMIDIA, CARTHAGE_201, {...ROMAN_SPAIN, grow: [0.1, 0.5]}], regions: [{text: 'LOST', at: [-3.5, 39.6], appear: 0.45, size: 40}]}, [
    {type: 'citation', text: 'Polybius 15.18; Livy 30.37', at: [0.05, 0.95]},
  ]),
  c1g: map(-201, {camera: TUNISIA, territories: B201, cities: [C3.carthagePlain]}, [
    {type: 'counter', label: 'TALENTS OF SILVER', value: 10000, window: [0.05, 0.98], context: '≈ 260 tonnes of silver'},
    {type: 'glossary', term: 'Talent', meaning: 'an ancient weight, about 26 kg', window: [0.08, 0.95]},
    {type: 'citation', text: 'Polybius 15.18 · talent ≈ 26 kg (Britannica)', at: [0.3, 0.98]},
  ]),
  c1h: {kind: 'map', year: -201, map: M({camera: WEST_MED, territories: B201}), overlays: [{type: 'list', title: 'The treaty of 201 BC', items: ['Lose every land outside Africa', 'Keep only a handful of warships', 'Pay 10,000 talents over 50 years', "No war without Rome's permission"], source: 'Polybius 15.18; Livy 30.37'}]},
  c1i: map(-190, {camera: cam([14, 36.5], 3.6, [13, 37], 4.0), territories: B201, cities: [C3.carthagePlain], routes: [
    route('t1', [CARTHAGE, [12.5, 37.6], [15.1, 37.5]], [0.05, 0.4], {dashed: true, width: 6}),
    route('t2', [CARTHAGE, [9.5, 38.5], [9.1, 39.2]], [0.15, 0.5], {dashed: true, width: 6}),
    route('t3', [CARTHAGE, [5, 37.5], [0.5, 38.3]], [0.25, 0.6], {dashed: true, width: 6}),
    route('t4', [CARTHAGE, [15, 34.5], [22, 33.2], [29.9, 31.3]], [0.3, 0.75], {dashed: true, width: 6}),
  ]}, [{type: 'citation', text: 'Appian, Punica 67–69: Carthage "advanced greatly"', at: [0.3, 0.98]}]),
  c1j: map(-191, {camera: cam([11.5, 39.2], 7, [11.8, 39.6], 7.8), territories: B201, cities: [C3.romePlain, C3.carthagePlain], routes: [route('pay', SEA_TO_ROME, [0.05, 0.45], {unit: {label: 'Offer: pay it all now', color: COL3.carthage}})]}, [
    {type: 'citation', text: 'Livy 36.4 — Rome refused', at: [0.5, 0.98]},
  ]),
  c1k: recap('Carthage lost the war, but won the peace. In Rome, some found that frightening.', {camera: WEST_MED, territories: B201}, 'One of them was about to visit Carthage…'),

  // 2 — The Fig
  c2: chapter(2, 'The Fig', 'about 153 BC', {camera: cam([11.5, 39.5], 6, [11.5, 39.5], 6.6), territories: B150}, 'cato-16c', 'Can one fig start a war?'),
  c2a: map(-153, {camera: ROME_CLOSE, territories: ROMAN, cities: [C3.romePlain]}, [
    {type: 'character', name: 'Cato the Elder', role: 'Roman senator', line: 'Hated luxury, never changed his mind. (Portrait imagined, 1500s.)', side: 'Rome', image: 'cato-16c'},
  ]),
  c2b: map(-153, {camera: cam([11.6, 39.6], 6.5, [10.6, 37.4], 11), territories: B150, cities: [C3.romePlain, at(C3.carthagePlain, 0.4, 1.3)], routes: [route('cato', SEA_TO_ROME.slice().reverse(), [0.05, 0.55], {unit: {label: 'Cato', color: COL3.rome}})]}),
  c2c: map(-153, {camera: ROME_CLOSE, territories: ROMAN, cities: [{...C3.romePlain, size: 1.4}], regions: [{text: 'THE SENATE', at: [12.9, 42.6], appear: 0.2, size: 38}]}, [
    {type: 'citation', text: 'Plutarch, Cato 27; Pliny 15.20 — versions differ', at: [0.3, 0.98]},
  ]),
  c2d: map(-153, {camera: cam([11.5, 39.4], 6.4, [11.6, 39.4], 7), territories: B150, cities: [C3.romePlain, C3.carthagePlain], routes: [route('fig', [CARTHAGE, [11.2, 38.0], [11.6, 39.6], [12.1, 41.0], ROME], [0.05, 0.5], {dashed: true, km: true})], regions: [{text: "≈ 3 DAYS' SAIL", at: [9.6, 39.4], appear: 0.4, size: 36}]}, [
    {type: 'citation', text: 'Plutarch, Cato 27', at: [0.05, 0.95]},
  ]),
  c2e: {kind: 'map', year: -153, map: M({camera: ROME_CLOSE, territories: ROMAN, cities: [C3.romePlain]}), overlays: [{type: 'quote', text: 'Carthage must be destroyed', by: 'Cato, as told by Plutarch (Cato 27). The famous Latin wording is later.'}]},
  c2f: map(-153, {camera: ROME_CLOSE, territories: ROMAN, cities: [C3.romePlain]}, [
    {type: 'character', name: 'Scipio Nasica', role: 'Roman senator', line: 'Said Carthage must be spared: a rival keeps Rome strong.', side: 'Rome'},
    {type: 'citation', text: 'Plutarch, Cato 27; Appian, Punica 69', at: [0.4, 0.98]},
  ]),
  c2g: map(-153, {camera: cam([11.2, 39.0], 5.6, [11.2, 39.2], 6.2), territories: B150, cities: [C3.romePlain, C3.carthagePlain]}, [
    {type: 'citation', text: 'Modern historians: the scene was likely embellished', at: [0.05, 0.95]},
  ]),
  c2h: recap("Rome's most stubborn senator wanted Carthage gone. All he needed was an excuse.", {camera: cam([11.5, 39.5], 6, [11.5, 39.5], 6.6), territories: B150}, 'And the excuse lived next door…'),

  // 3 — The Neighbour
  c3: chapter(3, 'The Neighbour', '193 – 150 BC', {camera: cam([7, 35.5], 7, [7.5, 35.5], 7.6), territories: B201}, 'coin-masinissa', 'What if you are not allowed to defend yourself?'),
  c3a: map(-193, {camera: cam([6.5, 35.6], 6.8, [7.2, 35.6], 8), territories: [...ROMAN, CARTHAGE_201, {...NUMIDIA, grow: [0.05, 0.5]}], cities: [at(C3.cirta, 0.4), C3.carthagePlain], regions: [{text: 'NUMIDIA', at: [4.2, 35.9], appear: 0.35, size: 44}]}),
  c3b: art('coin-masinissa', 'A coin of King Masinissa, Musée Cirta, Constantine (Algeria)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.12}, [
    {type: 'character', name: 'Masinissa', role: 'King of Numidia', line: "Rome's loyal ally. Spent 50 years taking Carthage's land.", side: 'Numidia', image: 'coin-masinissa'},
  ], true),
  c3c: map(-170, {camera: cam([10.4, 34.4], 8.5, [10.6, 34.6], 10), territories: [...ROMAN, NUMIDIA, CARTHAGE_201, {...EMPORIA, grow: [0.08, 0.42]}, {...TYSCA, grow: [0.55, 0.85]}], cities: [C3.carthagePlain], regions: [{text: 'EMPORIA COAST', at: [13.2, 33.6], appear: 0.25, size: 30}, {text: '≈ 50 TOWNS', at: [9.3, 35.9], appear: 0.7, size: 28}]}, [
    {type: 'citation', text: 'Appian, Punica 67–68 — borders approximate', at: [0.05, 0.98]},
  ]),
  c3d: map(-160, {camera: cam([11, 38.5], 6, [10.8, 38.2], 6.6), territories: B150, cities: [C3.romePlain, C3.carthagePlain], routes: [route('env', SEA_TO_ROME.slice().reverse(), [0.1, 0.6], {color: COL3.rome, unit: {label: 'Roman envoys', color: COL3.rome}})]}, [
    {type: 'glossary', term: 'Envoy', meaning: 'an official messenger sent by a government', window: [0.1, 0.9]},
  ]),
  c3e: {kind: 'map', year: -150, map: M({camera: TUNISIA, territories: B150}), overlays: [{type: 'quote', text: "No war without Rome's permission", by: 'Treaty of 201 BC (Polybius 15.18)'}]},
  c3f: map(-150, {camera: TUNISIA, territories: B150, cities: [C3.carthagePlain], routes: [
    route('mas', [[6.61, 36.37], [7.6, 36.3], [8.7, 36.2]], [0.0, 0.3], {color: COL3.numidia, unit: {label: 'Masinissa', color: COL3.numidia, kind: 'cavalry'}}),
    route('army', [CARTHAGE, [9.9, 36.6], [9.2, 36.3]], [0.4, 0.9], {unit: {label: 'Carthage: ~25,000', color: COL3.carthage}}),
  ], regions: [{text: 'BESIEGED TOWN', at: [8.3, 35.8], appear: 0.2, size: 26}]}, [
    {type: 'glossary', term: 'Siege', meaning: 'surrounding a town until it gives up', window: [0.05, 0.45]},
    {type: 'citation', text: 'Appian, Punica 70', at: [0.5, 0.98]},
  ]),
  c3g: map(-150, {camera: cam([9.0, 36.2], 18, [9.0, 36.3], 22), territories: B150, routes: [route('trap', [[9.9, 36.6], [9.2, 36.3]], [0, 0.01], {unit: {label: 'Trapped', color: COL3.carthage}})], regions: [{text: 'MASINISSA ≈ 88 YEARS OLD', at: [8.6, 35.9], appear: 0.1, size: 24}]}, [
    {type: 'citation', text: 'Appian, Punica 71–73 — most of the army lost', at: [0.4, 0.98]},
  ]),
  c3h: map(-150, {camera: cam([9.0, 36.2], 20, [9.1, 36.3], 24), territories: B150}, [
    {type: 'character', name: 'Scipio Aemilianus', role: 'Young Roman officer', line: 'Not the same man as Scipio Nasica. Remember him: he will end this war.', side: 'Rome'},
    {type: 'citation', text: 'Appian, Punica 71–72', at: [0.5, 0.98]},
  ]),
  c3i: recap("Carthage fought a war without asking. In Rome's eyes, it had broken the treaty.", {camera: TUNISIA, territories: B150}, "Rome's answer would be a trap…"),

  // 4 — The Trap
  c4: chapter(4, 'The Trap', '149 BC', {camera: cam([11, 38], 6.5, [11, 37.8], 7.2), territories: B149}, 'coin-tanit', 'What would you give up to avoid a war?'),
  c4a: map(-149, {camera: CLOSE, territories: [...B149, {id: 'utica', color: COL3.rome, origin: [10.06, 37.06], rings: [[[9.7, 37.3], [10.2, 37.3], [10.2, 36.95], [9.75, 36.95]]], grow: [0.4, 0.75]}], cities: [C3.carthage, at(C3.utica, 0.3)]}),
  c4b: map(-149, {camera: cam([12.5, 39.5], 6.5, [12.0, 38.2], 9), territories: B149, cities: [C3.romePlain, at(C3.lilybaeum, 0.4), C3.carthagePlain], routes: [route('army', [ROME, [12.9, 40.4], [12.6, 38.6], SICILY_W], [0.05, 0.6], {color: COL3.rome, unit: {label: 'Roman army', color: COL3.rome}})]}, [
    {type: 'counter', label: 'SOLDIERS (APPIAN, APPROX.)', value: 84000, window: [0.25, 0.98], color: '#e0675b', context: 'More people than a packed big stadium'},
    {type: 'citation', text: 'Appian, Punica 75: 80,000 foot + 4,000 horse', at: [0.3, 0.98]},
  ]),
  c4c: map(-149, {camera: cam([11.4, 37.4], 11, [11.2, 37.3], 12.5), territories: B149, cities: [C3.lilybaeum, C3.carthagePlain], routes: [route('host', [CARTHAGE, [11.4, 37.3], SICILY_W], [0.4, 0.85], {dashed: true, unit: {label: '300 children', color: COL3.carthage}})]}, [
    {type: 'glossary', term: 'Hostage', meaning: 'a person handed over to guarantee a promise', window: [0.45, 0.98]},
    {type: 'citation', text: 'Appian, Punica 76–77', at: [0.5, 0.98]},
  ]),
  c4d: map(-149, {camera: cam([11.0, 37.3], 12, [10.4, 37.0], 18), territories: B149, cities: [C3.carthagePlain, C3.utica], routes: [route('land', [SICILY_W, [11.2, 37.4], [10.2, 37.1]], [0.05, 0.5], {color: COL3.rome, unit: {label: 'Roman army', color: COL3.rome}})]}),
  c4e: map(-149, {camera: CLOSE, territories: B149, cities: [C3.carthagePlain]}, [
    {type: 'counter', label: 'SETS OF ARMOUR', value: 200000, window: [0.05, 0.98], context: 'More than twice the Roman army sent'},
    {type: 'counter', label: 'CATAPULTS', value: 2000, window: [0.35, 0.98], top: 600, color: '#f4ecd8'},
    {type: 'citation', text: "Appian, Punica 80 — Appian's figures", at: [0.05, 0.98]},
  ]),
  c4f: map(-149, {camera: CLOSE, territories: B149, cities: [C3.carthagePlain]}, [
    {type: 'character', name: 'Censorinus', role: 'Roman consul, 149 BC', line: 'Gave Carthage the final order.', side: 'Rome'},
  ]),
  c4g: map(-149, {camera: cam([10.25, 36.82], 70, [10.22, 36.83], 95), territories: B149, cities: [C3.carthagePlain], routes: [route('inland', [CARTHAGE, [10.25, 36.86], [10.15, 36.85]], [0.15, 0.6], {color: COL3.rome, dashed: true})], regions: [{text: '15 KM FROM THE SEA', at: [10.13, 36.9], appear: 0.45, size: 26}]}, [
    {type: 'citation', text: 'Appian, Punica 81: "at least ten miles"', at: [0.3, 0.98]},
  ]),
  c4h: map(-149, {camera: cam([10.6, 37.0], 20, [10.5, 36.95], 24), territories: B149, cities: [C3.carthagePlain], routes: [
    route('sea1', [CARTHAGE, [11.2, 37.3]], [0.05, 0.4], {dashed: true, width: 6}),
    route('sea2', [CARTHAGE, [11.0, 36.6]], [0.2, 0.55], {dashed: true, width: 6}),
  ]}),
  c4i: recap('Carthage gave up its children and its weapons. Rome asked for the city. Carthage said no.', {camera: CLOSE, territories: B149}, 'Now it had to fight with almost nothing…'),

  // 5 — The Siege (schematic city plan)
  c5: chapter(5, 'The Siege', '149 – 146 BC', {camera: CLOSE, territories: B149}, 'assault-1885', 'Can a city with no weapons hold off Rome?'),
  c5a: {kind: 'battle', battle: PLAN('Carthage rearms, 149 BC (schematic plan)', {phases: [{at: 0, title: 'Rearming', sub: 'The whole city makes weapons, day and night'}], units: DEFENDERS, notes: [n('byrsa'), n('walls', 0.3)], zoom: [{at: 0, cx: 46, cy: 28, s: 1.3}, {at: 1, cx: 44, cy: 28, s: 1.45}]}), overlays: [{type: 'citation', text: 'Appian, Punica 93', at: [0.05, 0.95]}]},
  c5b: {kind: 'battle', battle: PLAN('Carthage rearms, 149 BC (schematic plan)', {units: DEFENDERS, notes: [n('byrsa'), {text: 'hair → catapult ropes (the story goes)', x: 46, y: 40, appear: 0.25}], zoom: [{at: 0, cx: 44, cy: 30, s: 1.45}, {at: 1, cx: 44, cy: 32, s: 1.6}]}), overlays: [{type: 'citation', text: 'Appian, Punica 93', at: [0.05, 0.95]}]},
  c5c: {kind: 'battle', battle: SIEGE_HOLD},
  c5d: map(-148, {camera: cam([7.0, 36.2], 9, [7.2, 36.3], 10.5), territories: B149, cities: [{...C3.cirta, size: 1.3}], regions: [{text: 'MASINISSA DIES, ≈ 90', at: [5.6, 35.5], appear: 0.15, size: 30}]}, [
    {type: 'citation', text: 'Appian, Punica 105–106 (age approximate)', at: [0.3, 0.98]},
  ]),
  c5e: {kind: 'battle', battle: PLAN('The secret channel (schematic plan)', {
    phases: [{at: 0, title: 'The secret channel', sub: 'Rome blocks the harbour mouth — watch the new exit'}],
    units: [
      blk('mole', 'b', [{at: 0, x: 61, y: 50, w: 0.5, h: 2, opacity: 0}, {at: 0.2, x: 61, y: 50.5, w: 7, h: 2, opacity: 1}], 'Roman dam', 'light'),
      blk('f1', 'a', [{at: 0, x: 64, y: 40, w: 3, h: 1.4, opacity: 0}, {at: 0.55, x: 70, y: 37, opacity: 1}, {at: 1, x: 80, y: 34}], '~50 new warships', 'ship'),
      blk('f2', 'a', [{at: 0, x: 64, y: 41, w: 3, h: 1.4, opacity: 0}, {at: 0.6, x: 71, y: 39.5, opacity: 1}, {at: 1, x: 82, y: 38}], undefined, 'ship'),
    ],
    arrows: [{from: [65, 39], via: [70, 37], to: [76, 35], side: 'a', draw: [0.35, 0.65], width: 1.1}],
    notes: [n('war'), n('trade'), n('sea', 0.1)],
    zoom: [{at: 0, cx: 64, cy: 42, s: 2.0}, {at: 1, cx: 68, cy: 40, s: 1.7}],
  }), overlays: [{type: 'citation', text: 'Appian, Punica 121 — "about fifty" ships', at: [0.4, 0.98]}]},
  c5f: map(-147, {camera: cam([11.6, 39.6], 6.5, [10.8, 37.6], 10), territories: B149, cities: [C3.romePlain, C3.carthagePlain], routes: [route('scipio', SEA_TO_ROME.slice().reverse(), [0.1, 0.7], {color: COL3.rome, unit: {label: 'Scipio Aemilianus', color: COL3.rome}})]}, [
    {type: 'citation', text: 'Appian, Punica 112: consul for 147 BC', at: [0.4, 0.98]},
  ]),
  c5g: {kind: 'battle', battle: PLAN('Blockade, 147 BC (schematic plan)', {phases: [{at: 0, title: 'Phase 2 — Cut off', sub: 'Roman camps by land, Roman ships by sea'}], units: [...ROMAN_CAMPS, ...ROMAN_SHIPS, ...DEFENDERS], notes: [n('walls'), n('sea')], zoom: [{at: 0, cx: 50, cy: 28, s: 1.0}, {at: 1, cx: 50, cy: 28, s: 1.12}]})},
  c5h: {kind: 'battle', battle: PLAN('Spring 146 BC (schematic plan)', {
    phases: [{at: 0, title: 'Phase 3 — The final assault', sub: 'Harbour first, then street by street to the citadel'}],
    units: [...ROMAN_CAMPS, blk('ra', 'b', [{at: 0, x: 62, y: 49, w: 4, h: 2.4}, {at: 0.4, x: 62, y: 42}, {at: 0.9, x: 57, y: 33}], 'Roman assault'), ...DEFENDERS],
    arrows: [
      {from: [62, 50], via: [63, 46], to: [62, 42], side: 'b', draw: [0.05, 0.35]},
      {from: [62, 42], via: [60, 37], to: [56, 33], side: 'b', draw: [0.4, 0.8]},
    ],
    notes: [n('byrsa'), n('war', 0.05, 0.5), {text: '6 days and nights of street fighting', x: 48, y: 44, appear: 0.55}],
    zoom: [{at: 0, cx: 60, cy: 40, s: 1.8}, {at: 1, cx: 56, cy: 34, s: 2.0}],
  }), overlays: [{type: 'citation', text: 'Appian, Punica 127–129', at: [0.3, 0.98]}]},
  c5i: {kind: 'art', art: {id: 'assault-1885', title: 'Final assault on Carthage, 146 BC — engraving, 1885', from: {x: 0.5, y: 0.35, zoom: 1.0}, to: {x: 0.5, y: 0.55, zoom: 1.12}}, overlays: [
    {type: 'glossary', term: 'Citadel', meaning: "a fortress on a city's highest point", window: [0.04, 0.4]},
    {type: 'counter', label: 'PEOPLE ENSLAVED (APPIAN)', value: 50000, window: [0.4, 0.98], color: '#e0675b', context: '≈ a packed big football stadium', top: 200},
    {type: 'citation', text: 'Appian, Punica 130', at: [0.4, 0.98]},
  ]},
  c5j: {kind: 'art', art: {id: 'buys-scipio', title: 'Jacobus Buys, Scipio and Polybius at the ruins of Carthage, 1797', from: {x: 0.5, y: 0.4, zoom: 1.0}, to: {x: 0.5, y: 0.5, zoom: 1.15}}, overlays: [
    {type: 'character', name: 'Polybius', role: 'Greek historian, eyewitness', line: "Scipio's friend. He was there and wrote down what he saw.", window: [0.04, 0.7]},
  ]},
  c5k: {kind: 'map', year: -146, map: M({camera: CLOSE, territories: [...B149.filter((t) => t.id !== 'carthage-150'), AFRICA_146]}), overlays: [{type: 'quote', text: 'A day will come when sacred Troy shall perish', by: 'Homer, quoted by Scipio (Polybius 38.22; Appian, Punica 132)'}]},
  c5l: recap('After three years of siege, Carthage fell. Over 600 years of history ended in days.', {camera: CLOSE, territories: [...B149, AFRICA_146]}, 'But one famous detail is probably false…'),

  // 6 — Myth or Fact
  c6: chapter(6, 'Myth or Fact', 'The salted earth', {camera: CLOSE, territories: [...B149, AFRICA_146]}, 'turner-decline', 'Did Rome really salt the earth?'),
  c6a: map(-146, {camera: cam([10.3, 36.85], 34, [10.3, 36.85], 44), territories: [...B149, AFRICA_146], cities: [C3.carthagePlain], regions: [{text: 'SALT?', at: [10.1, 36.62], appear: 0.35, size: 64}]}),
  c6b: {kind: 'map', year: -146, map: M({camera: CLOSE, territories: [...B149, AFRICA_146]}), overlays: [{type: 'list', title: 'Who mentions salt?', items: ['Polybius, who was there: no', 'Appian: no', 'Any ancient writer: no'], source: 'R. T. Ridley, Classical Philology 81 (1986)'}]},
  c6c: map(-146, {camera: cam([10.3, 36.85], 30, [10.3, 36.85], 26), territories: [...B149, AFRICA_146], cities: [C3.carthagePlain], regions: [{text: 'MODERN MYTH', at: [10.1, 36.62], appear: 0.2, size: 50}]}, [
    {type: 'citation', text: 'Ridley 1986: first in modern books (Cambridge Ancient History, 1930)', at: [0.1, 0.98]},
  ]),
  c6d: map(-146, {camera: TUNISIA, territories: [...B149, {...AFRICA_146, grow: [0.05, 0.45]}], cities: [C3.carthagePlain], regions: [{text: 'PROVINCE OF AFRICA', at: [10.3, 35.9], appear: 0.35, size: 34}]}, [
    {type: 'glossary', term: 'Province', meaning: 'a territory ruled directly by Rome', window: [0.4, 0.98]},
    {type: 'citation', text: 'Appian, Punica 135', at: [0.05, 0.4]},
  ]),
  c6e: recap('The city burned and the land became Roman. But the salt is a modern myth.', {camera: TUNISIA, territories: [...B149, AFRICA_146]}, 'And the story of this place was not over…'),

  // 7 — Then and Now
  c7: chapter(7, 'Then and Now', '146 BC → today', {camera: CLOSE, territories: [...B149, AFRICA_146]}, 'byrsa-photo', 'What is left of Carthage today?'),
  c7a: map(undefined, {camera: CLOSE, territories: [...B149, AFRICA_146], cities: [C3.carthagePlain], regions: [{text: 'ROMAN CARTHAGE', at: [10.55, 36.6], appear: 0.45, size: 32}]}, [
    {type: 'citation', text: 'Appian, Punica 136 · Britannica: Colonia Julia Carthago', at: [0.3, 0.98]},
  ]),
  c7b: map(undefined, {camera: WEST_MED, territories: [...ROMAN, NUMIDIA, EMPORIA, TYSCA, AFRICA_146], cities: [C3.romePlain, C3.carthagePlain]}),
  c7c: art('byrsa-photo', 'Byrsa hill today, Carthage (Tunisia) — photo J.-P. Dalbéra, CC BY 2.0', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.5, zoom: 1.18}, [
    {type: 'glossary', term: 'World Heritage Site', meaning: 'a place UNESCO protects for all humanity', window: [0.5, 0.98]},
    {type: 'citation', text: 'UNESCO World Heritage List no. 37 (1979)', at: [0.5, 0.98]},
  ]),
  c7d: art('port-photo', 'The round war harbour today — photo Neil Rickards, CC BY 2.0', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.2}),
  c7e: map(undefined, {camera: WEST_MED, territories: [...ROMAN, NUMIDIA, EMPORIA, TYSCA, {...CARTHAGE_150, fadeOut: [0.4, 0.9]}], cities: [C3.carthagePlain, C3.romePlain]}),
  c7f: map(-150, {camera: ROME_CLOSE, territories: ROMAN, cities: [C3.romePlain], regions: [{text: 'CATO: DESTROY IT', at: [12.8, 42.9], appear: 0.1, size: 34}]}),
  c7h: art('turner-decline', '', {x: 0.55, y: 0.48, zoom: 1.22}, {x: 0.5, y: 0.5, zoom: 1.05}, [{type: 'endscreen', teaser: 'Hannibal: the man who nearly destroyed Rome'}]),
  c7g: map(-150, {camera: CLOSE, territories: [...B149, {...AFRICA_146, grow: [0.35, 0.95]}], cities: [{...C3.carthage, size: 1.5}], regions: [{text: 'NASICA: SPARE IT', at: [10.6, 37.25], appear: 0.1, size: 30}]}),
};
