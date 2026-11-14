import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import type {BattleSpec, BUnit} from '../../../../packages/engine/src/map/battle';
import {arcUnits} from '../../../../packages/engine/src/map/battle';
import type {City, LonLat, MapSpec} from '../../../../packages/engine/src/map/map';
import {MODERN} from '../../data/punic3';
import {
  BARCID_SPAIN, C, CARTHAGE_AFRICA, COL, DEFECTORS, EXILE, HANNIBAL_HOME, HASDRUBAL, MARCH, ROMAN_SPAIN, ROME_ITALY,
  SARD_CORSICA, SCIPIO_AFRICA, SCIPIO_SPAIN, SICILY, SICILY_CARTHAGE, TO_ARNO, TO_BITHYNIA, TO_CANNAE, TO_TREBIA,
} from '../../data/punic';

// Episode 001 "Hannibal: The Man Who Nearly Destroyed Rome" — visual design per scene id (see timeline.json).

const HANNIBAL = {label: 'Hannibal', color: COL.carthage, kind: 'infantry' as const};
const SIDES = {a: {name: 'Carthage', color: '#c8812a'}, b: {name: 'Rome', color: '#a8322d'}};
const base = [ROME_ITALY, SARD_CORSICA, SICILY, CARTHAGE_AFRICA, BARCID_SPAIN];
const WEST_MED: MapSpec['camera'] = [{at: 0, center: [8, 39.5], zoom: 4.6}, {at: 1, center: [7, 40], zoom: 5.2}];

// ---------- battles ----------
const romanBlocks = (xs: number[][], ys: number[][], ws: number[], ats: number[]): BUnit[] => {
  const out: BUnit[] = [];
  xs[0].forEach((_, ci) =>
    ys[0].forEach((__, ri) =>
      out.push({id: `r${ci}${ri}`, side: 'b', kind: 'inf', label: ci === 1 && ri === 0 ? 'Roman legions' : undefined, count: ci === 1 && ri === 0 ? '~80,000' : undefined, keys: ats.map((at, k) => ({at, x: xs[k][ci], y: ys[k][ri], w: ws[k], h: 4.4}))}),
    ),
  );
  return out;
};

const CANNAE: BattleSpec = {
  title: 'Cannae, 216 BC',
  phases: [
    {at: 0, title: 'Phase 1 — The trap is set', sub: 'A curved centre in front, African veterans hidden at the ends'},
    {at: 0.32, title: 'Phase 2 — The centre bends', sub: 'Watch the Roman mass push into a pocket'},
    {at: 0.64, title: 'Phase 3 — Surrounded', sub: 'Veterans close the sides, cavalry closes the back'},
  ],
  sides: SIDES,
  terrain: {river: [[7, -5], [5, 15], [8, 30], [6, 45], [8, 60]]},
  units: [
    ...romanBlocks(
      [[38, 46, 54, 62], [38, 46, 54, 62], [41, 47.3, 52.7, 59], [43, 48, 52, 57]],
      [[12, 17], [19, 24], [25, 30], [26.5, 31]],
      [7, 7, 6, 4.8],
      [0, 0.3, 0.6, 1],
    ),
    {id: 'rcavL', side: 'b', kind: 'cav', label: 'Roman cavalry', labelUntil: 0.4, keys: [{at: 0, x: 24, y: 15, w: 6, h: 3}, {at: 0.3, x: 24, y: 17}, {at: 0.45, x: 23, y: 25}, {at: 0.6, x: 12, y: 8, opacity: 0}]},
    {id: 'rcavR', side: 'b', kind: 'cav', label: 'Allied cavalry', labelUntil: 0.4, keys: [{at: 0, x: 76, y: 15, w: 6, h: 3}, {at: 0.3, x: 76, y: 17}, {at: 0.45, x: 77, y: 25}, {at: 0.8, x: 96, y: 18, opacity: 0}]},
    ...arcUnits('g', 'a', 7, [
      {at: 0, cx: 50, cy: 52, r: 22, a0: -2.25, a1: -0.89},
      {at: 0.3, cx: 50, cy: 52, r: 22, a0: -2.25, a1: -0.89},
      {at: 0.62, cx: 50, cy: 20, r: 17, a0: 2.25, a1: 0.89},
      {at: 1, cx: 50, cy: 17, r: 18, a0: 2.3, a1: 0.84},
    ], {w: 4, h: 2.6}),
    {id: 'afL', side: 'a', kind: 'inf', label: 'Africans', keys: [{at: 0, x: 31, y: 37, w: 5, h: 7}, {at: 0.62, x: 31, y: 36}, {at: 0.85, x: 37, y: 28, rot: 90}, {at: 1, x: 38.5, y: 28, rot: 90}]},
    {id: 'afR', side: 'a', kind: 'inf', label: 'Africans', keys: [{at: 0, x: 69, y: 37, w: 5, h: 7}, {at: 0.62, x: 69, y: 36}, {at: 0.85, x: 63, y: 28, rot: -90}, {at: 1, x: 61.5, y: 28, rot: -90}]},
    {id: 'hcav', side: 'a', kind: 'cav', label: 'Heavy cavalry', labelUntil: 0.4, keys: [{at: 0, x: 22, y: 37, w: 6, h: 3}, {at: 0.3, x: 22, y: 33}, {at: 0.45, x: 23, y: 27}, {at: 0.66, x: 30, y: 7}, {at: 0.82, x: 58, y: 7}, {at: 1, x: 50, y: 20}]},
    {id: 'ncav', side: 'a', kind: 'cav', label: 'Numidians', labelUntil: 0.4, keys: [{at: 0, x: 78, y: 37, w: 6, h: 3}, {at: 0.3, x: 78, y: 33}, {at: 0.45, x: 77, y: 27}, {at: 0.8, x: 92, y: 18}, {at: 1, x: 66, y: 16}]},
  ],
  arrows: [
    {from: [50, 8], to: [50, 30], side: 'b', draw: [0.12, 0.5], width: 2.2},
    {from: [22, 31], via: [24, 4], to: [46, 8], side: 'a', draw: [0.6, 0.85]},
    {from: [31, 38], to: [39, 29], side: 'a', draw: [0.66, 0.84]},
    {from: [69, 38], to: [61, 29], side: 'a', draw: [0.66, 0.84]},
    {from: [58, 6], via: [56, 10], to: [52, 16], side: 'a', draw: [0.84, 0.97]},
  ],
  notes: [
    {text: 'River Aufidus', x: 9, y: 52, appear: 0.0},
    {text: 'Deep Roman formation', x: 50, y: 5, appear: 0.04, until: 0.5},
    {text: 'Gauls & Iberians (curved center)', x: 50, y: 45, appear: 0.08, until: 0.6},
    {text: 'Encircled', x: 50, y: 40, appear: 0.9},
  ],
  zoom: [{at: 0, cx: 50, cy: 28, s: 1}, {at: 1, cx: 50, cy: 24, s: 1.12}],
};

const TREBIA: BattleSpec = {
  title: 'Trebia, December 218 BC',
  phases: [
    {at: 0, title: 'Phase 1 — The bait', sub: 'Numidian riders lure the Romans across the icy river'},
    {at: 0.55, title: 'Phase 2 — The trap closes', sub: 'Mago’s hidden men strike from behind'},
  ],
  sides: SIDES,
  terrain: {river: [[52, -5], [49, 10], [53, 25], [48, 40], [51, 60]], hills: [{x: 62, y: 50, r: 6}]},
  units: [
    {id: 'num', side: 'a', kind: 'cav', label: 'Numidian horse', labelUntil: 0.3, keys: [{at: 0, x: 30, y: 28, w: 6, h: 3}, {at: 0.15, x: 72, y: 28}, {at: 0.35, x: 30, y: 31}, {at: 1, x: 27, y: 50}]},
    ...[20, 28, 36].map((y, i): BUnit => ({id: `rt${i}`, side: 'b', kind: 'inf', label: i === 1 ? 'Roman army' : undefined, labelUntil: 0.45, keys: [{at: 0, x: 82, y, w: 7, h: 5}, {at: 0.15, x: 80, y}, {at: 0.45, x: 52, y}, {at: 0.6, x: 40, y}, {at: 0.82, x: 37, y: y < 25 ? 22 : y, opacity: i === 0 ? 1 : 0.85}, {at: 1, x: i === 0 ? 20 : 38, y: i === 0 ? 12 : y, opacity: i === 0 ? 1 : 0.2}]})),
    ...[18, 28, 38].map((y, i): BUnit => ({id: `ct${i}`, side: 'a', kind: 'inf', keys: [{at: 0, x: 24, y, w: 6, h: 5}, {at: 0.6, x: 26, y}, {at: 0.85, x: 31, y}]})),
    {id: 'eleN', side: 'a', kind: 'ele', keys: [{at: 0, x: 26, y: 10, w: 3, h: 2.6}, {at: 0.65, x: 28, y: 12}, {at: 0.85, x: 34, y: 16}]},
    {id: 'eleS', side: 'a', kind: 'ele', keys: [{at: 0, x: 26, y: 46, w: 3, h: 2.6}, {at: 0.65, x: 28, y: 44}, {at: 0.85, x: 34, y: 40}]},
    {id: 'cavN', side: 'a', kind: 'cav', keys: [{at: 0, x: 22, y: 4, w: 6, h: 3}, {at: 0.65, x: 30, y: 6}, {at: 0.85, x: 42, y: 14}]},
    {id: 'mago', side: 'a', kind: 'inf', label: 'Mago (2,000)', keys: [{at: 0, x: 62, y: 50, w: 6, h: 3, opacity: 0}, {at: 0.55, x: 62, y: 50, opacity: 0}, {at: 0.62, x: 62, y: 50, opacity: 1}, {at: 0.82, x: 45, y: 38}]},
  ],
  arrows: [
    {from: [82, 28], to: [42, 28], side: 'b', draw: [0.15, 0.5], width: 1.2},
    {from: [62, 49], via: [56, 46], to: [46, 39], side: 'a', draw: [0.62, 0.8]},
    {from: [38, 22], via: [30, 14], to: [18, 9], side: 'b', draw: [0.86, 1]},
  ],
  notes: [
    {text: "Hannibal's army", x: 24, y: 44, appear: 0.02, until: 0.5},
    {text: 'Icy river, no breakfast', x: 52, y: 12, appear: 0.3, until: 0.62},
    {text: 'Hidden in a stream bed', x: 62, y: 43, appear: 0.42, until: 0.7},
    {text: '≈10,000 break out', x: 20, y: 5, appear: 0.9},
  ],
};

const TRASIMENE: BattleSpec = {
  title: 'Lake Trasimene, 217 BC',
  phases: [
    {at: 0, title: 'Phase 1 — Into the fog', sub: 'A long Roman column on a narrow lakeside strip'},
    {at: 0.5, title: 'Phase 2 — The ambush', sub: 'Hannibal’s men charge down the hills'},
  ],
  sides: SIDES,
  terrain: {
    lake: [[-20, 41], [20, 39], [40, 40.5], [60, 38.5], [80, 40], [120, 39], [120, 70], [-20, 70]],
    hills: [{x: 15, y: 13, r: 10}, {x: 38, y: 11, r: 11}, {x: 62, y: 12, r: 11}, {x: 86, y: 13, r: 10}],
    fog: [0.35, 0.6],
  },
  units: [
    ...Array.from({length: 8}, (_, i): BUnit => {
      const x = 12 + i * 10;
      return {id: `col${i}`, side: 'b', kind: 'inf', label: i === 7 ? 'Flaminius' : undefined, keys: [{at: 0, x: x - 14, y: 34, w: 6, h: 2.2}, {at: 0.45, x, y: 34}, {at: 0.72, x, y: 35}, {at: 1, x: x + (i % 2 ? 1 : -1), y: 43, opacity: 0.25}]};
    }),
    ...[15, 38, 62, 86].map((x, i): BUnit => ({id: `amb${i}`, side: 'a', kind: i === 3 ? 'cav' : 'inf', label: i === 1 ? 'Hannibal' : undefined, keys: [{at: 0, x, y: 17, w: 7, h: 3, opacity: 0}, {at: 0.42, x, y: 17, opacity: 0}, {at: 0.55, x, y: 17, opacity: 1}, {at: 0.8, x, y: 29}]})),
  ],
  arrows: [15, 38, 62, 86].map((x) => ({from: [x, 19] as [number, number], to: [x, 31] as [number, number], side: 'a' as const, draw: [0.56, 0.74] as [number, number]})),
  notes: [
    {text: 'Morning fog', x: 50, y: 24, appear: 0.0, until: 0.45},
    {text: 'Narrow strip between lake and hills', x: 50, y: 30, appear: 0.12, until: 0.5},
    {text: 'Nowhere to go but the water', x: 50, y: 50, appear: 0.8},
  ],
};

const ZAMA: BattleSpec = {
  title: 'Zama, 202 BC',
  phases: [
    {at: 0, title: 'Phase 1 — The elephants charge', sub: 'Watch the open lanes in the Roman lines'},
    {at: 0.5, title: 'Phase 2 — Cannae in reverse', sub: 'Roman cavalry comes back and strikes from behind'},
  ],
  sides: SIDES,
  units: [
    ...[34, 42, 50, 58, 66].flatMap((x, ci) =>
      [12, 17, 22].map((y, ri): BUnit => ({id: `m${ci}${ri}`, side: 'b', kind: 'inf', label: ci === 2 && ri === 0 ? 'Scipio' : undefined, keys: [{at: 0, x, y, w: 4, h: 3.4}, {at: 0.55, x, y}, {at: 0.78, x, y: y + 8}]})),
    ),
    {id: 'laelius', side: 'b', kind: 'cav', label: 'Laelius', keys: [{at: 0, x: 18, y: 17, w: 6, h: 3}, {at: 0.55, x: 18, y: 26}, {at: 0.72, x: 14, y: 58}, {at: 0.88, x: 30, y: 52}]},
    {id: 'masinissa', side: 'b', kind: 'cav', label: 'Masinissa', keys: [{at: 0, x: 82, y: 17, w: 6, h: 3}, {at: 0.55, x: 82, y: 26}, {at: 0.72, x: 86, y: 58}, {at: 0.88, x: 70, y: 52}]},
    ...Array.from({length: 8}, (_, i): BUnit => {
      const x0 = 30 + i * 5.7;
      const lane = [38, 46, 54, 62][i % 4];
      const veer = i === 0 ? 18 : i === 7 ? 82 : null;
      return {
        id: `el${i}`, side: 'a', kind: 'ele', label: i === 3 ? 'Elephants' : undefined, labelUntil: 0.2,
        keys: veer
          ? [{at: 0, x: x0, y: 31, w: 3, h: 2.6}, {at: 0.1, x: x0, y: 31}, {at: 0.3, x: veer, y: 34}, {at: 0.42, x: veer, y: 38, opacity: 0}]
          : [{at: 0, x: x0, y: 31, w: 3, h: 2.6}, {at: 0.1, x: x0, y: 31}, {at: 0.28, x: lane, y: 24}, {at: 0.45, x: lane, y: 2, opacity: 0}],
      };
    }),
    ...[36, 42, 48].map((y, i): BUnit => ({id: `cl${i}`, side: 'a', kind: 'inf', label: i === 2 ? 'Veterans of Italy' : undefined, keys: [{at: 0, x: 50, y, w: 40, h: 3}, {at: 0.6, x: 50, y: y - 1}, {at: 0.8, x: 50, y: y - 3}]})),
    {id: 'ccavL', side: 'a', kind: 'cav', keys: [{at: 0, x: 18, y: 34, w: 6, h: 3}, {at: 0.55, x: 18, y: 30}, {at: 0.72, x: 12, y: 62, opacity: 0}]},
    {id: 'ccavR', side: 'a', kind: 'cav', keys: [{at: 0, x: 82, y: 34, w: 6, h: 3}, {at: 0.55, x: 82, y: 30}, {at: 0.72, x: 88, y: 62, opacity: 0}]},
  ],
  arrows: [
    {from: [50, 31], to: [50, 6], side: 'a', draw: [0.1, 0.35], width: 1.8},
    {from: [82, 20], via: [92, 40], to: [86, 57], side: 'b', draw: [0.56, 0.72]},
    {from: [18, 20], via: [8, 40], to: [14, 57], side: 'b', draw: [0.56, 0.72]},
    {from: [86, 58], via: [80, 56], to: [68, 51], side: 'b', draw: [0.8, 0.94]},
    {from: [14, 58], via: [20, 56], to: [32, 51], side: 'b', draw: [0.8, 0.94]},
  ],
  notes: [
    {text: 'Over 80 elephants', x: 50, y: 28, appear: 0.0, until: 0.15},
    {text: 'Open lanes', x: 50, y: 6, appear: 0.12, until: 0.48},
    {text: 'Cannae in reverse', x: 50, y: 54, appear: 0.88},
  ],
};

// ---------- Clarity Kit (docs/CLARITY_STANDARD.md + VIEWER_CLARITY_FEEDBACK.md) ----------
export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Carthage', color: COL.carthage},
    {name: 'Rome', color: COL.rome, pattern: 'hatch'},
  ],
  highlight: {Carthage: '#f0a650', Carthaginian: '#f0a650', Hannibal: '#f0a650', Rome: '#ef6a5e', Roman: '#ef6a5e', Romans: '#ef6a5e'},
  now: 2026,
  chapters: {c1: 'The Oath', c2: 'The March', c3: 'Three Disasters', c4: 'Cannae', c5: 'The Long War', c6: 'Zama', c7: 'The Last Years'},
};

type Spec = Omit<MapSpec, 'modern' | 'avoidLabels'>;
/** Every map: modern borders + names, label avoidance, shaded relief, phone-size text, Rome hatched. */
const M = (spec: Spec): MapSpec => ({
  ...spec,
  territories: (spec.territories ?? []).map((t) => (t.color === COL.rome ? {...t, pattern: 'hatch' as const} : t)),
  modern: {labels: MODERN},
  avoidLabels: true,
  relief: true,
  minText: 30,
});
const map = (year: number | undefined, spec: Spec, overlays?: Overlay[]): SceneDef => ({kind: 'map', year, map: M(spec), overlays});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[]): SceneDef => ({kind: 'art', art: {id, title, from, to}, overlays});
const chapter = (n: number, title: string, sub: string, spec: Spec, image: string, question: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'chapter', n, title, sub, image, question}]});
const recap = (text: string, next: string, spec: Spec): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'recap', text, next}]});
const T = (c: City, today: string, extra: Partial<City> = {}): City => ({...c, today, ...extra});
const G = (term: string, meaning: string, window: [number, number] = [0.1, 0.9]): Overlay => ({type: 'glossary', term, meaning, window});
const who = (name: string, role: string, line: string, side?: string, image?: string, window?: [number, number]): Overlay => ({type: 'character', name, role, line, side, image, window});
const RIVER = {ebro: {name: 'Ebro', label: 'Ebro river', at: [0.2, 41.3] as LonLat}, rhone: {name: 'Rhône', label: 'Rhône river', at: [4.9, 44.9] as LonLat}, po: {name: 'Po', label: 'Po river', at: [10.6, 45.15] as LonLat}};

// then → now (sources.md rows 30–31)
const CT = {
  carthage: T(C.carthage, 'near Tunis, Tunisia'),
  rome: T(C.rome, 'Rome, Italy'),
  newCarthage: T(C.newCarthage, 'Cartagena, Spain'),
  saguntum: T(C.saguntum, 'Sagunto, Spain'),
  gades: T(C.gades, 'Cádiz, Spain'),
  massalia: T(C.massalia, 'Marseille, France'),
  turin: T({...C.turin, name: 'Taurini'}, 'Turin, Italy'),
  placentia: T(C.placentia, 'Piacenza, Italy'),
  trasimene: T(C.trasimene, 'Umbria, Italy'),
  cannae: T(C.cannae, 'Puglia, Italy'),
  capua: T(C.capua, 'Campania, Italy'),
  tarraco: T(C.tarraco, 'Tarragona, Spain'),
  metaurus: T(C.metaurus, 'Marche, Italy'),
  utica: T(C.utica, 'Utique, Tunisia'),
  zama: T(C.zama, 'Tunisia (site debated)'),
  croton: T(C.croton, 'Crotone, Italy'),
  ephesus: T(C.ephesus, 'near Selçuk, Turkey'),
  libyssa: T(C.libyssa, 'near Gebze, Turkey'),
  tyre: T(C.tyre, 'Tyre (Sour), Lebanon'),
};

// ---------- scene table ----------
const italy = (zoomFrom = 9, zoomTo = 10): MapSpec['camera'] => [{at: 0, center: [12.8, 42.4], zoom: zoomFrom}, {at: 1, center: [13.2, 42.0], zoom: zoomTo}];
const BARCAS: Overlay = {
  type: 'family', title: 'The Barca family', side: 'Carthage', window: [0.04, 0.98],
  parent: {name: 'Hamilcar', note: 'father, general'},
  children: [{name: 'Hannibal', note: 'eldest son', highlight: true}, {name: 'Hasdrubal', note: 'brother'}, {name: 'Mago', note: 'youngest'}],
  inLaw: {name: 'Hasdrubal the Fair', note: 'a different Hasdrubal!'},
};

const BASE_SCENES: Record<string, SceneDef> = {
  // cold open: a real painting first, then who / where / when
  c0a: art('trumbull-cannae', 'John Trumbull, The Death of Paulus Aemilius at the Battle of Cannae, 1773', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.45, zoom: 1.2}, [G('Cannae', "a village in southern Italy (today's Puglia)", [0.1, 0.95])]),
  c0a_2: art('trumbull-cannae', '', {x: 0.55, y: 0.45, zoom: 1.2}, {x: 0.45, y: 0.5, zoom: 1.35}),
  c0b: map(-216, {camera: [{at: 0, center: [16.0, 41.4], zoom: 34}, {at: 1, center: [15.0, 41.6], zoom: 22}], territories: base, cities: [{...CT.cannae, size: 1.4}]}, [
    {type: 'counter', label: 'ROMAN DEAD (POLYBIUS)', value: 70000, window: [0.05, 0.98], color: '#e0675b', context: '≈ a sold-out 70,000-seat stadium'},
    {type: 'citation', text: 'Polybius 3.117; Livy 22.49 — figures disputed', at: [0.05, 0.98]},
    G('BC', 'years before year 1 — they count down', [0.45, 0.98]),
  ]),
  c0b_2: map(-216, {camera: [{at: 0, center: [15.0, 41.6], zoom: 22}, {at: 1, center: [14.6, 41.7], zoom: 18}], territories: base, cities: [{...CT.cannae, size: 1.4}]}, [
    {type: 'counter', label: 'ROMAN DEAD (LIVY)', value: 50000, window: [0.0, 0.98], color: '#f4ecd8'},
    who('Polybius & Livy', 'Ancient historians', 'Greek (Polybius) and Roman (Livy). Our two main sources.', undefined, undefined, [0.4, 0.98]),
  ]),
  c0c: art('turner-hannibal', '', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.15}, [{type: 'title', title: 'HANNIBAL', sub: 'THE MAN WHO NEARLY DESTROYED ROME'}]),

  c1: chapter(1, 'The Oath', '247 – 219 BC', {camera: WEST_MED, territories: base}, 'west-oath', 'Why would a 9-year-old swear to hate Rome?'),
  c1a: map(-241, {camera: [{at: 0, center: [13.5, 38.0], zoom: 14}, {at: 1, center: [12.5, 38.4], zoom: 11}], territories: [ROME_ITALY, CARTHAGE_AFRICA, {...SICILY_CARTHAGE, fadeOut: [0.55, 0.75]}, {...SICILY, grow: [0.65, 0.9]}], cities: [{...CT.carthage, appear: 0.05}, {...CT.rome, appear: 0.05}], regions: [{text: 'SICILY', at: [14.2, 37.2], appear: 0.15, size: 38}]}, [
    who('Hamilcar Barca', "Carthaginian general, Hannibal's father", 'Fought Rome in Sicily for years.', 'Carthage', undefined, [0.03, 0.98]),
  ]),
  c1a_2: map(-241, {camera: [{at: 0, center: [12.5, 38.4], zoom: 11}, {at: 1, center: [12.0, 38.2], zoom: 10}], territories: [ROME_ITALY, CARTHAGE_AFRICA, SICILY], cities: [CT.carthage, CT.rome], regions: [{text: 'SICILY', at: [14.2, 37.2], size: 38}]}, [
    G('Punic Wars', 'Rome vs Carthage (Punic = Carthaginian)', [0.05, 0.6]),
    {type: 'citation', text: 'Polybius 1.62–63: Sicily ceded to Rome, 241 BC', at: [0.05, 0.95]},
  ]),
  c1b: map(-237, {camera: [{at: 0, center: [8, 39.5], zoom: 6.5}, {at: 1, center: [2, 38.5], zoom: 7}], territories: [ROME_ITALY, SICILY, CARTHAGE_AFRICA, {...SARD_CORSICA, grow: [0.05, 0.35]}], routes: [{id: 'hamilcar', points: [[10.32, 36.85], [5.0, 36.4], [0.0, 36.3], [-6.29, 36.53]], color: COL.route, draw: [0.5, 0.92], dashed: true, km: true, unit: {label: 'Hamilcar', color: COL.carthage, kind: 'infantry'}}], cities: [CT.carthage, {...CT.gades, appear: 0.85}], regions: [{text: 'IBERIA', at: [-4.0, 40.2], appear: 0.6, size: 44}]}, [
    G('Mercenaries', 'soldiers paid to fight for someone else', [0.05, 0.45]),
    G('Iberia', "today's Spain and Portugal", [0.55, 0.98]),
  ]),
  c1c: art('west-oath', 'Benjamin West, The Oath of Hannibal, 1770', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.42, y: 0.45, zoom: 1.25}),
  c1c_2: art('west-oath', '', {x: 0.42, y: 0.45, zoom: 1.25}, {x: 0.5, y: 0.5, zoom: 1.05}, [{type: 'quote', text: 'Never to be a friend of Rome', by: "Hannibal's oath at age nine, as he told it (Polybius 3.11)", at: [0.05, 0.97]}]),
  c1d: map(-221, {camera: [{at: 0, center: [-3, 39.5], zoom: 11}, {at: 1, center: [-1.2, 39.4], zoom: 13}], territories: [{...BARCID_SPAIN, grow: [0.02, 0.4]}, CARTHAGE_AFRICA], rivers: [RIVER.ebro], cities: [{...CT.newCarthage, appear: 0.15}], regions: [{text: 'BARCID SPAIN (APPROX.)', at: [-3.6, 38.4], appear: 0.25, size: 34}]}, [BARCAS]),
  c1d_2: map(-219, {camera: [{at: 0, center: [-1.2, 39.4], zoom: 13}, {at: 1, center: [-0.6, 39.6], zoom: 16}], territories: [BARCID_SPAIN, CARTHAGE_AFRICA], rivers: [RIVER.ebro], cities: [CT.newCarthage, {...CT.saguntum, appear: 0.15, size: 1.3}]}, [
    G('Siege', 'surrounding a city until it gives up', [0.1, 0.6]),
    {type: 'citation', text: 'Siege of Saguntum: 8 months (Polybius 3.17)', at: [0.55, 0.98]},
  ]),
  c1z: recap('A father’s war, a son’s oath, and a Carthaginian empire in Spain.', 'But where would Hannibal fight Rome?…', {camera: WEST_MED, territories: base}),

  c2: chapter(2, 'The March', '218 BC', {camera: [{at: 0, center: [3, 42], zoom: 7}, {at: 1, center: [4, 42.5], zoom: 7.6}], territories: base}, 'leutemann-alps', 'How do you march elephants over the Alps?'),
  c2a: map(-218, {camera: [{at: 0, center: [6, 39], zoom: 5}, {at: 0.45, center: [-1.2, 39.0], zoom: 11}, {at: 1, center: [-0.6, 39.6], zoom: 12.5}], territories: base, cities: [{...CT.newCarthage, appear: 0.4}]}),
  c2a_2: map(-218, {camera: [{at: 0, center: [-0.6, 39.6], zoom: 12.5}, {at: 1, center: [0.2, 40.6], zoom: 13}], territories: base, rivers: [RIVER.ebro], cities: [CT.newCarthage], routes: [{id: 'ebro', points: MARCH.slice(0, 4), color: COL.route, draw: [0.05, 0.6], unit: HANNIBAL}]}, [
    {type: 'counter', label: 'INFANTRY (CLAIMED)', value: 90000, window: [0.05, 0.98], context: 'Polybius — likely inflated'},
    {type: 'counter', label: 'CAVALRY (CLAIMED)', value: 12000, window: [0.15, 0.98], top: 520, color: '#f4ecd8'},
  ]),
  c2b: map(-218, {camera: [{at: 0, center: [0.6, 41.2], zoom: 11}, {at: 1, center: [3.4, 43.0], zoom: 12}], territories: base, rivers: [RIVER.rhone], routes: [{id: 'm1', points: MARCH.slice(0, 9), color: COL.route, draw: [0.02, 0.9], km: true, unit: HANNIBAL}], regions: [{text: 'PYRENEES', at: [1.0, 42.9], appear: 0.4, size: 30}, {text: 'GAUL', at: [2.6, 45.6], appear: 0.2}]}, [
    G('Gaul', "today's France, home of Celtic tribes", [0.2, 0.95]),
  ]),
  c2b_2: art('leutemann-alps', 'Heinrich Leutemann, Hannibal’s crossing (woodcut, 1800s)', {x: 0.5, y: 0.6, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.2}, [
    {type: 'citation', text: 'Rafts covered with earth (Polybius 3.46); 37 elephants (Appian)', at: [0.1, 0.98]},
  ]),
  c2c: art('turner-hannibal', 'J. M. W. Turner, Snow Storm: Hannibal and his Army Crossing the Alps, 1812', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.6, y: 0.55, zoom: 1.25}),
  c2c_2: map(-218, {camera: [{at: 0, center: [4.8, 44.3], zoom: 18}, {at: 1, center: [6.6, 45.1], zoom: 24}], territories: base, rivers: [RIVER.rhone], routes: [{id: 'm2a', points: MARCH.slice(0, 9), color: COL.route, draw: [-1, 0]}, {id: 'm2', points: MARCH.slice(8), color: COL.route, draw: [0.05, 0.9], unit: HANNIBAL}], cities: [{...C.rhone}, {...C.pass, appear: 0.6}], regions: [{text: 'ALPS', at: [7.4, 46.0], appear: 0.1, size: 48}]}),
  c2d: map(-218, {camera: [{at: 0, center: [7.4, 45.0], zoom: 30}, {at: 1, center: [8.4, 44.9], zoom: 24}], territories: base, rivers: [RIVER.po], routes: [{id: 'm3', points: MARCH, color: COL.route, draw: [-1, 0], unit: HANNIBAL}], cities: [{...CT.turin, appear: 0.05}]}, [
    {type: 'counter', label: 'INFANTRY LEFT', value: 20000, window: [0.25, 0.98], context: 'from about 90,000 claimed'},
    {type: 'counter', label: 'CAVALRY LEFT', value: 6000, window: [0.35, 0.98], top: 520, color: '#f4ecd8'},
    {type: 'citation', text: "Polybius 3.56, from Hannibal's own inscription", at: [0.1, 0.98]},
  ]),
  c2d_2: map(-218, {camera: [{at: 0, center: [8.4, 44.9], zoom: 24}, {at: 1, center: [11, 43.5], zoom: 9}], territories: base, rivers: [RIVER.po], routes: [{id: 'm3', points: MARCH, color: COL.route, draw: [-1, 0], unit: HANNIBAL}], cities: [CT.turin, {...CT.rome, appear: 0.5}]}),
  c2z: recap('Hannibal crossed the Alps and lost half his army doing it.', 'Now he had to win, fast, in enemy land…', {camera: italy(8, 8.6), territories: base}),

  c3: chapter(3, 'Three Disasters', '218 – 217 BC', {camera: italy(8, 8.6), territories: base}, 'turner-hannibal', 'How do you beat an army twice your size?'),
  c3a: map(-218, {camera: [{at: 0, center: [8.4, 45.1], zoom: 30}, {at: 1, center: [9.3, 45.0], zoom: 36}], territories: base, rivers: [RIVER.po], routes: [{id: 'tr', points: TO_TREBIA.slice(0, 3), color: COL.route, draw: [0.05, 0.85], unit: HANNIBAL}], cities: [{...CT.turin, align: 'left'}, {...C.ticinus, align: 'right', appear: 0.2}]}, [
    G('Consul', 'one of two Roman leaders elected each year', [0.1, 0.5]),
    who('Publius Scipio', 'Roman consul, 218 BC', 'The FATHER. His son of the same name comes later.', 'Rome', undefined, [0.45, 0.98]),
  ]),
  c3a_2: map(-218, {camera: [{at: 0, center: [9.3, 45.0], zoom: 36}, {at: 1, center: [9.6, 45.0], zoom: 40}], territories: base, rivers: [RIVER.po], routes: [{id: 'tr', points: TO_TREBIA, color: COL.route, draw: [0.05, 0.85], unit: HANNIBAL}], cities: [{...CT.placentia, appear: 0.3}, {...C.trebia, appear: 0.6}]}),
  c3b: {kind: 'battle', battle: TREBIA, range: [0, 0.35], overlays: [G('Numidians', "horsemen from today's Algeria and Tunisia", [0.05, 0.6])]},
  c3b_2: {kind: 'battle', battle: TREBIA, range: [0.35, 0.62], overlays: [who('Mago', "Hannibal's youngest brother", 'Hid 2,000 men in a stream bed.', 'Carthage', undefined, [0.2, 0.98])]},
  c3c: {kind: 'battle', battle: TREBIA, range: [0.62, 1]},
  c3d: map(-217, {camera: [{at: 0, center: [9.8, 44.8], zoom: 26}, {at: 1, center: [11.4, 43.6], zoom: 30}], territories: base, routes: [{id: 'arno', points: TO_ARNO, color: COL.route, draw: [0.05, 0.9], unit: HANNIBAL}], cities: [{...C.arno, appear: 0.4}, {...CT.trasimene, appear: 0.85}]}),
  c3e: {kind: 'battle', battle: TRASIMENE, range: [0, 0.5], overlays: [who('Flaminius', 'Roman consul, 217 BC', 'Marched straight into the fog.', 'Rome', undefined, [0.05, 0.6])]},
  c3e_2: {kind: 'battle', battle: TRASIMENE, range: [0.5, 1], overlays: [G('Ambush', 'a surprise attack from hiding', [0.05, 0.5])]},
  c3z: recap('Three Roman armies. Three disasters.', 'Rome decided to try something new: not fighting at all…', {camera: italy(9, 9.6), territories: base}),

  c4: chapter(4, 'Cannae', '216 BC', {camera: [{at: 0, center: [15, 41.5], zoom: 14}, {at: 1, center: [15.6, 41.4], zoom: 16}], territories: base}, 'trumbull-cannae', 'How did 50,000 men surround 86,000?'),
  c4a: map(-217, {camera: italy(9, 10.5), territories: base, routes: [{id: 'ca', points: TO_CANNAE, color: COL.route, draw: [0.1, 0.95], unit: HANNIBAL}], cities: [CT.rome, {...CT.cannae, appear: 0.85}]}, [
    G('Dictator', 'one leader with full power, for 6 months', [0.05, 0.45]),
    who('Fabius Maximus', 'Roman dictator, 217 BC', 'Strategy: follow Hannibal, never fight him.', 'Rome', undefined, [0.45, 0.98]),
  ]),
  c4a_2: map(-217, {camera: italy(10.5, 11), territories: base, cities: [CT.rome, CT.cannae]}, [{type: 'quote', text: 'Cunctator: the Delayer', by: 'Nickname of Quintus Fabius Maximus', at: [0.05, 0.98]}]),
  c4b: map(-216, {camera: [{at: 0, center: [15.0, 41.6], zoom: 20}, {at: 1, center: [15.6, 41.4], zoom: 26}], territories: base, cities: [{...CT.cannae, size: 1.4}]}, [
    G('Legion', 'a Roman army unit of about 5,000 men', [0.05, 0.4]),
    who('Paullus & Varro', 'The two Roman consuls, 216 BC', 'They shared command of the biggest Roman army yet.', 'Rome', undefined, [0.42, 0.98]),
  ]),
  c4b_2: map(-216, {camera: [{at: 0, center: [15.6, 41.4], zoom: 26}, {at: 1, center: [15.9, 41.35], zoom: 30}], territories: base, cities: [{...CT.cannae, size: 1.4}]}, [
    {type: 'counter', label: 'ROME: INFANTRY', value: 80000, window: [0.0, 0.98], color: '#e0675b', context: '+ about 6,000 cavalry'},
    {type: 'counter', label: 'HANNIBAL: INFANTRY', value: 40000, window: [0.2, 0.98], top: 560, context: '+ about 10,000 cavalry'},
    {type: 'citation', text: 'Polybius 3.113–114', at: [0.05, 0.98]},
  ]),
  c4c: {kind: 'battle', battle: CANNAE, range: [0, 0.16]},
  c4c_2: {kind: 'battle', battle: CANNAE, range: [0.16, 0.32]},
  c4d: {kind: 'battle', battle: CANNAE, range: [0.32, 0.64]},
  c4e: {kind: 'battle', battle: CANNAE, range: [0.64, 0.86]},
  c4e_2: {kind: 'battle', battle: CANNAE, range: [0.86, 1]},
  c4f: art('trumbull-cannae', 'John Trumbull, The Death of Paulus Aemilius at the Battle of Cannae, 1773', {x: 0.4, y: 0.45, zoom: 1.3}, {x: 0.5, y: 0.5, zoom: 1.05}, [
    {type: 'counter', label: "HANNIBAL'S LOSSES (POLYBIUS)", value: 5700, window: [0.3, 0.98], color: '#f4ecd8'},
    G('Double envelopment', 'attacking from both sides and from behind', [0.6, 0.98]),
  ]),
  c4z: recap('The worst day in Rome’s history.', 'Everyone expected Hannibal to march on Rome next. He did not…', {camera: italy(10, 10.6), territories: base}),

  c5: chapter(5, 'The Long War', '216 – 207 BC', {camera: italy(8, 8.6), territories: base}, 'scipio-bust', 'Can you win every battle and still lose the war?'),
  c5a: map(-216, {camera: italy(10, 11), territories: base, cities: [CT.rome, CT.cannae], routes: [{id: 'notrome', points: [[16.13, 41.31], [14.8, 41.8], [12.48, 41.9]], color: '#f4ecd8', draw: [0.05, 0.4], dashed: true, km: true}]}, [
    who('Maharbal', "Hannibal's cavalry commander", 'Wanted to attack Rome at once.', 'Carthage', undefined, [0.03, 0.4]),
    {type: 'quote', text: 'You know how to win a victory, Hannibal; you do not know how to use one.', by: 'Maharbal, according to Livy 22.51', at: [0.45, 0.98]},
  ]),
  c5a_2: map(-216, {camera: italy(11, 11.5), territories: base, cities: [CT.rome, CT.cannae]}, [G('Siege engines', 'machines built to break city walls', [0.05, 0.6])]),
  c5b: map(-215, {camera: italy(10, 11.5), territories: [...base, {...DEFECTORS, grow: [0.1, 0.5]}], cities: [CT.rome, {...CT.capua, appear: 0.1, size: 1.3}]}),
  c5b_2: map(-212, {camera: italy(11.5, 12), territories: [...base, DEFECTORS], cities: [CT.rome, CT.capua]}),
  c5c: map(-209, {camera: [{at: 0, center: [0.5, 40.0], zoom: 14}, {at: 1, center: [-0.6, 38.8], zoom: 18}], territories: [CARTHAGE_AFRICA, BARCID_SPAIN, {...ROMAN_SPAIN, grow: [0.5, 0.95]}], routes: [{id: 'scipio', points: SCIPIO_SPAIN, color: COL.roman, draw: [0.1, 0.6], unit: {label: 'Scipio', color: COL.rome, kind: 'infantry'}}], cities: [CT.tarraco, {...CT.newCarthage, size: 1.3}]}, [
    who('Scipio (the son)', 'Roman general, later "Africanus"', 'Son of the consul from Ticinus. Will face Hannibal.', 'Rome', 'scipio-bust', [0.03, 0.98]),
  ]),
  c5d: map(-207, {camera: [{at: 0, center: [3, 42.5], zoom: 6.5}, {at: 1, center: [11, 43.6], zoom: 11}], territories: base, routes: [{id: 'hasd', points: HASDRUBAL, color: COL.route, draw: [0.02, 0.6], unit: {label: 'Hasdrubal', color: COL.carthage, kind: 'infantry'}}], cities: [{...CT.metaurus, appear: 0.55, size: 1.3}]}, [
    who('Hasdrubal', "Hannibal's brother", 'NOT Hasdrubal the Fair, the brother-in-law.', 'Carthage', undefined, [0.03, 0.6]),
  ]),
  c5d_2: map(-207, {camera: [{at: 0, center: [11, 43.6], zoom: 11}, {at: 1, center: [13, 43.8], zoom: 14}], territories: base, cities: [{...CT.metaurus, size: 1.3}]}, [{type: 'citation', text: 'Livy 27.51', at: [0.05, 0.98]}]),
  c5z: recap('Hannibal held southern Italy, but Rome refused to give up.', 'And then Rome took the war to Africa…', {camera: WEST_MED, territories: base}),

  c6: chapter(6, 'Zama', '204 – 201 BC', {camera: [{at: 0, center: [10, 36.5], zoom: 12}, {at: 1, center: [10, 36.4], zoom: 13}], territories: base}, 'zama-loc', 'Can the master be beaten at his own game?'),
  c6a: map(-204, {camera: [{at: 0, center: [12.5, 37.8], zoom: 8}, {at: 1, center: [12.6, 37.6], zoom: 8.8}], territories: base, routes: [{id: 'scip', points: SCIPIO_AFRICA, color: COL.roman, draw: [0.05, 0.6], dashed: true, unit: {label: 'Scipio', color: COL.rome, kind: 'infantry'}}], cities: [CT.utica]}),
  c6a_2: map(-203, {camera: [{at: 0, center: [12.6, 37.6], zoom: 8.8}, {at: 1, center: [12.2, 37.0], zoom: 9.4}], territories: base, routes: [{id: 'home', points: HANNIBAL_HOME, color: COL.route, draw: [0.05, 0.85], dashed: true, km: true, unit: HANNIBAL}], cities: [CT.croton, CT.utica]}),
  c6b: art('zama-loc', 'The Battle of Zama, engraving after Cornelis Cort (Library of Congress)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.45, zoom: 1.25}, [
    who('Masinissa', 'Numidian prince, fights for Rome', 'Brings the best cavalry in Africa.', 'Rome', 'coin-masinissa', [0.05, 0.98]),
  ]),
  c6b_2: {kind: 'battle', battle: ZAMA, range: [0, 0.5]},
  c6c: {kind: 'battle', battle: ZAMA, range: [0.5, 0.8]},
  c6c_2: {kind: 'battle', battle: ZAMA, range: [0.8, 1]},
  c6d: map(-201, {camera: [{at: 0, center: [10.32, 36.85], zoom: 20}, {at: 1, center: [10.32, 36.85], zoom: 24}], territories: base, cities: [CT.carthage]}, [{type: 'list', title: 'Peace of 201 BC', items: ['10,000 talents of silver (≈ 260 tonnes) over 50 years', 'All warships surrendered except 10', 'All war elephants surrendered', 'No war without Rome’s permission'], source: 'Polybius 15.18'}]),
  c6z: recap('Carthage lost the war, its fleet and its elephants.', 'But Hannibal’s own story was not over…', {camera: WEST_MED, territories: base}),

  c7: chapter(7, 'The Last Years', '201 – 183 BC', {camera: [{at: 0, center: [20, 37], zoom: 4.2}, {at: 1, center: [22, 37.5], zoom: 4.6}], territories: base}, 'turner-decline', 'What happens to a defeated hero?'),
  c7a: map(-196, {camera: [{at: 0, center: [10.32, 36.85], zoom: 20}, {at: 1, center: [11, 36.8], zoom: 14}], territories: base, cities: [CT.carthage]}, [G('Chief magistrate', "Carthage's top elected official (a 'sufete')", [0.1, 0.9])]),
  c7a_2: map(-195, {camera: [{at: 0, center: [16, 36], zoom: 4.2}, {at: 1, center: [24, 37], zoom: 5}], territories: base, routes: [{id: 'exile', points: EXILE, color: COL.route, draw: [0.08, 0.9], dashed: true, unit: HANNIBAL}], cities: [CT.carthage, {...CT.tyre, appear: 0.65}, {...CT.ephesus, appear: 0.85}]}),
  c7b: map(-183, {camera: [{at: 0, center: [27.8, 39.0], zoom: 16}, {at: 1, center: [29.2, 40.6], zoom: 26}], territories: [], routes: [{id: 'bith', points: TO_BITHYNIA, color: COL.route, draw: [0.05, 0.6], unit: HANNIBAL}], cities: [CT.ephesus, {...CT.libyssa, appear: 0.5, size: 1.3}], regions: [{text: 'BITHYNIA', at: [31.6, 39.7], appear: 0.4, size: 34}]}),
  c7c: map(-146, {camera: [{at: 0, center: [10.32, 36.85], zoom: 24}, {at: 1, center: [10, 38.5], zoom: 6}], territories: [ROME_ITALY, SARD_CORSICA, SICILY, {...CARTHAGE_AFRICA, fadeOut: [0.05, 0.4]}], cities: [CT.carthage]}),
  c7c_2: art('turner-hannibal', '', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.0}),
  c7c_3: art('turner-hannibal', '', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.1}, [{type: 'title', title: 'HANNIBAL', sub: 'WOULD HE HAVE WON IF HE HAD MARCHED ON ROME?'}]),
  c7d: art('turner-decline', '', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.48, zoom: 1.2}, [{type: 'endscreen', teaser: 'Why Rome destroyed Carthage, 50 years later'}]),
};

export const SCENES: Record<string, SceneDef> = BASE_SCENES;
