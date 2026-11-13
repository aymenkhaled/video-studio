import type {City, LonLat, Territory} from '../../../packages/engine/src/map/map';

// Shared geography for Punic-war episodes. Territories are our own APPROXIMATE drawings
// (clipped to coastlines at render time) — say "approximate" in every description.

export const COL = {rome: '#a8322d', carthage: '#c8812a', route: '#f0c36a', roman: '#d9574c'};

export const ROME_ITALY: Territory = {
  id: 'rome', color: COL.rome, origin: [12.48, 41.9],
  rings: [[[10.0, 44.1], [12.6, 44.1], [19, 41.5], [19, 38.2], [16.6, 37.6], [15.6, 38.6], [13.0, 39.6], [11.0, 41.3], [9.5, 43.0], [10.0, 44.1]]],
};
export const SARD_CORSICA: Territory = {
  id: 'sardcors', color: COL.rome, origin: [9.0, 40.6],
  rings: [[[7.8, 43.2], [10.2, 43.2], [10.2, 38.6], [7.8, 38.6], [7.8, 43.2]]],
};
export const SICILY: Territory = {
  id: 'sicily', color: COL.rome, origin: [14.0, 37.5],
  rings: [[[12.0, 38.4], [15.8, 38.4], [15.8, 36.4], [12.0, 36.4], [12.0, 38.4]]],
};
export const SICILY_CARTHAGE: Territory = {...SICILY, id: 'sicily-carthage', color: COL.carthage};
export const CARTHAGE_AFRICA: Territory = {
  id: 'carthage-africa', color: COL.carthage, origin: [10.32, 36.85],
  rings: [[[8.0, 37.6], [11.4, 37.6], [11.6, 35.5], [11.0, 33.6], [12.6, 32.6], [15.2, 31.9], [19.6, 30.8], [19.6, 29.9], [15.0, 30.9], [12.4, 31.9], [10.2, 32.9], [9.6, 34.6], [8.2, 35.6], [5.0, 35.9], [2.0, 35.9], [-1.5, 35.0], [-1.5, 36.2], [3.0, 37.4], [8.0, 37.6]]],
};
export const BARCID_SPAIN: Territory = {
  id: 'barcid-spain', color: COL.carthage, origin: [-0.99, 37.6],
  rings: [[[0.9, 40.8], [-0.5, 41.3], [-3.0, 40.1], [-5.0, 38.7], [-7.5, 37.7], [-6.3, 35.9], [-2.0, 36.2], [1.5, 38.6], [0.9, 40.8]]],
};
/** Southern Italy that went over to Hannibal after Cannae (very approximate). */
export const DEFECTORS: Territory = {
  id: 'defectors', color: COL.carthage, origin: [14.25, 41.08], opacity: 0.5,
  rings: [[[13.9, 41.4], [15.6, 41.4], [17.4, 40.6], [17.4, 38.6], [15.6, 38.0], [15.4, 39.9], [13.9, 40.6], [13.9, 41.4]]],
};
/** Roman Spain after Scipio (approximate east coast). */
export const ROMAN_SPAIN: Territory = {...BARCID_SPAIN, id: 'roman-spain', color: COL.rome, origin: [1.25, 41.12]};

export const C: Record<string, City> = {
  rome: {name: 'Rome', at: [12.48, 41.9]},
  carthage: {name: 'Carthage', at: [10.32, 36.85]},
  newCarthage: {name: 'New Carthage', at: [-0.99, 37.6], align: 'left'},
  saguntum: {name: 'Saguntum', at: [-0.27, 39.68]},
  gades: {name: 'Gades', at: [-6.29, 36.53], align: 'left'},
  massalia: {name: 'Massalia', at: [5.37, 43.3]},
  rhone: {name: 'Rhône crossing', at: [4.78, 44.05], align: 'left'},
  pass: {name: 'Alpine pass (debated)', at: [6.95, 45.22]},
  turin: {name: 'Taurini (Turin)', at: [7.68, 45.07]},
  ticinus: {name: 'Ticinus', at: [9.16, 45.19], align: 'left'},
  trebia: {name: 'Trebia', at: [9.6, 45.0]},
  placentia: {name: 'Placentia', at: [9.69, 45.05]},
  arno: {name: 'Arno marshes', at: [10.9, 43.72], align: 'left'},
  trasimene: {name: 'Lake Trasimene', at: [12.1, 43.15]},
  cannae: {name: 'Cannae', at: [16.13, 41.31]},
  capua: {name: 'Capua', at: [14.25, 41.08], align: 'left'},
  tarraco: {name: 'Tarraco', at: [1.25, 41.12]},
  metaurus: {name: 'Metaurus', at: [13.0, 43.8], align: 'left'},
  utica: {name: 'Utica', at: [10.06, 37.06], align: 'left'},
  zama: {name: 'Zama (approx.)', at: [9.2, 36.1], align: 'left'},
  croton: {name: 'Croton', at: [17.13, 39.08]},
  lilybaeum: {name: 'Lilybaeum', at: [12.44, 37.8], align: 'left'},
  ephesus: {name: 'Ephesus', at: [27.34, 37.94]},
  libyssa: {name: 'Libyssa (Bithynia)', at: [29.43, 40.8]},
  tyre: {name: 'Tyre', at: [35.2, 33.27]},
};

// Inland waypoints so smoothed curves never bulge over the sea.
export const MARCH: LonLat[] = [[-0.99, 37.6], [-1.0, 38.6], [-0.75, 39.7], [0.2, 40.95], [1.3, 41.85], [2.3, 42.45], [2.9, 43.25], [4.0, 43.85], [4.78, 44.1], [5.5, 44.9], [6.3, 45.3], [6.95, 45.22], [7.68, 45.07]];
export const TO_TREBIA: LonLat[] = [[7.68, 45.07], [8.4, 45.15], [9.16, 45.19], [9.6, 45.0]];
export const TO_ARNO: LonLat[] = [[9.6, 45.0], [10.3, 44.6], [10.6, 44.1], [10.9, 43.72], [11.6, 43.45], [12.1, 43.15]];
export const TO_CANNAE: LonLat[] = [[12.1, 43.15], [13.2, 42.6], [14.0, 42.0], [14.6, 41.6], [15.4, 41.4], [16.13, 41.31]];
export const HASDRUBAL: LonLat[] = [[-0.99, 37.6], [0.2, 40.95], [2.3, 42.45], [4.78, 44.1], [6.3, 45.3], [7.68, 45.07], [9.6, 45.0], [11.6, 44.3], [13.0, 43.8]];
export const SCIPIO_SPAIN: LonLat[] = [[1.25, 41.12], [0.4, 40.4], [-0.27, 39.68], [-0.6, 38.6], [-0.99, 37.6]];
export const SCIPIO_AFRICA: LonLat[] = [[12.44, 37.8], [11.6, 37.6], [10.8, 37.3], [10.06, 37.06]];
export const HANNIBAL_HOME: LonLat[] = [[17.13, 39.08], [16.0, 37.8], [13.5, 36.8], [11.3, 36.0], [10.64, 35.83]];
export const EXILE: LonLat[] = [[10.32, 36.85], [14.5, 34.6], [22.0, 33.6], [30.0, 33.5], [35.2, 33.27], [33.0, 36.4], [27.34, 37.94]];
export const TO_BITHYNIA: LonLat[] = [[27.34, 37.94], [28.0, 39.0], [29.43, 40.8]];
