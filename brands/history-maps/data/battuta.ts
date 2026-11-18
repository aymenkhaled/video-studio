import type {City, LonLat, RegionLabel} from '../../../packages/engine/src/map/map';

// Episode 003 (Ibn Battuta) map data. Waypoints are modern coordinates of places named in the Rihla and in
// 003-ibn-battuta/sources.md, joined in travel order. The line is a schematic reconstruction, not a GPS track.
// Distances: `mappedKm` = great-circle length of the drawn line. The on-screen counter shows the SOURCED estimate
// (about 117,000 km, Dunn / Wikipedia) shared out along the line in proportion to mapped distance (`estKm`), so the
// last waypoint reads ≈ 117,000 km. Marco Polo uses the sourced ≈ 24,000 km figure (bar), his line is schematic.

export const TOTAL_EST_KM = 117000;
export const POLO_KM = 24000;
export const COL4 = {gold: '#f2b632', polo: '#9aa3ab', sea: '#7fb7d6'};

export const P = {
  tangier: [-5.8, 35.77], tlemcen: [-1.32, 34.88], algiers: [3.06, 36.75], bejaia: [5.08, 36.75], tunis: [10.18, 36.8], sfax: [10.6, 34.74], tripoli: [13.19, 32.89],
  alexandria: [29.92, 31.2], cairo: [31.24, 30.04], jerusalem: [35.23, 31.78], damascus: [36.29, 33.51], medina: [39.61, 24.47],
  mecca: [39.83, 21.42], najaf: [44.33, 32.0], basra: [47.78, 30.51], isfahan: [51.67, 32.65], shiraz: [52.53, 29.59],
  baghdad: [44.36, 33.31], tabriz: [46.29, 38.08], jeddah: [39.17, 21.49], aden: [45.03, 12.79], zeila: [43.47, 11.35], mogadishu: [45.34, 2.05],
  mombasa: [39.67, -4.04], kilwa: [39.51, -8.96], dhofar: [54.1, 17.0], hormuz: [56.45, 27.1], hasa: [49.5, 25.4],
  alanya: [32.0, 36.54], konya: [32.49, 37.87], sinop: [35.15, 42.02], kaffa: [35.38, 45.03], astrakhan: [48.03, 46.35],
  bulgar: [49.08, 54.98], constantinople: [28.98, 41.01], sarai: [45.6, 48.6], urgench: [59.15, 42.33], bukhara: [64.42, 39.77],
  samarkand: [66.97, 39.65], balkh: [66.9, 36.76], kabul: [69.18, 34.55], indus: [71.5, 33.9], multan: [71.47, 30.2],
  delhi: [77.21, 28.61], koil: [78.08, 27.88], cambay: [72.6, 22.3], calicut: [75.78, 11.25], male: [73.51, 4.18],
  ceylon: [79.86, 6.93], chittagong: [91.83, 22.36], sumatra: [97.15, 5.17], quanzhou: [118.59, 24.91], guangzhou: [113.26, 23.13],
  hangzhou: [120.15, 30.27], khanbaliq: [116.4, 39.9], fez: [-5.0, 34.03], sijilmasa: [-4.25, 31.28], taghaza: [-4.98, 23.6],
  walata: [-7.03, 17.28], mali: [-8.85, 11.37], timbuktu: [-3.0, 16.77], gao: [0.04, 16.27], takedda: [7.0, 17.3], tuat: [-0.3, 27.9],
  venice: [12.33, 45.44], acre: [35.07, 32.93], ayas: [35.8, 36.77], kashgar: [75.99, 39.47], dunhuang: [94.66, 40.14],
  shangdu: [116.18, 42.36], trebizond: [39.72, 41.0],
} satisfies Record<string, LonLat>;
export type Place = keyof typeof P;

/** A chapter's leg = list of segments; `sea` segments draw dashed. */
type Seg = {via: Place[]; sea?: boolean};
const LEGS: Record<string, Seg[]> = {
  c1: [{via: ['tangier', 'tlemcen', 'bejaia', 'tunis']}],
  c2: [{via: ['tunis', 'tripoli', 'alexandria', 'cairo', 'jerusalem', 'damascus', 'medina', 'mecca']}],
  c3: [
    {via: ['mecca', 'najaf', 'basra', 'isfahan', 'shiraz', 'baghdad', 'tabriz', 'baghdad', 'mecca', 'jeddah']},
    {via: ['jeddah', 'aden', 'mogadishu', 'mombasa', 'kilwa', 'dhofar', 'hormuz'], sea: true},
    {via: ['hormuz', 'hasa', 'mecca']},
  ],
  c4: [
    {via: ['mecca', 'cairo', 'damascus', 'alanya', 'konya', 'sinop']},
    {via: ['sinop', 'kaffa'], sea: true},
    {via: ['kaffa', 'astrakhan', 'bulgar', 'astrakhan', 'constantinople', 'astrakhan', 'sarai']},
  ],
  c5: [{via: ['sarai', 'urgench', 'bukhara', 'samarkand', 'balkh', 'kabul', 'indus', 'multan', 'delhi']}],
  c6: [
    {via: ['delhi', 'koil', 'cambay']},
    {via: ['cambay', 'calicut', 'male', 'ceylon', 'chittagong'], sea: true},
  ],
  c7: [{via: ['chittagong', 'sumatra', 'quanzhou'], sea: true}, {via: ['quanzhou', 'guangzhou', 'quanzhou', 'hangzhou', 'khanbaliq']}],
  c8: [
    {via: ['khanbaliq', 'quanzhou']},
    {via: ['quanzhou', 'sumatra', 'calicut', 'dhofar', 'hormuz'], sea: true},
    {via: ['hormuz', 'baghdad', 'damascus', 'jerusalem', 'cairo', 'mecca', 'cairo']},
    {via: ['cairo', 'tunis'], sea: true},
    {via: ['tunis', 'fez']},
  ],
  c9: [{via: ['fez', 'sijilmasa', 'taghaza', 'walata', 'mali', 'timbuktu', 'gao', 'takedda', 'tuat', 'sijilmasa', 'fez']}],
};
export const CHAPTERS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'] as const;

const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;
export const gcKm = (a: LonLat, b: LonLat): number => {
  const dLat = rad(b[1] - a[1]);
  const dLon = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const pathKm = (pts: LonLat[]) => pts.slice(1).reduce((s, p, i) => s + gcKm(pts[i], p), 0);

export type Leg = {id: string; segs: {points: LonLat[]; sea: boolean; mappedKm: number}[]; mappedKm: number; points: LonLat[]};
export const LEG: Record<string, Leg> = Object.fromEntries(
  CHAPTERS.map((c) => {
    const segs = LEGS[c].map((s) => {
      const points = s.via.map((k) => P[k] as LonLat);
      return {points, sea: !!s.sea, mappedKm: pathKm(points)};
    });
    const points = segs.flatMap((s, i) => (i === 0 ? s.points : s.points.slice(1)));
    return [c, {id: c, segs, points, mappedKm: segs.reduce((a, s) => a + s.mappedKm, 0)}];
  }),
);
export const MAPPED_TOTAL = CHAPTERS.reduce((a, c) => a + LEG[c].mappedKm, 0);
const SCALE = TOTAL_EST_KM / MAPPED_TOTAL;
/** Estimated km (sourced total shared out along the line) at the start and end of each chapter. */
export const EST: Record<string, [number, number]> = (() => {
  let t = 0;
  const out: Record<string, [number, number]> = {};
  for (const c of CHAPTERS) {
    const a = t;
    t += LEG[c].mappedKm * SCALE;
    out[c] = [Math.round(a), Math.round(t)];
  }
  return out;
})();
/** Whole journey as one polyline (final maps, hook). */
export const ALL_POINTS: LonLat[] = CHAPTERS.flatMap((c, i) => (i === 0 ? LEG[c].points : LEG[c].points.slice(1)));

/** Marco Polo, schematic (outbound overland, return by sea). */
export const POLO_POINTS: LonLat[] = (['venice', 'acre', 'ayas', 'tabriz', 'hormuz', 'balkh', 'kashgar', 'dunhuang', 'shangdu', 'khanbaliq', 'quanzhou', 'sumatra', 'ceylon', 'hormuz', 'tabriz', 'trebizond', 'constantinople', 'venice'] as Place[]).map((k) => P[k] as LonLat);

const c = (name: string, k: Place, today?: string, extra: Partial<City> = {}): City => ({name, at: P[k] as LonLat, today, ...extra});
export const CITY = {
  tangier: c('Tangier', 'tangier', 'Morocco'),
  tangierPlain: c('Tangier', 'tangier'),
  tlemcen: c('Tlemcen', 'tlemcen', 'Algeria'),
  tunis: c('Tunis', 'tunis', 'Tunisia'),
  alexandria: c('Alexandria', 'alexandria', 'Egypt', {align: 'left'}),
  cairo: c('Cairo', 'cairo', 'Egypt'),
  damascus: c('Damascus', 'damascus', 'Syria'),
  medina: c('Medina', 'medina', 'Saudi Arabia', {align: 'left'}),
  mecca: c('Mecca', 'mecca', 'Saudi Arabia'),
  meccaPlain: c('Mecca', 'mecca'),
  baghdad: c('Baghdad', 'baghdad', 'Iraq'),
  isfahan: c('Isfahan', 'isfahan', 'Iran'),
  mogadishu: c('Mogadishu', 'mogadishu', 'Somalia'),
  kilwa: c('Kilwa', 'kilwa', 'Tanzania'),
  sinop: c('Sinop', 'sinop', 'Türkiye'),
  constantinople: c('Constantinople', 'constantinople', 'Istanbul, Türkiye', {align: 'left'}),
  sarai: c('New Sarai', 'sarai', 'near Volgograd, Russia'),
  bulgar: c('Bulgar (doubted)', 'bulgar', 'Tatarstan, Russia'),
  bukhara: c('Bukhara', 'bukhara', 'Uzbekistan'),
  samarkand: c('Samarkand', 'samarkand', 'Uzbekistan'),
  delhi: c('Delhi', 'delhi', 'India'),
  delhiPlain: c('Delhi', 'delhi'),
  calicut: c('Calicut', 'calicut', 'Kozhikode, India', {align: 'left'}),
  male: c('Maldives', 'male', 'Malé', {align: 'left'}),
  ceylon: c('Ceylon', 'ceylon', 'Sri Lanka'),
  chittagong: c('Chittagong', 'chittagong', 'Bangladesh'),
  sumatra: c('Sumatra', 'sumatra', 'Indonesia'),
  quanzhou: c('Quanzhou', 'quanzhou', 'China'),
  khanbaliq: c('Khanbaliq (doubted)', 'khanbaliq', 'Beijing, China'),
  fez: c('Fez', 'fez', 'Morocco', {align: 'left'}),
  fezPlain: c('Fez', 'fez', undefined, {align: 'left'}),
  sijilmasa: c('Sijilmasa', 'sijilmasa', 'near Rissani, Morocco'),
  taghaza: c('Taghaza', 'taghaza', 'salt mines, Mali'),
  walata: c('Walata', 'walata', 'Oualata, Mauritania', {align: 'left'}),
  mali: c('Capital of Mali', 'mali', 'site uncertain', {align: 'left'}),
  timbuktu: c('Timbuktu', 'timbuktu', 'Mali'),
  algiers: c('Algiers', 'algiers', 'Algeria', {align: 'left'}),
  sfax: c('Sfax', 'sfax', 'Tunisia', {align: 'left'}),
  tripoli: c('Tripoli', 'tripoli', 'Libya'),
  jerusalem: c('Jerusalem', 'jerusalem', 'Jerusalem', {align: 'left'}),
  najaf: c('Najaf', 'najaf', 'Iraq', {align: 'left'}),
  basra: c('Basra', 'basra', 'Iraq', {align: 'left'}),
  shiraz: c('Shiraz', 'shiraz', 'Iran'),
  tabriz: c('Tabriz', 'tabriz', 'Iran'),
  jeddah: c('Jeddah', 'jeddah', 'Saudi Arabia', {align: 'left'}),
  aden: c('Aden', 'aden', 'Yemen'),
  zeila: c('Zeila', 'zeila', 'Somaliland', {align: 'left'}),
  mombasa: c('Mombasa', 'mombasa', 'Kenya', {align: 'left'}),
  hormuz: c('Hormuz', 'hormuz', 'Iran'),
  alanya: c('Alanya', 'alanya', 'Türkiye'),
  konya: c('Konya', 'konya', 'Türkiye'),
  kaffa: c('Kaffa', 'kaffa', 'Feodosia, Crimea', {align: 'left'}),
  astrakhan: c('Astrakhan', 'astrakhan', 'Russia', {align: 'left'}),
  urgench: c('Urgench', 'urgench', 'Uzbekistan', {align: 'left'}),
  balkh: c('Balkh', 'balkh', 'Afghanistan', {align: 'left'}),
  kabul: c('Kabul', 'kabul', 'Afghanistan'),
  indus: c('Indus', 'indus', 'Pakistan'),
  multan: c('Multan', 'multan', 'Pakistan', {align: 'left'}),
  koil: c('Koil', 'koil', 'Aligarh, India'),
  cambay: c('Khambhat', 'cambay', 'Gujarat, India'),
  guangzhou: c('Guangzhou', 'guangzhou', 'China'),
  hangzhou: c('Hangzhou', 'hangzhou', 'China'),
  gao: c('Gao', 'gao', 'Mali'),
  takedda: c('Takedda', 'takedda', 'Niger', {align: 'left'}),
  tuat: c('Tuat', 'tuat', 'Algeria'),
  dhofar: c('Dhofar', 'dhofar', 'Oman', {align: 'left'}),
  hasa: c('Al-Hasa', 'hasa', 'Saudi Arabia'),
  venice: c('Venice', 'venice', 'Italy'),
};

/** Modern country names for the Clarity layer (world scale; the engine hides overlapping labels). */
export const MODERN_W: RegionLabel[] = [
  {text: 'Morocco', at: [-6.5, 31.6]}, {text: 'Algeria', at: [2.6, 28.5]}, {text: 'Tunisia', at: [9.4, 33.8]}, {text: 'Libya', at: [17.5, 27.0]},
  {text: 'Egypt', at: [29.5, 26.5]}, {text: 'Syria', at: [38.5, 35.2]}, {text: 'Saudi Arabia', at: [44.5, 23.8]}, {text: 'Iraq', at: [43.5, 32.8]},
  {text: 'Iran', at: [54.0, 32.5]}, {text: 'Yemen', at: [47.5, 15.6]}, {text: 'Oman', at: [56.5, 20.5]}, {text: 'Somalia', at: [46.0, 6.0]},
  {text: 'Kenya', at: [37.9, 0.4]}, {text: 'Tanzania', at: [34.8, -6.4]}, {text: 'Türkiye', at: [35.0, 39.0]}, {text: 'Ukraine', at: [31.2, 49.0]},
  {text: 'Russia', at: [44.0, 53.0]}, {text: 'Kazakhstan', at: [67.0, 48.0]}, {text: 'Uzbekistan', at: [63.5, 41.5]}, {text: 'Afghanistan', at: [65.5, 33.8]},
  {text: 'Pakistan', at: [69.0, 29.0]}, {text: 'India', at: [79.0, 22.0]}, {text: 'Sri Lanka', at: [80.7, 7.8], size: 18}, {text: 'Bangladesh', at: [90.3, 24.0], size: 18},
  {text: 'Indonesia', at: [102.0, -1.0]}, {text: 'China', at: [104.0, 34.0]}, {text: 'Mali', at: [-2.0, 18.5]}, {text: 'Mauritania', at: [-10.5, 20.5]},
  {text: 'Niger', at: [9.0, 16.5]}, {text: 'Spain', at: [-3.7, 39.9]}, {text: 'Italy', at: [12.6, 42.8]}, {text: 'Greece', at: [22.0, 39.6]},
];

/** Modern countries on the route (ISO 3166-1 numeric, Natural Earth ids), for the final "lit" map. Approximate. */
export const ROUTE_COUNTRIES = [
  '504', '012', '788', '434', '818', '376', '275', '400', '422', '760', '682', '368', '364', '887', '512', '706', '404', '834', '048', '634',
  '792', '804', '643', '398', '795', '860', '004', '586', '356', '462', '144', '050', '360', '458', '156', '724', '466', '478', '562',
];
