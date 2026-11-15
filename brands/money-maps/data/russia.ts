// Money & Maps — Russia / Canada places for episode 002 (coordinates: Wikipedia / GeoNames, lon-lat).
// January means and populations are the sourced values in episodes/002-siberian-curse/sources.md.
import type {LonLat, RegionLabel, Territory} from '../../../packages/engine/src/map/map';

export const RU: Record<string, LonLat> = {
  moscow: [37.62, 55.75],
  stpete: [30.32, 59.94],
  perm: [56.25, 58.01],
  yekaterinburg: [60.6, 56.84],
  tyumen: [65.53, 57.15],
  surgut: [73.4, 61.25],
  novosibirsk: [82.92, 55.03],
  krasnoyarsk: [92.87, 56.01],
  norilsk: [88.2, 69.35],
  dudinka: [86.18, 69.41],
  yakutsk: [129.73, 62.03],
  magadan: [150.8, 59.57],
  susuman: [148.15, 62.78],
  vorkuta: [64.03, 67.5],
  anadyr: [177.51, 64.73],
  khabarovsk: [135.07, 48.48],
  vladivostok: [131.89, 43.12],
  winnipeg: [-97.14, 49.9],
  toronto: [-79.38, 43.65],
  montreal: [-73.57, 45.5],
  vancouver: [-123.12, 49.28],
  calgary: [-114.07, 51.05],
};

export const MODERN_RU: RegionLabel[] = [
  {text: 'RUSSIA', at: [95, 64], size: 30},
  {text: 'KAZAKHSTAN', at: [67, 48], size: 22},
  {text: 'MONGOLIA', at: [103, 46.8], size: 22},
  {text: 'CHINA', at: [110, 38], size: 22},
  {text: 'FINLAND', at: [26, 63.5], size: 20},
  {text: 'UKRAINE', at: [31.5, 49], size: 20},
  {text: 'JAPAN', at: [139, 37], size: 20},
];

export const MODERN_NA: RegionLabel[] = [
  {text: 'CANADA', at: [-102, 60], size: 30},
  {text: 'UNITED STATES', at: [-100, 40], size: 26},
  {text: 'GREENLAND', at: [-41, 73], size: 20},
];

// Approximate band ≈ 100 km north of the Canada–US border (for orientation only; labelled "approximate" on screen).
const BORDER: LonLat[] = [
  [-123.3, 49.0], [-110, 49.0], [-95.2, 49.0], [-89.6, 48.0], [-84.6, 46.5], [-82.4, 43.0], [-79.0, 42.8],
  [-76.2, 44.1], [-74.7, 45.0], [-71.5, 45.0], [-70.0, 46.7], [-69.2, 47.4], [-67.8, 47.1], [-67.1, 45.2],
];
export const CANADA_BAND: Territory = {
  id: 'band',
  rings: [[...BORDER, ...BORDER.slice().reverse().map(([x, y]) => [x, y + 0.9] as LonLat)]],
  color: '#e69f00',
  label: 'WITHIN ~100 KM OF THE US BORDER',
  labelAt: [-96, 52.2],
  opacity: 0.55,
  grow: [0.15, 0.45],
};

// Line along the Ural Mountains (the usual Europe–Asia divide), approximate.
export const URALS: LonLat[] = [[66.2, 68.4], [65.0, 66.0], [61.0, 63.0], [59.5, 61.0], [59.4, 58.5], [59.0, 56.0], [58.6, 53.5], [58.4, 51.5]];
