import React from 'react';
import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import type {CamKey, MapSpec, MapTheme, RegionLabel} from '../../../../packages/engine/src/map/map';
import type {ScaleCam} from '../../../../packages/engine/src/scale/units';
import type {ScaleSpec, ScaleSubject} from '../../../../packages/engine/src/scale/scale';
import type {CompareSpec} from '../../../../packages/engine/src/scale/compare';
import {offset, SatZoomShot} from '../../../../packages/engine/src/scale/satzoom';
import type {SatCam, SatShape, SatZoomSpec} from '../../../../packages/engine/src/scale/satzoom';

// Scale & Science 003 "The Biggest Living Thing Isn't a Whale" — visual design per scene id (timeline.json).
// Realism rule (Aymen 15 Nov 2026): real NOAA/NPS/USFS photos, a real NOAA top-view whale cut out at exact length,
// and REAL satellite imagery (EOxCloudless 2016, CC BY 4.0 — credit on frame; USDA NAIP for Pando) with footprints
// drawn at true size. Every number on screen has a row in sources.md. Wording rules: see build_timeline.py docstring.

export const C = {whale: '#7fc4d8', tree: '#8fd19e', pando: '#f2c14e', fungus: '#f0a650', clone: '#5ef0a8', paris: '#ff8fa3', fucus: '#c9a46a', pitch: '#ffffff'};

export const CLARITY: ClarityConfig = {
  factions: [],
  chapters: {c1: 'The Biggest Animal', c2: 'The Giant Trees', c3: 'The Forest That Is One Tree', c4: 'The Humongous Fungus', c5: 'One Plant, 180 km', c6: 'So Which Is the Biggest?'},
  highlight: {Pando: C.pando, Hyperion: C.tree, Sherman: C.tree, Posidonia: C.clone, 'Shark Bay': C.clone, Armillaria: C.fungus},
  now: 2026,
};

// ---------- building blocks ----------
const gloss = (term: string, meaning: string, window: [number, number] = [0.1, 0.85]): Overlay => ({type: 'glossary', term, meaning, window});
const src = (text: string): Overlay => ({type: 'citation', text});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], points?: {x: number; y: number; label: string; appear?: number; color?: string}[]): SceneDef => ({
  kind: 'art',
  art: {id, title, from, to, points},
  overlays,
});
const cam = (x0: number, w0: number, x1 = x0, w1 = w0): ScaleCam[] => [{at: 0, x: x0, width: w0}, {at: 1, x: x1, width: w1}];
const stage = (env: ScaleSpec['env'], spec: Omit<ScaleSpec, 'env'>, overlays?: Overlay[]): SceneDef => ({kind: 'scale', scale: {env, ...spec}, overlays});
const compare = (spec: CompareSpec, overlays?: Overlay[]): SceneDef => ({kind: 'compare', compare: spec, overlays});
const sat = (spec: SatZoomSpec, overlays?: Overlay[]): SceneDef => ({
  kind: 'custom',
  render: ({p, elapsed}) => React.createElement(SatZoomShot, {spec, p, elapsed}),
  overlays,
});

// ---------- scale-stage subjects (real cut-outs; references are plain rulers) ----------
const whale = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'whale', shape: 'blueWhale', image: 'bw-top', fit: 'length', size: 30, x, y: 6, label: 'Blue whale', sizeLabel: '20–30 m · up to ~190 t', ...extra});
const whaleUp = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'whaleUp', shape: 'human', image: 'bw-up', size: 30, x, label: 'Blue whale, on its tail', sizeLabel: '30 m', ...extra});
const you = (x: number): ScaleSubject => ({id: 'you', shape: 'human', size: 1.75, x, color: '#ffd166', label: '', you: true});
const bus = (id: string, x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id, shape: 'bus', size: 12, x, color: '#f2c14e', label: 'City bus', sizeLabel: '12 m', labelInside: true, bracket: false, ...extra});

// ---------- satellite stages ----------
const EOX = 'Imagery: EOxCloudless 2016 by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016) · CC BY 4.0';
const NAIP = 'Imagery: USDA NAIP / USGS The National Map (public domain)';
type LL = [number, number];
const SB: LL = [113.65, -25.95]; // Shark Bay origin
const PANDO: LL = [-111.75, 38.525];
const MAL: LL = [-118.6, 44.45];
const at = (o: LL, p: LL) => {
  const [x, y] = offset(o, p);
  return {x, y};
};
const r = (areaM2: number) => Math.sqrt(areaM2 / Math.PI); // equal-area circle radius
const SBL = ['sb-z8', 'sb-z10', 'sb-z12', 'sb-z14'];
const WHALE_AT: LL = [113.775, -25.79]; // open water east of Monkey Mia
const W0 = at(SB, WHALE_AT);
// sampled meadows of the clone (Edgeloe 2022 Fig. 1; positions = OpenStreetMap place names, approx.)
const SITES: {name: string; ll: LL}[] = [
  {name: 'Dirk Hartog I.', ll: [113.07, -25.72]},
  {name: 'Herald Bight', ll: [113.55, -25.61]},
  {name: 'Middle Bluff', ll: [113.46, -25.81]},
  {name: 'Monkey Mia', ll: [113.72, -25.79]},
  {name: 'Faure Sill', ll: [113.885, -25.85]},
  {name: 'Fowlers Camp', ll: [113.62, -26.11]},
  {name: 'Nanga Bay', ll: [113.8, -26.26]},
];
const pins = (appear0: number, step: number, labels = true): SatShape[] =>
  SITES.map((s, i) => ({type: 'pin', at: s.ll, label: labels ? s.name : undefined, color: C.clone, appear: appear0 + i * step}));
const RULER: SatShape = {type: 'path', pts: [[-90000, 26000], [90000, 26000]], color: C.clone, label: 'The clone spans ≥ 180 km', sub: 'this long (White Island → Faure Sill)', draw: [0.15, 0.45], appear: 0.15};
const whaleImg = (extra: Partial<SatShape> = {}): SatShape => ({type: 'image', id: 'bw-top', len: 30, ...W0, rot: 25, ...extra} as SatShape);
const whaleRing = (extra: Partial<SatShape> = {}): SatShape => ({type: 'circle', r: 30, ...W0, minPx: 26, color: C.whale, label: 'Blue whale · 30 m', sub: 'to scale', ...extra} as SatShape);
const clone = (x: number, y: number, extra: Partial<SatShape> = {}): SatShape => ({type: 'circle', r: r(200e6), x, y, fill: true, color: C.clone, label: 'Seagrass clone meadows ≈ 200 km²', sub: 'same total area · shape simplified', ...extra} as SatShape);
const paris = (x: number, y: number, extra: Partial<SatShape> = {}): SatShape => ({type: 'circle', r: r(105.4e6), x, y, color: C.paris, label: 'Paris · 105 km²', sub: 'same area · shape simplified', ...extra} as SatShape);
const pandoRing = (x: number, y: number, extra: Partial<SatShape> = {}): SatShape => ({type: 'circle', r: r(42.6e4), x, y, color: C.pando, label: 'Pando · 42.6 ha', sub: 'same area · shape simplified', ...extra} as SatShape);
const fungusRing = (x: number, y: number, extra: Partial<SatShape> = {}): SatShape => ({type: 'circle', r: r(9.65e6), x, y, fill: true, color: C.fungus, label: 'Honey fungus · 9.65 km²', sub: 'same area · position & shape simplified', ...extra} as SatShape);
const pitch = (x: number, y: number, extra: Partial<SatShape> = {}): SatShape => ({type: 'rect', w: 105, h: 68, x, y, color: C.pitch, label: 'Football pitch', sub: '105 × 68 m', ...extra} as SatShape);
const sbCam = (...k: [number, number, number, number][]): SatCam[] => k.map(([a, w, x, y]) => ({at: a, width: w, x, y}));

// ---------- maps ----------
const THEME: MapTheme = {sea: '#0d2a38', land: '#7a6a4f', coast: '#e2d3b0', graticule: 'rgba(255,255,255,0.05)', text: '#f4f1e6'};
const AU: RegionLabel[] = [{text: 'AUSTRALIA', at: [134, -25]}, {text: 'Indian Ocean', at: [104, -24]}, {text: 'WESTERN AUSTRALIA', at: [121, -27.5]}];
const mapCam = (a: [number, number], za: number, b: [number, number], zb: number): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb}];
const map = (spec: Omit<MapSpec, 'theme' | 'modern' | 'avoidLabels'>, overlays?: Overlay[], labels = AU): SceneDef => ({
  kind: 'map',
  map: {theme: THEME, modern: {labels}, avoidLabels: true, minText: 30, ...spec},
  overlays,
});

// grand ladder positions (metres from SB): all east of the whale, over the eastern gulf
const P1 = {x: W0.x + 150, y: W0.y};
const P2 = {x: W0.x + 900, y: W0.y};
const P3 = {x: W0.x + 4500, y: W0.y};
const P4 = {x: W0.x + 20000, y: W0.y - 6000};

export const SCENES: Record<string, SceneDef> = {
  // ---------- hook: the promise on frame 1 (real satellite + the clone's meadows + the ≥180 km ruler) ----------
  h1: sat({layers: SBL, origin: SB, camera: sbCam([0, 300000, 0, -15000], [1, 250000, 0, -15000]), credit: EOX, shapes: [...pins(0.02, 0.025, false), {...RULER, draw: [0.3, 0.7], appear: 0.3}]}, [{type: 'character', name: 'One single plant', role: 'Shark Bay, Western Australia', line: 'One seagrass clone, found in meadows spanning at least 180 km (Edgeloe et al. 2022).', side: 'none', window: [0.02, 0.97]}]),
  h2: sat({layers: SBL, origin: SB, camera: sbCam([0, 600, W0.x + 60, W0.y], [0.45, 650, W0.x + 60, W0.y], [1, 240000, 0, -15000]), credit: EOX, dim: 0.1, shapes: [whaleImg(), whaleRing({labelVanish: 0.6}), ...pins(0.75, 0.01, false)]}, [{type: 'character', name: 'Blue whale', role: '30 m · real NOAA photo, to scale', line: 'Placed at its true size on the satellite image of Shark Bay.', side: 'none', image: 'bw-pair', window: [0.03, 0.5]}]),
  h3: stage('ocean', {subjects: [whale(4), you(1)], camera: cam(19, 44, 20, 50)}, [{type: 'list', title: 'What most people guess', items: ['the blue whale?', 'a giant tree?'], source: ''}]),
  h4: sat({layers: SBL, origin: SB, camera: sbCam([0, 60000, 0, -5000], [1, 66000, 0, -5000]), credit: EOX, dim: 0.15, shapes: [clone(-9000, -6000, {appear: 0.05}), paris(10000, -6000, {appear: 0.3})]}),
  h5: compare({title: 'Coming up: the biggest living things, by length', unit: 'length', max: 200, rows: [
    {label: 'Blue whale', note: 'body length', range: [20, 30], color: C.whale, appear: 0.05},
    {label: 'Ningaloo siphonophore', note: 'outer ring, estimated', value: 47, color: '#b9a6f0', appear: 0.12},
    {label: 'Hyperion redwood', note: 'height, 2019', value: 116.07, color: C.tree, appear: 0.19},
    {label: '???', note: 'one living thing', value: 200, text: '?', color: '#555c63', appear: 0.3},
  ]}),

  // ---------- 1 the biggest animal ----------
  c1: art('bw-pair', '', {x: 0.5, y: 0.5, zoom: 1.1}, {x: 0.55, y: 0.5, zoom: 1.2}, [{type: 'chapter', n: 1, title: 'The Biggest Animal', sub: 'the blue whale', question: 'Can anything alive beat the blue whale?', image: 'bw-pair'}]),
  c1b: stage('ocean', {subjects: [whale(4), you(1)], camera: cam(17, 40, 19, 46)}, [src('Guinness World Records: adults 20–30 m')]),
  c1c: stage('ocean', {subjects: [whale(4, {y: 9}), bus('bus1', 4, {appear: 0.05, y: 0}), bus('bus2', 16, {appear: 0.15, y: 0})], camera: cam(19, 44)}, [{type: 'character', name: 'Heaviest on record', role: 'estimated, Guinness', line: '~190 t: a 27.6 m female caught in 1947.', side: 'none', window: [0.45, 0.98]}]),
  c1d: art('bw-aerial', 'Blue whale from the air · NOAA Photo Library (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.2}, [src('Our first video: blue whale vs megalodon vs the giant dinosaurs')]),
  c1e: art('siph', 'A siphonophore, deep sea · NOAA Ocean Exploration (public domain)', {x: 0.3, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.2}),
  c1f: map({projection: 'mercator', camera: mapCam([134, -26], 2.4, [113.5, -22.5], 6.5), cities: [{name: 'Ningaloo (April 2020)', at: [113.6, -22.4], appear: 0.35}, {name: 'Perth', at: [115.86, -31.95]}]}, [src('Schmidt Ocean Institute expedition, Ningaloo Canyons · ScienceAlert 2020')]),
  c1g: compare({title: 'Longest animals', unit: 'length', max: 50, rows: [
    {label: 'Blue whale', note: 'body length', range: [20, 30], color: C.whale},
    {label: 'Ningaloo siphonophore', note: 'outer ring of its spiral, estimated', value: 47, text: '~47 m', color: '#b9a6f0', appear: 0.2},
  ], source: 'Guinness; ScienceAlert 2020 (Schmidt Ocean Institute)'}),
  c1h: art('siph', 'A siphonophore: one colony, many specialised parts · NOAA Ocean Exploration (public domain)', {x: 0.4, y: 0.5, zoom: 1.2}, {x: 0.6, y: 0.5, zoom: 1.4}, [gloss('Zooid', 'a colony unit with its own job', [0.3, 0.95])]),
  c1i: art('siph', '', {x: 0.7, y: 0.5, zoom: 1.5}, {x: 0.6, y: 0.5, zoom: 1.3}, [{type: 'quote', text: 'What counts as one living thing?', by: 'keep this question in mind'}]),
  c1r: art('bw-pair', '', {x: 0.5, y: 0.5, zoom: 1.25}, {x: 0.5, y: 0.5, zoom: 1.3}, [{type: 'recap', text: 'The blue whale is the heaviest animal; a colony animal can be longer.', next: 'Can anything alive get much bigger?'}]),

  // ---------- 2 the giant trees ----------
  c2: art('redwoods', '', {x: 0.5, y: 0.6, zoom: 1.1}, {x: 0.5, y: 0.4, zoom: 1.2}, [{type: 'chapter', n: 2, title: 'The Giant Trees', sub: 'California', question: 'Can a tree beat the whale?', image: 'redwoods'}]),
  c2b: art('redwoods', 'Coast redwoods · NPS (public domain). Hyperion’s exact location is kept secret to protect it.', {x: 0.3, y: 0.8, zoom: 1.7}, {x: 0.3, y: 0.25, zoom: 1.4}, [src('Hyperion: 116.07 m (2019 measurement, Guinness)')]),
  c2c: stage('land', {subjects: [whaleUp(60), you(52)], levels: [{height: 116.07, label: 'Hyperion, coast redwood · 116.07 m (2019)', color: C.tree, appear: 0.1}], heightAxis: true, camera: cam(120, 360, 125, 380)}),
  c2d: art('sherman', 'General Sherman, Sequoia National Park · Daniel G. Rego (CC0)', {x: 0.5, y: 0.8, zoom: 1.5}, {x: 0.5, y: 0.35, zoom: 1.15}, [src('NPS: largest single tree by trunk volume')]),
  c2e: compare({title: 'Volume', unit: 'mass', max: 1600, rows: [
    {label: 'General Sherman', note: 'trunk only, NPS estimate', value: 1486.6, text: '1,486.6 m³', color: C.tree},
    {label: 'Heaviest blue whale', note: '~190 t ≈ 184 m³ (approx.)', value: 184, text: '≈ 184 m³', color: C.whale, appear: 0.2},
  ], source: 'NPS (updated 2025); Guinness; derived'}),
  c2f: art('redwoods', '', {x: 0.5, y: 0.3, zoom: 1.2}, {x: 0.5, y: 0.6, zoom: 1.05}),
  c2r: art('sherman', '', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.25}, [{type: 'recap', text: 'Trees beat the whale on height and on volume.', next: 'Could one living thing be a whole forest?'}]),

  // ---------- 3 the forest that is one tree ----------
  c3: art('pando-fall', '', {x: 0.5, y: 0.5, zoom: 1.1}, {x: 0.5, y: 0.45, zoom: 1.2}, [{type: 'chapter', n: 3, title: 'The Forest That Is One Tree', sub: 'Pando, Utah', question: 'Can a whole forest be one living thing?', image: 'pando-fall'}]),
  c3b: sat({layers: ['pando-z12', 'pando-z16'], origin: PANDO, camera: sbCam([0, 3000, 0, 0], [1, 1800, 0, 0]), credit: NAIP}),
  c3c: art('pando-fall', 'Pando: every trunk grew from the same roots · USDA Forest Service (public domain)', {x: 0.5, y: 0.75, zoom: 1.5}, {x: 0.5, y: 0.45, zoom: 1.25}, [src('Rogers & McAvoy 2018; Pineau et al. 2026: ~47,000 stems, one genet')]),
  c3d: art('pando-fall', 'Pando in autumn · USDA Forest Service (public domain)', {x: 0.4, y: 0.5, zoom: 1.2}, {x: 0.6, y: 0.5, zoom: 1.3}, [gloss('Ramet / genet', 'one trunk / the whole clone', [0.1, 0.95])]),
  c3e: sat({layers: ['pando-z12', 'pando-z16'], origin: PANDO, camera: sbCam([0, 2600, 0, 0], [1, 2200, 0, 0]), credit: NAIP, shapes: [pandoRing(0, 0, {appear: 0.05, sub: 'shape simplified'}), pitch(560, 260, {appear: 0.4, label: '1 football pitch', sub: 'Pando ≈ 60 of these'})]}),
  c3e2: sat({layers: ['pando-z12', 'pando-z16'], origin: PANDO, camera: sbCam([0, 2200, 0, 0], [1, 3000, 0, 0]), credit: NAIP, shapes: [pandoRing(0, 0), {type: 'path', pts: [[-1000, -150], [1000, 150]], color: '#ffffff', label: '~2 km at its widest', sub: '≈ 25 minutes on foot', draw: [0.1, 0.5], dashed: true}]}, [src('Pineau et al. 2026: Pando spans roughly 2 km at its widest')]),
  c3f: compare({title: 'Weight', unit: 'mass', max: 6500, rows: [
    {label: 'Pando', note: 'whole clone, estimated', value: 6000, text: '~6,000 t', color: C.pando},
    {label: 'Heaviest blue whale', note: 'estimated', value: 190, text: '~190 t', color: C.whale, appear: 0.2},
  ], tally: {row: 0, shape: 'blueWhale', each: 190, label: 'blue whales (approx.)', appear: 0.45}, source: 'Grant 1993; Guinness'}),
  c3g: sat({layers: ['pando-z12', 'pando-z16'], origin: PANDO, camera: sbCam([0, 1900, 200, 0], [1, 2300, -200, 0]), credit: NAIP, dim: 0.25, shapes: [pandoRing(0, 0, {label: undefined})]}, [{type: 'character', name: 'How old is Pando?', role: 'Pineau et al. 2026 (eLife)', line: 'DNA model: ~12,000–37,000 years. Reviewers: evidence still incomplete.', side: 'none', window: [0.1, 0.95]}]),
  c3h: art('pando-fall', 'Young aspen shoots are eaten before they can grow', {x: 0.5, y: 0.75, zoom: 1.4}, {x: 0.5, y: 0.6, zoom: 1.2}, [src('Rogers & McAvoy 2018, PLOS ONE: deer and cattle browsing')]),
  c3r: sat({layers: ['pando-z12', 'pando-z16'], origin: PANDO, camera: sbCam([0, 2500, 0, 0], [1, 2700, 0, 0]), credit: NAIP, dim: 0.35}, [{type: 'recap', text: 'A whole forest can be one living thing.', next: 'What if most of a giant is underground?'}]),

  // ---------- 4 the humongous fungus ----------
  c4: art('armillaria', '', {x: 0.5, y: 0.5, zoom: 1.1}, {x: 0.5, y: 0.5, zoom: 1.2}, [{type: 'chapter', n: 4, title: 'The Humongous Fungus', sub: 'Oregon', question: 'How big can something hidden get?', image: 'armillaria'}]),
  c4b: art('malheur', 'Malheur National Forest, Oregon, 1942 · Russell Lee, Library of Congress (public domain)', {x: 0.5, y: 0.6, zoom: 1.1}, {x: 0.5, y: 0.4, zoom: 1.25}),
  c4c: art('armillaria', 'Armillaria ostoyae, a honey fungus · George Chernilevsky (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.55, zoom: 1.3}),
  c4d: art('armillaria2', 'Honey fungus at the base of a tree · George Chernilevsky (public domain)', {x: 0.5, y: 0.7, zoom: 1.5}, {x: 0.5, y: 0.6, zoom: 1.2}, [gloss('Rhizomorph', 'dark, root-like fungus strand', [0.4, 0.95])]),
  c4d2: sat({layers: ['malheur-z11', 'malheur-z13'], origin: MAL, camera: sbCam([0, 7000, 0, 0], [1, 9000, 0, 0]), credit: EOX}, [src('Ferguson et al. 2003: the fungus spreads from root to root, under the forest')]),
  c4e: sat({layers: ['malheur-z11', 'malheur-z13'], origin: MAL, camera: sbCam([0, 26000, 0, 0], [1, 9000, 0, 0]), credit: EOX, shapes: [fungusRing(0, 0, {appear: 0.35})]}, [src('Ferguson et al. 2003: one genet, ~965 ha')]),
  c4f: sat({layers: ['malheur-z11', 'malheur-z13'], origin: MAL, camera: sbCam([0, 9000, 0, 0], [1, 10500, 800, 0]), credit: EOX, shapes: [fungusRing(0, 0), pandoRing(3300, 0, {appear: 0.35, label: 'Pando, for scale', sub: '42.6 ha · same area'})]}),
  c4g: art('armillaria2', 'Honey mushrooms are only the fruit · George Chernilevsky (public domain)', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.55, y: 0.45, zoom: 1.3}, [{type: 'character', name: 'How old?', role: 'Ferguson et al. 2003', line: 'Spread-rate models: 1,900–8,650 years.', side: 'none', window: [0.1, 0.95]}]),
  c4h: art('malheur', '', {x: 0.5, y: 0.35, zoom: 1.3}, {x: 0.5, y: 0.6, zoom: 1.1}, [src('Scientific American 2007: “the largest organism”')]),
  c4i: art('sb-nasa', 'Shark Bay, Western Australia, from space · NASA Earth Observatory (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.35}),
  c4r: art('armillaria2', '', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.25}, [{type: 'recap', text: 'One fungus covers almost 10 km².', next: 'So what could be bigger, under the sea?'}]),

  // ---------- 5 the plant that spans 180 km ----------
  c5: art('sb-nasa', '', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.3}, [{type: 'chapter', n: 5, title: 'One Plant, 180 km', sub: 'Shark Bay, Western Australia', question: 'Is this the biggest living thing on Earth?', image: 'sb-nasa'}]),
  c5b: map({projection: 'mercator', camera: mapCam([128, -27], 2.6, [113.8, -26.0], 8.5), cities: [{name: 'Shark Bay', at: [113.75, -25.9], appear: 0.4}, {name: 'Perth', at: [115.86, -31.95]}, {name: 'Ningaloo', at: [113.6, -22.4]}]}, [gloss('Shark Bay', 'World Heritage Site; Gathaagudu to the Malgana', [0.45, 0.98])]),
  c5c: art('seagrass', 'A seagrass meadow (Posidonia oceanica, a Mediterranean relative) · Karim saari, CC BY 4.0', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.45, zoom: 1.25}, [gloss('Seagrass', 'a flowering plant that lives under the sea', [0.1, 0.9])]),
  c5d: art('seagrass-diver', 'A diver in a seagrass meadow · Symbiosis / ocean.si.edu, CC BY 2.0', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.2}, [src('Edgeloe et al. 2022: 10 Posidonia australis meadows sampled')]),
  c5e: sat({layers: SBL, origin: SB, camera: sbCam([0, 200000, 0, -5000], [1, 180000, 0, -8000]), credit: EOX, shapes: pins(0.15, 0.06)}, [{type: 'character', name: 'Same DNA', role: 'Edgeloe et al. 2022', line: '9 of 10 sampled meadows = one clone · 1 meadow was a different plant', side: 'none', window: [0.55, 0.98]}]),
  c5f: sat({layers: SBL, origin: SB, camera: sbCam([0, 180000, 0, -15000], [1, 250000, 0, -25000]), credit: EOX, shapes: [...pins(0, 0, false), RULER]}),
  c5f2: compare({title: '180 km is…', unit: 'length', max: 200, rows: [
    {label: 'Shark Bay clone span', note: 'at least', value: 180, text: '≥ 180 km', color: C.clone},
    {label: 'Motorway drive at 100 km/h', note: 'about', value: 180, text: '≈ 1 h 48 min', color: '#d6e4ea', appear: 0.3},
  ], source: 'Edgeloe 2022; derived'}),
  c5g: sat({layers: SBL, origin: SB, camera: sbCam([0, 70000, 0, -5000], [1, 62000, 0, -5000]), credit: EOX, dim: 0.15, shapes: [clone(-9000, -6000), paris(10000, -6000, {appear: 0.35})]}, [src('Edgeloe 2022: ~200 km² of P. australis meadows (pre-2011) · Paris 105.4 km² (INSEE)')]),
  c5h: art('seagrass', '', {x: 0.3, y: 0.5, zoom: 1.3}, {x: 0.6, y: 0.5, zoom: 1.15}, [{type: 'character', name: 'How old?', role: 'Edgeloe et al. 2022', line: 'Growth model: up to ~4,500 years.', side: 'none', window: [0.15, 0.95]}]),
  c5i: compare({title: 'How old? (estimates)', unit: 'length', max: 38000, rows: [
    {label: 'Great Pyramid of Giza', note: 'built c. 2560 BC', value: 4580, text: '~4,580 years ago', color: '#e8d6a8'},
    {label: 'Shark Bay seagrass clone', note: 'model maximum', value: 4500, text: 'up to ~4,500 yr', color: C.clone, appear: 0.1},
    {label: 'Honey fungus, Oregon', note: 'spread-rate models', range: [1900, 8650], text: '1,900–8,650 yr', color: C.fungus, appear: 0.25},
    {label: 'Pando, Utah', note: '2026 DNA model, disputed', range: [12000, 37000], text: '12,000–37,000 yr', color: C.pando, appear: 0.4},
  ], source: 'Edgeloe 2022; Ferguson 2003; Pineau 2026; Britannica'}),
  c5j: compare({title: 'Chromosomes per cell', unit: 'length', max: 45, rows: [
    {label: 'Relatives (diploid)', note: 'two sets', value: 20, text: '20', color: '#9fb4c0'},
    {label: 'Shark Bay clone (tetraploid)', note: 'four sets', value: 40, text: '40', color: C.clone, appear: 0.25},
  ], source: 'Edgeloe et al. 2022, Table 3'}),
  c5k: art('seagrass-diver', '', {x: 0.5, y: 0.4, zoom: 1.3}, {x: 0.5, y: 0.55, zoom: 1.15}, [src('Edgeloe 2022: favoured hypothesis, a cross between two Posidonia lineages')]),
  c5l: art('seagrass', '', {x: 0.6, y: 0.6, zoom: 1.4}, {x: 0.4, y: 0.45, zoom: 1.2}, [{type: 'character', name: 'Growing sideways', role: 'Edgeloe et al. 2022 (assumed rate)', line: '15–35 cm of new rhizome per year, shoot by shoot.', side: 'none', window: [0.3, 0.98]}]),
  c5m: sat({layers: SBL, origin: SB, camera: sbCam([0, 600, W0.x + 60, W0.y], [0.3, 650, W0.x + 60, W0.y], [0.6, 900, W0.x + 100, W0.y], [1, 2700, W0.x + 700, W0.y]), credit: EOX, dim: 0.1, shapes: [
    whaleImg(), whaleRing({labelVanish: 0.62}),
    pitch(P1.x, P1.y, {appear: 0.3, labelVanish: 0.9}),
    pandoRing(P2.x, P2.y, {appear: 0.62}),
  ]}),
  c5m2: sat({layers: SBL, origin: SB, camera: sbCam([0, 2700, W0.x + 700, W0.y], [0.3, 12000, W0.x + 3000, W0.y], [0.62, 52000, W0.x + 14000, W0.y - 3000], [1, 260000, 0, -15000]), credit: EOX, shapes: [
    whaleImg(), pitch(P1.x, P1.y, {label: undefined}), pandoRing(P2.x, P2.y, {labelVanish: 0.2}),
    fungusRing(P3.x, P3.y, {appear: 0.08, labelVanish: 0.55, sub: 'same area · shape simplified'}),
    clone(P4.x, P4.y, {appear: 0.4, labelVanish: 0.75}),
    {...RULER, draw: [0.72, 0.95], appear: 0.72},
  ]}),
  c5r: sat({layers: SBL, origin: SB, camera: sbCam([0, 250000, 0, -15000], [1, 260000, 0, -15000]), credit: EOX, shapes: pins(0, 0, false)}, [{type: 'recap', text: 'One seagrass clone spans at least 180 km.', next: 'So is it the biggest living thing on Earth?'}]),

  // ---------- 6 so which is the biggest? ----------
  c6: art('seagrass', '', {x: 0.5, y: 0.5, zoom: 1.15}, {x: 0.5, y: 0.5, zoom: 1.25}, [{type: 'chapter', n: 6, title: 'So Which Is the Biggest?', sub: 'it depends on the ruler', question: 'Which giant really wins?', image: 'seagrass'}]),
  c6b: map({projection: 'mercator', camera: mapCam([10, 55], 3.2, [20, 59], 4.2), cities: [{name: 'Stockholm', at: [18.07, 59.33]}, {name: 'Helsinki', at: [24.94, 60.17]}]}, [src('Pereyra et al. 2022/2023: one Fucus clone, 6 sites, > 600 km of coastline')], [{text: 'Baltic Sea', at: [19.5, 57.5]}, {text: 'SWEDEN', at: [15, 62]}, {text: 'FINLAND', at: [26, 63]}]),
  c6c: compare({title: 'How far one clone has spread', unit: 'length', max: 650, rows: [
    {label: 'Shark Bay seagrass', note: 'span · area ≈ 200 km²', value: 180, text: '≥ 180 km', color: C.clone},
    {label: 'Baltic seaweed (Fucus)', note: 'along the coast · area not measured', value: 600, text: '> 600 km', color: C.fucus, appear: 0.2},
  ], source: 'Edgeloe 2022; Pereyra et al. 2022 (bioRxiv) / 2023 (Mol. Ecol.)'}),
  c6c2: sat({layers: SBL, origin: SB, camera: sbCam([0, 190000, 0, -8000], [1, 175000, 0, -8000]), credit: EOX, shapes: pins(0, 0, true)}, [gloss('Genet', 'everything grown from one first seed', [0.35, 0.98])]),
  c6d: art('sb-nasa', '', {x: 0.5, y: 0.5, zoom: 1.15}, {x: 0.5, y: 0.5, zoom: 1.3}, [{type: 'list', title: 'It depends on the ruler', items: ['Tallest: Hyperion, 116.07 m', 'Heaviest animal: blue whale, ~190 t', 'Largest known area: Shark Bay clone, ~200 km²', 'Longest spread: Baltic seaweed, > 600 km'], source: 'see description for sources'}]),
  c6e: art('seagrass-diver', 'Seagrass meadow · Symbiosis / ocean.si.edu, CC BY 2.0', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.05}, [src('Edgeloe 2022 (citing Strydom 2020): ~1,310 km² of dense seagrass lost 2010–14')]),
  c6e2: art('seagrass', '', {x: 0.5, y: 0.5, zoom: 1.25}, {x: 0.45, y: 0.55, zoom: 1.1}, [src('Edgeloe 2022: some clone meadows recovered after the heatwave')]),
  c6f: sat({layers: SBL, origin: SB, camera: sbCam([0, 240000, 0, -15000], [1, 300000, 0, -15000]), credit: EOX, shapes: [...pins(0, 0, false), {...RULER, draw: undefined}]}),
  end: art('bw-pair', '', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.3}, [{type: 'endscreen', teaser: 'The blue whale vs every giant that ever lived'}]),
};
