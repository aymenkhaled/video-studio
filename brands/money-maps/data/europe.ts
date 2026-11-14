// Money & Maps — shared European data. Source: World Bank, World Development Indicators, NY.GDP.PCAP.CD
// (GDP per capita, current US$), year 2024, API last updated 2026-11-11, licence CC BY 4.0.
// Keys: ISO 3166-1 numeric ids as used by Natural Earth / world-atlas (Kosovo has no id there and is left grey).
import type {LonLat, RegionLabel} from '../../../packages/engine/src/map/map';

export const GDP_PC_2024: Record<string, number> = {
  '756': 107702, // Switzerland
  '276': 56104, // Germany
  '250': 46103, // France
  '380': 40430, // Italy
  '040': 58269, // Austria
  '438': 220167, // Liechtenstein
  '528': 67465, // Netherlands
  '056': 56582, // Belgium
  '442': 137782, // Luxembourg
  '724': 35327, // Spain
  '620': 29328, // Portugal
  '826': 53341, // United Kingdom
  '372': 112895, // Ireland
  '208': 71026, // Denmark
  '578': 89889, // Norway
  '752': 57223, // Sweden
  '246': 53156, // Finland
  '616': 25104, // Poland
  '203': 31828, // Czechia
  '703': 25993, // Slovakia
  '348': 23305, // Hungary
  '705': 34301, // Slovenia
  '191': 24050, // Croatia
  '070': 9398, // Bosnia and Herzegovina
  '688': 13678, // Serbia
  '499': 13270, // Montenegro
  '008': 11374, // Albania
  '807': 9292, // North Macedonia
  '300': 24626, // Greece
  '100': 17597, // Bulgaria
  '642': 20080, // Romania
  '498': 7579, // Moldova
  '804': 5392, // Ukraine
  '112': 8606, // Belarus
  '440': 29604, // Lithuania
  '428': 23579, // Latvia
  '233': 31428, // Estonia
  '352': 85863, // Iceland
};
export const WORLD_GDP_PC_2024 = 13717;

/** Sequential, colour-blind-safe classes (viridis family), light = poorer, dark = richer. */
export const GDP_BREAKS = [20000, 40000, 60000, 90000];
export const GDP_COLORS = ['#fde725', '#7ad151', '#22a884', '#2a788e', '#414487'];

/** World Bank GDP per capita, current US$ — Switzerland vs world, 1970–2024 (every 5 years + 2024). */
export const GDP_LINE = {
  swiss: [[1970, 4105], [1975, 10484], [1980, 19686], [1985, 17411], [1990, 40171], [1995, 50869], [2000, 39298], [2005, 57080], [2010, 77956], [2015, 85265], [2020, 87530], [2024, 107702]] as [number, number][],
  world: [[1970, 818], [1975, 1489], [1980, 2587], [1985, 2691], [1990, 4339], [1995, 5463], [2000, 5513], [2005, 7291], [2010, 9555], [2015, 10192], [2020, 10999], [2024, 13717]] as [number, number][],
};

/** Modern country names for orientation (Clarity rule 1). */
export const MODERN_EU: RegionLabel[] = [
  {text: 'Germany', at: [10.2, 51.0]},
  {text: 'France', at: [2.5, 46.6]},
  {text: 'Italy', at: [12.6, 43.0]},
  {text: 'Austria', at: [14.4, 47.6]},
  {text: 'Switzerland', at: [8.2, 46.8], size: 26},
  {text: 'Netherlands', at: [5.6, 52.3]},
  {text: 'Belgium', at: [4.6, 50.6]},
  {text: 'Czechia', at: [15.4, 49.8]},
  {text: 'Poland', at: [19.2, 52.1]},
  {text: 'Spain', at: [-3.6, 40.2]},
  {text: 'United Kingdom', at: [-1.8, 52.6]},
  {text: 'Hungary', at: [19.4, 47.1]},
  {text: 'Slovenia', at: [14.8, 46.1]},
  {text: 'Croatia', at: [16.2, 45.4]},
  {text: 'Denmark', at: [9.3, 56.0]},
  {text: 'Liechtenstein', at: [9.55, 47.17], size: 16},
];

export const PLACES: Record<string, LonLat> = {
  bern: [7.447, 46.948],
  zurich: [8.541, 47.377],
  geneva: [6.143, 46.204],
  basel: [7.588, 47.56],
  lucerne: [8.31, 47.05],
  lachauxdefonds: [6.826, 47.1],
  gotthard: [8.567, 46.558],
  milan: [9.19, 45.464],
  rotterdam: [4.48, 51.92],
  lehavre: [0.107, 49.494],
  newyork: [-74.0, 40.71],
  tambora: [118.0, -8.25],
  appenzell: [9.41, 47.33],
  paris: [2.35, 48.857],
  vienna: [16.37, 48.21],
  erstfeld: [8.65, 46.82],
  bodio: [8.91, 46.38],
};
