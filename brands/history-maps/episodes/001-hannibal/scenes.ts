import type {SceneDef} from '../../../../packages/engine/src/map/episode';
import type {BattleSpec, BUnit} from '../../../../packages/engine/src/map/battle';
import {arcUnits} from '../../../../packages/engine/src/map/battle';
import type {MapSpec} from '../../../../packages/engine/src/map/map';
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
      out.push({id: `r${ci}${ri}`, side: 'b', kind: 'inf', label: ci === 1 && ri === 0 ? 'Roman legions' : undefined, keys: ats.map((at, k) => ({at, x: xs[k][ci], y: ys[k][ri], w: ws[k], h: 4.4}))}),
    ),
  );
  return out;
};

const CANNAE: BattleSpec = {
  title: 'Cannae, 216 BC',
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
    {id: 'hcav', side: 'a', kind: 'cav', label: "Hasdrubal's cavalry", labelUntil: 0.4, keys: [{at: 0, x: 22, y: 37, w: 6, h: 3}, {at: 0.3, x: 22, y: 33}, {at: 0.45, x: 23, y: 27}, {at: 0.66, x: 30, y: 7}, {at: 0.82, x: 58, y: 7}, {at: 1, x: 50, y: 20}]},
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
    {text: "Hannibal's army", x: 22, y: 50, appear: 0.02, until: 0.5},
    {text: 'Icy river, no breakfast', x: 52, y: 12, appear: 0.3, until: 0.62},
    {text: 'Hidden in a stream bed', x: 62, y: 43, appear: 0.42, until: 0.7},
    {text: '≈10,000 break out', x: 20, y: 5, appear: 0.9},
  ],
};

const TRASIMENE: BattleSpec = {
  title: 'Lake Trasimene, 217 BC',
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

// ---------- scene table ----------
const chapter = (n: number, title: string, sub: string, map: MapSpec): SceneDef => ({kind: 'map', map, overlays: [{type: 'chapter', n, title, sub}]});
const italy = (zoomFrom = 9, zoomTo = 10): MapSpec['camera'] => [{at: 0, center: [12.8, 42.4], zoom: zoomFrom}, {at: 1, center: [13.2, 42.0], zoom: zoomTo}];

export const SCENES: Record<string, SceneDef> = {
  c0a: {kind: 'battle', battle: CANNAE, range: [0.3, 0.96]},
  c0b: {
    kind: 'map', year: -216,
    map: {camera: [{at: 0, center: [16.0, 41.4], zoom: 34}, {at: 1, center: [15.0, 41.6], zoom: 22}], territories: base, cities: [{...C.cannae, size: 1.4}]},
    overlays: [
      {type: 'counter', label: 'ROMAN DEAD (POLYBIUS)', value: 70000, window: [0.05, 0.98], color: '#e0675b'},
      {type: 'counter', label: 'ROMAN DEAD (LIVY)', value: 50000, window: [0.2, 0.98], top: 560, color: '#f4ecd8'},
      {type: 'citation', text: 'Polybius 3.117; Livy 22.49 — figures disputed', at: [0.05, 0.98]},
    ],
  },
  c0c: {kind: 'map', map: {camera: [{at: 0, center: [12, 39], zoom: 4.2}, {at: 1, center: [10, 39.5], zoom: 4.8}], territories: base}, overlays: [{type: 'title', title: 'HANNIBAL', sub: 'THE MAN WHO NEARLY DESTROYED ROME'}]},

  c1: chapter(1, 'The Oath', '247 – 219 BC', {camera: WEST_MED, territories: base}),
  c1a: {
    kind: 'map', year: -241,
    map: {camera: [{at: 0, center: [13.5, 38.0], zoom: 14}, {at: 1, center: [12.5, 38.4], zoom: 11}], territories: [ROME_ITALY, CARTHAGE_AFRICA, {...SICILY_CARTHAGE, fadeOut: [0.55, 0.75]}, {...SICILY, grow: [0.65, 0.9]}], cities: [{...C.carthage, appear: 0.05}, {...C.rome, appear: 0.05}], regions: [{text: 'SICILY', at: [14.2, 37.2], appear: 0.15, size: 38}]},
    overlays: [{type: 'citation', text: 'First Punic War, 264–241 BC', at: [0.05, 0.95]}],
  },
  c1b: {
    kind: 'map', year: -237,
    map: {camera: [{at: 0, center: [8, 39.5], zoom: 6.5}, {at: 1, center: [2, 38.5], zoom: 7}], territories: [ROME_ITALY, SICILY, CARTHAGE_AFRICA, {...SARD_CORSICA, grow: [0.05, 0.35]}], routes: [{id: 'hamilcar', points: [[10.32, 36.85], [5.0, 36.4], [0.0, 36.3], [-6.29, 36.53]], color: COL.route, draw: [0.5, 0.92], unit: {label: 'Hamilcar', color: COL.carthage, kind: 'infantry'}}], cities: [C.carthage, {...C.gades, appear: 0.85}], regions: [{text: 'IBERIA', at: [-4.0, 40.2], appear: 0.6, size: 48}]},
  },
  c1c: {kind: 'map', year: -237, map: {camera: [{at: 0, center: [10.32, 36.85], zoom: 30}, {at: 1, center: [10.32, 36.85], zoom: 36}], territories: [CARTHAGE_AFRICA], cities: [{...C.carthage, size: 1.4}]}, overlays: [{type: 'quote', text: 'Never to be a friend of Rome', by: "Hannibal's oath at age nine, as he told it (Polybius 3.11)", at: [0.06, 0.97]}]},
  c1d: {
    kind: 'map', year: -219,
    map: {camera: [{at: 0, center: [-3, 39.5], zoom: 11}, {at: 1, center: [-1.2, 39.4], zoom: 15}], territories: [{...BARCID_SPAIN, grow: [0.02, 0.4]}, CARTHAGE_AFRICA], cities: [{...C.newCarthage, appear: 0.15}, {...C.saguntum, appear: 0.6, size: 1.3}], regions: [{text: 'BARCID SPAIN', at: [-3.6, 38.4], appear: 0.25, size: 40}]},
    overlays: [{type: 'citation', text: 'Siege of Saguntum: 8 months (Polybius 3.17)', at: [0.62, 0.98]}],
  },

  c2: chapter(2, 'The March', '218 BC', {camera: [{at: 0, center: [3, 42], zoom: 7}, {at: 1, center: [4, 42.5], zoom: 7.6}], territories: base}),
  c2a: {
    kind: 'map', year: -218,
    map: {camera: [{at: 0, center: [6, 39], zoom: 5}, {at: 0.45, center: [-1.2, 39.0], zoom: 11}, {at: 1, center: [-0.6, 39.6], zoom: 12.5}], territories: base, cities: [{...C.newCarthage, appear: 0.4}], routes: [{id: 'ebro', points: MARCH.slice(0, 4), color: COL.route, draw: [0.55, 0.95], unit: HANNIBAL}]},
    overlays: [
      {type: 'counter', label: 'INFANTRY (CLAIMED)', value: 90000, window: [0.55, 0.98]},
      {type: 'counter', label: 'CAVALRY (CLAIMED)', value: 12000, window: [0.62, 0.98], top: 560, color: '#f4ecd8'},
      {type: 'citation', text: 'Polybius 3.35 — likely inflated', at: [0.55, 0.98]},
    ],
  },
  c2b: {
    kind: 'map', year: -218,
    map: {camera: [{at: 0, center: [0.6, 41.2], zoom: 13}, {at: 1, center: [4.4, 43.6], zoom: 15}], territories: base, routes: [{id: 'm1', points: MARCH.slice(0, 9), color: COL.route, draw: [0.02, 0.6], unit: {label: '37 elephants', color: COL.carthage, kind: 'elephant'}}], cities: [{...C.massalia, appear: 0.45}, {...C.rhone, appear: 0.55}], regions: [{text: 'GAUL', at: [1.6, 45.9], appear: 0.2}]},
    overlays: [{type: 'citation', text: 'Rafts covered with earth (Polybius 3.46)', at: [0.55, 0.98]}],
  },
  c2c: {
    kind: 'map', year: -218,
    map: {camera: [{at: 0, center: [4.8, 44.3], zoom: 18}, {at: 1, center: [6.6, 45.1], zoom: 26}], territories: base, routes: [{id: 'm2a', points: MARCH.slice(0, 9), color: COL.route, draw: [-1, 0]}, {id: 'm2', points: MARCH.slice(8), color: COL.route, draw: [0.05, 0.9], unit: HANNIBAL}], cities: [{...C.rhone}, {...C.pass, appear: 0.7}], regions: [{text: 'ALPS', at: [7.4, 46.0], appear: 0.1, size: 52}]},
  },
  c2d: {
    kind: 'map', year: -218,
    map: {camera: [{at: 0, center: [7.4, 45.0], zoom: 30}, {at: 1, center: [8.4, 44.9], zoom: 24}], territories: base, routes: [{id: 'm3', points: MARCH, color: COL.route, draw: [-1, 0], unit: HANNIBAL}], cities: [{...C.turin, appear: 0.05}]},
    overlays: [
      {type: 'counter', label: 'INFANTRY LEFT', value: 20000, window: [0.12, 0.98]},
      {type: 'counter', label: 'CAVALRY LEFT', value: 6000, window: [0.2, 0.98], top: 560, color: '#f4ecd8'},
      {type: 'citation', text: "Polybius 3.56, from Hannibal's own inscription", at: [0.1, 0.98]},
    ],
  },

  c3: chapter(3, 'Three Disasters', '218 – 217 BC', {camera: italy(8, 8.6), territories: base}),
  c3a: {kind: 'map', year: -218, map: {camera: [{at: 0, center: [8.4, 45.1], zoom: 30}, {at: 1, center: [9.3, 45.0], zoom: 36}], territories: base, routes: [{id: 'tr', points: TO_TREBIA, color: COL.route, draw: [0.05, 0.85], unit: HANNIBAL}], cities: [{...C.turin, align: 'left'}, {...C.ticinus, align: 'right', appear: 0.2}, {...C.placentia, appear: 0.6}]}},
  c3b: {kind: 'battle', battle: TREBIA, range: [0, 0.62]},
  c3c: {kind: 'battle', battle: TREBIA, range: [0.62, 1]},
  c3d: {kind: 'map', year: -217, map: {camera: [{at: 0, center: [9.8, 44.8], zoom: 26}, {at: 1, center: [11.4, 43.6], zoom: 30}], territories: base, routes: [{id: 'arno', points: TO_ARNO, color: COL.route, draw: [0.05, 0.9], unit: HANNIBAL}], cities: [{...C.arno, appear: 0.4}, {...C.trasimene, appear: 0.85}]}},
  c3e: {kind: 'battle', battle: TRASIMENE},

  c4: chapter(4, 'Cannae', '216 BC', {camera: [{at: 0, center: [15, 41.5], zoom: 14}, {at: 1, center: [15.6, 41.4], zoom: 16}], territories: base}),
  c4a: {
    kind: 'map', year: -217,
    map: {camera: italy(9, 10.5), territories: base, routes: [{id: 'ca', points: TO_CANNAE, color: COL.route, draw: [0.1, 0.95], unit: HANNIBAL}], cities: [C.rome, {...C.cannae, appear: 0.85}]},
    overlays: [{type: 'quote', text: 'Cunctator: the Delayer', by: 'Nickname of Quintus Fabius Maximus', at: [0.45, 0.98]}],
  },
  c4b: {
    kind: 'map', year: -216,
    map: {camera: [{at: 0, center: [15.0, 41.6], zoom: 20}, {at: 1, center: [15.6, 41.4], zoom: 30}], territories: base, cities: [{...C.cannae, size: 1.4}]},
    overlays: [
      {type: 'counter', label: 'ROME: INFANTRY', value: 80000, window: [0.08, 0.98], color: '#e0675b'},
      {type: 'counter', label: 'HANNIBAL: INFANTRY', value: 40000, window: [0.55, 0.98], top: 560},
      {type: 'citation', text: 'Polybius 3.113–114', at: [0.05, 0.98]},
    ],
  },
  c4c: {kind: 'battle', battle: CANNAE, range: [0, 0.32]},
  c4d: {kind: 'battle', battle: CANNAE, range: [0.32, 0.64]},
  c4e: {kind: 'battle', battle: CANNAE, range: [0.64, 1]},
  c4f: {
    kind: 'map', year: -216,
    map: {camera: [{at: 0, center: [16.0, 41.3], zoom: 36}, {at: 1, center: [14.5, 41.6], zoom: 14}], territories: base, cities: [{...C.cannae, size: 1.3}, {...C.rome, appear: 0.4}]},
    overlays: [{type: 'counter', label: "HANNIBAL'S LOSSES (POLYBIUS)", value: 5700, window: [0.05, 0.55], color: '#f4ecd8'}, {type: 'citation', text: 'Polybius 3.117', at: [0.05, 0.55]}],
  },

  c5: chapter(5, 'The Long War', '216 – 207 BC', {camera: italy(8, 8.6), territories: base}),
  c5a: {kind: 'map', year: -216, map: {camera: italy(10, 11), territories: base, cities: [C.rome, C.cannae], routes: [{id: 'notrome', points: [[16.13, 41.31], [14.8, 41.8], [12.48, 41.9]], color: '#f4ecd8', draw: [0.05, 0.4], dashed: true}]}, overlays: [{type: 'quote', text: 'You know how to win a victory, Hannibal; you do not know how to use one.', by: 'Maharbal, according to Livy 22.51', at: [0.12, 0.7]}]},
  c5b: {kind: 'map', year: -215, map: {camera: italy(10, 11.5), territories: [...base, {...DEFECTORS, grow: [0.1, 0.5]}], cities: [C.rome, {...C.capua, appear: 0.1, size: 1.3}]}},
  c5c: {kind: 'map', year: -209, map: {camera: [{at: 0, center: [0.5, 40.0], zoom: 14}, {at: 1, center: [-0.6, 38.8], zoom: 18}], territories: [CARTHAGE_AFRICA, BARCID_SPAIN, {...ROMAN_SPAIN, grow: [0.5, 0.95]}], routes: [{id: 'scipio', points: SCIPIO_SPAIN, color: COL.roman, draw: [0.1, 0.6], unit: {label: 'Scipio', color: COL.rome, kind: 'infantry'}}], cities: [C.tarraco, {...C.newCarthage, size: 1.3}]}},
  c5d: {kind: 'map', year: -207, map: {camera: [{at: 0, center: [3, 42.5], zoom: 6.5}, {at: 1, center: [11, 43.6], zoom: 11}], territories: base, routes: [{id: 'hasd', points: HASDRUBAL, color: COL.route, draw: [0.02, 0.6], unit: {label: 'Hasdrubal', color: COL.carthage, kind: 'infantry'}}], cities: [{...C.metaurus, appear: 0.55, size: 1.3}]}},

  c6: chapter(6, 'Zama', '204 – 201 BC', {camera: [{at: 0, center: [10, 36.5], zoom: 12}, {at: 1, center: [10, 36.4], zoom: 13}], territories: base}),
  c6a: {kind: 'map', year: -203, map: {camera: [{at: 0, center: [12.5, 37.8], zoom: 8}, {at: 1, center: [12.6, 37.6], zoom: 8.8}], territories: base, routes: [{id: 'scip', points: SCIPIO_AFRICA, color: COL.roman, draw: [0.05, 0.4], unit: {label: 'Scipio', color: COL.rome, kind: 'infantry'}}, {id: 'home', points: HANNIBAL_HOME, color: COL.route, draw: [0.55, 0.95], unit: HANNIBAL}], cities: [C.utica, C.croton]}},
  c6b: {kind: 'battle', battle: ZAMA, range: [0, 0.5]},
  c6c: {kind: 'battle', battle: ZAMA, range: [0.5, 1]},
  c6d: {kind: 'map', year: -201, map: {camera: [{at: 0, center: [10.32, 36.85], zoom: 20}, {at: 1, center: [10.32, 36.85], zoom: 24}], territories: base, cities: [C.carthage]}, overlays: [{type: 'list', title: 'Peace of 201 BC', items: ['10,000 talents of silver over 50 years', 'All warships surrendered except 10', 'All war elephants surrendered', 'No war without Rome’s permission'], source: 'Polybius 15.18'}]},

  c7: chapter(7, 'The Last Years', '201 – 183 BC', {camera: [{at: 0, center: [20, 37], zoom: 4.2}, {at: 1, center: [22, 37.5], zoom: 4.6}], territories: base}),
  c7a: {kind: 'map', year: -195, map: {camera: [{at: 0, center: [16, 36], zoom: 4.2}, {at: 1, center: [24, 37], zoom: 5}], territories: base, routes: [{id: 'exile', points: EXILE, color: COL.route, draw: [0.08, 0.9], unit: HANNIBAL}], cities: [C.carthage, {...C.tyre, appear: 0.65}, {...C.ephesus, appear: 0.85}]}},
  c7b: {kind: 'map', year: -183, map: {camera: [{at: 0, center: [27.8, 39.0], zoom: 16}, {at: 1, center: [29.2, 40.6], zoom: 26}], territories: [], routes: [{id: 'bith', points: TO_BITHYNIA, color: COL.route, draw: [0.05, 0.6], unit: HANNIBAL}], cities: [C.ephesus, {...C.libyssa, appear: 0.5, size: 1.3}], regions: [{text: 'BITHYNIA', at: [31.6, 39.7], appear: 0.4, size: 36}]}},
  c7c: {kind: 'map', year: -146, map: {camera: [{at: 0, center: [10.32, 36.85], zoom: 24}, {at: 1, center: [10, 38.5], zoom: 4.6}], territories: [ROME_ITALY, SARD_CORSICA, SICILY, {...CARTHAGE_AFRICA, fadeOut: [0.05, 0.25]}]}, overlays: [{type: 'title', title: 'HANNIBAL', sub: 'WOULD HE HAVE WON IF HE HAD MARCHED ON ROME?'}]},
};
