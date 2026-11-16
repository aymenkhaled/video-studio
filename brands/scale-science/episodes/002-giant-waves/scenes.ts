import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import type {CamKey, City, MapSpec, MapTheme, RegionLabel} from '../../../../packages/engine/src/map/map';
import type {ScaleCam} from '../../../../packages/engine/src/scale/units';
import type {ScaleSpec, ScaleSubject} from '../../../../packages/engine/src/scale/scale';
import type {CompareSpec} from '../../../../packages/engine/src/scale/compare';

// Scale & Science 002 "Every Giant Wave Ever Measured, Shown to Scale" — visual design per scene id (timeline.json).
// Realism rule (Aymen, 15 Nov 2026): real USGS/NASA photos of the actual places, real photo cut-outs of landmarks at
// exact height, animated water; drawn profiles only for buildings without a clean free photo (ESB, Burj Khalifa).
// Every number on screen has a row in sources.md. Run-up = highest point water reached on land.

export const C = {water: '#7fc4d8', tracy: '#f2c14e', lituya: '#ef6a5e', taan: '#9fe0f0', dickson: '#b9a6f0', spirit: '#8fd19e', esb: '#c9c2b0', burj: '#bcd0dc'};

export const CLARITY: ClarityConfig = {
  factions: [],
  chapters: {c1: 'The Empty Morning', c2: 'Not a Normal Tsunami', c3: 'The Ladder of Giants', c4: 'The Record', c5: 'Why There Will Be More', c6: 'Every Giant Wave, to Scale'},
  highlight: {Tracy: '#f2c14e', Lituya: '#ef6a5e', Taan: '#9fe0f0', Greenland: '#b9a6f0', Dickson: '#b9a6f0', Spirit: '#8fd19e'},
  now: 2026,
};

// ---------- building blocks ----------
const gloss = (term: string, meaning: string, window: [number, number] = [0.1, 0.85]): Overlay => ({type: 'glossary', term, meaning, window});
const src = (text: string): Overlay => ({type: 'citation', text});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], marks?: {y: number; label: string; appear?: number; color?: string; line?: boolean}[], object = false): SceneDef => ({
  kind: 'art',
  art: {id, title, from, to, marks, object},
  overlays,
});
const cam = (x0: number, w0: number, x1 = x0, w1 = w0): ScaleCam[] => [{at: 0, x: x0, width: w0}, {at: 1, x: x1, width: w1}];
const stage = (spec: Omit<ScaleSpec, 'env'>, overlays?: Overlay[]): SceneDef => ({kind: 'scale', scale: {env: 'fjord', heightAxis: true, ground: 720, ...spec}, overlays});
const compare = (spec: CompareSpec, overlays?: Overlay[]): SceneDef => ({kind: 'compare', compare: spec, overlays});

// landmarks at true height (x = left edge in metres)
const liberty = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'liberty', shape: 'human', image: 'liberty-cut', size: 93, x, label: 'Statue of Liberty', sizeLabel: '93 m · 305 ft', ...extra});
const eiffel = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'eiffel', shape: 'human', image: 'eiffel-cut', size: 330, x, label: 'Eiffel Tower', sizeLabel: '330 m · 1,083 ft', ...extra});
const esb = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'esb', shape: 'esb', size: 443, x, color: C.esb, label: 'Empire State Building', sizeLabel: '443 m · 1,454 ft (tip)', bracket: false, ...extra});
const burj = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'burj', shape: 'burj', size: 828, x, color: C.burj, label: 'Burj Khalifa', sizeLabel: '828 m · 2,717 ft', bracket: false, ...extra});
const you = (x: number): ScaleSubject => ({id: 'you', shape: 'human', size: 1.75, x, color: '#ffd166', label: '', you: true});

const LV = {
  surf: {height: 26.21, label: 'Biggest wave surfed · 26 m', color: '#ffffff'},
  japan: {height: 40.5, label: 'Japan 2011 run-up · 40.5 m', color: '#d6e4ea'},
  taan: {height: 193, label: 'Taan Fiord 2015 · 193 m', color: C.taan},
  dickson: {height: 200, label: 'Greenland 2023 · ~200 m (modelled)', color: C.dickson},
  vajont: {height: 235, label: 'Vajont 1963 · ~235–270 m', color: '#f0a650'},
  spirit: {height: 265, label: 'Spirit Lake 1980 · ~265 m', color: C.spirit},
  tracy: {height: 481, label: 'Tracy Arm 2025 · 481 m', color: C.tracy},
  lituya: {height: 524, label: 'Lituya Bay 1958 · 524 m', color: C.lituya},
};

// maps
const MODERN_THEME: MapTheme = {sea: '#0e2836', land: '#53705e', coast: '#b9d3c6', graticule: 'rgba(255,255,255,0.05)', text: '#f4f1e6'};
const AK_LABELS: RegionLabel[] = [
  {text: 'ALASKA (USA)', at: [-146, 63.5]},
  {text: 'CANADA', at: [-127, 58.5]},
  {text: 'Gulf of Alaska', at: [-145, 57.5]},
];
const P = {
  juneau: {name: 'Juneau', at: [-134.42, 58.3], align: 'left'} as City,
  tracy: {name: 'Tracy Arm', at: [-133.2, 57.87]} as City,
  lituya: {name: 'Lituya Bay', at: [-137.55, 58.65]} as City,
  taan: {name: 'Taan Fiord', at: [-141.2, 60.1]} as City,
  barry: {name: 'Barry Arm', at: [-148.15, 61.13]} as City,
  whittier: {name: 'Whittier', at: [-148.68, 60.77]} as City,
};
const mapCam = (a: [number, number], za: number, b: [number, number], zb: number): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb}];
const map = (spec: Omit<MapSpec, 'theme' | 'modern' | 'avoidLabels'>, overlays?: Overlay[], labels = AK_LABELS): SceneDef => ({
  kind: 'map',
  map: {theme: MODERN_THEME, modern: {labels}, avoidLabels: true, minText: 30, ...spec},
  overlays,
});

export const SCENES: Record<string, SceneDef> = {
  // ---------- hook: the promise on frame 1 (real photo + the 481 m line + ESB for scale) ----------
  h1: art('ta-runup', 'Tracy Arm, Alaska, 3 days after the wave · USGS photo', {x: 0.5, y: 0.45, zoom: 1.0}, {x: 0.55, y: 0.4, zoom: 1.12}, [{type: 'character', name: 'Tracy Arm wave', role: '10 Aug 2025 · 05:26', line: 'Water climbed 481 m (1,578 ft) up the slope: higher than the Empire State Building (443 m).', side: 'none', window: [0.05, 0.97]}], [{y: 0.3, label: 'Bare slope = where the water reached (481 m)', appear: 0.12, line: false}]),
  h2: art('ta-wide', 'The slide and the fjord · USGS photo', {x: 0.55, y: 0.5, zoom: 1.35}, {x: 0.5, y: 0.45, zoom: 1.2}, [src('USGS · Shugar et al. 2026, Science')]),
  h3: stage({subjects: [esb(140), {...liberty(40), appear: 0.1}], water: {height: 481, window: [0.15, 0.7], label: 'Tracy Arm run-up · 481 m · 1,578 ft'}, camera: cam(300, 1700, 310, 1800)}),
  h4: compare({title: 'Coming up: every giant wave, to scale', unit: 'length', max: 560, rows: [
    {label: 'Taan Fiord 2015', value: 193, color: C.taan, appear: 0.05},
    {label: 'Greenland 2023', value: 200, color: C.dickson, appear: 0.12},
    {label: 'Spirit Lake 1980', value: 265, color: C.spirit, appear: 0.19},
    {label: 'Tracy Arm 2025', value: 481, color: C.tracy, appear: 0.26},
    {label: '???', note: 'the record', value: 524, color: '#555c63', text: '?', appear: 0.33},
  ]}),
  h5: map({projection: 'mercator', camera: mapCam([-140, 59.5], 3.2, [-133.8, 58.1], 11), cities: [{...P.juneau, appear: 0.3}, {...P.tracy, appear: 0.5}]}, [gloss('Fjord', 'long, narrow sea inlet between steep mountains', [0.45, 0.98])]),

  // ---------- 1 the empty morning ----------
  c1: art('ta-runup', '', {x: 0.4, y: 0.5, zoom: 1.15}, {x: 0.5, y: 0.45, zoom: 1.25}, [{type: 'chapter', n: 1, title: 'The Empty Morning', sub: 'Tracy Arm, Alaska · 10 August 2025', question: 'How did a mountain fall into the sea?', image: 'ta-runup'}]),
  c1b: art('ta-runup', 'South Sawyer Glacier at the head of the fjord · USGS photo', {x: 0.3, y: 0.45, zoom: 1.3}, {x: 0.4, y: 0.5, zoom: 1.1}),
  c1c: art('ta-sat', 'Tracy Arm from space, 19 Aug 2025 · NASA Earth Observatory (Landsat)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.4, zoom: 1.3}, [src('UAF Geophysical Institute: glacier retreat 2–5 Aug 2025')]),
  c1d: art('ta-scar', 'The slope that failed · USGS photo', {x: 0.5, y: 0.35, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.15}, [gloss('Seismometer', 'instrument that records ground shaking', [0.08, 0.6])]),
  c1d2: map({projection: 'mercator', camera: mapCam([-133.3, 57.9], 13, [-133.2, 57.88], 16), cities: [P.tracy]}, [{type: 'list', title: 'The mountain’s warnings', items: ['Days before: a tiny tremor about once an hour', 'Last 6 hours: every 30–60 seconds', 'Last 2 hours: one continuous vibration'], source: 'UAF Geophysical Institute'}]),
  c1e: art('ta-wide', 'About 64 million m³ of rock fell into Tracy Arm · USGS photo', {x: 0.45, y: 0.45, zoom: 1.4}, {x: 0.55, y: 0.5, zoom: 1.25}, [src('UAF Geophysical Institute (2026)')]),
  c1f: stage({subjects: [{...esb(520), appear: 0.05}, {id: 'cube', shape: 'block', size: 400, x: 20, color: '#8a8378', label: 'Fallen rock as one cube', sizeLabel: '~400 m on each side', bracket: false}], camera: cam(380, 1400)}),
  c1g: stage({subjects: [you(100), liberty(140)], water: {height: 100, window: [0.1, 0.55], label: 'First wave (model) · ~100 m · 240+ km/h'}, camera: cam(160, 420, 170, 460)}, [src('UAF GI: model of the first wave')]),
  c1g2: stage({subjects: [liberty(140)], water: {height: 100, from: 100, window: [0, 0.05], label: '~100 m ≈ a 30-storey building'}, camera: cam(170, 460, 200, 520)}),
  c1h: stage({subjects: [liberty(140), you(100)], water: {height: 100, from: 100, window: [0, 0.05], label: 'About as tall as the Statue of Liberty (93 m)'}, camera: cam(190, 380)}),
  c1i: stage({subjects: [liberty(40)], water: {height: 300, window: [0.1, 0.95]}, camera: cam(300, 1300)}, [gloss('Run-up', 'highest point the water reaches on land', [0.3, 0.98])]),
  c1j: art('ta-runup', 'Trimline: green forest above, bare rock below · USGS photo', {x: 0.55, y: 0.35, zoom: 1.35}, {x: 0.5, y: 0.4, zoom: 1.15}, undefined, [{y: 0.3, label: 'Trimline (approx.): water reached 481 m', appear: 0.2, line: false}]),
  c1k: stage({subjects: [liberty(40), eiffel(220), esb(560)], water: {height: 481, window: [0.25, 0.75], label: 'Tracy Arm run-up · 481 m · 1,578 ft'}, camera: cam(380, 1650, 400, 1750)}),
  c1l: art('ta-sawyer', 'Sawyer Island after the wave · USGS photo', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.55, y: 0.45, zoom: 1.2}, [src('USGS: ≥ 30 m at Sawyer Island · 36 cm on the Juneau tide gauge')]),
  c1m: art('ta-williams', 'Williams Cove after the wave · USGS photo', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.15}, [src('UAF GI: > 20 vessels a day in summer')]),
  c1n: map({projection: 'mercator', camera: mapCam([-133.6, 58.1], 9, [-133.4, 57.95], 12), cities: [P.juneau, P.tracy]}),
  c1r: art('ta-wide', '', {x: 0.5, y: 0.5, zoom: 1.3}, {x: 0.5, y: 0.5, zoom: 1.4}, [{type: 'recap', text: 'A melting glacier let a mountain fall into a fjord; the water climbed 481 m.', next: 'But why don’t ocean tsunamis get this tall?'}]),

  // ---------- 2 not a normal tsunami ----------
  c2: art('nazare', '', {x: 0.5, y: 0.5, zoom: 1.1}, {x: 0.5, y: 0.5, zoom: 1.2}, [{type: 'chapter', n: 2, title: 'Not a Normal Tsunami', sub: 'ocean waves vs fjord splashes', question: 'Why don’t ocean tsunamis get this tall?', image: 'nazare'}]),
  c2b: map({projection: 'globe', camera: mapCam([170, 25], 1.0, [150, 30], 1.15)}, [gloss('Tsunami', 'giant wave from a sudden shove of water', [0.1, 0.9])], [{text: 'Pacific Ocean', at: [-170, 20]}, {text: 'JAPAN', at: [138, 37]}]),
  c2c: art('nazare', 'Giant waves at Nazaré, Portugal · Luis Ascenso, CC BY 2.0', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.45, zoom: 1.25}, [src('Guinness World Records: 26.21 m, 2020')]),
  c2d: stage({subjects: [you(40), liberty(70)], water: {height: 40.5, window: [0.1, 0.5], label: 'Japan 2011 · highest run-up 40.5 m'}, levels: [LV.surf], camera: cam(90, 260, 100, 300)}, [src('2011 Tohoku Tsunami Joint Survey Group')]),
  c2d2: stage({subjects: [you(40), liberty(70)], water: {height: 40.5, from: 40.5, window: [0, 0.05], label: '40.5 m: less than half the statue'}, levels: [LV.surf], camera: cam(100, 300, 110, 330)}),
  c2e: map({projection: 'mercator', camera: mapCam([-133.5, 57.85], 12, [-133.25, 57.88], 17), cities: [P.tracy]}, [src('A fjord: deep, narrow, walled by mountains')]),
  c2e2: stage({subjects: [liberty(40), eiffel(220), esb(560)], water: {height: 481, window: [0.2, 0.8], label: 'Fjord splash: 481 m'}, levels: [LV.japan], camera: cam(380, 1650)}),
  c2f: compare({title: 'How high the water got', unit: 'length', max: 560, rows: [
    {label: 'Biggest wave surfed', note: 'wave face, Nazaré 2020', value: 26.21, color: '#ffffff'},
    {label: 'Japan 2011', note: 'highest run-up', value: 40.5, color: '#d6e4ea', appear: 0.15},
    {label: 'Tracy Arm 2025', note: 'fjord splash', value: 481, color: C.tracy, appear: 0.3},
  ], source: 'Guinness; Tohoku Joint Survey Group; Shugar et al. 2026'}),
  c2r: art('nazare', '', {x: 0.5, y: 0.5, zoom: 1.25}, {x: 0.5, y: 0.5, zoom: 1.3}, [{type: 'recap', text: 'The tallest waves are fjord splashes, not ocean tsunamis.', next: 'But is Tracy Arm the only giant?'}]),

  // ---------- 3 the ladder of giants ----------
  c3: stage({subjects: [eiffel(220), liberty(40)], water: {height: 193, window: [0.1, 0.8]}, camera: cam(250, 1100)}, [{type: 'chapter', n: 3, title: 'The Ladder of Giants', sub: 'Alaska · Greenland · Washington', question: 'Which wave is the tallest of all?'}]),
  c3b: map({projection: 'mercator', camera: mapCam([-137, 59.2], 6, [-141.1, 60.0], 10), cities: [{...P.taan, appear: 0.2}, P.tracy, P.juneau]}),
  c3c: art('taan-survey', 'Taan Fiord, scientists surveying the damage, 2016 · USGS photo', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.2}, [src('Higman et al. 2018, Scientific Reports')]),
  c3d: stage({subjects: [liberty(40), {...liberty(160), id: 'liberty2', label: '× 2', sizeLabel: '186 m'}], water: {height: 193, window: [0.1, 0.6], label: 'Taan Fiord 2015 · 193 m'}, camera: cam(170, 700)}),
  c3e: map({projection: 'globe', camera: mapCam([-40, 60], 1.3, [-28, 71], 2.2), cities: [{name: 'Dickson Fjord', at: [-27.2, 72.85], appear: 0.3}]}, undefined, [{text: 'GREENLAND', at: [-42, 74]}]),
  c3f: stage({subjects: [liberty(40), eiffel(240)], water: {height: 200, window: [0.05, 0.45], label: 'Greenland 2023 · ~200 m'}, levels: [LV.taan], camera: cam(260, 1050)}, [src('Svennevig et al. 2024, Science')]),
  c3g: map({projection: 'globe', camera: mapCam([-28, 60], 1.0, [10, 40], 1.0), cities: [{name: 'Dickson Fjord', at: [-27.2, 72.85]}]}, [src('Svennevig et al. 2024: a 9-day global seismic signal')], [{text: 'GREENLAND', at: [-42, 74]}]),
  c3h: art('spirit-1982', 'Spirit Lake below Mount St. Helens, 1982 · USGS photo (Lyn Topinka)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.2}, [src('USGS Cascades Volcano Observatory: ~265 m')]),
  c3h2: map({projection: 'mercator', camera: mapCam([11.5, 45.0], 7, [12.33, 46.27], 13), cities: [{name: 'Vajont dam', at: [12.33, 46.27], appear: 0.2}]}, [src('Genevois & Ghirotti 2005; run-up ~235–270 m, estimates vary')], [{text: 'ITALY', at: [12.0, 44.3]}, {text: 'AUSTRIA', at: [13.5, 47.4]}]),
  c3h3: stage({subjects: [liberty(40), eiffel(220)], water: {height: 235, window: [0.05, 0.5], label: 'Vajont 1963 · ~235–270 m (estimates vary)'}, levels: [LV.spirit], camera: cam(260, 1100)}, [src('Genevois & Ghirotti 2005: almost 2,000 deaths')]),
  c3i: stage({subjects: [liberty(40), eiffel(220)], water: {height: 265, window: [0.05, 0.4]}, levels: [LV.taan, LV.dickson, LV.vajont, LV.spirit], camera: cam(260, 1100)}),
  c3r: stage({subjects: [eiffel(220)], water: {height: 265, from: 265, window: [0, 0.05]}, camera: cam(260, 1100)}, [{type: 'recap', text: 'Taan Fiord, Greenland, Vajont and Spirit Lake all passed 190 m.', next: 'So which wave holds the record?'}]),

  // ---------- 4 the record ----------
  c4: art('lituya-overview', '', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.1}, [{type: 'chapter', n: 4, title: 'The Record', sub: 'Lituya Bay, Alaska · 9 July 1958', question: 'What is the tallest wave ever measured?', image: 'lituya-overview'}]),
  c4b: map({projection: 'mercator', camera: mapCam([-135, 58.5], 8, [-137.4, 58.62], 11), cities: [{...P.lituya, appear: 0.2}, P.tracy, P.juneau]}),
  c4c: art('lituya-rockslide', 'Where the rock fell, Lituya Bay, 1958 · USGS photo (D. J. Miller)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.15}, [src('Miller 1960, USGS Professional Paper 354-C')], undefined, true),
  c4d: art('lituya-overview', 'Lituya Bay after the wave, 1958 · USGS photo (D. J. Miller)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.6, y: 0.55, zoom: 1.12}, undefined, undefined, true),
  c4e: stage({subjects: [{id: 'boat', shape: 'boat', size: 12, x: 200, y: 20, color: '#8b5a3c', label: 'Fishing boat', sizeLabel: 'illustration', bracket: false, appear: 0.65}], water: {height: 20, window: [0.05, 0.6], label: 'At his boat (estimate) · 15–23 m'}, camera: cam(200, 200, 205, 230)}),
  c4e2: stage({subjects: [], water: {height: 30, from: 20, window: [0.05, 0.5], label: 'Mid-bay (estimate) · ~30 m'}, levels: [{height: 23, label: 'At his boat · 15–23 m', color: '#ffffff'}], camera: cam(205, 230, 210, 260)}, [src('Miller 1960: Ulrich’s eyewitness estimates')]),
  c4f: art('lituya-trim', 'Trimline: forest destroyed up to 524 m · USGS photo (D. J. Miller, 1958)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.1}, undefined, [{y: 0.2, label: 'Trimline (approx.): 524 m · 1,720 ft', appear: 0.35, color: C.lituya, line: false}], true),
  c4f2: art('lituya-damage', 'Uprooted and stripped trees · USGS photo (D. J. Miller, 1958)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.12}, undefined, undefined, true),
  c4g: stage({subjects: [liberty(40), eiffel(220), esb(560)], water: {height: 524, window: [0.1, 0.7], label: 'Lituya Bay 1958 · 524 m · 1,720 ft — the record'}, levels: [LV.tracy], camera: cam(400, 1750, 410, 1850)}),
  c4r: art('lituya-overview', '', {x: 0.5, y: 0.5, zoom: 1.1}, {x: 0.5, y: 0.5, zoom: 1.15}, [{type: 'recap', text: 'The record: Lituya Bay, 524 m. Tracy Arm is second.', next: 'Will there be more?'}], undefined, true),

  // ---------- 5 why there will be more ----------
  c5: art('ta-sat', '', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.5, y: 0.5, zoom: 1.15}, [{type: 'chapter', n: 5, title: 'Why There Will Be More', sub: 'shrinking glaciers, unstable slopes', question: 'Could the next one hit a cruise ship?', image: 'ta-sat'}]),
  c5b: art('ta-sat', 'Glaciers retreating in Alaska’s fjords · NASA Landsat', {x: 0.4, y: 0.4, zoom: 1.3}, {x: 0.55, y: 0.5, zoom: 1.05}),
  c5c: map({projection: 'mercator', camera: mapCam([-136.8, 58.75], 12, [-136.6, 58.85], 15), cities: [{name: 'Glacier Bay', at: [-136.4, 58.9]}, P.lituya]}, [src('Coe et al. 2018, Landslides: rock avalanches 1984–2016')]),
  c5c2: map({projection: 'globe', camera: mapCam([-35, 68], 1.8, [-28, 72], 2.4), cities: [{name: 'Dickson Fjord', at: [-27.2, 72.85]}]}, [src('GEUS / Svennevig et al. 2024')], [{text: 'GREENLAND', at: [-42, 74]}]),
  c5d: art('barry-arm', 'Barry Arm, Prince William Sound: the moving slope · Alaska DGGS photo (G. Wolken)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.45, zoom: 1.2}, [src('Alaska DGGS: slow movement, monitored')]),
  c5e: map({projection: 'mercator', camera: mapCam([-148.4, 61.0], 10, [-148.4, 60.95], 13), cities: [{...P.barry, appear: 0.1}, {...P.whittier, appear: 0.3}]}, [src('USGS Open-File Report 2021: worst-case model')]),
  c5f: map({projection: 'mercator', camera: mapCam([-141, 59.8], 4.2, [-142, 60.0], 4.6), cities: [P.tracy, P.lituya, P.taan, P.barry]}, [src('UAF GI: Alaska needs slope monitoring like its quake and volcano networks')]),
  c5r: art('ta-sat', '', {x: 0.5, y: 0.5, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.25}, [{type: 'recap', text: 'Shrinking glaciers mean more falling slopes, and more giant waves.', next: 'So how do they all compare?'}]),

  // ---------- 6 every giant wave, to scale ----------
  c6: stage({subjects: [liberty(40), eiffel(220), esb(560), burj(800)], water: {height: 193, window: [0.1, 0.9]}, camera: cam(560, 2900)}, [{type: 'chapter', n: 6, title: 'Every Giant Wave, to Scale', sub: 'run-ups, measured or reconstructed', question: 'How do they all compare?'}]),
  c6b: stage({subjects: [liberty(40), eiffel(220), esb(560)], water: {height: 265, from: 150, window: [0.05, 0.85]}, levels: [{...LV.taan, appear: 0.1}, {...LV.dickson, appear: 0.3}, {...LV.vajont, appear: 0.5}, {...LV.spirit, appear: 0.7}], camera: cam(380, 1500)}),
  c6c: stage({subjects: [liberty(40), eiffel(220), esb(560)], water: {height: 524, from: 265, window: [0.05, 0.8], label: 'The record · 524 m'}, levels: [LV.taan, LV.dickson, LV.vajont, LV.spirit, {...LV.tracy, appear: 0.2}, {...LV.lituya, appear: 0.6}], camera: cam(420, 1850)}),
  c6d: compare({title: 'Every giant wave, measured', unit: 'length', max: 560, rows: [
    {label: 'Lituya Bay 1958', note: 'run-up, the record', value: 524, text: '524 m · 1,720 ft', color: C.lituya},
    {label: 'Tracy Arm 2025', note: 'run-up', value: 481, color: C.tracy, appear: 0.1},
    {label: 'Spirit Lake 1980', note: 'run-up', value: 265, color: C.spirit, appear: 0.2},
    {label: 'Vajont 1963', note: 'run-up, estimates vary', range: [235, 270], color: '#f0a650', appear: 0.25},
    {label: 'Greenland 2023', note: 'run-up, modelled', value: 200, color: C.dickson, appear: 0.3},
    {label: 'Taan Fiord 2015', note: 'run-up', value: 193, color: C.taan, appear: 0.4},
  ], source: 'Miller 1960; Shugar 2026; USGS CVO; Genevois 2005; Svennevig 2024; Higman 2018'}),
  c6e: stage({subjects: [liberty(40), eiffel(220), esb(560), burj(820)], water: {height: 524, from: 524, window: [0, 0.05], label: 'Lituya Bay · 524 m'}, camera: cam(560, 2900, 580, 3000)}),
  c6e2: stage({subjects: [esb(560), burj(820)], water: {height: 524, from: 524, window: [0, 0.05]}, levels: [{height: 828, label: 'Burj Khalifa · 828 m: no wave has come close', color: C.burj}], camera: cam(760, 3000)}),
  c6f: art('ta-runup', 'Tracy Arm, August 2025 · USGS photo', {x: 0.5, y: 0.5, zoom: 1.15}, {x: 0.5, y: 0.45, zoom: 1.0}, undefined, [{y: 0.3, label: '481 m run-up', appear: 0.1, line: false}]),
  end: stage({subjects: [liberty(40), eiffel(220), esb(560)], water: {height: 524, from: 524, window: [0, 0.05]}, camera: cam(420, 1850, 440, 1900)}, [{type: 'endscreen', teaser: 'Is the biggest living thing a whale?'}]),
};
