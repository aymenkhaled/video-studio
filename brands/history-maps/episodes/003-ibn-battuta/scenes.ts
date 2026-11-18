import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {CamKey, City, LonLat, MapSpec, Route} from '../../../../packages/engine/src/map/map';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import {ALL_POINTS, CITY, COL4, EST, LEG, MODERN_W, P, type Place, POLO_KM, POLO_POINTS, ROUTE_COUNTRIES, TOTAL_EST_KM} from '../../data/battuta';

// Episode 003 "Ibn Battuta" — visual design per scene id (see timeline.json). Map-first: every content scene is a
// map with the gold route drawing, modern borders + names, a year, and the journey HUD (≈ km so far vs Marco Polo).
// Art (PD) only as short inserts. Distances on the HUD = the sourced ≈117,000 km estimate shared out along the line.

export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Ibn Battuta', color: COL4.gold},
    {name: 'Marco Polo', color: COL4.polo},
  ],
  chapters: {
    c1: 'Tangier', c2: 'The Road to Mecca', c3: 'Persia and Africa', c4: 'The Steppe', c5: 'The Sultan',
    c6: 'Shipwreck', c7: 'China?', c8: 'The Black Death', c9: 'Mali', c10: 'The Book',
  },
  highlight: {'Ibn Battuta': COL4.gold, Battuta: COL4.gold, 'Marco Polo': '#c9ced3', Polo: '#c9ced3'},
  now: 2026,
};

// ---------- helpers ----------
const cam = (a: LonLat, za: number, b: LonLat, zb: number, fly = false): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb, fly}];
const hold = (c: LonLat, z: number) => cam(c, z, c, z * 1.08);
const M = (spec: Omit<MapSpec, 'modern' | 'avoidLabels'>): MapSpec => ({modern: {labels: MODERN_W}, avoidLabels: true, relief: true, minText: 30, ...spec});
const at = (c: City, appear: number, size?: number): City => ({...c, appear, size});
const pts = (ps: Place[]): LonLat[] => ps.map((k) => P[k] as LonLat);

/** The journey HUD (km counter + Polo bar). k = [from, to] in estimated km. */
const J = (k: [number, number]): Overlay => ({type: 'journey', km: k, total: TOTAL_EST_KM, label: 'IBN BATTUTA (EST.)', compare: {label: 'MARCO POLO', km: POLO_KM}});
/** km at fraction f of chapter c's share of the estimate. */
const K = (c: string, f: number) => Math.round(EST[c][0] + f * (EST[c][1] - EST[c][0]));
const KK = (c: string, a: number, b: number): [number, number] => [K(c, a), K(c, b)];

/** Gold route being drawn now. */
const gold = (id: string, ps: Place[], draw: [number, number], sea = false, extra: Partial<Route> = {}): Route => ({id, points: pts(ps), color: COL4.gold, draw, width: 7, dashed: sea, ...extra});
/** Everything travelled before chapter `upTo` (thin, already drawn). */
const past = (upTo: string): Route[] => {
  const order = Object.keys(LEG);
  const done = order.slice(0, order.indexOf(upTo));
  return done.flatMap((c) => LEG[c].segs.map((s, i) => ({id: `past-${c}-${i}`, points: s.points, color: '#b8924a', draw: [0, 0.001] as [number, number], width: 3, dashed: s.sea})));
};
const polo = (draw: [number, number] = [0, 0.001]): Route => ({id: 'polo', points: POLO_POINTS, color: COL4.polo, draw, width: 5});

type Scene = {year?: number; camera: CamKey[]; routes?: Route[]; cities?: City[]; regions?: MapSpec['regions']; projection?: MapSpec['projection']; choropleth?: MapSpec['choropleth']};
const map = (s: Scene, overlays: Overlay[] = []): SceneDef => ({
  kind: 'map', year: s.year,
  map: M({camera: s.camera, routes: s.routes, cities: s.cities, regions: s.regions, projection: s.projection, choropleth: s.choropleth}),
  overlays,
});
const chapter = (n: number, title: string, sub: string, s: Scene, question: string, image?: string): SceneDef => ({kind: 'map', map: M({camera: s.camera, routes: s.routes, cities: s.cities}), overlays: [{type: 'chapter', n, title, sub, image, question}]});
const recap = (text: string, s: Scene, next?: string): SceneDef => ({kind: 'map', map: M({camera: s.camera, routes: s.routes, cities: s.cities}), overlays: [{type: 'recap', text, next}]});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], object = false): SceneDef => ({kind: 'art', art: {id, title, from, to, object}, overlays});

// ---------- cameras (visible width ≈ 360 / zoom degrees) ----------
const WORLD: LonLat = [55, 27];
const MAGHREB = (z = 8.5): CamKey[] => cam([1, 35.2], z, [3.5, 35.4], z * 1.1);
const EGYPT_ARABIA = cam([28, 30], 6.5, [36, 27], 7.2);
const PERSIA = cam([44, 30], 7.5, [47, 32], 8.2);
const EAFRICA = cam([44, 12], 5.0, [44, 2], 5.4);
const STEPPE = cam([36, 44], 6.0, [40, 46], 6.4);
const CASIA = cam([55, 44], 5.0, [66, 38], 5.6);
const INDIA = cam([74, 24], 6.0, [76, 22], 6.6);
const BAY = cam([88, 12], 4.2, [100, 14], 4.4);
const CHINA = cam([110, 26], 5.2, [114, 32], 5.6);
const SAHARA = cam([-6, 26], 6.5, [-5, 20], 7.0);

const ALL_GOLD: Route = {id: 'all', points: ALL_POINTS, color: COL4.gold, draw: [0, 0.001], width: 5};

// ---------- the scenes ----------
export const SCENES: Record<string, SceneDef> = {
  // c0 — hook: Polo's grey line draws, then the gold loop explodes over it (thumbnail map at frame 1)
  c0a: map({year: 1325, camera: cam(WORLD, 2.3, WORLD, 2.45), routes: [polo([0, 0.35]), {...ALL_GOLD, draw: [0.4, 0.98], width: 7}],
    regions: [{text: 'MARCO POLO', at: [70, 47], appear: 0, size: 34}, {text: 'IBN BATTUTA', at: [20, 5], appear: 0.5, size: 40}]}),
  c0b: map({year: 1325, camera: cam(WORLD, 2.45, WORLD, 2.6), routes: [polo(), ALL_GOLD]}, [J([0, TOTAL_EST_KM]), {type: 'citation', text: 'Estimate: R. Dunn; Wikipedia. Polo ≈ 24,000 km', at: [0.1, 0.98]}]),
  c0c: map({year: 1325, camera: cam([-5.8, 35.7], 14, [-5.8, 35.7], 18, true), cities: [CITY.tangier]}, [
    {type: 'character', name: 'Ibn Battuta', role: 'Scholar and traveller, 1304 – c. 1368', line: 'Born in Tangier. Left at about 21. (Engraving imagined, 1800s.)', image: 'benett-ibn-battuta', side: 'Ibn Battuta'},
  ]),
  c0d: {kind: 'map', map: M({camera: hold(WORLD, 2.5), routes: [polo(), ALL_GOLD]}), overlays: [{type: 'list', title: 'Three questions', items: ['How did he pay for it?', 'What nearly killed him?', 'Why did Europe forget him?']}]},
  c0e: map({year: 1355, camera: cam(WORLD, 2.6, [30, 30], 3.2), routes: [polo(), ALL_GOLD]}),
  c0f: art('catalan-atlas', '', {x: 0.62, y: 0.5, zoom: 1.5}, {x: 0.6, y: 0.5, zoom: 1.3}, [{type: 'title', title: 'IBN BATTUTA', sub: '117,000 KM BEFORE COLUMBUS'}]),

  // c1 — Tangier
  c1: chapter(1, 'Tangier', '1325', {camera: hold([-5.8, 35.7], 16), cities: [CITY.tangierPlain]}, 'A pilgrimage of 16 months… or 24 years?', 'catalan-atlas'),
  c1a: map({year: 1325, projection: 'globe', camera: cam([10, 25], 1.15, [-5.8, 35.7], 6), cities: [at(CITY.tangier, 0.55, 1.3)]}),
  c1b: map({year: 1304, camera: hold([-5.8, 35.7], 22), cities: [CITY.tangier]}, [
    {type: 'glossary', term: 'Islamic law', meaning: 'rules from the Quran and Muslim tradition', window: [0.4, 0.98]},
  ]),
  c1c: map({year: 1325, camera: MAGHREB(9), cities: [CITY.tangierPlain, at(CITY.tlemcen, 0.6)], routes: [gold('r', ['tangier', 'tlemcen'], [0.25, 0.9])]}, [J(KK('c1', 0, 0.35))]),
  c1d: map({year: 1325, camera: cam([5, 32], 4.2, [18, 28], 3.6), cities: [CITY.tangierPlain, at(CITY.mecca, 0.3, 1.3)], routes: [{id: 'plan', points: pts(['tangier', 'cairo', 'mecca']), color: '#f4ecd8', draw: [0.2, 0.7], width: 3, dashed: true}],
    regions: [{text: '≈ 16 MONTHS THERE AND BACK', at: [10, 22], appear: 0.6, size: 28}]}, [
    {type: 'glossary', term: 'Hajj', meaning: 'the pilgrimage to Mecca, once in a lifetime', window: [0.05, 0.6]},
  ]),
  c1e: art('wasiti-hajj', 'Pilgrims travelling to Mecca — al-Wasiti, 1237 (Maqamat, BnF)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.55, zoom: 1.2}),
  c1f: map({year: 1325, camera: MAGHREB(8), cities: [CITY.tangierPlain, CITY.tlemcen, at(CITY.tunis, 0.75)], routes: [gold('r0', ['tangier', 'tlemcen'], [0, 0.001]), gold('r', ['tlemcen', 'bejaia', 'tunis'], [0.1, 0.85])]}, [J(KK('c1', 0.35, 1))]),
  c1g: recap('A young scholar leaves home alone for a 16-month pilgrimage. It will take 24 years.', {camera: MAGHREB(8), routes: past('c2')}, 'How will he pay for it?'),

  // c2 — the road to Mecca (peak ~2:30: he travelled on hospitality)
  c2: chapter(2, 'The Road to Mecca', '1325 – 1326', {camera: EGYPT_ARABIA, routes: past('c2')}, 'How does a man with no money cross a continent?', 'wasiti-hajj'),
  c2a: art('wasiti-hajj', 'A caravan — al-Wasiti, 1237 (Maqamat, BnF)', {x: 0.45, y: 0.55, zoom: 1.25}, {x: 0.55, y: 0.5, zoom: 1.05}, [
    {type: 'glossary', term: 'Caravan', meaning: 'travellers and camels moving together for safety', window: [0.05, 0.95]},
  ]),
  c2b: map({year: 1325, camera: hold([10.18, 36.8], 14), cities: [CITY.tunis], routes: past('c2')}, [
    {type: 'glossary', term: 'Qadi', meaning: 'a judge of Islamic law', window: [0.3, 0.98]},
  ]),
  c2c: map({year: 1325, camera: cam(WORLD, 2.6, [45, 28], 2.9), routes: past('c2'), regions: [{text: 'LANDS RULED BY MUSLIMS (ROUGHLY)', at: [45, 40], appear: 0.2, size: 30}]}, [
    {type: 'citation', text: 'R. Dunn / UC Berkeley ORIAS', at: [0.3, 0.98]},
  ]),
  c2d: map({year: 1325, camera: cam([18, 33], 6.5, [24, 32], 7), cities: [CITY.tunis, at({...CITY.alexandria, note: 'hosted and fed'}, 0.6)], routes: [...past('c2'), gold('r', ['tunis', 'tripoli', 'alexandria'], [0.05, 0.85])], regions: [{text: 'TRAVELLING ON HOSPITALITY', at: [20, 29.5], appear: 0.45, size: 32}]}, [J(KK('c2', 0, 0.35))]),
  c2e: map({year: 1326, camera: EGYPT_ARABIA, cities: [CITY.alexandria, at(CITY.cairo, 0.4)], routes: [...past('c2'), gold('r0', ['tunis', 'tripoli', 'alexandria'], [0, 0.001]), gold('r', ['alexandria', 'cairo'], [0.2, 0.6])]}, [
    J(KK('c2', 0.35, 0.42)),
    {type: 'glossary', term: 'Mamluks', meaning: 'soldier-sultans who ruled Egypt and Syria', window: [0.45, 0.98]},
  ]),
  c2f: map({year: 1326, camera: cam([34, 31], 9, [36, 30], 8), cities: [CITY.cairo, at(CITY.damascus, 0.5)], routes: [...past('c2'), gold('r0', ['tunis', 'tripoli', 'alexandria', 'cairo'], [0, 0.001]), gold('r', ['cairo', 'jerusalem', 'damascus'], [0.1, 0.7])]}, [J(KK('c2', 0.42, 0.6))]),
  c2g: map({year: 1326, camera: cam([37, 28], 8, [39.5, 23], 9), cities: [CITY.damascus, at(CITY.medina, 0.5), at(CITY.mecca, 0.8, 1.3)], routes: [...past('c2'), gold('r0', ['tunis', 'tripoli', 'alexandria', 'cairo', 'jerusalem', 'damascus'], [0, 0.001]), gold('r', ['damascus', 'medina', 'mecca'], [0.05, 0.85], false, {km: true})]}, [J(KK('c2', 0.6, 1))]),
  c2h: map({year: 1326, camera: hold([39.83, 21.42], 20), cities: [{...CITY.mecca, size: 1.5}], routes: past('c3')}),
  c2i: recap('His learning paid his way. Mecca was only the first stop.', {camera: EGYPT_ARABIA, routes: past('c3')}, 'Next: Iraq and Persia…'),

  // c3 — Persia and Africa (passes Polo's total)
  c3: chapter(3, 'Persia and Africa', '1326 – 1330', {camera: cam([45, 20], 4.5, [45, 18], 4.8), routes: past('c3')}, 'Where does a pilgrim go after Mecca?'),
  c3a: map({year: 1327, camera: PERSIA, cities: [CITY.meccaPlain, at(CITY.isfahan, 0.6)], routes: [...past('c3'), gold('r', ['mecca', 'najaf', 'basra', 'isfahan', 'shiraz'], [0.05, 0.9])]}, [J(KK('c3', 0, 0.2))]),
  c3b: map({year: 1327, camera: hold([44.36, 33.31], 12), cities: [{...CITY.baghdad, note: 'sacked by the Mongols, 1258'}], routes: [...past('c3'), gold('r', ['shiraz', 'baghdad', 'tabriz', 'baghdad'], [0.05, 0.8])]}, [
    J(KK('c3', 0.2, 0.33)),
    {type: 'glossary', term: 'Mongols', meaning: 'steppe horsemen who conquered a huge empire', window: [0.3, 0.98]},
  ]),
  c3c: map({year: 1328, camera: cam([42, 28], 7, [40, 23], 8), cities: [CITY.mecca], routes: [...past('c3'), gold('r0', ['mecca', 'najaf', 'basra', 'isfahan', 'shiraz', 'baghdad', 'tabriz', 'baghdad'], [0, 0.001]), gold('r', ['baghdad', 'mecca', 'jeddah'], [0.05, 0.6])]}, [J(KK('c3', 0.33, 0.39))]),
  c3d: map({year: 1330, camera: EAFRICA, cities: [CITY.meccaPlain, at({...CITY.mogadishu}, 0.75)], routes: [...past('c3'), gold('r', ['jeddah', 'aden', 'mogadishu'], [0.05, 0.9], true)]}, [J(KK('c3', 0.39, 0.47))]),
  c3e: map({year: 1330, camera: cam([44, 2], 5.4, [41, -4], 6), cities: [CITY.mogadishu, at(CITY.kilwa, 0.7)], routes: [...past('c3'), gold('r0', ['jeddah', 'aden', 'mogadishu'], [0, 0.001], true), gold('r', ['mogadishu', 'mombasa', 'kilwa'], [0.05, 0.85], true)]}, [J(KK('c3', 0.47, 0.6))]),
  c3f: art('catalan-atlas', 'Catalan Atlas, 1375 (BnF) — the world as Mediterranean mapmakers saw it', {x: 0.7, y: 0.6, zoom: 1.4}, {x: 0.75, y: 0.55, zoom: 1.6}, [
    {type: 'quote', text: 'One of the finest and most beautifully built towns', by: 'Ibn Battuta on Kilwa (Rihla, Gibb translation)'},
  ]),
  c3g: map({year: 1330, camera: cam([40, -2], 5.5, [48, 12], 4.2), cities: [CITY.kilwa], routes: [polo(), ...past('c3'), gold('r0', ['jeddah', 'aden', 'mogadishu', 'mombasa', 'kilwa'], [0, 0.001], true), gold('r', ['kilwa', 'dhofar', 'hormuz'], [0.05, 0.9], true)]}, [
    J(KK('c3', 0.6, 0.9)),
    {type: 'citation', text: 'Rough estimate: the sourced total shared along the mapped route', at: [0.2, 0.98]},
  ]),
  c3h: map({year: 1330, camera: cam([48, 12], 4.2, [45, 20], 3.6), routes: [polo(), ...past('c4')], cities: [CITY.meccaPlain]}, [J(KK('c3', 0.9, 1))]),
  c3i: recap('Iraq, Persia, the Swahili coast. Next goal: a job with the Sultan of Delhi.', {camera: cam([55, 25], 3.4, [60, 25], 3.6), routes: past('c4'), cities: [CITY.delhiPlain]}, 'But he took the long way…'),

  // c4 — the steppe and Constantinople
  c4: chapter(4, 'The Steppe', '1330 – 1333', {camera: STEPPE, routes: past('c4')}, 'Why go to India by way of Russia?'),
  c4a: map({year: 1332, camera: cam([34, 34], 6, [34, 39], 6.6), cities: [at(CITY.sinop, 0.6)], routes: [...past('c4'), gold('r', ['mecca', 'cairo', 'damascus', 'alanya', 'konya', 'sinop'], [0.05, 0.85])]}, [J(KK('c4', 0, 0.35))]),
  c4b: map({year: 1332, camera: STEPPE, cities: [CITY.sinop], routes: [...past('c4'), gold('r', ['sinop', 'kaffa'], [0.05, 0.5], true)], regions: [{text: 'GOLDEN HORDE', at: [42, 48.5], appear: 0.4, size: 40}]}, [
    J(KK('c4', 0.35, 0.4)),
    {type: 'glossary', term: 'Steppe', meaning: 'endless grassland with few trees', window: [0.05, 0.5]},
    {type: 'glossary', term: 'Golden Horde', meaning: 'a Mongol state north of the Black Sea', window: [0.5, 0.98]},
  ]),
  c4c: map({year: 1332, camera: cam([40, 46], 7, [46, 46.5], 7.5), cities: [at({name: "Khan's camp", at: P.astrakhan as LonLat, today: 'near Astrakhan, Russia'}, 0.4)], routes: [...past('c4'), gold('r', ['sinop', 'kaffa', 'astrakhan'], [0.05, 0.7])]}, [
    J(KK('c4', 0.4, 0.5)),
    {type: 'character', name: 'Özbeg Khan', role: 'Ruler of the Golden Horde, 1313–1341', line: 'Mongol khan. His court moved with him in tents and wagons.'},
    {type: 'glossary', term: 'Khan', meaning: 'a Mongol or Turkic ruler', window: [0.6, 0.98]},
  ]),
  c4d: map({year: 1332, camera: cam([47, 48], 6, [48, 51], 5.4), cities: [CITY.sarai, at(CITY.bulgar, 0.5)], routes: [...past('c4'), {id: 'bulgar', points: pts(['astrakhan', 'bulgar']), color: COL4.gold, draw: [0.1, 0.6], width: 5, dashed: true}], regions: [{text: 'DOUBTED BY HISTORIANS', at: [52, 53.5], appear: 0.6, size: 28}]}, [
    J(KK('c4', 0.5, 0.62)),
    {type: 'citation', text: 'Historicity doubts: Wikipedia; Dunn', at: [0.5, 0.98]},
  ]),
  c4e: map({year: 1332, camera: cam([42, 46], 6, [32, 43], 6.5, true), cities: [at(CITY.constantinople, 0.5, 1.3)], routes: [...past('c4'), gold('r', ['astrakhan', 'constantinople'], [0.3, 0.95])]}, [
    J(KK('c4', 0.62, 0.8)),
    {type: 'character', name: 'Bayalun', role: "Byzantine princess, the khan's wife", line: 'Pregnant, she travelled home to give birth.', window: [0.02, 0.6]},
    {type: 'glossary', term: 'Byzantine', meaning: 'the Christian Roman Empire of the east', window: [0.6, 0.98]},
  ]),
  c4f: map({year: 1332, camera: cam([28.98, 41.01], 25, [28.98, 41.01], 34), cities: [{...CITY.constantinople, size: 1.4, note: 'Hagia Sophia'}], routes: past('c4')}, [
    {type: 'citation', text: 'Wikipedia: Ibn Battuta (Constantinople, c. 1332)', at: [0.3, 0.98]},
  ]),
  c4g: map({year: 1333, camera: CASIA, cities: [at(CITY.bukhara, 0.5), at(CITY.samarkand, 0.7)], routes: [...past('c4'), gold('r0', ['astrakhan', 'constantinople', 'astrakhan'], [0, 0.001]), gold('r', ['astrakhan', 'sarai', 'urgench', 'bukhara', 'samarkand'], [0.05, 0.9])]}, [J(KK('c4', 0.8, 1))]),
  c4h: recap('Mongol steppe, a Byzantine princess, Constantinople. Next: India.', {camera: cam([66, 35], 6, [71, 32], 6.5), routes: [...past('c5'), gold('r', ['samarkand', 'balkh', 'kabul', 'indus'], [0.05, 0.6])]}, 'And a very dangerous sultan…'),

  // c5 — the sultan of Delhi (peak ~6:00)
  c5: chapter(5, 'The Sultan', '1333 – 1341', {camera: INDIA, routes: past('c5')}, 'What does a judge do when the ruler is a tyrant?', 'tughlaq-court'),
  c5a: map({year: 1334, camera: cam([72, 31], 7, [77.2, 28.6], 12), cities: [at(CITY.delhi, 0.5, 1.3)], routes: [...past('c5'), gold('r', ['indus', 'multan', 'delhi'], [0.05, 0.7])]}, [
    J(KK('c5', 0.6, 1)),
    {type: 'character', name: 'Muhammad bin Tughluq', role: 'Sultan of Delhi, 1325–1351', line: 'Brilliant, generous, and brutally violent.', image: 'tughlaq-court', window: [0.25, 0.98]},
  ]),
  c5b: art('tughlaq-court', 'Muhammad bin Tughluq on the throne — later painting, Indian Museum, Kolkata', {x: 0.5, y: 0.45, zoom: 1.05}, {x: 0.5, y: 0.4, zoom: 1.3}, [
    {type: 'glossary', term: 'Sultan', meaning: 'a Muslim ruler, like a king', window: [0.05, 0.6]},
  ]),
  c5c: map({year: 1335, camera: hold([77.21, 28.61], 16), cities: [{...CITY.delhi, size: 1.4}], routes: past('c6')}, [
    {type: 'citation', text: 'R. Dunn / ORIAS: Delhi, 1334–1341', at: [0.2, 0.98]},
  ]),
  c5d: map({year: 1341, camera: hold([77.21, 28.61], 18), cities: [{...CITY.delhiPlain, size: 1.4}], routes: past('c6'), regions: [{text: '≈ 7 YEARS AS A JUDGE', at: [80.5, 31.2], appear: 0.1, size: 30}]}, [
    {type: 'citation', text: 'Six or seven years: sources differ', at: [0.3, 0.98]},
  ]),
  c5e: map({year: 1341, camera: cam([77.21, 28.61], 20, [77.21, 28.61], 30), cities: [{...CITY.delhiPlain, size: 1.5}], routes: past('c6'), regions: [{text: '9 DAYS UNDER GUARD', at: [78.4, 29.6], appear: 0.15, size: 34}]}),
  c5f: map({year: 1341, camera: hold([77.21, 28.61], 26), cities: [CITY.delhiPlain], routes: past('c6'), regions: [{text: '5 MONTHS AS A HERMIT', at: [78.3, 29.5], appear: 0.3, size: 30}]}, [
    {type: 'glossary', term: 'Hermit', meaning: 'someone who lives alone, for religion', window: [0.3, 0.98]},
  ]),
  c5g: map({year: 1341, camera: cam([77, 28], 8, [100, 28], 3.2, true), cities: [CITY.delhiPlain, at(CITY.khanbaliq, 0.6)], routes: [...past('c6'), {id: 'emb', points: pts(['delhi', 'calicut', 'sumatra', 'quanzhou', 'khanbaliq']), color: '#f4ecd8', draw: [0.3, 0.9], width: 3, dashed: true}]}, [
    {type: 'glossary', term: 'Ambassador', meaning: "a ruler's official envoy to another ruler", window: [0.4, 0.98]},
  ]),
  c5h: recap('Delhi made him rich, and nearly got him killed. Now he leads an embassy to China.', {camera: INDIA, routes: past('c6')}, 'What could go wrong?'),

  // c6 — shipwreck (peak ~7:30: loses everything)
  c6: chapter(6, 'Shipwreck', '1341 – 1345', {camera: cam([76, 16], 6, [76, 14], 6.6), routes: past('c6')}, 'How fast can you lose everything?'),
  c6a: map({year: 1341, camera: hold([77.6, 28.2], 12), cities: [CITY.delhiPlain], routes: [...past('c6'), gold('r', ['delhi', 'koil'], [0.1, 0.5])], regions: [{text: 'ROBBED BY REBELS', at: [79.6, 26.4], appear: 0.5, size: 30}]}, [
    J(KK('c6', 0, 0.08)),
    {type: 'glossary', term: 'Embassy', meaning: 'an official mission sent to a foreign ruler', window: [0.05, 0.45]},
  ]),
  c6b: map({year: 1341, camera: INDIA, cities: [at(CITY.calicut, 0.6)], routes: [...past('c6'), gold('r0', ['delhi', 'koil'], [0, 0.001]), gold('r', ['koil', 'cambay'], [0.05, 0.4]), gold('s', ['cambay', 'calicut'], [0.4, 0.85], true)]}, [J(KK('c6', 0.08, 0.35))]),
  c6c: map({year: 1341, camera: cam([75.78, 11.25], 30, [75.78, 11.25], 42), cities: [{...CITY.calicut, size: 1.5}], routes: past('c6'), regions: [{text: 'STORM — ONE SHIP SINKS', at: [74.4, 10.6], appear: 0.4, size: 30}]}, [
    {type: 'citation', text: 'Wikipedia; ORIAS: Calicut, 1341', at: [0.3, 0.98]},
  ]),
  c6d: map({year: 1341, camera: cam([75.78, 11.25], 42, [76, 11.5], 20), cities: [CITY.calicut], routes: past('c6'), regions: [{text: 'EMBASSY ✗   GIFTS ✗   JOB ✗', at: [72.5, 13.2], appear: 0.25, size: 30}]}),
  c6e: map({year: 1343, camera: cam([76, 11], 9, [73.5, 4.2], 12), cities: [CITY.calicut, at(CITY.male, 0.5, 1.3)], routes: [...past('c6'), gold('r0', ['delhi', 'koil', 'cambay', 'calicut'], [0, 0.001]), gold('r', ['calicut', 'male'], [0.1, 0.7], true)]}, [J(KK('c6', 0.35, 0.5))]),
  c6f: map({year: 1343, camera: hold([73.51, 4.18], 22), cities: [{...CITY.male, size: 1.4, note: 'chief judge'}], routes: past('c6')}, [
    {type: 'citation', text: 'Time in the Maldives: 9 months – 1.5 years (sources differ)', at: [0.3, 0.98]},
  ]),
  c6g: map({year: 1344, camera: cam([74, 5], 10, [81, 8], 9), cities: [CITY.male, at({...CITY.ceylon, note: "Adam's Peak"}, 0.35)], routes: [...past('c6'), gold('r', ['male', 'ceylon'], [0.05, 0.4], true)], regions: [{text: 'PIRATES', at: [83.5, 11], appear: 0.65, size: 34}]}, [J(KK('c6', 0.5, 0.65))]),
  c6h: recap('Robbed twice, shipwrecked, nothing left. He still sails for China.', {camera: BAY, routes: past('c7')}, 'Did he really get there?'),

  // c7 — China (hedged)
  c7: chapter(7, 'China?', '1345 – 1346', {camera: CHINA, routes: past('c7')}, 'Did he really go to China?'),
  c7a: map({year: 1345, camera: BAY, cities: [CITY.chittagong, at(CITY.sumatra, 0.4), at(CITY.quanzhou, 0.8)], routes: [...past('c7'), gold('r', ['ceylon', 'chittagong'], [0.0, 0.2], true), gold('s', ['chittagong', 'sumatra', 'quanzhou'], [0.2, 0.9], true)]}, [J([K('c6', 0.65), K('c7', 0.5)])]),
  c7b: map({year: 1346, camera: hold([118.59, 24.91], 14), cities: [{...CITY.quanzhou, size: 1.4, note: 'silk, porcelain, paper money'}], routes: past('c7')}, [
    {type: 'glossary', term: 'Porcelain', meaning: 'fine white pottery, a Chinese speciality', window: [0.2, 0.98]},
  ]),
  c7c: map({year: 1346, camera: CHINA, cities: [CITY.quanzhou], routes: [...past('c7'), {id: 'dbt', points: pts(['quanzhou', 'guangzhou', 'quanzhou', 'hangzhou']), color: COL4.gold, draw: [0.05, 0.7], width: 5, dashed: true}], regions: [{text: 'HISTORIANS START TO DOUBT', at: [108, 35], appear: 0.25, size: 32}]}, [J(KK('c7', 0.5, 0.75))]),
  c7d: map({year: 1346, camera: cam([116, 32], 6, [116, 37], 6.4), cities: [CITY.quanzhou, at(CITY.khanbaliq, 0.3)], routes: [...past('c7'), {id: 'bj', points: pts(['hangzhou', 'khanbaliq']), color: COL4.gold, draw: [0.05, 0.5], width: 5, dashed: true}], regions: [{text: 'PROBABLY NOT THIS FAR?', at: [109, 41.5], appear: 0.55, size: 30}]}, [
    J(KK('c7', 0.75, 1)),
    {type: 'citation', text: 'Historicity: Wikipedia (Dunn, Haw)', at: [0.5, 0.98]},
  ]),
  c7e: map({camera: cam(WORLD, 2.5, WORLD, 2.6), routes: [polo(), ...past('c8')], regions: [{text: 'TOLD FROM MEMORY, NO NOTES', at: [55, 52], appear: 0.15, size: 30}]}),
  c7f: recap('China is the shakiest part of his story. And the plague is coming.', {camera: cam([80, 25], 3, [55, 28], 3.4), routes: past('c8')}, 'The Black Death…'),

  // c8 — the Black Death and home (peak ~9:45)
  c8: chapter(8, 'The Black Death', '1346 – 1349', {camera: cam([36, 33], 7, [36, 33], 7.6), routes: past('c8')}, 'What was waiting for him at home?'),
  c8a: map({year: 1347, camera: cam([90, 18], 3.2, [50, 25], 3.6, true), cities: [at(CITY.damascus, 0.8)], routes: [...past('c8'), gold('r', ['khanbaliq', 'quanzhou'], [0, 0.1]), gold('s', ['quanzhou', 'sumatra', 'calicut', 'dhofar', 'hormuz'], [0.1, 0.65], true), gold('t', ['hormuz', 'baghdad', 'damascus'], [0.65, 0.95])]}, [J(KK('c8', 0, 0.62))]),
  c8b: map({year: 1348, camera: cam([36, 33], 7, [33, 31], 7.5), cities: [CITY.damascus, at(CITY.cairo, 0.5)], routes: past('c8'), regions: [{text: 'BLACK DEATH', at: [33, 35.5], appear: 0.3, size: 40}]}, [
    {type: 'glossary', term: 'Black Death', meaning: 'a plague that killed millions, 1346–1353', window: [0.25, 0.98]},
  ]),
  c8c: map({year: 1348, camera: hold([36.29, 33.51], 16), cities: [{...CITY.damascus, size: 1.4, note: '≈ 2,400 deaths a day (his figure)'}], routes: past('c8')}, [
    {type: 'citation', text: 'Rihla, Gibb & Beckingham vol. 4, p. 918', at: [0.3, 0.98]},
  ]),
  c8d: map({year: 1348, camera: cam([34, 26], 6, [15, 32], 5.5), cities: [CITY.meccaPlain, at(CITY.tunis, 0.7)], routes: [...past('c8'), gold('r0', ['khanbaliq', 'quanzhou', 'sumatra', 'calicut', 'dhofar', 'hormuz', 'baghdad', 'damascus'], [0, 0.001]), gold('r', ['damascus', 'jerusalem', 'cairo', 'mecca', 'cairo'], [0.05, 0.5]), gold('s', ['cairo', 'tunis'], [0.5, 0.9], true)]}, [J(KK('c8', 0.62, 0.92))]),
  c8e: map({year: 1349, camera: cam([6, 35], 7, [-5, 35], 12), cities: [at(CITY.fez, 0.5, 1.3), CITY.tangierPlain], routes: [...past('c8'), gold('r', ['tunis', 'fez'], [0.05, 0.6])]}, [J(KK('c8', 0.92, 1))]),
  c8f: map({year: 1349, camera: cam([-5.8, 35.7], 20, [-5.0, 34.03], 16), cities: [CITY.tangierPlain, {...CITY.fez, size: 1.4}], routes: past('c9'), regions: [{text: 'HOME AFTER 24 YEARS', at: [-2.4, 36.4], appear: 0.4, size: 30}]}),
  c8g: recap('24 years on the road. Home in Fez. But one great kingdom was missing.', {camera: SAHARA, routes: past('c9')}, 'Across the Sahara…'),

  // c9 — Mali
  c9: chapter(9, 'Mali', '1351 – 1354', {camera: SAHARA, routes: past('c9')}, 'What lies on the other side of the Sahara?', 'catalan-mansa-musa'),
  c9a: map({year: 1351, camera: cam([-5, 30], 7, [-5, 20], 5.5), cities: [CITY.fezPlain, at(CITY.timbuktu, 0.6)], routes: past('c9'), regions: [{text: 'SAHARA', at: [2, 25], appear: 0.1, size: 44}, {text: 'EMPIRE OF MALI', at: [-6, 14], appear: 0.55, size: 36}]}),
  c9b: art('catalan-mansa-musa', 'Catalan Atlas, 1375 (BnF): a king of Mali, usually identified as Mansa Musa', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.55, zoom: 1.35}),
  c9c: map({year: 1352, camera: SAHARA, cities: [CITY.fezPlain, at(CITY.sijilmasa, 0.2), at({...CITY.taghaza, note: 'houses built of salt'}, 0.6)], routes: [...past('c9'), gold('r', ['fez', 'sijilmasa', 'taghaza', 'walata'], [0.05, 0.85])]}, [J(KK('c9', 0, 0.45))]),
  c9d: map({year: 1352, camera: cam([-7, 16], 9, [-8, 13], 11), cities: [CITY.walata, at(CITY.mali, 0.5, 1.3)], routes: [...past('c9'), gold('r0', ['fez', 'sijilmasa', 'taghaza', 'walata'], [0, 0.001]), gold('r', ['walata', 'mali'], [0.05, 0.5])]}, [
    J(KK('c9', 0.45, 0.58)),
    {type: 'character', name: 'Mansa Sulayman', role: 'King of Mali, 1341–1360', line: 'Brother of the famous Mansa Musa.', window: [0.35, 0.98]},
    {type: 'glossary', term: 'Mansa', meaning: 'king, in the Mali Empire', window: [0.05, 0.35]},
  ]),
  c9e: {kind: 'map', year: 1352, map: M({camera: hold([-8.85, 11.37], 14), cities: [CITY.mali], routes: past('c9')}), overlays: [{type: 'list', title: "The king's welcome gift (his complaint)", items: ['3 loaves of bread', 'Some fried beef', 'A gourd of yogurt'], source: 'R. Dunn / ORIAS: Journey to Mali'}]},
  c9f: map({year: 1353, camera: cam([-4, 16], 7, [-4, 26], 5.5), cities: [at(CITY.timbuktu, 0.2), at(CITY.fezPlain, 0.85)], routes: [...past('c9'), gold('r0', ['fez', 'sijilmasa', 'taghaza', 'walata', 'mali'], [0, 0.001]), gold('r', ['mali', 'timbuktu', 'gao', 'takedda', 'tuat', 'sijilmasa', 'fez'], [0.05, 0.9])]}, [J(KK('c9', 0.58, 1))]),
  c9g: recap('His travelling days are over. Now his story has to make its own journey.', {camera: cam(WORLD, 2.5, WORLD, 2.6), routes: [ALL_GOLD]}, 'Into a book…'),

  // c10 — the book, payoff, end screen
  c10: chapter(10, 'The Book', 'c. 1355', {camera: hold([-5.0, 34.03], 14), cities: [CITY.fez]}, 'Why did Europe forget him?', 'catalan-atlas'),
  c10a: map({year: 1355, camera: hold([-5.0, 34.03], 18), cities: [{...CITY.fez, size: 1.4}], routes: [ALL_GOLD]}, [
    {type: 'character', name: 'Abu Inan', role: 'Sultan of Morocco, 1348–1358', line: 'Asked for the story to be written down.', window: [0.02, 0.5]},
    {type: 'character', name: 'Ibn Juzayy', role: 'Court writer in Fez', line: 'Wrote down and polished what Ibn Battuta told him.', window: [0.5, 0.98]},
  ]),
  c10b: map({year: 1355, camera: cam([-5.0, 34.03], 18, [-5, 34], 8), cities: [CITY.fezPlain], routes: [ALL_GOLD], regions: [{text: 'RIHLA = "THE JOURNEY"', at: [2, 38.5], appear: 0.55, size: 34}]}, [
    {type: 'glossary', term: 'Rihla', meaning: 'Arabic for "journey"; also a travel book', window: [0.55, 0.98]},
  ]),
  c10c: map({camera: cam([20, 35], 4, [20, 38], 4.4), routes: [ALL_GOLD], regions: [{text: 'ARABIC COPIES', at: [28, 28], appear: 0.4, size: 32}, {text: 'EUROPE: UNKNOWN', at: [8, 48], appear: 0.6, size: 32}]}),
  c10d: art('catalan-atlas', 'Catalan Atlas, 1375 (BnF) — European maps drew on Marco Polo', {x: 0.75, y: 0.5, zoom: 1.5}, {x: 0.85, y: 0.5, zoom: 1.3}, [
    {type: 'citation', text: 'Wikipedia: Marco Polo (influence on Columbus)', at: [0.3, 0.98]},
  ]),
  c10e: map({camera: cam([2, 46], 7, [2.3, 48.8], 9), routes: [], cities: [{name: 'Paris', at: [2.35, 48.86], today: 'France', note: 'Arabic text + French, 1853–58'}]}, [
    {type: 'citation', text: 'Defrémery & Sanguinetti, 4 vols, 1853–1858', at: [0.3, 0.98]},
  ]),
  c10f: {kind: 'map', map: M({camera: hold(WORLD, 2.5), routes: [polo(), ALL_GOLD]}), overlays: [{type: 'list', title: 'The answers', items: ['Paid by learning + hospitality', 'Survived bandits, a tyrant, a wreck, pirates, plague', 'Europe never had his book until the 1800s']}]},
  c10g: map({camera: cam(WORLD, 2.2, WORLD, 2.4), routes: [polo([0, 0.25]), {...ALL_GOLD, draw: [0.25, 0.85], width: 7}],
    choropleth: {values: Object.fromEntries(ROUTE_COUNTRIES.map((id) => [id, 1])), breaks: [0.5], colors: ['rgba(0,0,0,0)', 'rgba(242,182,50,0.42)'], appear: [0.7, 0.95]}}, [
    J([0, TOTAL_EST_KM]),
    {type: 'citation', text: '≈117,000 km and ≥ 40 countries: estimates (Dunn; ORIAS)', at: [0.2, 0.98]},
  ]),
  c10h: map({camera: cam(WORLD, 2.4, [60, 25], 2.6), routes: [polo(), ALL_GOLD, {id: 'dbt', points: pts(['quanzhou', 'hangzhou', 'khanbaliq']), color: '#f4ecd8', draw: [0, 0.001], width: 3, dashed: true}], regions: [{text: 'DOUBTED PARTS DASHED', at: [100, 45], appear: 0.2, size: 28}]}),
  c10i: map({camera: hold(WORLD, 2.5), routes: [polo(), ALL_GOLD], regions: [{text: 'POLO OR IBN BATTUTA?', at: [55, 50], appear: 0.15, size: 40}]}),
  c10j: art('catalan-atlas', '', {x: 0.4, y: 0.5, zoom: 1.2}, {x: 0.45, y: 0.5, zoom: 1.05}, [{type: 'endscreen', teaser: 'Why Rome destroyed Carthage'}]),
};
