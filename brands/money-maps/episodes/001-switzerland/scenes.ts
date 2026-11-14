import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {CamKey, Choropleth, City, MapSpec, MapTheme, Route} from '../../../../packages/engine/src/map/map';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import {CB, type ChartSpec} from '../../../../packages/engine/src/map/chart';
import {GDP_BREAKS, GDP_COLORS, GDP_LINE, GDP_PC_2024, MODERN_EU, PLACES, WORLD_GDP_PC_2024} from '../../data/europe';

// Money & Maps 001 "Why Is Switzerland So Rich?" — visual design per scene id (see timeline.json).
// Clarity Standard: modern names + borders on every map, label avoidance, sourced numbers with year + currency,
// glossary pop-ups for every economics word, recap card per chapter. Charts carry their own source line.

const SWISS = CB.swiss;
export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Switzerland', color: SWISS},
    {name: 'Other countries', color: CB.blue, pattern: 'hatch'},
  ],
  chapters: {
    c1: 'A Country With Nothing', c2: 'The Hungry Years', c3: 'Small, Light, Valuable', c4: 'The Road Through the Alps',
    c5: 'Safe Money', c6: 'Medicine From Basel', c7: 'You, in Switzerland', c8: 'The Formula',
  },
  highlight: {Switzerland: '#ff7a68', Swiss: '#ff7a68', Geneva: '#ff7a68', Basel: '#ff7a68', Zurich: '#ff7a68', China: '#7cc4ef', Germany: '#7cc4ef'},
  now: 2026,
};

// Money & Maps look: light paper land on deep navy sea (different from the parchment History channel).
const MONEY: MapTheme = {sea: '#13212e', land: '#e8e1cf', coast: '#55606b', graticule: 'rgba(232,225,207,0.07)', text: '#1d2630'};

const cam = (a: [number, number], za: number, b: [number, number], zb: number): CamKey[] => [{at: 0, center: a, zoom: za}, {at: 1, center: b, zoom: zb}];
const EUROPE = cam([9, 49.5], 5.2, [8.6, 48.6], 6.2);
const EU_WIDE = cam([10, 50], 4.6, [9, 49], 5.4);
const CH = cam([8.2, 46.8], 22, [8.3, 46.75], 26);
const ALPS = cam([8.6, 46.6], 15, [8.4, 46.7], 18);

const M = (spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>): MapSpec => ({theme: MONEY, relief: true, minText: 30, ...spec, modern: {labels: MODERN_EU}, avoidLabels: true});
const map = (year: number | undefined, spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, overlays?: Overlay[]): SceneDef => ({kind: 'map', year, map: M(spec), overlays});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], object = false): SceneDef => ({kind: 'art', art: {id, title, from, to, object}, overlays});
const chart = (c: ChartSpec, overlays?: Overlay[]): SceneDef => ({kind: 'chart', chart: c, overlays});
const chapter = (n: number, title: string, sub: string, spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, image: string, question: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'chapter', n, title, sub, image, question}]});
const recap = (text: string, spec: Omit<MapSpec, 'modern' | 'avoidLabels' | 'theme'>, next?: string): SceneDef => ({kind: 'map', map: M(spec), overlays: [{type: 'recap', text, next}]});
const city = (name: string, at: [number, number], appear = 0.05, extra: Partial<City> = {}): City => ({name, at, appear, ...extra});
const route = (id: string, points: [number, number][], draw: [number, number], extra: Partial<Route> = {}): Route => ({id, points, color: SWISS, draw, ...extra});
const P = PLACES;

// ---------- choropleths ----------
const k = (v: number) => `$${Math.round(v / 100) / 10}k`;
const GDP: Choropleth = {
  values: GDP_PC_2024,
  breaks: GDP_BREAKS,
  colors: GDP_COLORS,
  appear: [0.05, 0.3],
  highlight: ['756'],
  labels: [
    {id: '756', text: k(GDP_PC_2024['756']), at: [8.2, 46.75]},
    {id: '276', text: k(GDP_PC_2024['276']), at: [10.3, 51.6]},
    {id: '250', text: k(GDP_PC_2024['250']), at: [2.4, 47.2]},
    {id: '380', text: k(GDP_PC_2024['380']), at: [12.8, 43.3]},
    {id: '040', text: k(GDP_PC_2024['040']), at: [14.6, 47.4]},
    {id: '442', text: k(GDP_PC_2024['442']), at: [6.1, 49.75]},
    {id: '616', text: k(GDP_PC_2024['616']), at: [19.3, 52.2]},
  ],
  legend: {title: 'GDP per person, 2024 US$', source: 'World Bank, 2024', fmt: {prefix: '$', compact: true}},
};
const SWISS_ONLY: Choropleth = {values: {'756': 1}, breaks: [], colors: [SWISS], highlight: ['756'], appear: [0.25, 0.5]};
const SWISS_NL: Choropleth = {values: {'756': 1, '528': 0}, breaks: [1], colors: [CB.sky, SWISS], highlight: ['756', '528'], appear: [0.05, 0.3], labels: [
  {id: '756', text: '41,285 km²', at: [8.2, 46.75]},
  {id: '528', text: '≈ 41,500 km²', at: [5.5, 52.3]},
]};
const EU27 = ['040', '056', '100', '191', '196', '203', '208', '233', '246', '250', '276', '300', '348', '372', '380', '428', '440', '442', '470', '528', '616', '620', '642', '703', '705', '724', '752'];
const EU_MEMBERS: Choropleth = {
  values: Object.fromEntries([...EU27.map((id) => [id, 1]), ['756', 0]]),
  breaks: [1],
  colors: [SWISS, CB.blue],
  appear: [0.05, 0.35],
  highlight: ['756'],
  labels: [{id: '756', text: 'not in the EU', at: [8.2, 46.75]}],
  legend: {title: 'European Union, 2026', source: 'EU / Swiss government', labels: ['Switzerland', 'EU member']},
};

// ---------- charts ----------
const GDP_BARS: ChartSpec = {
  type: 'bar', title: 'What each person produces, on average', unit: 'GDP per person, 2024, current US$', source: 'World Bank, 2024',
  howTo: 'longer bar = more per person', num: {prefix: '$'},
  bars: [
    {label: 'World average', value: WORLD_GDP_PC_2024, color: CB.grey},
    {label: 'Germany', value: GDP_PC_2024['276'], color: CB.blue},
    {label: 'Switzerland', value: GDP_PC_2024['756'], highlight: true, note: '≈ 8 × the world average'},
  ],
};

// ---------- the scenes ----------
export const SCENES: Record<string, SceneDef> = {
  // cold open: real terrain on frame 1, the puzzle (rich vs nothing) in the first line
  o1: art('alps-modis', 'The Alps from space — NASA MODIS, 2016. Switzerland is in the middle.', {x: 0.42, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.3}, [
    {type: 'glossary', term: 'Switzerland', meaning: 'small country in central Europe, capital Bern', window: [0.05, 0.55]},
  ]),
  o2: map(2024, {camera: EUROPE, choropleth: GDP}, [
    {type: 'glossary', term: 'GDP per person', meaning: "a year's production, divided by the population", window: [0.3, 0.98]},
  ]),
  o3: chart(GDP_BARS),
  o4: art('village-alps', 'A village in the Bernese Oberland, about 1890–1900 (photochrom, Library of Congress)', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.55, y: 0.45, zoom: 1.25}, [
    {type: 'citation', text: 'SCNAT (Swiss Academy of Sciences): 1816–17 famine', at: [0.45, 0.98]},
  ]),
  o5: art('alps-modis', '', {x: 0.45, y: 0.5, zoom: 1.3}, {x: 0.45, y: 0.5, zoom: 1.1}, [{type: 'title', title: 'SWITZERLAND', sub: 'WHY IS IT SO RICH?'}]),

  // 1 — A Country With Nothing
  c1: chapter(1, 'A Country With Nothing', 'Geography', {camera: EUROPE, choropleth: SWISS_ONLY}, 'alps-modis', 'What does Switzerland NOT have?'),
  c1a: {kind: 'map', year: 2026, map: M({projection: 'globe', camera: cam([10, 30], 1.15, [8.3, 46.8], 9), choropleth: SWISS_ONLY, cities: [city('Bern (capital)', P.bern, 0.6)]})},
  c1b: map(2024, {camera: cam([6.8, 49.3], 8.5, [7.0, 49.0], 9.5), choropleth: SWISS_NL}, [
    {type: 'glossary', term: 'km²', meaning: 'a square 1 km long on each side', window: [0.05, 0.5]},
    {type: 'counter', label: 'PEOPLE (END OF 2024)', value: 9048900, window: [0.55, 0.98], color: '#ff7a68', context: 'Federal Statistical Office', top: 260},
  ]),
  c1c: map(2026, {camera: ALPS, choropleth: {...SWISS_ONLY, appear: [0, 0.01], values: {'756': 1}, colors: ['rgba(214,64,47,0.25)']}, regions: [{text: 'THE ALPS', at: [8.6, 46.45], appear: 0.15, size: 50}], cities: [city('Zurich', P.zurich, 0.5), city('Geneva', P.geneva, 0.5), city('Bern', P.bern, 0.5)]}, [
    {type: 'citation', text: 'Swiss government (EDA): Alps ≈ 58–60% of the land', at: [0.05, 0.95]},
  ]),
  c1d: map(2026, {camera: cam([7.2, 49.5], 8.5, [6.2, 50.3], 8.0), rivers: [{name: 'Rhine', label: 'Rhine', at: [7.75, 49.2]}], cities: [city('Basel', P.basel, 0.05), city('Rotterdam', P.rotterdam, 0.6, {align: 'left'})], routes: [route('rhine', [P.basel, [7.75, 48.58], [8.47, 49.49], [8.27, 50.0], [7.6, 50.36], [6.96, 50.94], [6.76, 51.43], [5.86, 51.84], P.rotterdam], [0.15, 0.75], {dashed: true, km: true, color: CB.blue})], regions: [{text: 'NORTH SEA', at: [3.2, 53.4], appear: 0.6, size: 34}]}, [
    {type: 'glossary', term: 'Landlocked', meaning: 'a country with no coast of its own', window: [0.04, 0.5]},
  ]),
  c1e: map(2026, {camera: CH, choropleth: SWISS_ONLY}, [{type: 'list', title: 'Under Swiss ground', items: ['Oil field: none', 'Gas: almost none', 'Coal mine: none worth mentioning', 'Oil & gas: almost all imported'], source: 'Swiss government (EDA), energy'}]),
  c1f: chart({
    type: 'share', title: 'Where Swiss electricity comes from', unit: 'Share of domestic electricity production, 10-year average', source: 'Swiss Federal Office of Energy',
    howTo: 'the whole bar = all electricity made in Switzerland',
    segments: [{label: 'Hydropower (water)', value: 58, color: CB.sky}, {label: 'Everything else', value: 42, color: CB.grey}],
  }),
  c1g: recap('Small, landlocked, mountainous, and almost no fuel. On paper, a recipe for staying poor.', {camera: CH, choropleth: SWISS_ONLY}, 'And for a long time, it was poor…'),

  // 2 — The Hungry Years
  c2: chapter(2, 'The Hungry Years', '1515 – 1817', {camera: CH, choropleth: SWISS_ONLY}, 'village-alps', 'How poor was Switzerland 200 years ago?'),
  c2a: art('hodler-marignano', 'Ferdinand Hodler, Retreat from Marignano (study), about 1897', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.5, zoom: 1.2}, [
    {type: 'glossary', term: 'Mercenary', meaning: 'a soldier who fights for pay', window: [0.35, 0.98]},
  ]),
  c2a2: map(1515, {camera: cam([9.0, 46.2], 12, [9.1, 45.9], 14), choropleth: SWISS_ONLY, cities: [city('Marignano', [9.33, 45.36], 0.1, {today: 'Melegnano, near Milan, Italy'}), city('Milan', P.milan, 0.05, {align: 'left'})]}, [
    {type: 'citation', text: 'Swiss government (EDA): neutrality dates back to Marignano 1515', at: [0.05, 0.95]},
  ]),
  c2b: art('lion-lucerne', 'The Lion Monument, Lucerne (photochrom, about 1890–1900). It honours Swiss Guards killed in Paris in 1792.', {x: 0.5, y: 0.55, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.25}, [
    {type: 'citation', text: 'Lucerne Tourism · swissinfo.ch', at: [0.4, 0.98]},
  ]),
  c2c: art('tambora-iss', 'Mount Tambora, Sumbawa island, Indonesia — photo from space (NASA, 2009)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.35}, [
    {type: 'glossary', term: 'Volcano', meaning: 'a mountain that erupts hot rock and ash', window: [0.2, 0.7]},
  ]),
  c2d: {kind: 'map', year: 1816, map: M({projection: 'globe', camera: cam([110, 5], 1.2, [20, 40], 1.25), cities: [city('Tambora', P.tambora, 0.02, {today: 'Indonesia'}), city('Switzerland', P.bern, 0.55)], routes: [route('ash', [P.tambora, [80, 20], [50, 35], P.bern], [0.1, 0.7], {dashed: true, color: CB.grey})]}), overlays: [
    {type: 'citation', text: 'SCNAT: summer 1816 ≈ 2.5 °C colder', at: [0.5, 0.98]},
  ]},
  c2e: chart({
    type: 'share', title: 'Summer 1816 in Switzerland', unit: 'Days with rain, May to July 1816 (about 90 days)', source: 'SCNAT (Swiss Academy of Sciences)',
    segments: [{label: 'Rainy days: 50 of 90', value: 56, color: CB.blue}, {label: 'Dry: 40', value: 44, color: CB.grey}],
  }),
  c2f: art('village-alps', 'Mountain village, Switzerland (photochrom, about 1890–1900)', {x: 0.4, y: 0.6, zoom: 1.3}, {x: 0.5, y: 0.5, zoom: 1.1}, [
    {type: 'glossary', term: 'Gulden', meaning: 'an old local currency, before the franc', window: [0.4, 0.98]},
  ]),
  c2g: chart({
    type: 'bar', title: 'Price of one sack of grain', unit: 'Gulden (old currency), eastern Switzerland', source: '"Hungertafel" price board, Toggenburg (via sozialgeschichte.ch)',
    howTo: 'longer bar = more expensive', num: {suffix: ' gulden'},
    bars: [{label: '1811', value: 14, color: CB.grey}, {label: 'June 1817', value: 106, highlight: true, note: 'more than 7 × as much'}],
  }),
  c2h: art('village-alps', 'Bernese Oberland (photochrom). The worst hunger was in the east, around Appenzell.', {x: 0.6, y: 0.4, zoom: 1.2}, {x: 0.5, y: 0.5, zoom: 1.05}, [
    {type: 'counter', label: 'DEATHS, PART OF APPENZELL, 1817', value: 1754, window: [0.45, 0.98], color: '#ff7a68', context: 'usually about 640 a year', top: 260},
    {type: 'citation', text: 'Zollikofer 1817 via sozialgeschichte.ch · SCNAT', at: [0.45, 0.98]},
  ]),
  c2i: map(1817, {camera: cam([-20, 46], 2.6, [-35, 44], 2.4), cities: [city('Switzerland', P.bern, 0.02), city('Le Havre', P.lehavre, 0.2, {align: 'left', today: 'France'}), city('New York', P.newyork, 0.7)], routes: [route('emig', [P.bern, P.lehavre], [0.05, 0.3]), route('sea', [P.lehavre, [-20, 47], [-50, 43], P.newyork], [0.3, 0.8], {dashed: true})], regions: [{text: 'ATLANTIC OCEAN', at: [-38, 38], appear: 0.4, size: 34}]}, [
    {type: 'glossary', term: 'Emigrate', meaning: 'to leave your country to live elsewhere', window: [0.1, 0.6]},
  ]),
  c2j: recap('A poor mountain country that exported soldiers and emigrants.', {camera: CH, choropleth: SWISS_ONLY}, 'But one city had already found a better export…'),

  // 3 — Small, Light, Valuable
  c3: chapter(3, 'Small, Light, Valuable', '1541 – today', {camera: CH, choropleth: SWISS_ONLY}, 'met-watch', 'Why is a watch perfect for a mountain country?'),
  c3a: art('calvin', 'Portrait of John Calvin, about 1550 (Museum Catharijneconvent)', {x: 0.5, y: 0.35, zoom: 1.0}, {x: 0.5, y: 0.3, zoom: 1.15}, [
    {type: 'character', name: 'John Calvin', role: 'Protestant reformer, Geneva', line: 'Lived 1509–1564. Preached against luxury.', image: 'calvin', side: 'Switzerland', window: [0.25, 0.98]},
  ], false),
  c3b: map(1600, {camera: cam([5.6, 46.0], 13, [5.9, 46.1], 15), cities: [city('Geneva', P.geneva, 0.05), city('Lyon', [4.84, 45.76], 0.1, {align: 'left', today: 'France'})], routes: [route('huguenots', [[4.84, 45.76], [5.5, 46.0], P.geneva], [0.3, 0.7], {color: CB.blue})]}, [
    {type: 'glossary', term: 'Protestants', meaning: 'Christians who broke from the Catholic Church', window: [0.05, 0.5]},
    {type: 'citation', text: 'Fondation de la Haute Horlogerie · Swiss government (EDA)', at: [0.5, 0.98]},
  ]),
  c3c: art('met-watch', 'Watch by Jean Rousseau, Geneva, about 1650–60 — The Met, New York (CC0)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.2}, undefined, true),
  c3c2: map(1785, {camera: cam([6.1, 46.3], 18, [6.14, 46.22], 22), cities: [city('Geneva', P.geneva, 0.02)]}, [
    {type: 'counter', label: 'WATCHMAKERS IN GENEVA (~1785)', value: 20000, window: [0.15, 0.98], color: '#ff7a68', context: 'making about 85,000 watches a year', top: 260},
    {type: 'citation', text: 'Swiss government (EDA), "Artisans of Time"', at: [0.15, 0.98]},
  ]),
  c3d: map(1800, {camera: cam([6.6, 46.8], 14, [6.8, 47.0], 16), cities: [city('La Chaux-de-Fonds', P.lachauxdefonds, 0.1), city('Geneva', P.geneva, 0.05)], regions: [{text: 'JURA MOUNTAINS', at: [6.5, 47.25], appear: 0.2, size: 38}]}),
  c3e: chart({
    type: 'bar', title: 'Average export price of one watch', unit: '2024, US$ (export price, not shop price)', source: 'Federation of the Swiss Watch Industry (FH), 2025',
    howTo: 'longer bar = more money per watch', num: {prefix: '$'},
    bars: [{label: 'China', value: 4, color: CB.sky}, {label: 'Switzerland', value: 1837, highlight: true}],
  }),
  c3f: chart({
    type: 'pictogram', icon: 'watch', title: 'Wristwatches exported in 2024', unit: 'Number of watches', source: 'FH, World watchmaking industry 2024', per: '5 million watches',
    groups: [{label: 'China', count: 119, color: CB.sky}, {label: 'Switzerland', count: 3, color: SWISS}],
  }),
  c3g: chart({
    type: 'area', title: 'Money earned from those watches', unit: '2024, US$ billion (number × average price, our math)', source: 'FH 2025, our calculation',
    howTo: 'bigger square = more money', num: {prefix: '$', suffix: ' bn', decimals: 1},
    items: [{label: 'China', value: 2.4, color: CB.sky, note: '595 million watches'}, {label: 'Switzerland', value: 28.1, color: SWISS, note: '15 million watches'}],
  }),
  c3h: map(2024, {camera: CH, choropleth: SWISS_ONLY}, [
    {type: 'glossary', term: 'Franc', meaning: 'Swiss money: 1 franc ≈ $1.1 (2024)', window: [0.05, 0.5]},
    {type: 'counter', label: 'WATCH EXPORTS PER PERSON, 2024', value: 2900, window: [0.45, 0.98], color: '#ff7a68', context: 'francs (26 billion ÷ 9 million people)', top: 260},
  ]),
  c3i: recap('Switzerland got richer by exporting small, valuable things that are cheap to move.', {camera: CH, choropleth: SWISS_ONLY}, 'But to sell anything, you need a way through the mountains…'),

  // 4 — The Road Through the Alps
  c4: chapter(4, 'The Road Through the Alps', '1200s – 2016', {camera: ALPS, choropleth: SWISS_ONLY}, 'turner-gotthard', 'How do you trade through a wall of mountains?'),
  c4a: art('turner-gotthard', 'J. M. W. Turner, The Pass of St Gotthard, near Faido, 1843', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.2}, [
    {type: 'citation', text: 'Swiss government (EDA): "The legend of the Gotthard pass"', at: [0.4, 0.98]},
  ]),
  c4b: map(1882, {camera: cam([8.8, 46.6], 11, [8.7, 46.5], 13), rivers: [], cities: [city('Zurich', P.zurich, 0.05), city('Milan', P.milan, 0.05), city('Gotthard tunnel', P.gotthard, 0.45)], routes: [route('gotthard', [P.zurich, [8.6, 47.0], P.gotthard, [8.9, 46.2], P.milan], [0.1, 0.8], {km: true})]}, [
    {type: 'citation', text: 'EDA: 15 km rail tunnel, opened 1882', at: [0.5, 0.98]},
  ]),
  c4c: art('gotthard-workers', 'Workers on the Gotthard rail tunnel, about 1880', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.2}, [
    {type: 'counter', label: 'TONNES OF GOODS, 1883', value: 300000, window: [0.5, 0.98], color: '#ff7a68', context: '≈ 7,500 loads of 40 tonnes (our math)', top: 260},
    {type: 'glossary', term: 'Tonne', meaning: '1,000 kilograms', window: [0.5, 0.85]},
  ]),
  c4d: art('wassen-rail', 'Wassen on the Gotthard railway (photochrom, about 1890–1900)', {x: 0.5, y: 0.5, zoom: 1.05}, {x: 0.6, y: 0.5, zoom: 1.25}),
  c4e: map(2016, {camera: cam([8.8, 46.6], 20, [8.78, 46.6], 24), cities: [city('Erstfeld', P.erstfeld, 0.1), city('Bodio', P.bodio, 0.1)], routes: [route('base', [P.erstfeld, [8.75, 46.65], [8.82, 46.5], P.bodio], [0.15, 0.6], {color: CB.orange})], regions: [{text: '57 KM', at: [9.15, 46.62], appear: 0.6, size: 40}]}, [
    {type: 'citation', text: 'Swiss transport ministry (UVEK): Gotthard Base Tunnel, 2016', at: [0.4, 0.98]},
  ]),
  c4f: map(1815, {camera: EU_WIDE, choropleth: SWISS_ONLY, cities: [city('Vienna', P.vienna, 0.05), city('Paris', P.paris, 0.05, {align: 'left'})]}, [
    {type: 'character', name: 'Napoleon', role: 'French emperor', line: 'Conquered much of Europe. Defeated in 1815.', window: [0.05, 0.5]},
    {type: 'glossary', term: 'Neutral', meaning: "takes no side in other countries' wars", window: [0.5, 0.98]},
    {type: 'citation', text: 'Treaty of Paris, 20 Nov 1815 (Swiss government)', at: [0.5, 0.98]},
  ]),
  c4f2: map(2026, {camera: EU_WIDE, choropleth: EU_MEMBERS}, [
    {type: 'glossary', term: 'European Union', meaning: 'a group of 27 European countries', window: [0.05, 0.6]},
  ]),
  c4g: map(1945, {camera: EUROPE, choropleth: SWISS_ONLY, regions: [{text: 'NEUTRAL', at: [8.2, 45.4], appear: 0.2, size: 36}]}, [
    {type: 'citation', text: 'Federal Council: Switzerland’s policy of neutrality', at: [0.1, 0.98]},
  ]),
  c4h: art('lion-lucerne', 'Lucerne (photochrom, about 1890–1900)', {x: 0.5, y: 0.5, zoom: 1.25}, {x: 0.5, y: 0.5, zoom: 1.05}, [
    {type: 'list', title: 'Where would you keep your savings?', items: ['In a country at war?', 'Or in a quiet, neutral one?']},
  ]),
  c4i: recap('Tunnels connected Switzerland to Europe, and neutrality kept it out of war.', {camera: ALPS, choropleth: SWISS_ONLY}, 'Which brought in a very different business…'),

  // 5 — Safe Money
  c5: chapter(5, 'Safe Money', '1934 – today', {camera: CH, choropleth: SWISS_ONLY}, 'zurich-poly', 'Are Swiss banks the real secret?'),
  c5a: map(1934, {camera: cam([7.6, 46.9], 18, [7.8, 47.0], 21), choropleth: SWISS_ONLY, cities: [city('Zurich', P.zurich, 0.05), city('Geneva', P.geneva, 0.05), city('Basel', P.basel, 0.05)]}, [
    {type: 'glossary', term: 'Banking secrecy', meaning: 'bankers may not reveal who their clients are', window: [0.4, 0.98]},
    {type: 'citation', text: 'Banking Act of 8 Nov 1934, Art. 47', at: [0.4, 0.98]},
  ]),
  c5b: map(1960, {camera: EUROPE, choropleth: SWISS_ONLY, routes: [
    route('m1', [P.paris, P.geneva], [0.1, 0.5], {color: CB.orange, dashed: true}),
    route('m2', [P.milan, P.zurich], [0.15, 0.55], {color: CB.orange, dashed: true}),
    route('m3', [[11.58, 48.14], P.zurich], [0.2, 0.6], {color: CB.orange, dashed: true}),
    route('m4', [[4.9, 52.37], P.basel], [0.25, 0.65], {color: CB.orange, dashed: true}),
  ]}, [{type: 'citation', text: 'Springer (2023): Swiss bank secrecy and tax evasion', at: [0.3, 0.98]}]),
  c5c: map(2018, {camera: EUROPE, choropleth: SWISS_ONLY, routes: [
    route('d1', [P.geneva, P.paris], [0.4, 0.75], {color: CB.blue, dashed: true}),
    route('d2', [P.zurich, P.milan], [0.45, 0.8], {color: CB.blue, dashed: true}),
    route('d3', [P.zurich, [11.58, 48.14]], [0.5, 0.85], {color: CB.blue, dashed: true}),
    route('d4', [P.basel, [4.9, 52.37]], [0.55, 0.9], {color: CB.blue, dashed: true}),
  ]}, [
    {type: 'glossary', term: 'Tax office', meaning: 'the government agency that collects taxes', window: [0.05, 0.4]},
    {type: 'citation', text: 'First automatic exchange: Sept 2018 (OECD standard)', at: [0.45, 0.98]},
  ]),
  c5d: art('zurich-poly', 'Zurich, the biggest Swiss banking city (photochrom, about 1890–1900)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.4, y: 0.5, zoom: 1.2}, [
    {type: 'citation', text: 'FINMA, 19 March 2023', at: [0.3, 0.98]},
  ]),
  c5e: map(2023, {camera: cam([8.54, 47.37], 30, [8.54, 47.37], 36), choropleth: SWISS_ONLY, cities: [city('Zurich', P.zurich, 0.02)], regions: [{text: 'CREDIT SUISSE → UBS', at: [8.54, 47.2], appear: 0.2, size: 34}]}, [
    {type: 'citation', text: 'Federal Department of Finance: UBS takeover of Credit Suisse', at: [0.2, 0.98]},
  ]),
  c5f: map(2024, {camera: CH, choropleth: SWISS_ONLY}, [
    {type: 'counter', label: 'FOREIGN PRIVATE MONEY MANAGED, 2024', value: 2427, suffix: ' bn CHF', window: [0.3, 0.98], color: '#ff7a68', context: '≈ 268,000 francs per Swiss resident (our math)', top: 260},
    {type: 'citation', text: 'Swiss Bankers Association, Banking Barometer 2025', at: [0.3, 0.98]},
  ]),
  c5g: chart({
    type: 'share', title: 'How big is finance in Switzerland?', unit: 'Share of Swiss GDP, 2024', source: 'State Secretariat for International Finance (SIF), 2026',
    howTo: 'the whole bar = everything Switzerland produces',
    segments: [{label: 'Banks + insurance', value: 9, color: CB.orange}, {label: 'Everything else', value: 91, color: CB.grey}],
  }),
  c5h: map(2024, {camera: cam([7.6, 47.4], 18, [7.6, 47.55], 24), choropleth: SWISS_ONLY, cities: [city('Basel', P.basel, 0.3)], regions: [{text: '?', at: [7.9, 47.2], appear: 0.5, size: 60}]}),
  c5i: recap('Swiss banks are famous, but finance is only about a tenth of the economy.', {camera: CH, choropleth: SWISS_ONLY}, 'The biggest export comes from one city on the Rhine…'),

  // 6 — Medicine From Basel
  c6: chapter(6, 'Medicine From Basel', '1859 – today', {camera: cam([7.6, 47.56], 26, [7.6, 47.56], 30), choropleth: SWISS_ONLY}, 'basel-gate', 'How did a dye town become a medicine giant?'),
  c6a: map(1880, {camera: cam([7.6, 47.6], 26, [7.59, 47.56], 32), choropleth: SWISS_ONLY, rivers: [{name: 'Rhine', label: 'Rhine', at: [7.75, 47.6]}], cities: [city('Basel', P.basel, 0.05), city('Mulhouse', [7.34, 47.75], 0.3, {align: 'left', today: 'France'}), city('Lörrach', [7.66, 47.61], 0.35, {today: 'Germany'})]}),
  c6b: art('basel-gate', 'The Spalentor, Basel (photochrom, about 1890–1900)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.4, zoom: 1.2}, [
    {type: 'glossary', term: 'Patent', meaning: 'a legal right to stop others copying', window: [0.1, 0.7]},
    {type: 'citation', text: 'Historical Dictionary of Switzerland (HLS): Chemische Industrie', at: [0.4, 0.98]},
  ]),
  c6c: art('basel-gate', 'Basel (photochrom, about 1890–1900)', {x: 0.5, y: 0.35, zoom: 1.25}, {x: 0.5, y: 0.6, zoom: 1.05}, [
    {type: 'citation', text: 'swissinfo.ch · Novartis history: Roche founded 1896', at: [0.4, 0.98]},
  ]),
  c6c2: art('basel-gate', 'Basel (photochrom, about 1890–1900)', {x: 0.4, y: 0.5, zoom: 1.1}, {x: 0.6, y: 0.5, zoom: 1.25}, [
    {type: 'list', title: 'Sandoz, a Basel dye maker', items: ['1914: medicines = 10% of sales', '1952: medicines = the biggest part'], source: 'swissinfo.ch / Novartis archives'},
  ]),
  c6d: chart({
    type: 'bar', title: "Switzerland's biggest exports", unit: '2024, billion Swiss francs', source: 'Federal Office for Customs (BAZG), 2025',
    howTo: 'longer bar = more money from abroad', num: {suffix: ' bn'},
    bars: [
      {label: 'Chemicals + medicines', value: 149.1, highlight: true},
      {label: 'Machines + electronics', value: 32.1, color: CB.blue},
      {label: 'Watches', value: 26.0, color: CB.orange},
      {label: 'Precision instruments', value: 17.4, color: CB.grey},
    ],
  }),
  c6e: chart({
    type: 'share', title: 'All Swiss exports, 2024', unit: 'Share of total exports (CHF 283 billion)', source: 'BAZG, Swiss foreign trade 2024',
    segments: [{label: 'Chemicals + medicines', value: 53, color: CB.green}, {label: 'Everything else', value: 47, color: CB.grey}],
  }),
  c6f: chart({
    type: 'area', title: 'Exports per Swiss resident, 2024', unit: 'Swiss francs per person (export value ÷ 9 million people)', source: 'BAZG, FSO, our calculation', num: {prefix: 'CHF '},
    items: [{label: 'Watches', value: 2900, color: CB.orange}, {label: 'Chemicals + medicines', value: 16500, color: CB.green}],
  }),
  c6g: map(2024, {camera: EU_WIDE, choropleth: SWISS_ONLY, cities: [city('Basel', P.basel, 0.02)], routes: [
    route('x1', [P.basel, P.rotterdam], [0.1, 0.45], {color: CB.green}),
    route('x2', [P.basel, P.milan], [0.15, 0.5], {color: CB.green}),
    route('x3', [P.basel, P.paris], [0.2, 0.55], {color: CB.green}),
    route('x4', [P.basel, P.vienna], [0.25, 0.6], {color: CB.green}),
  ]}),
  c6h: recap('Basel turned dye chemistry into medicine, now over half of Swiss exports.', {camera: CH, choropleth: SWISS_ONLY}, 'But none of this works without one more ingredient…'),

  // 7 — You, in Switzerland
  c7: chapter(7, 'You, in Switzerland', 'Wages and prices today', {camera: CH, choropleth: SWISS_ONLY}, 'zurich-poly', 'What is it like to earn a Swiss salary?'),
  c7a: art('zurich-poly', 'Zurich and its Polytechnic, today ETH Zurich (photochrom, about 1890–1900)', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.6, y: 0.5, zoom: 1.2}, [
    {type: 'glossary', term: 'Apprenticeship', meaning: 'learning a job while working, with pay', window: [0.25, 0.98]},
  ]),
  c7b: chart({
    type: 'bar', title: 'Young people without a job', unit: 'Youth unemployment rate, end of 2025', source: 'Swiss government (admin.ch), 2026', num: {suffix: '%', decimals: 1},
    howTo: 'shorter bar = better',
    bars: [{label: 'Switzerland', value: 9.3, highlight: true}, {label: 'Rich countries (OECD)', value: 11.2, color: CB.blue}, {label: 'European Union', value: 14.7, color: CB.sky}],
  }),
  c7c: art('zurich-poly', 'Zurich (photochrom, about 1890–1900)', {x: 0.6, y: 0.5, zoom: 1.2}, {x: 0.45, y: 0.5, zoom: 1.05}, [
    {type: 'citation', text: 'French Treasury, Trésor-Economics 379 (2026)', at: [0.3, 0.98]},
  ]),
  c7d: chart({
    type: 'bar', title: 'YOU: a full-time Swiss wage', unit: 'Gross wage per month, 2024, Swiss francs', source: 'Federal Statistical Office (FSO), 2025', num: {suffix: ' CHF'},
    howTo: 'the middle bar is the median',
    bars: [{label: 'Lowest 10% earn under', value: 4635, color: CB.grey}, {label: 'Median (middle)', value: 7024, highlight: true}, {label: 'Top 10% earn over', value: 12526, color: CB.blue}],
  }, [{type: 'glossary', term: 'Median', meaning: 'the middle: half earn more, half less', window: [0.35, 0.98]}]),
  c7d2: map(2024, {camera: CH, choropleth: SWISS_ONLY}, [
    {type: 'counter', label: 'MEDIAN WAGE PER YEAR (×12)', value: 84288, suffix: ' CHF', window: [0.1, 0.98], color: '#ff7a68', context: 'before tax; FSO 2024, our math', top: 260},
  ]),
  c7e: chart({
    type: 'share', title: 'Where a household’s income goes', unit: 'Share of gross household income, Switzerland', source: 'Swiss government (EDA), household budget',
    howTo: 'the whole bar = all income',
    segments: [{label: 'Taxes + compulsory health insurance', value: 33, color: CB.orange}, {label: 'Rent, food, transport, savings…', value: 67, color: CB.grey}],
  }, [{type: 'glossary', term: 'Compulsory', meaning: 'required by law', window: [0.3, 0.9]}]),
  c7f: chart({
    type: 'bar', title: 'How expensive is everyday life?', unit: 'Price level of household spending, 2025 (EU average = 100)', source: 'Eurostat via Statistics Norway, June 2026 (preliminary)',
    howTo: '100 = EU average price', num: {},
    bars: [{label: 'EU average', value: 100, color: CB.grey}, {label: 'Germany', value: 108.3, color: CB.blue}, {label: 'Austria', value: 113.0, color: CB.sky}, {label: 'Switzerland', value: 171.3, highlight: true, note: '≈ 70% above the EU average'}],
  }),
  c7g: map(2024, {camera: CH, choropleth: SWISS_ONLY}, [
    {type: 'counter', label: 'AVERAGE HOUSEHOLD SAVES', value: 1700, suffix: ' CHF / month', window: [0.1, 0.98], color: '#ff7a68', context: 'after all spending (Swiss government, EDA)', top: 260},
  ]),
  c7h: recap('Swiss wages are high, but so are taxes, insurance, and prices.', {camera: CH, choropleth: SWISS_ONLY}, "So what is the real secret? Let's put it together…"),

  // 8 — The Formula
  c8: chapter(8, 'The Formula', 'Putting it together', {camera: EUROPE, choropleth: GDP}, 'alps-modis', 'So, why is Switzerland so rich?'),
  c8a: chart({
    type: 'line', title: 'Switzerland vs the world, 1970–2024', unit: 'GDP per person, current US$', source: 'World Bank, 2026', howTo: 'higher line = richer per person', num: {prefix: '$'},
    x: [1970, 2024], series: [{name: 'Switzerland', color: SWISS, points: GDP_LINE.swiss, highlight: true}, {name: 'World', color: CB.sky, points: GDP_LINE.world}],
  }),
  c8a2: map(2024, {camera: EUROPE, choropleth: GDP}, [
    {type: 'citation', text: 'Current US$: exchange rates move these numbers', at: [0.05, 0.95]},
  ]),
  c8b: map(2024, {camera: ALPS, choropleth: SWISS_ONLY}, [{type: 'list', title: 'Why Switzerland is rich', items: ['Mountains → sell small, valuable things']}]),
  c8c: map(2024, {camera: CH, choropleth: SWISS_ONLY}, [{type: 'list', title: 'Why Switzerland is rich', items: ['Mountains → sell small, valuable things', 'Tunnels → connected to Europe', 'Peace → factories and savings stayed safe', 'Skills → high value, high wages']}]),
  c8d: chart({
    type: 'share', title: 'The risk: one big basket', unit: 'Share of Swiss exports, 2024', source: 'BAZG, 2025',
    segments: [{label: 'Chemicals + medicines', value: 53, color: CB.green}, {label: 'Everything else', value: 47, color: CB.grey}],
  }),
  c8e: map(2026, {camera: EU_WIDE, choropleth: GDP, regions: [{text: 'WHICH COUNTRY NEXT?', at: [10, 55.5], appear: 0.2, size: 44}]}),
  c8f: art('alps-modis', '', {x: 0.45, y: 0.5, zoom: 1.15}, {x: 0.5, y: 0.5, zoom: 1.0}, [{type: 'endscreen', teaser: 'Why is Russia so big, but so empty?'}]),
};
