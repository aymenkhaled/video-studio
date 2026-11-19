import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {CamKey, Choropleth, City, Ghost, MapSpec, MapTheme, RegionLabel} from '../../../../packages/engine/src/map/map';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import {CB, type ChartSpec} from '../../../../packages/engine/src/map/chart';
import {AT_RO_1914, AT_RU_1914, DE_RU_1914, LIMES} from '../../data/phantom';

// Money & Maps 003 "Borders That Vanished Still Decide Who's Rich" — visual design per scene id (timeline.json).
// Every number on screen = a row in sources.md (ids in comments). Signature device: a glowing "ghost border" drawn over
// today's map/data. Registers: regional money maps (admin-1 / US counties) · ghost lines · charts · real photos (PD/CC).

const GHOST = '#ffd166';
const EAST = '#c8553d';
export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Old border (approximate)', color: GHOST},
  ],
  chapters: {
    c1: 'Germany, 1990', c2: 'Poland, 1918', c3: 'The Habsburg Line', c4: "Rome's Frontier", c5: 'A Dinosaur-Age Coast', c6: 'The Answer',
  },
  highlight: {Germany: '#ffd166', East: '#ff8a6b', eastern: '#ff8a6b', Poland: '#ffd166', Prussia: '#7cc4ef', Prussian: '#7cc4ef', Russia: '#ff8a6b', Russian: '#ff8a6b', Habsburg: '#c9a7ff', Habsburgs: '#c9a7ff', Roman: '#ffd166', Limes: '#ffd166', 'Black Belt': '#ffd166', Alabama: '#ffd166'},
  now: 2026,
};

const MONEY: MapTheme = {sea: '#13212e', land: '#e8e1cf', coast: '#55606b', graticule: 'rgba(232,225,207,0.07)', text: '#1d2630'};
const cam = (a: [number, number], za: number, b: [number, number], zb: number): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb}];
const fly = (a: [number, number], za: number, b: [number, number], zb: number, hold = 0.15): CamKey[] => [
  {at: 0, center: a, zoom: za}, {at: hold, center: a, zoom: za * 1.02}, {at: 1 - hold, center: b, zoom: zb, fly: true}, {at: 1, center: b, zoom: zb * 1.03},
];

// ---------- cameras ----------
const DE = cam([10.3, 51.2], 7.0, [10.6, 51.1], 7.6);
const DE_IN = cam([10.6, 51.4], 7.6, [11.0, 51.6], 8.6);
const EUROPE = cam([14, 50], 3.0, [16, 49.5], 3.3);
const PL = cam([19.5, 52.2], 6.0, [19.8, 52.0], 6.6);
const HAB = cam([24.5, 48.0], 5.0, [25.0, 47.6], 5.5);
const LIM = cam([9.4, 49.6], 11.0, [9.8, 49.5], 12.5);
const AL = cam([-86.9, 32.6], 11.0, [-86.9, 32.5], 12.0);
const AL_WIDE = cam([-86.5, 33.0], 6.5, [-86.8, 32.7], 8.0);

// ---------- labels ----------
const L = (text: string, at: [number, number], size = 22): RegionLabel => ({text, at, size});
const MOD_DE = [L('GERMANY', [10.4, 52.9], 26), L('POLAND', [19.0, 52.3]), L('FRANCE', [4.2, 48.6]), L('CZECHIA', [15.4, 49.8]), L('AUSTRIA', [14.3, 47.6]), L('DENMARK', [9.6, 55.9], 20), L('NETH.', [5.6, 52.3], 20)];
const MOD_PL = [L('POLAND', [19.4, 51.0], 26), L('GERMANY', [11.0, 51.5]), L('LITHUANIA', [24.0, 55.4], 20), L('BELARUS', [27.5, 53.2]), L('UKRAINE', [27.0, 49.6]), L('CZECHIA', [15.4, 49.8], 20), L('SLOVAKIA', [19.5, 48.7], 20)];
const MOD_HAB = [L('POLAND', [19.5, 52.0]), L('UKRAINE', [30.0, 49.2], 26), L('ROMANIA', [25.0, 45.9], 26), L('HUNGARY', [19.3, 47.0]), L('MOLDOVA', [28.6, 47.2], 18), L('SERBIA', [20.8, 44.0], 20), L('SLOVAKIA', [19.5, 48.7], 18)];
const MOD_LIM = [L('GERMANY', [10.6, 50.8], 26), L('FRANCE', [6.6, 48.6]), L('Rhine', [7.55, 50.2], 18), L('Danube', [11.3, 48.62], 18), L('Main', [9.6, 50.0], 18)];
const MOD_US = [L('ALABAMA', [-86.6, 34.0], 26), L('MISSISSIPPI', [-89.6, 32.7]), L('GEORGIA', [-83.4, 32.7]), L('FLORIDA', [-85.0, 30.3], 20), L('Gulf of Mexico', [-87.6, 29.6], 20)];

// ---------- data layers ----------
const ADMIN1 = 'geo/admin1.json';
const GDP_LABELS = ['under €42,000', '€42,000 – 50,000', '€50,000 – 60,000', '€60,000 +'];
const GDP25: Record<string, number> = { // G2 (2025, current prices)
  'DE-BW': 59335, 'DE-BY': 62200, 'DE-BE': 59097, 'DE-BB': 40759, 'DE-HB': 60974, 'DE-HH': 90208, 'DE-HE': 60894, 'DE-MV': 40495,
  'DE-NI': 49907, 'DE-NW': 50470, 'DE-RP': 44915, 'DE-SL': 42765, 'DE-SN': 41693, 'DE-ST': 38452, 'DE-SH': 44344, 'DE-TH': 38591,
};
const GDP_MAP = (labels: boolean, appear: [number, number] = [0.02, 0.22]): Choropleth => ({
  file: ADMIN1, key: 'id', values: GDP25, breaks: [42000, 50000, 60000], colors: ['#f2c6a8', '#cfe0c3', '#86bfa6', '#2f8a7a'], appear,
  labels: labels ? [
    {id: 'DE-SL', text: '€42.8k', at: [6.95, 49.38]}, {id: 'DE-BB', text: '€40.8k', at: [13.2, 52.0]}, {id: 'DE-SN', text: '€41.7k', at: [13.3, 51.05]},
    {id: 'DE-TH', text: '€38.6k', at: [11.0, 50.85]}, {id: 'DE-ST', text: '€38.5k', at: [11.6, 52.1]}, {id: 'DE-MV', text: '€40.5k', at: [12.6, 53.75]},
    {id: 'DE-BY', text: '€62.2k', at: [11.5, 48.9]}, {id: 'DE-HE', text: '€60.9k', at: [9.0, 50.55]}, {id: 'DE-BW', text: '€59.3k', at: [9.0, 48.55]},
  ] : undefined,
  legend: {title: 'GDP per person, 2025', source: 'AK VGR der Länder 2026', labels: GDP_LABELS},
});
const INNER: Ghost = {id: 'inner', file: 'inner_german', draw: [0.3, 0.8], label: 'the old East–West border', labelAt: [9.2, 52.15]};
const INNER_ON: Ghost = {...INNER, draw: [0, 0.05]};
const PRU_RU: Ghost = {id: 'pru-ru', lines: [DE_RU_1914], draw: [0.15, 0.6], label: 'Prussia | Russia, 1914', labelAt: [17.3, 53.6]};
const AUT_RU: Ghost = {id: 'aut-ru', lines: [AT_RU_1914], draw: [0.35, 0.8], label: 'Austria | Russia', labelAt: [22.6, 49.75]};
const HABS: Ghost = {id: 'habs', lines: [AT_RU_1914, AT_RO_1914], draw: [0.1, 0.65], color: '#c9a7ff', label: 'old Habsburg edge, 1914', labelAt: [27.6, 46.6]};
const LIMES_G: Ghost = {id: 'limes', lines: [LIMES], draw: [0.1, 0.7], label: 'Roman Limes, about 160–260 CE', labelAt: [8.4, 48.75]};
const on = (g: Ghost): Ghost => ({...g, draw: [0, 0.05]});

// Alabama: the traditional 17 Black Belt counties (Encyclopedia of Alabama), US Census FIPS ids (us-atlas, public domain data)
const BB17 = ['01005', '01011', '01013', '01023', '01041', '01047', '01063', '01065', '01085', '01087', '01091', '01101', '01105', '01109', '01113', '01119', '01131'];
const BLACK_BELT = (labels: boolean): Choropleth => ({
  file: 'geo/us-counties.json', values: Object.fromEntries(BB17.map((f) => [f, 1])), breaks: [], colors: ['rgba(40,32,26,0.62)'], appear: [0.05, 0.3],
  labels: labels ? [ // B7 — ACS 2020–24 poverty rates
    {id: '01063', text: 'Greene 40%', at: [-87.95, 32.85]}, {id: '01011', text: 'Bullock 33%', at: [-85.72, 32.1]}, {id: '01047', text: 'Dallas 31%', at: [-87.11, 32.33]},
    {id: '01085', text: 'Lowndes 30%', at: [-86.65, 32.15]}, {id: '01131', text: 'Wilcox 28%', at: [-87.31, 31.99]},
  ] : undefined,
  legend: {title: labels ? 'Poverty rate, 2020–24' : 'Black Belt counties', source: labels ? 'US Census ACS via USAFacts' : 'Encyclopedia of Alabama (17 traditional)', labels: [labels ? 'Black Belt county' : 'traditional Black Belt']},
});
const AL_CITIES: City[] = [
  {name: 'Montgomery', at: [-86.3, 32.37], appear: 0.2, size: 1.3}, {name: 'Selma', at: [-87.02, 32.41], appear: 0.3, size: 1.2, align: 'left'},
  {name: 'Birmingham', at: [-86.8, 33.52], appear: 0.35, size: 1.2},
];

const M = (spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, labels: RegionLabel[]): MapSpec => ({theme: MONEY, relief: true, minText: 30, ...spec, modern: {labels}, avoidLabels: true});
const map = (year: number | undefined, labels: RegionLabel[], spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, overlays?: Overlay[]): SceneDef => ({kind: 'map', year, map: M(spec, labels), overlays});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], year?: number, extra: Record<string, unknown> = {}): SceneDef => ({kind: 'art', year, art: {id, title, from, to, ...extra}, overlays});
const chart = (c: ChartSpec, overlays?: Overlay[], year?: number): SceneDef => ({kind: 'chart', year, chart: c, overlays});
const chapter = (n: number, title: string, sub: string, labels: RegionLabel[], spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, image: string, question: string): SceneDef => ({kind: 'map', map: M(spec, labels), overlays: [{type: 'chapter', n, title, sub, image, question}]});
const recap = (text: string, labels: RegionLabel[], spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, next?: string): SceneDef => ({kind: 'map', map: M(spec, labels), overlays: [{type: 'recap', text, next}]});
const SRC_GDP = 'AK VGR der Länder, Ausgabe 2026 (2025, current prices)';

// ---------- the scenes ----------
export const SCENES: Record<string, SceneDef> = {
  // 0:00 promise: the thumbnail map (Germany's money map) in motion on frame 1, then the ghost line lands on the colour edge
  o1: map(2025, MOD_DE, {camera: DE, choropleth: GDP_MAP(false, [0, 0.08]), ghosts: [{...INNER, draw: [0.55, 0.95]}]}, [
    {type: 'glossary', term: 'GDP per person', meaning: 'everything a state produces in a year, divided by its people', window: [0.04, 0.5]},
  ]),
  o2: map(2025, MOD_DE, {camera: DE_IN, choropleth: GDP_MAP(true, [0, 0.02]), ghosts: [INNER_ON]}, [
    {type: 'citation', text: 'Five eastern states vs the poorest western state (Saarland) · AK VGR der Länder 2026', at: [0.1, 0.95]}, // G3
  ]),
  o3: art('europe-night', 'EUROPE at night — NASA Suomi NPP, 2012', {x: 0.45, y: 0.45, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.12}, undefined, 2012),
  o3b: map(undefined, MOD_PL, {camera: EUROPE, ghosts: [{...PRU_RU, draw: [0.02, 0.3], label: '1918'}, {...HABS, draw: [0.1, 0.4], label: undefined}, {...LIMES_G, draw: [0.25, 0.55], label: 'Rome'}]}, [
    {type: 'citation', text: 'Ghost lines: approximate tracings of the 1914 borders and the Roman Limes', at: [0.1, 0.95]},
  ]),
  o4: map(undefined, MOD_PL, {camera: EUROPE, ghosts: [{...INNER, draw: [0.0, 0.2], label: undefined}, on({...PRU_RU, label: undefined}), on({...HABS, label: undefined}), on({...LIMES_G, label: undefined})]}, [
    {type: 'title', title: 'PHANTOM BORDERS', sub: 'LINES THAT VANISHED — AND STILL SHOW UP IN THE MONEY'},
  ]),

  // ---------- chapter 1: Germany, 1990 ----------
  c1: chapter(1, 'Germany, 1990', 'erased 36 years ago', MOD_DE, {camera: DE, ghosts: [INNER_ON]}, 'ddr-border-tower', 'Did reunification erase the border?'),
  c1a: art('ddr-border-tower', 'East German guards on the inner German border, 1984 — US Army photo (public domain)', {x: 0.5, y: 0.45, zoom: 1.0}, {x: 0.5, y: 0.4, zoom: 1.12}, [
    {type: 'glossary', term: 'inner German border', meaning: 'the fortified line between East and West Germany, 1949–1990', window: [0.05, 0.5]},
  ], 1984),
  c1a2: art('wall-1989', 'A watchtower at the Berlin Wall, 28 December 1989 — Aad van der Drift (CC BY 2.0)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.52, y: 0.45, zoom: 1.12}, undefined, 1989),
  c1b: chart({
    type: 'bar', title: 'A full-time monthly wage, 1991', unit: 'average gross monthly pay, full-time, euros', source: 'Destatis, 2025', // G5
    howTo: 'longer bar = higher pay', num: {prefix: '€'},
    bars: [{label: 'West', value: 1987, color: CB.blue}, {label: 'East', value: 924, highlight: true, color: EAST, note: 'less than half'}],
  }, undefined, 1991),
  c1c: map(2024, MOD_DE, {camera: DE_IN, choropleth: GDP_MAP(false), ghosts: [INNER_ON], cities: [{name: 'Erfurt', at: [11.03, 50.98], appear: 0.15, size: 1.3, note: 'Thuringia: +163% since 1991 (real, per person)', dot: {color: GHOST, r: 1.2}}]}), // G8
  c1d: chart({
    type: 'bar', title: 'GDP per person, 2025', unit: 'euros, current prices; five eastern states vs the poorest western state', source: SRC_GDP, // G2, G3
    num: {prefix: '€'},
    bars: [
      {label: 'Saarland (poorest West)', value: 42765, color: CB.blue, highlight: true},
      {label: 'Saxony', value: 41693, color: EAST}, {label: 'Brandenburg', value: 40759, color: EAST}, {label: 'Mecklenburg-W. Pomerania', value: 40495, color: EAST},
      {label: 'Thuringia', value: 38591, color: EAST}, {label: 'Saxony-Anhalt', value: 38452, color: EAST},
    ],
  }, [{type: 'citation', text: 'East (five states) ≈ 72% of West per person, 2025 · IW / AK VGRdL', at: [0.45, 0.98]}], 2025), // G4
  c1e: chart({
    type: 'bar', title: 'A full-time monthly wage, 2024', unit: 'average gross monthly pay, full-time, euros', source: 'Destatis, 2025', // G5
    num: {prefix: '€'},
    bars: [{label: 'West (with Berlin)', value: 4810, color: CB.blue}, {label: 'East', value: 3973, highlight: true, color: EAST, note: 'West earns about 21% more'}],
  }, undefined, 2024),
  c1e2: chart({
    type: 'bar', title: 'Typical full-time pay, 2025', unit: 'median gross annual pay incl. bonuses, euros; East without Berlin', source: 'Destatis, April 2026', // G6
    num: {prefix: '€'},
    bars: [{label: 'West', value: 55435, color: CB.blue}, {label: 'East', value: 46013, highlight: true, color: EAST, note: '€9,422 less a year'}],
  }, undefined, 2025),
  c1f: map(2024, MOD_DE, {camera: DE, choropleth: GDP_MAP(false, [0, 0.02]), ghosts: [INNER_ON], cities: [
    {name: 'Munich', at: [11.58, 48.14], appear: 0.35, size: 1.2, dot: {color: CB.blue, r: 1.1}}, {name: 'Frankfurt', at: [8.68, 50.11], appear: 0.42, size: 1.2, dot: {color: CB.blue, r: 1.1}},
    {name: 'Stuttgart', at: [9.18, 48.78], appear: 0.49, size: 1.2, align: 'left', dot: {color: CB.blue, r: 1.1}}, {name: 'Düsseldorf', at: [6.78, 51.23], appear: 0.56, size: 1.2, align: 'left', dot: {color: CB.blue, r: 1.1}},
  ]}, [{type: 'citation', text: 'Big head offices stayed in the West after 1990 (ifo Dresden, via tagesschau 2024) · cities shown as examples', at: [0.3, 0.95]}]), // G9
  c1g: chart({
    type: 'share', title: "Germany's 500 largest companies: where they are based", unit: 'head office location, Die Welt top-500 ranking', source: 'manager magazin 2019 (Die Welt ranking)', // G10 HEDGE
    segments: [{label: 'five eastern states', value: 16, color: EAST}, {label: 'West + Berlin', value: 484, color: CB.blue}], total: '500 firms',
  }, [{type: 'citation', text: 'DAX (top 40): none based in the five eastern states · tagesschau.de 2024', at: [0.45, 0.98]}], 2019), // G9
  c1h: map(2024, MOD_DE, {camera: DE, ghosts: [INNER_ON], routes: [
    {id: 'mig', points: [[12.6, 51.6], [11.2, 51.2], [9.6, 50.6], [8.6, 50.2]], color: EAST, draw: [0.2, 0.75], width: 10},
  ], regions: [{text: '1.2 million net, east → west, 1991–2024', at: [10.4, 49.6], appear: 0.6, size: 26}]}, [
    {type: 'citation', text: 'Destatis, Sept 2025 (Berlin not included) · arrow schematic', at: [0.1, 0.95]}, // G11
  ]),
  c1i: chart({
    type: 'bar', title: 'Population change since 1990', unit: 'residents, 1990 → 2024', source: 'Destatis, Sept 2025', // G11
    num: {suffix: '%'},
    bars: [
      {label: 'Saxony-Anhalt', value: 26, color: EAST, highlight: true, valueText: '−26%'}, {label: 'Thuringia', value: 20, color: EAST, valueText: '−20%'},
      {label: 'Mecklenburg-W. Pomerania', value: 18, color: EAST, valueText: '−18%'}, {label: 'Western states (all)', value: 10, color: CB.blue, valueText: '+10%'},
    ],
  }, undefined, 2024),
  c1j: chart({
    type: 'line', title: 'Eastern output per worker, % of the West', unit: 'GDP per person employed, five eastern states', source: 'ifo Wettbewerbsreport Ostdeutschland 2026 (via press)', // G7 HEDGE
    howTo: 'line rising = the East catching up; 100 = equal', num: {suffix: '%'},
    x: [1991, 2025], y: [0, 100], series: [{name: 'East vs West', color: EAST, highlight: true, points: [[1991, 34.5], [2015, 78], [2025, 85]]}],
    events: [{x: 1991, label: 'about a third'}, {x: 2025, label: 'about 85%'}],
  }, undefined, 2025),
  c1r: recap('The border vanished in 1990. It still shows up in pay and output.', MOD_DE, {camera: DE, choropleth: GDP_MAP(false, [0, 0.02]), ghosts: [INNER_ON]}, 'A century back: Poland'),

  // ---------- chapter 2: Poland, 1918 ----------
  c2: chapter(2, 'Poland, 1918', 'three empires, one country', MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)]}, 'faden-1799', 'Is the old Prussian side still richer?'),
  c2a: art('faden-1799', 'Poland divided by its neighbours — William Faden, 1799 (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.15}, [
    {type: 'glossary', term: 'partitions of Poland', meaning: 'Russia, Prussia and Austria split Poland; it was gone from the map until 1918', window: [0.05, 0.6]},
  ], 1799),
  c2b: map(1914, MOD_PL, {camera: PL, ghosts: [PRU_RU, AUT_RU], regions: [{text: 'PRUSSIAN PART', at: [16.6, 52.6], appear: 0.25, size: 24}, {text: 'RUSSIAN PART', at: [21.4, 52.0], appear: 0.45, size: 24}, {text: 'AUSTRIAN PART', at: [21.6, 49.75], appear: 0.7, size: 22}]}, [
    {type: 'citation', text: 'Borders of 1914, approximate (our tracing of public-domain maps)', at: [0.1, 0.95]},
  ]),
  c2b2: art('flemming-1914', 'The Austrian–Russian borderland — Carl Flemming war map, 1914 (public domain)', {x: 0.45, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.2}, undefined, 1914),
  c2c: map(1918, MOD_PL, {camera: PL, ghosts: [{...PRU_RU, draw: [0, 0.05], fadeOut: [0.25, 0.6]}, {...AUT_RU, draw: [0, 0.05], fadeOut: [0.25, 0.6]}], regions: [{text: 'POLAND, 1918', at: [19.4, 52.4], appear: 0.4, size: 30}]}),
  c2d: map(2015, MOD_PL, {camera: cam([18.3, 52.0], 8.5, [18.4, 51.8], 9.5), ghosts: [on(PRU_RU)], regions: [{text: 'compare villages on both sides', at: [18.2, 52.9], appear: 0.3, size: 24}]}, [
    {type: 'citation', text: 'Grosfeld & Zhuravskaya, Journal of Comparative Economics, 2015', at: [0.1, 0.95]}, // P1
  ]),
  c2d2: map(2015, MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)]}, [
    {type: 'list', title: 'Faded since 1918', items: ['income', 'education', 'corruption', 'trust in government'], source: 'Grosfeld & Zhuravskaya, J. Comparative Economics, 2015'}, // P2
  ]),
  c2e: map(2015, MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)]}, [
    {type: 'list', title: 'Still there', items: ['denser railways on the old Prussian side', 'more industry per person there', 'different votes (anti- vs post-communist)'], source: 'Grosfeld & Zhuravskaya 2015; working paper 2023'}, // P3
  ]),
  c2e2: map(2015, MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)], regions: [{text: 'old Russian side: less church-going', at: [21.6, 51.6], appear: 0.25, size: 26}]}), // P4
  c2f: map(2023, MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)], regions: [{text: 'the viral claim: "elections follow the 1914 border"', at: [19.4, 54.6], appear: 0.15, size: 24}]}),
  c2f2: map(2023, MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)]}, [
    {type: 'quote', text: 'Much of the famous east–west voting split is a smooth slope across Poland, not a jump at the old border.', by: 'paraphrasing Grosfeld & Zhuravskaya, 2023'}, // P5
  ]),
  c2r: recap('Money crossed the dead border. Railways and habits crossed much more slowly.', MOD_PL, {camera: PL, ghosts: [on(PRU_RU), on(AUT_RU)]}, 'Another empire, another line'),

  // ---------- chapter 3: the Habsburg line ----------
  c3: chapter(3, 'The Habsburg Line', 'Austria-Hungary, gone since 1918', MOD_HAB, {camera: HAB, ghosts: [on(HABS)]}, 'andree-habsburg', 'Can an empire leave behind trust?'),
  c3a: map(1914, MOD_HAB, {camera: HAB, ghosts: [HABS], regions: [{text: 'former HABSBURG side', at: [23.6, 47.0], appear: 0.5, size: 22}, {text: 'never Habsburg', at: [27.0, 48.6], appear: 0.6, size: 22}]}),
  c3b: art('andree-habsburg', 'Austria-Hungary with its 1914 border in red — Richard Andree, Times Atlas (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.62, y: 0.45, zoom: 1.25}, undefined, 1914),
  c3c: map(2006, MOD_HAB, {camera: HAB, ghosts: [on(HABS)], regions: [{text: '200 km band on both sides', at: [24.3, 48.9], appear: 0.3, size: 22}]}, [
    {type: 'citation', text: 'Becker, Boeckh, Hainz & Woessmann, Economic Journal 2016 · EBRD Life in Transition Survey 2006', at: [0.1, 0.95]}, // H1, H2
  ]),
  c3c2: map(2006, MOD_HAB, {camera: cam([24.5, 48.0], 5.5, [24.8, 47.8], 6.0), ghosts: [on(HABS)], regions: [{text: 'survey 2006 — 88 years after 1918', at: [26.6, 49.6], appear: 0.3, size: 24}]}, [
    {type: 'citation', text: 'EBRD Life in Transition Survey, 2006', at: [0.1, 0.95]}, // H1
  ]),
  c3d: chart({
    type: 'bar', title: 'On the old Habsburg side…', unit: 'difference vs the other side, percentage points (same country, within 200 km)', source: 'Becker et al., IZA DP 5584 (marginal effects)', // H3 HEDGE
    howTo: 'longer bar = bigger difference', num: {suffix: ' pts', decimals: 1},
    bars: [
      {label: 'more likely to "never" bribe the road police', value: 7.3, color: '#c9a7ff', highlight: true, valueText: '+7.3 pts'},
      {label: 'more likely to "never" bribe the courts', value: 5.9, color: '#c9a7ff', valueText: '+5.9 pts'},
      {label: 'less likely to completely distrust courts', value: 4.6, color: CB.grey, valueText: '−4.6 pts'},
    ],
  }, undefined, 2006),
  c3d2: map(2006, MOD_HAB, {camera: HAB, ghosts: [on(HABS)]}, [
    {type: 'quote', text: 'Firms on the Habsburg side of the former border within the same country have higher trust in the courts.', by: 'Becker, Boeckh, Hainz & Woessmann (IZA working paper)'}, // H2
  ]),
  c3e: map(2006, MOD_HAB, {camera: HAB, ghosts: [on(HABS), {id: 'fake', lines: [AT_RO_1914.map(([x, y]) => [x + 1.3, y - 0.2] as [number, number])], draw: [0.15, 0.5], color: CB.grey, width: 5, label: 'test border, 100 km away: no effect', labelAt: [28.2, 46.0], fadeOut: [0.8, 0.98]}]}), // H4
  c3r: recap('An empire died in 1918. Its trust in courts and police did not.', MOD_HAB, {camera: HAB, ghosts: [on(HABS)]}, 'Almost 2,000 years back'),

  // ---------- chapter 4: Rome's frontier ----------
  c4: chapter(4, "Rome's Frontier", 'the Limes, given up about 260 CE', MOD_LIM, {camera: LIM, ghosts: [on(LIMES_G)]}, 'limes-tower', 'Does Rome still light up Germany?'),
  c4a: map(undefined, MOD_LIM, {camera: LIM, ghosts: [LIMES_G], regions: [{text: 'ROMAN SIDE', at: [8.3, 49.6], appear: 0.55, size: 26}, {text: 'BEYOND ROME', at: [10.4, 50.1], appear: 0.65, size: 26}], cities: [{name: 'Mainz', at: [8.27, 50.0], appear: 0.4, size: 1.1, note: 'Roman Mogontiacum'}, {name: 'Regensburg', at: [12.1, 49.02], appear: 0.5, size: 1.1, note: 'Roman Castra Regina'}]}, [
    {type: 'citation', text: 'Limes line approximate (our tracing via fort sites) · about 550 km', at: [0.1, 0.95]}, // R1
  ]),
  c4a2: art('limes-tower', 'A modern reconstruction of a Limes watchtower, Mainhardt — Matthias Süßen (CC BY 3.0)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.42, zoom: 1.15}),
  c4b: art('europe-night', 'Germany at night — NASA Suomi NPP, 2012', {x: 0.36, y: 0.55, zoom: 2.2}, {x: 0.37, y: 0.58, zoom: 2.6}, undefined, 2012),
  c4b2: chart({
    type: 'bar', title: 'How much brighter is the old Roman side at night?', unit: 'night-time light, Roman vs non-Roman side near the Limes', source: 'Wahl, J. Economic Growth 2017 (discussion paper 2015)', // R2
    howTo: 'each bar = one way of measuring', num: {suffix: '%'},
    bars: [
      {label: 'strictest method', value: 5, color: GHOST, valueText: 'about +5%'},
      {label: 'standard models', value: 10, color: GHOST, valueText: 'about +10%'},
      {label: 'accounting for rivers', value: 20, color: GHOST, highlight: true, valueText: '+20% or more'},
    ],
  }, undefined, 2009),
  c4c: chart({
    type: 'bar', title: 'Cities near the Limes', unit: 'average city size, non-Roman side = 100', source: 'Wahl 2015, Table 7', // R3 HEDGE
    num: {}, bars: [{label: 'Beyond Rome', value: 100, color: CB.grey, valueText: '100'}, {label: 'Roman side', value: 150, color: GHOST, highlight: true, valueText: 'about 150', note: 'about half again as big'}],
  }),
  c4d: map(undefined, MOD_LIM, {camera: LIM, ghosts: [on(LIMES_G)], routes: [
    {id: 'rr1', points: [[8.27, 50.0], [8.68, 49.4], [9.0, 48.8], [9.4, 48.4]], color: '#8a6d3b', draw: [0.1, 0.5], width: 6}, // illustrative Roman roads (schematic)
    {id: 'rr2', points: [[7.6, 48.6], [8.4, 48.0], [9.6, 47.9], [10.9, 48.37]], color: '#8a6d3b', draw: [0.2, 0.6], width: 6},
  ]}, [{type: 'citation', text: 'Roads schematic, for illustration — Wahl: Roman roads persisted as today\'s road network', at: [0.1, 0.95]}]), // R4
  c4e: map(undefined, MOD_LIM, {camera: cam([8.0, 49.8], 9.0, [8.2, 49.8], 10.0), ghosts: [on(LIMES_G)], cities: [
    {name: 'Mainz', at: [8.27, 50.0], appear: 0.15, size: 1.3, note: 'Roman Mogontiacum', dot: {color: GHOST, r: 1.2}},
    {name: 'Trier', at: [6.64, 49.75], appear: 0.35, size: 1.3, align: 'left', note: 'Roman Augusta Treverorum', dot: {color: GHOST, r: 1.2}},
  ]}),
  c4r: recap('A road outlives the empire that built it.', MOD_LIM, {camera: LIM, ghosts: [on(LIMES_G)]}, 'Our last border is not human'),

  // ---------- chapter 5: the Cretaceous coastline ----------
  c5: chapter(5, 'A Dinosaur-Age Coast', 'Alabama’s Black Belt', MOD_US, {camera: AL_WIDE, choropleth: BLACK_BELT(false)}, 'blackbelt-space', 'How can an old coastline shape poverty?'),
  c5a: art('blackbelt-space', 'The Black Belt from space — NASA Earth Observatory, MODIS 2015–2018 (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.55, zoom: 1.12}, undefined, 2018), // B1
  c5b: art('cretaceous-1907', 'Where Cretaceous rocks reach the surface — Chamberlin & Salisbury, Geology, 1907 (public domain)', {x: 0.62, y: 0.6, zoom: 1.4}, {x: 0.66, y: 0.68, zoom: 1.9}, [
    {type: 'glossary', term: 'Cretaceous', meaning: 'the last age of the dinosaurs, 145 to 66 million years ago', window: [0.05, 0.55]}, // B3
  ]),
  c5b2: map(undefined, MOD_US, {camera: AL_WIDE, choropleth: BLACK_BELT(false), regions: [{text: 'chalk → dark, fertile soil', at: [-87.4, 31.6], appear: 0.3, size: 26}]}, [
    {type: 'citation', text: 'NASA Earth Observatory, "Black Belt Prairie", 2018', at: [0.1, 0.95]}, // B2
  ]),
  c5c: art('cotton-field', 'A cotton field in bloom, Alabama, 2016 — Alabama Extension (CC0)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.55, zoom: 1.12}, [
    {type: 'citation', text: 'By 1859 Alabama grew about 23% of all US cotton · Encyclopedia of Alabama', at: [0.3, 0.95]}, // B4
  ]),
  c5c2: art('cotton-family', 'Black cotton farmers in the US, about 1890s (public domain)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.12}, [
    {type: 'counter', label: 'ENSLAVED, SHARE OF ALABAMA (1860)', value: 45, suffix: '%', window: [0.4, 0.98], color: '#ffd166', context: 'US Census 1860', top: 260}, // B5
  ], 1860),
  c5d: map(1870, MOD_US, {camera: AL, choropleth: BLACK_BELT(false), cities: AL_CITIES}),
  c5d2: map(2023, MOD_US, {camera: AL, choropleth: BLACK_BELT(false), cities: AL_CITIES}, [
    {type: 'counter', label: 'BLACK BELT COUNTIES IN PERSISTENT POVERTY', value: 19, suffix: ' of 24', window: [0.3, 0.98], color: '#ffd166', context: 'Univ. of Alabama EPC, 2025', top: 260}, // B6
  ]),
  c5e: chart({
    type: 'bar', title: 'People in poverty, 2023', unit: 'average county poverty rate', source: 'University of Alabama Education Policy Center, 2025', // B6
    howTo: 'longer bar = more poverty', num: {suffix: '%'},
    bars: [{label: 'Black Belt (24 counties)', value: 24, color: GHOST, highlight: true, note: 'about 1 in 4'}, {label: 'Rest of Alabama (43)', value: 15, color: CB.grey, note: 'about 1 in 7'}],
  }, undefined, 2023),
  c5e2: chart({
    type: 'bar', title: 'Adults working or looking for work, 2023', unit: 'labour-force participation rate', source: 'University of Alabama Education Policy Center', // B10
    num: {suffix: '%'},
    bars: [{label: 'Black Belt', value: 52, color: GHOST, highlight: true}, {label: 'Alabama', value: 57, color: CB.grey}, {label: 'United States', value: 63, color: CB.blue}],
  }, undefined, 2023),
  c5e3: map(1965, MOD_US, {camera: cam([-86.7, 32.4], 14, [-86.6, 32.38], 15.5), choropleth: BLACK_BELT(false), cities: AL_CITIES, routes: [
    {id: 'march', points: [[-87.02, 32.41], [-86.75, 32.33], [-86.55, 32.3], [-86.3, 32.37]], color: GHOST, draw: [0.15, 0.85], width: 7, dashed: true},
  ]}, [{type: 'citation', text: 'Selma → Montgomery march, 1965 (route schematic)', at: [0.1, 0.95]}]),
  c5f: map(2024, MOD_US, {camera: AL, choropleth: BLACK_BELT(true), cities: AL_CITIES}),
  c5r: recap('An ancient coast made rich soil; slavery and its aftermath made the poverty.', MOD_US, {camera: AL_WIDE, choropleth: BLACK_BELT(false)}, 'So why do some borders fade?'),

  // ---------- chapter 6: the answer ----------
  c6: chapter(6, 'The Answer', 'why some ghost borders stay', MOD_PL, {camera: EUROPE, ghosts: [on(INNER), on(PRU_RU), on(HABS), on(LIMES_G)]}, 'europe-night', 'What makes a border refuse to die?'),
  c6a: map(undefined, MOD_PL, {camera: EUROPE, ghosts: [on({...INNER, label: undefined}), on({...PRU_RU, label: undefined}), on({...HABS, label: undefined}), on({...LIMES_G, label: undefined})]}, [
    {type: 'list', title: 'What stays', items: ['railways (Poland)', 'roads and towns (Rome)', 'trust in courts (Habsburg)', 'land and poverty (Alabama)'], source: 'sources.md: P3, R4, H2, B6'},
  ]),
  c6a2: art('europe-night', 'Europe at night — NASA Suomi NPP, 2012', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.48, y: 0.5, zoom: 1.2}, undefined, 2012),
  c6b: chart({
    type: 'line', title: 'What fades: the East German wage gap', unit: 'average gross monthly pay, full-time, East as % of West', source: 'Destatis, 2025 (our arithmetic)', // G5 CALC 924/1987=46.5 %, 3973/4810=82.6 %
    num: {suffix: '%'}, x: [1991, 2024], y: [0, 100], series: [{name: 'East as % of West', color: EAST, highlight: true, points: [[1991, 46.5], [2024, 82.6]]}],
    events: [{x: 1991, label: '46%'}, {x: 2024, label: '83%'}],
  }, undefined, 2024),
  c6c: map(2006, MOD_HAB, {camera: HAB, ghosts: [on(HABS), {id: 'fake2', lines: [AT_RO_1914.map(([x, y]) => [x + 1.3, y - 0.2] as [number, number])], draw: [0.1, 0.4], color: CB.grey, width: 5, label: 'fake border: nothing', labelAt: [28.2, 46.0]}]}),
  c6c2: map(undefined, MOD_PL, {camera: EUROPE, ghosts: [on({...INNER, label: undefined}), on({...PRU_RU, label: undefined}), on({...HABS, label: undefined}), on({...LIMES_G, label: undefined})]}),
  c6d: map(2025, MOD_DE, {camera: DE, choropleth: GDP_MAP(false, [0, 0.02]), ghosts: [{...INNER, draw: [0.1, 0.6]}]}),
  end: art('europe-night', '', {x: 0.45, y: 0.5, zoom: 1.0}, {x: 0.4, y: 0.5, zoom: 1.06}, [{type: 'endscreen', teaser: 'Which ghost border runs through your country?'}]),
};
