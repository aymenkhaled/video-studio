import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {CamKey, Choropleth, City, MapSpec, MapTheme, Route} from '../../../../packages/engine/src/map/map';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import {CB, type ChartSpec} from '../../../../packages/engine/src/map/chart';
import {CANADA_BAND, MODERN_NA, MODERN_RU, RU, URALS} from '../../data/russia';

// Money & Maps 002 "Russia Built Cities Where No Economy Should Exist" — visual design per scene id (timeline.json).
// Every number on screen = a row in sources.md (ids in comments). Registers: night photo (NASA) · story map with relief ·
// data charts · real photos (Prokudin-Gorsky, Landsat). Fly-to camera between far-apart places (PLAYBOOK trick #12).

const RUS = '#d6402f'; // Russia accent (always with a label)
const ICE = '#7cc4ef';
export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Russia', color: RUS},
    {name: 'Canada', color: CB.orange, pattern: 'hatch'},
  ],
  chapters: {
    c1: 'Where People Live', c2: 'Why Build There?', c3: 'The Price of Cold', c4: 'Paid to Leave', c5: 'Cold Money', c6: 'The Answer',
  },
  highlight: {Russia: '#ff7a68', Russian: '#ff7a68', Russians: '#ff7a68', Norilsk: '#ff7a68', Yakutsk: '#ff7a68', Siberia: '#ff7a68', Canada: '#f2b84b', Canadians: '#f2b84b', 'World Bank': '#7cc4ef'},
  now: 2026,
};

const MONEY: MapTheme = {sea: '#13212e', land: '#e8e1cf', coast: '#55606b', graticule: 'rgba(232,225,207,0.07)', text: '#1d2630'};
const cam = (a: [number, number], za: number, b: [number, number], zb: number): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb}];
const fly = (a: [number, number], za: number, b: [number, number], zb: number, hold = 0.15): CamKey[] => [
  {at: 0, center: a, zoom: za}, {at: hold, center: a, zoom: za * 1.02}, {at: 1 - hold, center: b, zoom: zb, fly: true}, {at: 1, center: b, zoom: zb * 1.03},
];
const RUSSIA = cam([98, 60], 1.75, [100, 60.5], 1.95);
const RUSSIA_W = cam([70, 58], 2.6, [75, 58], 2.9);
const FAREAST = cam([145, 62], 3.4, [148, 61.5], 3.9);
const NORILSK = cam([88, 68.5], 6.5, [88.2, 69], 7.5);
const CANADA = cam([-95, 52], 2.5, [-92, 51], 2.8);

const ONLY_RU: Choropleth = {values: {'643': 1}, breaks: [], colors: ['rgba(214,64,47,0.18)'], highlight: ['643'], appear: [0.02, 0.2]};
const RU_CA: Choropleth = {values: {'643': 1, '124': 0}, breaks: [1], colors: ['rgba(230,159,0,0.22)', 'rgba(214,64,47,0.2)'], highlight: ['643', '124'], appear: [0.02, 0.2]};

const M = (spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, labels = MODERN_RU): MapSpec => ({theme: MONEY, relief: true, minText: 30, ...spec, modern: {labels}, avoidLabels: true});
const map = (year: number | undefined, spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, overlays?: Overlay[], labels = MODERN_RU): SceneDef => ({kind: 'map', year, map: M(spec, labels), overlays});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], year?: number): SceneDef => ({kind: 'art', year, art: {id, title, from, to}, overlays});
const chart = (c: ChartSpec, overlays?: Overlay[], year?: number): SceneDef => ({kind: 'chart', year, chart: c, overlays});
const chapter = (n: number, title: string, sub: string, spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, image: string, question: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'chapter', n, title, sub, image, question}]});
const recap = (text: string, spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, next?: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'recap', text, next}]});
const city = (name: string, at: [number, number], appear = 0.05, extra: Partial<City> = {}): City => ({name, at, appear, ...extra});
const cold = (t: number) => (t <= -30 ? '#2b5fa8' : t <= -20 ? '#4f8fd6' : t <= -12 ? '#8fc3ee' : '#d8ecfa'); // January mean, colder = deeper blue
const tcity = (name: string, at: [number, number], t: string, deg: number, appear = 0.1, extra: Partial<City> = {}): City =>
  city(name, at, appear, {note: `${t} in January`, dot: {color: cold(deg), r: 1.3}, ...extra});
const trans: Route = {id: 'transsib', points: [RU.moscow, RU.perm, RU.yekaterinburg, RU.tyumen, [73.37, 54.98], RU.novosibirsk, RU.krasnoyarsk, [104.3, 52.29], [113.5, 52.03], [127.5, 50.27], RU.khabarovsk, RU.vladivostok], color: RUS, draw: [0.1, 0.85], km: false, width: 7};
const URAL_LINE: Route = {id: 'urals', points: URALS, color: '#5b6b7a', draw: [0.05, 0.35], dashed: true, width: 5};
const SRC_CENSUS = 'Rosstat census 2021 (federal districts), our arithmetic';

// ---------- the scenes ----------
export const SCENES: Record<string, SceneDef> = {
  // 0:00 promise: the thumbnail image (Russia at night) in motion on frame 1
  o1: art('night-russia', 'Russia at night — NASA Black Marble, 2016', {x: 0.2, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.5, zoom: 1.08}, [
    {type: 'glossary', term: 'Black Marble', meaning: "NASA's satellite map of Earth's lights at night", window: [0.05, 0.5]},
  ], 2016),
  o2: map(2021, {camera: fly([60, 58], 2.2, RU.norilsk, 5.5, 0.1), choropleth: ONLY_RU, cities: [city('Norilsk', RU.norilsk, 0.55, {note: '69° north, no road or railway in', dot: {color: RUS, r: 1.4}}), city('Moscow', RU.moscow, 0.02)], regions: [{text: 'ARCTIC CIRCLE 66.6° N →', at: [70, 66.9], appear: 0.6, size: 24}]}, [
    {type: 'counter', label: 'NORILSK, PEOPLE (2021 CENSUS)', value: 174453, window: [0.35, 0.98], color: '#ff7a68', context: 'citypopulation.de / Rosstat', top: 260}, // D6
  ]),
  o3: art('lena-yakutsk', 'The Lena river near Yakutsk, from space — NASA MODIS, 2002', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.47, y: 0.5, zoom: 1.25}, [
    {type: 'counter', label: 'YAKUTSK, AVERAGE JANUARY DAY', value: -37, suffix: ' °C', window: [0.25, 0.98], color: ICE, context: '−36.9 °C, 1991–2020 normal', top: 260}, // Y2
  ]),
  o4: map(2004, {camera: RUSSIA, choropleth: ONLY_RU, cities: [
    tcity('Novosibirsk', RU.novosibirsk, '−17 °C', -17, 0.35), city('Krasnoyarsk', RU.krasnoyarsk, 0.4), tcity('Yakutsk', RU.yakutsk, '−37 °C', -37, 0.45),
    tcity('Norilsk', RU.norilsk, '−26 °C', -26, 0.5), city('Yekaterinburg', RU.yekaterinburg, 0.55), city('Moscow', RU.moscow, 0.05),
  ]}, [
    {type: 'citation', text: 'Fiona Hill, Current History (2004): "more large cities … in cold places than any other country"', at: [0.05, 0.95]}, // H9
  ]),
  o5: art('night-russia', '', {x: 0.55, y: 0.5, zoom: 1.08}, {x: 0.75, y: 0.5, zoom: 1.0}, [
    {type: 'list', title: 'Two questions…', items: ['Why build cities where no market would?', 'What does the cold cost, every winter?']},
  ]),
  o5b: map(2001, {camera: cam([100, 64], 2.0, [104, 64.5], 2.2), choropleth: ONLY_RU, cities: [city('Norilsk', RU.norilsk, 0.1, {dot: {color: ICE, r: 1.4}}), city('Vorkuta', RU.vorkuta, 0.2, {dot: {color: ICE, r: 1.4}, align: 'left'}), city('Susuman', RU.susuman, 0.3, {dot: {color: ICE, r: 1.4}})]}, [
    {type: 'list', title: '…and a third', items: ['The World Bank helped pay people to leave. Why did most stay?']}, // B1 B3
  ]),
  o6: art('okhotsk-ice', 'Sea ice, Sea of Okhotsk, January 2026 — NASA MODIS', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.2}, [{type: 'title', title: 'THE SIBERIAN CURSE', sub: 'WHY RUSSIA BUILT CITIES IN THE COLD'}]),

  // 1 — Where People Live
  c1: chapter(1, 'Where People Live', 'Russia vs Canada', {camera: RUSSIA, choropleth: ONLY_RU}, 'night-west', 'Where do Russians actually live?'),
  c1a: {kind: 'map', year: 2025, map: M({projection: 'globe', camera: cam([60, 30], 1.1, [95, 55], 1.45), choropleth: ONLY_RU}), overlays: [
    {type: 'counter', label: 'RUSSIA, AREA', value: 17, suffix: ' million km²', window: [0.05, 0.5], color: '#ff7a68', context: 'about 11% of the world’s land', top: 260}, // R1, R5
    {type: 'counter', label: 'PEOPLE (WORLD BANK, 2025)', value: 143513328, window: [0.5, 0.98], color: '#ff7a68', context: 'World Bank WDI', top: 260}, // R2
  ]},
  c1b: map(2021, {camera: RUSSIA, choropleth: ONLY_RU, routes: [URAL_LINE], regions: [
    {text: 'URAL MOUNTAINS', at: [58.5, 63.6], appear: 0.15, size: 22}, {text: 'SIBERIA', at: [92, 62], appear: 0.25, size: 40}, {text: 'FAR EAST', at: [140, 62.5], appear: 0.35, size: 36},
  ]}, [
    {type: 'glossary', term: 'Siberia', meaning: 'the huge Asian part of Russia', window: [0.05, 0.5]},
  ]),
  c1b2: chart({
    type: 'bar', title: 'Siberia + Far East: share of Russia', unit: '2021 census, Siberian + Far Eastern federal districts', source: SRC_CENSUS, // R3
    howTo: 'longer bar = bigger share', num: {suffix: '%', decimals: 1},
    bars: [{label: 'Share of the land', value: 66.1, color: CB.grey}, {label: 'Share of the people', value: 16.8, highlight: true, note: 'about 1 Russian in 6'}],
  }),
  c1c: map(2021, {camera: CANADA, choropleth: RU_CA, territories: [CANADA_BAND], cities: [city('Vancouver', RU.vancouver, 0.4, {align: 'left'}), city('Toronto', RU.toronto, 0.45), city('Montreal', RU.montreal, 0.5), city('Calgary', RU.calgary, 0.55, {align: 'left'})]}, [
    {type: 'citation', text: 'Statistics Canada: 66% live within 100 km of the US border (2021) · band approximate', at: [0.05, 0.95]}, // C1
  ], MODERN_NA),
  c1d: map(2002, {camera: cam([-105, 62], 2.4, [-110, 64], 2.6), choropleth: RU_CA, regions: [{text: 'YUKON · NORTHWEST TERRITORIES · NUNAVUT', at: [-110, 66], appear: 0.1, size: 26}]}, [
    {type: 'list', title: "Canada's three northern territories", items: ['Less than 1% of Canadians'], source: 'Hill & Gaddy (Brookings, 2003), 2002 census'}, // H10
  ], MODERN_NA),
  c1e: chart({
    type: 'bar', title: 'Novosibirsk, Siberia', unit: 'People living in the city', source: 'Tsarist census 1897 (via F. Hill, 2004) · Rosstat 2021', // C5
    howTo: 'longer bar = more people', num: {},
    bars: [{label: '1897', value: 8000, color: CB.grey}, {label: '2021', value: 1633595, highlight: true, note: '≈ 200 × as many'}],
  }, [{type: 'glossary', term: 'Census', meaning: 'an official count of everyone in a country', window: [0.05, 0.45]}]),
  c1f: {kind: 'map', year: 2020, map: M({projection: 'globe', camera: [
    {at: 0, center: [-97, 55], zoom: 1.5}, {at: 0.25, center: [-97, 58], zoom: 1.5}, {at: 0.75, center: [83, 60], zoom: 1.5}, {at: 1, center: [83, 57], zoom: 1.55},
  ], choropleth: RU_CA, cities: [tcity('Winnipeg', RU.winnipeg, '−16.3 °C', -16.3, 0.05), tcity('Novosibirsk', RU.novosibirsk, '−17.0 °C', -17, 0.6)]}), overlays: [
    {type: 'citation', text: 'January daily mean, 1991–2020 normals: Environment Canada · Pogoda.ru.net', at: [0.05, 0.95]}, // C3 C4
  ]},
  c1g: map(2021, {camera: RUSSIA, choropleth: ONLY_RU, cities: [
    tcity('Novosibirsk', RU.novosibirsk, '−17 °C', -17, 0.05), tcity('Norilsk', RU.norilsk, '−26 °C', -26, 0.15), tcity('Yakutsk', RU.yakutsk, '−37 °C', -37, 0.25),
    city('Krasnoyarsk', RU.krasnoyarsk, 0.35), city('Yekaterinburg', RU.yekaterinburg, 0.4), city('Magadan', RU.magadan, 0.45), city('Vladivostok', RU.vladivostok, 0.5),
  ]}, [{type: 'citation', text: 'January daily means: Pogoda.ru.net / NOAA normals (via Wikipedia)', at: [0.05, 0.95]}]),
  c1r: recap('Most Russians live in the west, yet Siberia is full of big cities.', {camera: RUSSIA, choropleth: ONLY_RU}, 'Why build them there?'),

  // 2 — Why Build There?
  c2: chapter(2, 'Why Build There?', '1891 – 1950s', {camera: RUSSIA, choropleth: ONLY_RU}, 'pg-bridge', 'Who decided where Siberia’s cities went?'),
  c2a: art('pg-bridge', 'Trans-Siberian Railway bridge over the Kama near Perm — S. M. Prokudin-Gorsky, about 1910 (Library of Congress)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.42, y: 0.5, zoom: 1.2}, [
    {type: 'glossary', term: 'Tsar', meaning: "Russia's emperor before 1917", window: [0.5, 0.98]},
  ], 1910),
  c2b: map(1916, {camera: cam([70, 55], 2.2, [110, 52], 2.2), choropleth: ONLY_RU, routes: [trans], cities: [city('Moscow', RU.moscow, 0.05), city('Novosibirsk', RU.novosibirsk, 0.4), city('Vladivostok', RU.vladivostok, 0.8)]}, [
    {type: 'counter', label: 'TRANS-SIBERIAN RAILWAY', value: 9289, suffix: ' km', window: [0.3, 0.98], color: '#ff7a68', context: 'Moscow → Vladivostok, built 1891–1916', top: 260}, // T1 T2
  ]),
  c2c: art('pg-tobolsk', 'Tobolsk, Siberia — S. M. Prokudin-Gorsky, 1912 (Library of Congress)', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.55, y: 0.45, zoom: 1.25}, [
    {type: 'character', name: 'Fiona Hill & Clifford Gaddy', role: 'Brookings Institution researchers', line: 'Authors of "The Siberian Curse" (2003)', side: 'Russia', window: [0.35, 0.98]}, // H1
    {type: 'glossary', term: 'Brookings', meaning: 'a research institute in Washington, DC', window: [0.05, 0.33]},
  ], 1912),
  c2d: map(2003, {camera: RUSSIA, choropleth: ONLY_RU, cities: [city('Novosibirsk', RU.novosibirsk, 0.1), city('Krasnoyarsk', RU.krasnoyarsk, 0.15), city('Yekaterinburg', RU.yekaterinburg, 0.2), city('Norilsk', RU.norilsk, 0.25)]}, [
    {type: 'quote', text: 'Communist planners put factories, machines, and people in the wrong places.', by: 'Hill & Gaddy, The Siberian Curse (2003)'}, // H1
  ]),
  c2e: art('pg-zlatoust', 'Zlatoust, an Ural factory town — S. M. Prokudin-Gorsky, 1910 (Library of Congress)', {x: 0.45, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.5, zoom: 1.2}, [
    {type: 'glossary', term: 'Planned economy', meaning: 'the state, not markets, decides what gets built', window: [0.1, 0.6]},
  ], 1910),
  c2f: map(1950, {camera: RUSSIA, choropleth: ONLY_RU, cities: [city('Norilsk', RU.norilsk, 0.1), city('Vorkuta', RU.vorkuta, 0.15, {align: 'left'}), city('Magadan', RU.magadan, 0.2)], regions: [{text: 'KOLYMA', at: [150, 64.5], appear: 0.25, size: 26}]}, [
    {type: 'glossary', term: 'Gulag', meaning: 'the Soviet system of forced-labour prison camps', window: [0.02, 0.45]},
    {type: 'counter', label: 'PASSED THROUGH THE GULAG', value: 20, suffix: ' million', window: [0.45, 0.98], color: '#ff7a68', context: 'some 18–20 million, 1930s–1950s (Hill & Gaddy)', top: 260}, // G1
  ]),
  c2g: map(1935, {camera: NORILSK, choropleth: ONLY_RU, cities: [city('Norilsk', RU.norilsk, 0.05, {note: 'founded 1935 by the Norillag camp'}), city('Dudinka (port)', RU.dudinka, 0.4, {align: 'left'})], rivers: [{name: 'Yenisey', label: 'Yenisei', at: [86.0, 68.2]}]}, [
    {type: 'citation', text: 'Norillag 1935–1956; peak in the tens of thousands (Krasnoyarsk Memorial / Sibir.Realii)', at: [0.05, 0.95]}, // G3 G4
  ]),
  c2h: map(1952, {camera: FAREAST, choropleth: ONLY_RU, cities: [city('Magadan', RU.magadan, 0.1, {note: 'port built by Dalstroy'}), city('Susuman', RU.susuman, 0.3)], regions: [{text: 'KOLYMA GOLDFIELDS', at: [149, 64.4], appear: 0.2, size: 28}, {text: 'SEA OF OKHOTSK', at: [148, 56.5], appear: 0.3, size: 26}]}, [
    {type: 'counter', label: 'DALSTROY PRISONERS, 1 JAN 1952', value: 199726, window: [0.4, 0.98], color: '#ff7a68', context: 'nearly 200,000 (Dalstroy records, via Wikipedia)', top: 260}, // G5
  ]),
  c2i: chart({
    type: 'share', title: 'The camp economy at its peak (late 1940s – early 1950s)', unit: 'Estimated share of Russian industrial output', source: 'Hill & Gaddy, Brookings (2003): an estimated 15–18%', // G2
    segments: [{label: 'Camps: 15–18%', value: 16.5, color: RUS}, {label: 'Everything else', value: 83.5, color: CB.grey}],
  }),
  c2j: art('pg-workers', 'Factory workers in Zlatoust, about 1910 — S. M. Prokudin-Gorsky (Library of Congress)', {x: 0.5, y: 0.4, zoom: 1.0}, {x: 0.5, y: 0.35, zoom: 1.2}, [
    {type: 'citation', text: 'Norillag closed 1956 · Dalstroy dissolved 1957', at: [0.05, 0.95]}, // S1
  ], 1953),
  c2r: recap('A railway, a plan and prison labour put big cities in the coldest places.', {camera: RUSSIA, choropleth: ONLY_RU}, 'But what does keeping them alive cost?'),

  // 3 — The Price of Cold
  c3: chapter(3, 'The Price of Cold', 'Heat, wages, shipping', {camera: RUSSIA, choropleth: ONLY_RU}, 'okhotsk-ice', 'What does the cold cost, every year?'),
  c3a: map(2002, {camera: RUSSIA, choropleth: ONLY_RU, cities: [
    city('Moscow', RU.moscow, 0.1), tcity('Novosibirsk', RU.novosibirsk, '−17 °C', -17, 0.2), tcity('Norilsk', RU.norilsk, '−26 °C', -26, 0.3), tcity('Yakutsk', RU.yakutsk, '−37 °C', -37, 0.4),
  ]}, [
    {type: 'glossary', term: 'Temperature per capita', meaning: 'the January cold felt by the average resident', window: [0.05, 0.98]}, // H2
  ]),
  c3b: {kind: 'map', year: 1990, map: M({projection: 'globe', camera: cam([30, 72], 1.35, [10, 74], 1.4), choropleth: RU_CA}), overlays: [
    {type: 'list', title: 'Temperature per capita (January)', items: ['Average Russian: about −11 to −12 °C', 'Average Canadian: about −9 to −10 °C'], source: 'Gaddy & Hill, Brookings Policy Brief 99 (2002), charts 1920–1990'}, // H4
  ]},
  c3c: map(1990, {camera: RUSSIA, choropleth: RU_CA}, [
    {type: 'list', title: '1926 → 1990', items: ['Russia: about 1 °C colder per person', 'Canada: warmer, by even more'], source: 'Gaddy & Hill (2002)'}, // H3
  ]),
  c3d: art('lena-delta', 'Lena river delta, Arctic Russia — Landsat 7, NASA / USGS', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.55, zoom: 1.3}, undefined, 2000),
  c3e: chart({
    type: 'bar', title: 'Cost of living', unit: 'Coldest large Siberian cities vs the Russian average', source: 'Hill & Gaddy, The Siberian Curse (2003): "as much as four times as high"', // H7
    howTo: 'longer bar = more expensive', num: {suffix: '×'},
    bars: [{label: 'Russian average', value: 1, color: CB.grey}, {label: 'Coldest big cities (up to)', value: 4, highlight: true}],
  }),
  c3f: chart({
    type: 'bar', title: 'Same job, different place', unit: 'Pay with the legal regional coefficient (base salary = 100)', source: 'Russian Labour Code art. 316 · coefficient table (ppt.ru, 2023)', // W1 S6
    howTo: 'longer bar = higher pay for the same work', num: {},
    bars: [{label: 'Base salary', value: 100, color: CB.grey}, {label: 'Magadan region', value: 170, color: CB.sky, note: '+70%'}, {label: 'Norilsk', value: 180, highlight: true, note: '+80%'}],
  }, [{type: 'glossary', term: 'Coefficient', meaning: 'a legal pay multiplier for each region', window: [0.4, 0.98]}]),
  c3g: map(2023, {camera: NORILSK, choropleth: ONLY_RU, cities: [city('Norilsk', RU.norilsk, 0.05)]}, [
    {type: 'list', title: 'Northern pay', items: ['Regional coefficient: up to 2× (Arctic islands)', 'Northern allowance for years worked: up to +100%', 'Together: pay can double, or more'], source: 'Labour Code arts. 316–317'}, // W1 W2
  ]),
  c3h: chart({
    type: 'share', title: 'The northern delivery, 2024', unit: 'Cargo shipped to remote northern areas before the freeze', source: 'TASS / Ministry for the Development of the Far East and Arctic, Dec 2024', // N1
    total: '3.4 million tonnes',
    segments: [{label: 'Fuel and energy: about 70%', value: 70, color: CB.orange}, {label: 'Food and other goods', value: 30, color: CB.grey}],
  }, [{type: 'glossary', term: 'Northern delivery', meaning: 'summer shipments of fuel and food northward', window: [0.05, 0.6]}]),
  c3i: art('okhotsk-ice', 'Winter sea ice off Russia’s Pacific coast, January 2026 — NASA MODIS', {x: 0.4, y: 0.5, zoom: 1.2}, {x: 0.55, y: 0.5, zoom: 1.0}, [
    {type: 'counter', label: 'WINTER FUEL FOR THE COLDEST REGIONS', value: 700, suffix: ' million $', window: [0.2, 0.98], color: ICE, context: 'at least, per year, early 2000s (F. Hill, 2004)', top: 260}, // N4
  ]),
  c3j: map(2021, {camera: cam([129.7, 62.0], 9, [129.75, 62.03], 11), choropleth: ONLY_RU, cities: [tcity('Yakutsk', RU.yakutsk, '−37 °C', -37, 0.05, {note: 'built on permafrost; houses on piles'})], rivers: [{name: 'Lena', label: 'Lena', at: [129.2, 61.6]}]}, [
    {type: 'glossary', term: 'Permafrost', meaning: 'ground that stays frozen all year', window: [0.15, 0.98]}, // Y3
  ]),
  c3r: recap('The cold costs Russia every year, in heat, wages and shipping.', {camera: RUSSIA, choropleth: ONLY_RU}, 'So why not just move people out?'),

  // 4 — Paid to Leave
  c4: chapter(4, 'Paid to Leave', '1991 – 2009', {camera: FAREAST, choropleth: ONLY_RU}, 'norilsk-sat', 'Why didn’t people take the money and go?'),
  c4a: art('night-west', 'Western Russia at night — NASA Black Marble, 2016', {x: 0.7, y: 0.45, zoom: 1.2}, {x: 0.45, y: 0.5, zoom: 1.0}, undefined, 1991),
  c4b: chart({
    type: 'bar', title: 'Magadan region', unit: 'People living there (today’s borders)', source: 'Rosstat censuses 1989 and 2021', // D1
    howTo: 'longer bar = more people', num: {},
    bars: [{label: '1989', value: 385340, color: CB.grey}, {label: '2021', value: 136085, highlight: true, note: '−65%'}],
  }),
  c4c: chart({
    type: 'bar', title: 'Chukotka', unit: 'People living there', source: 'Rosstat censuses 1989 and 2021', // D2
    howTo: 'longer bar = more people', num: {},
    bars: [{label: '1989', value: 157528, color: CB.grey}, {label: '2021', value: 47490, highlight: true, note: '−70%'}],
  }),
  c4d: map(2021, {camera: FAREAST, choropleth: ONLY_RU, regions: [{text: 'RUSSIAN FAR EAST', at: [140, 63.5], appear: 0.1, size: 36}], cities: [city('Magadan', RU.magadan, 0.2), city('Yakutsk', RU.yakutsk, 0.25), city('Khabarovsk', RU.khabarovsk, 0.3)]}, [
    {type: 'counter', label: 'FAR EAST, POPULATION 1989 → 2021', value: -23, suffix: '%', window: [0.35, 0.98], color: '#ff7a68', context: 'about a quarter gone (census, today’s borders)', top: 260}, // D4
  ]),
  c4e: map(2001, {camera: fly([37.6, 55.7], 2.6, [100, 64], 2.0), choropleth: ONLY_RU, cities: [city('Moscow', RU.moscow, 0.02)]}, [
    {type: 'glossary', term: 'World Bank', meaning: 'an international lender owned by governments', window: [0.02, 0.45]},
    {type: 'counter', label: 'WORLD BANK LOAN, 2001', value: 80, suffix: ' million $', window: [0.4, 0.98], color: ICE, context: 'Northern Restructuring Project', top: 260}, // B1
  ]),
  c4f: map(2002, {camera: cam([110, 64], 1.9, [112, 64.5], 2.05), choropleth: ONLY_RU, cities: [
    city('Vorkuta', RU.vorkuta, 0.15, {dot: {color: ICE, r: 1.4}, align: 'left'}), city('Norilsk', RU.norilsk, 0.3, {dot: {color: ICE, r: 1.4}}), city('Susuman', RU.susuman, 0.45, {dot: {color: ICE, r: 1.4}}),
  ]}, [{type: 'glossary', term: 'Pilot', meaning: 'a small test before a bigger programme', window: [0.5, 0.98]}]),
  c4g: chart({
    type: 'bar', title: 'Households that moved out, 2002–2009', unit: 'Norilsk + Vorkuta + Susuman', source: 'World Bank IEG review, Northern Restructuring Project', // B3
    howTo: 'longer bar = more families', num: {},
    bars: [{label: 'Planned', value: 10401, color: CB.grey}, {label: 'Actually left', value: 4527, highlight: true, note: '≈ 10,000 people'}],
  }, [{type: 'glossary', term: 'Household', meaning: 'the people living in one home', window: [0.05, 0.45]}]),
  c4h: chart({
    type: 'bar', title: 'Norilsk only', unit: 'Households that moved out, 2002–2009', source: 'World Bank IEG review', // B3 S7
    howTo: 'longer bar = more families', num: {},
    bars: [{label: 'Planned', value: 4599, color: CB.grey}, {label: 'Actually left', value: 623, highlight: true, note: '≈ 1 in 7'}],
  }),
  c4i: chart({
    type: 'share', title: 'The $80 million loan', unit: 'At closure, 2009', source: 'World Bank IEG: $45.31M (57%) cancelled; rated "moderately unsatisfactory"', // B4
    total: '$80 million',
    segments: [{label: 'Spent: $34.7M', value: 43, color: ICE}, {label: 'Never spent, cancelled: $45.3M', value: 57, color: CB.grey}],
  }),
  c4j: art('norilsk-sat', 'Norilsk from space — Landsat 8, August 2016 (NASA)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.52, y: 0.48, zoom: 1.35}, [
    {type: 'quote', text: 'relatively high living standards', by: 'World Bank evaluators on Norilsk (IEG review)'}, // B5
  ], 2016),
  c4k: map(2024, {camera: fly(RU.norilsk, 4.5, [75, 63], 3.2, 0.12), choropleth: ONLY_RU, regions: [{text: 'WEST SIBERIAN OIL & GAS', at: [74, 63.4], appear: 0.6, size: 30}]}),
  c4r: recap('People left the far north on their own, but paying them to leave mostly failed.', {camera: RUSSIA, choropleth: ONLY_RU}, 'Is the curse really a curse?'),

  // 5 — Cold Money (top moment ~ 65 % of runtime)
  c5: chapter(5, 'Cold Money', 'Metals, oil and gas', {camera: RUSSIA_W, choropleth: ONLY_RU}, 'norilsk-sat', 'What does Russia get from the cold?'),
  c5a: chart({
    type: 'share', title: "World palladium mined in 2024", unit: 'Share of world mine production (estimate)', source: 'USGS Mineral Commodity Summaries 2025 (75 of 190 tonnes)', // NO4
    segments: [{label: 'Russia: about 39%', value: 39, color: RUS}, {label: 'Rest of the world', value: 61, color: CB.grey}],
  }, [{type: 'glossary', term: 'Palladium', meaning: 'a rare metal used in car exhaust cleaners', window: [0.05, 0.6]}]), // S2
  c5b: map(2023, {camera: RUSSIA_W, choropleth: ONLY_RU, regions: [{text: 'WESTERN SIBERIA', at: [75, 60.5], appear: 0.05, size: 34}, {text: 'KHANTY-MANSI', at: [69, 61.6], appear: 0.5, size: 24}], cities: [city('Surgut', RU.surgut, 0.55)]}, [
    {type: 'counter', label: "RUSSIA'S CRUDE OIL FROM WESTERN SIBERIA", value: 87, suffix: '%', window: [0.1, 0.5], color: '#ff7a68', context: '2023, Rystad Energy data (via Eurasia Review)', top: 260}, // X2
    {type: 'counter', label: 'KHANTY-MANSI REGION ALONE', value: 40, suffix: '%', window: [0.5, 0.98], color: '#ff7a68', context: 'about 40% (regional government)', top: 260}, // X3
  ]),
  c5c: map(2023, {camera: cam([72, 67.5], 4.5, [72.5, 68], 5.2), choropleth: ONLY_RU, regions: [{text: 'YAMAL PENINSULA', at: [70.5, 70.5], appear: 0.1, size: 30}, {text: 'KARA SEA', at: [69, 74], appear: 0.2, size: 26}]}, [
    {type: 'list', title: 'Yamal', items: ['Most of Russia’s natural gas'], source: 'Eurasia Review (2024)'}, // X4
  ]),
  c5d: chart({
    type: 'share', title: "Russia's federal budget, 2024", unit: 'Share of revenue from oil and gas', source: 'Russian Finance Ministry via The Moscow Times; Deputy PM Novak', // X5
    total: '11.13 trillion rubles from oil and gas',
    segments: [{label: 'Oil and gas: about 30%', value: 30, color: CB.orange}, {label: 'Everything else', value: 70, color: CB.grey}],
  }, [{type: 'glossary', term: 'Ruble', meaning: "Russia's currency", window: [0.05, 0.45]}, {type: 'glossary', term: 'Federal budget', meaning: "the national government's money for a year", window: [0.5, 0.98]}]),
  c5e: chart({
    type: 'bar', title: 'Some cold cities are growing', unit: 'People, censuses 2002 and 2021', source: 'Rosstat via citypopulation.de', // X7 Y5
    howTo: 'longer bar = more people', num: {},
    bars: [{label: 'Surgut 2002', value: 285027, color: CB.grey}, {label: 'Surgut 2021', value: 396443, highlight: true}, {label: 'Yakutsk 2002', value: 229951, color: CB.grey}, {label: 'Yakutsk 2021', value: 355443, highlight: true, note: '+55%'}],
  }),
  c5e2: map(2021, {camera: RUSSIA_W, choropleth: ONLY_RU, cities: [city('Surgut', RU.surgut, 0.1, {note: 'oil city: 285,027 → 396,443 (2002 → 2021)', dot: {color: CB.orange, r: 1.4}}), city('Tyumen', RU.tyumen, 0.3)], regions: [{text: 'KHANTY-MANSI', at: [69, 61.6], appear: 0.2, size: 24}]}, [
    {type: 'citation', text: 'Rosstat censuses via citypopulation.de', at: [0.05, 0.95]}, // X7
  ]),
  c5f: art('lena-yakutsk', 'The Lena near Yakutsk — NASA MODIS', {x: 0.45, y: 0.5, zoom: 1.3}, {x: 0.5, y: 0.5, zoom: 1.05}, [
    {type: 'counter', label: 'YAKUTSK, 2002 → 2021', value: 55, suffix: '%', window: [0.2, 0.98], color: '#ff7a68', context: 'growth (census), at −37 °C in January', top: 260}, // Y5
  ]),
  c5g: {kind: 'map', year: 2024, map: M({projection: 'globe', camera: cam([-20, 70], 1.3, [10, 72], 1.35), choropleth: RU_CA}), overlays: [
    {type: 'list', title: 'Critics of the "curse"', items: ['January cold is only one way to measure cost', "Canada's people also hug the warm south"], source: 'Pereltsvaig (Languages of the World); Project MUSE (2024)'}, // H12
  ]},
  c5h: map(2003, {camera: RUSSIA, choropleth: ONLY_RU, routes: [{id: 'west', points: [[110, 60], [80, 58], [50, 56]], color: ICE, draw: [0.4, 0.85], width: 9}]}, [
    {type: 'quote', text: 'Russia needs to "shrink" … not its territory, but its economic geography.', by: 'Hill & Gaddy (2003)'}, // H11
  ]),
  c5r: recap('The cold north costs Russia a fortune, and also earns much of it.', {camera: RUSSIA, choropleth: ONLY_RU}, 'So what is the real answer?'),

  // 6 — The Answer + callback to frame 1
  c6: chapter(6, 'The Answer', 'Land, people, money', {camera: RUSSIA, choropleth: ONLY_RU}, 'night-russia', 'So why is Russia so big, but so empty?'),
  c6a: map(2021, {camera: RUSSIA, choropleth: ONLY_RU, regions: [{text: 'THE LAND: MOSTLY EAST', at: [115, 66], appear: 0.15, size: 30}, {text: 'THE PEOPLE: MOSTLY WEST', at: [45, 53], appear: 0.35, size: 28}, {text: 'THE MONEY: OIL & GAS', at: [76, 61], appear: 0.55, size: 28}]}),
  c6b: map(2021, {camera: fly(RU.winnipeg, 2.4, [80, 58], 2.0, 0.1), choropleth: RU_CA, territories: [CANADA_BAND]}, [
    {type: 'list', title: 'Hill & Gaddy', items: ['Planners: people pushed into the cold', 'Markets: people stay near the warm edge'], source: 'The Siberian Curse (2003) · Statistics Canada'},
  ], MODERN_NA.concat(MODERN_RU)),
  c6c: map(2024, {camera: RUSSIA, choropleth: ONLY_RU}, [
    {type: 'list', title: 'Russia pays twice', items: ['1. To keep people warm in the cold', '2. To pull its riches out of it']},
  ]),
  c6d: art('night-russia', 'Russia at night — NASA Black Marble, 2016', {x: 0.8, y: 0.5, zoom: 1.12}, {x: 0.45, y: 0.5, zoom: 1.0}, undefined, 2016),
  end: art('night-russia', '', {x: 0.45, y: 0.5, zoom: 1.0}, {x: 0.3, y: 0.5, zoom: 1.06}, [{type: 'endscreen', teaser: 'Borders that vanished 100 years ago still decide who is rich'}]),
};
