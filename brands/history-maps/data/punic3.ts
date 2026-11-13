import type {City, RegionLabel, Territory} from '../../../packages/engine/src/map/map';
import type {BattleSpec, Terrain} from '../../../packages/engine/src/map/battle';
import {COL, ROME_ITALY as R_ITALY, SARD_CORSICA as R_SARD, SICILY as R_SICILY, ROMAN_SPAIN as R_SPAIN} from './punic';

// Colour-blind second cue: Rome = diagonal hatch, Numidia = dots, Carthage = plain (legend shows the same).
export const ROME_ITALY: Territory = {...R_ITALY, pattern: 'hatch'};
export const SARD_CORSICA: Territory = {...R_SARD, pattern: 'hatch'};
export const SICILY: Territory = {...R_SICILY, pattern: 'hatch'};
export const ROMAN_SPAIN: Territory = {...R_SPAIN, pattern: 'hatch'};

// Episode 002 (Third Punic War) map data. All territories are approximate reconstructions (see 002-carthage/sources.md
// "Map data"); they are clipped to Natural Earth land by the map engine.

export const COL3 = {carthage: COL.carthage, rome: COL.rome, numidia: '#4f7a4a', route: COL.route};

/** Carthage after the 201 BC treaty: north/central Tunisia + the Emporia coast to the Gulf of Sirte. */
export const CARTHAGE_201: Territory = {
  id: 'carthage-201', color: COL3.carthage, origin: [10.32, 36.85],
  rings: [[[8.6, 37.4], [11.3, 37.3], [11.2, 35.6], [10.9, 34.6], [11.3, 33.6], [13.0, 33.0], [15.4, 32.2], [15.2, 31.6], [12.6, 32.2], [10.6, 32.9], [10.0, 33.6], [9.3, 34.6], [8.6, 35.6], [8.4, 36.6]]],
};
/** Lost to Masinissa: the Emporia coast (Gulf of Gabès → Leptis). */
export const EMPORIA: Territory = {
  id: 'emporia', color: COL3.numidia, pattern: 'dots', origin: [10.1, 33.9],
  rings: [[[10.0, 34.2], [10.9, 34.7], [11.3, 33.6], [13.0, 33.0], [15.4, 32.2], [15.2, 31.6], [12.6, 32.2], [10.6, 32.9], [10.0, 33.6]]],
};
/** Lost to Masinissa: the "Tysca" region of about fifty towns (inland, location approximate). */
export const TYSCA: Territory = {
  id: 'tysca', color: COL3.numidia, pattern: 'dots', origin: [9.3, 36.0],
  rings: [[[8.6, 36.6], [9.9, 36.5], [10.1, 35.6], [9.1, 35.3], [8.6, 35.7]]],
};
/** What Carthage still held around 150 BC (north-east Tunisia). */
export const CARTHAGE_150: Territory = {
  id: 'carthage-150', color: COL3.carthage, origin: [10.32, 36.85],
  rings: [[[9.8, 37.4], [11.3, 37.3], [11.2, 35.6], [10.4, 35.5], [10.0, 36.4], [9.6, 37.0]]],
};
/** Numidia under Masinissa, before his land grabs (northern Algeria + western Tunisia). */
export const NUMIDIA: Territory = {
  id: 'numidia', color: COL3.numidia, pattern: 'dots', origin: [6.61, 36.37],
  rings: [[[-1.8, 35.2], [2.0, 36.9], [6.0, 37.2], [8.6, 37.2], [8.4, 36.4], [8.6, 35.4], [9.2, 34.6], [9.0, 33.6], [6.0, 33.8], [2.0, 34.4], [-1.8, 34.6]]],
};
/** Roman province of Africa, 146 BC (≈ Carthage's last territory). */
export const AFRICA_146: Territory = {...CARTHAGE_150, id: 'africa-146', color: COL3.rome, origin: [10.32, 36.85], pattern: 'hatch'};
/** Tyre's homeland (Phoenicia), for the founding story. */
export const PHOENICIA: Territory = {
  id: 'phoenicia', color: COL3.carthage, origin: [35.2, 33.27], opacity: 0.5,
  rings: [[[35.0, 34.7], [36.2, 34.6], [35.8, 32.9], [34.9, 32.9]]],
};

export const C3: Record<string, City> = {
  carthage: {name: 'Carthage', at: [10.32, 36.85], today: 'near Tunis, Tunisia'},
  carthagePlain: {name: 'Carthage', at: [10.32, 36.85]},
  utica: {name: 'Utica', at: [10.06, 37.06], align: 'left', today: 'Utique, Tunisia'},
  rome: {name: 'Rome', at: [12.48, 41.9], today: 'Rome, Italy'},
  romePlain: {name: 'Rome', at: [12.48, 41.9]},
  cirta: {name: 'Cirta', at: [6.61, 36.37], align: 'left', today: 'Constantine, Algeria'},
  tyre: {name: 'Tyre', at: [35.2, 33.27], align: 'left', today: 'Tyre (Sour), Lebanon'},
  zama: {name: 'Zama (site debated)', at: [9.45, 36.3], align: 'left'},
  lilybaeum: {name: 'Sicily', at: [12.44, 37.8], align: 'left'},
};

/** Modern country names (explicit points; centroids are wrong for countries with overseas land). */
export const MODERN: RegionLabel[] = [
  {text: 'Tunisia', at: [9.3, 33.9]},
  {text: 'Algeria', at: [4.0, 34.6]},
  {text: 'Libya', at: [14.0, 30.6]},
  {text: 'Italy', at: [14.6, 41.4]},
  {text: 'Spain', at: [-3.7, 39.9]},
  {text: 'France', at: [2.6, 46.6]},
  {text: 'Morocco', at: [-6.0, 33.0]},
  {text: 'Greece', at: [22.0, 39.6]},
  {text: 'Egypt', at: [29.5, 27.5]},
  {text: 'Lebanon', at: [35.9, 34.0]},
  {text: 'Malta', at: [14.4, 35.7], size: 16},
];

// ---------- schematic city plan of Carthage (BattleShot field 100 × 56.25, north up; not to scale) ----------
const circle = (cx: number, cy: number, r: number, n = 18): [number, number][] =>
  Array.from({length: n}, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * 0.92 * Math.sin((i / n) * 2 * Math.PI)]);

export const PLAN_TERRAIN: Terrain = {
  lakes: [
    // Mediterranean (east and south-east)
    [[74, -12], [112, -12], [112, 72], [44, 72], [48, 54], [62, 50], [70, 40], [73, 22]],
    // Lake of Tunis (south-west)
    [[-12, 44], [8, 40], [26, 43], [38, 52], [36, 72], [-12, 72]],
    // salt marsh (north-west)
    [[-12, -12], [30, -12], [28, 8], [12, 13], [-12, 12]],
    // circular war harbour + rectangular trade harbour
    circle(63, 40, 3.2),
    [[58, 44.2], [64.5, 44.2], [64.5, 47.5], [58, 47.5]],
  ],
  walls: [
    [[27, 9], [28.5, 22], [30, 42]], // triple land wall across the isthmus
    [[30, 42], [44, 50], [60, 48.5]], // south wall along the lake / harbours
    [[28, 9], [50, 3], [72, 8]], // north wall (Megara)
  ],
  hills: [{x: 54, y: 30, r: 4.5}],
};

export const PLAN_NOTES = {
  byrsa: {text: 'Byrsa (citadel)', x: 54, y: 24.5},
  war: {text: 'War harbour', x: 63, y: 35.5},
  trade: {text: 'Trade harbour', x: 61, y: 51},
  walls: {text: 'Land walls', x: 24, y: 26},
  lake: {text: 'Lake of Tunis', x: 16, y: 52},
  sea: {text: 'Mediterranean Sea', x: 88, y: 20},
  megara: {text: 'Megara (gardens)', x: 50, y: 12},
};

export const PLAN_SIDES: BattleSpec['sides'] = {a: {name: 'Carthage', color: COL3.carthage}, b: {name: 'Rome', color: COL3.rome}};
