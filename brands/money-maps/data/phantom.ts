import type {LonLat} from '../../../packages/engine/src/map/map';

// Money & Maps 003 — vanished borders as approximate polylines (our own waypoints, ~10–15 km accuracy).
// Waypoints follow documented border towns of 1815–1914 (Kalisz/Skalmierzyce, Słupca/Strzałkowo, Aleksandrów/Toruń,
// Mława/Soldau, Prostki, Eydtkuhnen/Wirballen, Brody/Radziwiłłów, Zbruch river, Suceava/Burdujeni, Predeal, Orșova)
// and the Upper Germanic–Raetian Limes forts (Rheinbrohl … Eining). Checked against public-domain maps
// (Andree 1895 with 1914 borders; Flemming 1914 war map no. 7; von Cohausen 1884). On screen: "approximate".
// No licence-safe digital dataset exists (docs/research/c003-media-geo.md §A3).

/** Germany–Russia, 1815–1918 (Prussian partition | Russian partition), Baltic → Three Emperors' Corner. */
export const DE_RU_1914: LonLat[] = [
  [21.06, 55.87], [21.45, 55.72], [21.9, 55.5], [22.15, 55.27], [22.6, 55.08], [22.75, 54.85], [22.74, 54.63], [22.75, 54.42],
  [22.65, 54.22], [22.55, 54.0], [22.45, 53.78], [22.43, 53.68], [22.2, 53.52], [21.9, 53.45], [21.4, 53.42], [20.9, 53.3],
  [20.45, 53.2], [20.1, 53.22], [19.75, 53.25], [19.35, 53.17], [19.05, 53.1], [18.78, 52.93], [18.55, 52.72], [18.25, 52.5],
  [17.86, 52.3], [17.92, 52.05], [18.03, 51.75], [18.12, 51.48], [18.15, 51.26], [18.42, 51.04], [18.7, 50.86], [18.88, 50.75],
  [19.0, 50.55], [19.08, 50.38], [19.16, 50.23],
];

/** Austria(-Hungary)–Russia, Three Emperors' Corner → Vistula → Galicia's north edge → Zbruch → Bukovina. */
export const AT_RU_1914: LonLat[] = [
  [19.16, 50.23], [19.45, 50.16], [19.8, 50.17], [20.15, 50.15], [20.45, 50.2], [20.75, 50.24], [21.05, 50.33], [21.35, 50.47],
  [21.62, 50.62], [21.82, 50.71], [22.15, 50.6], [22.5, 50.45], [22.85, 50.32], [23.2, 50.35], [23.6, 50.4], [24.0, 50.43],
  [24.3, 50.55], [24.65, 50.42], [24.95, 50.22], [25.22, 50.1], [25.55, 49.95], [25.85, 49.78], [26.1, 49.55], [26.18, 49.2],
  [26.27, 48.85], [26.4, 48.55], [26.38, 48.3],
];

/** Austria-Hungary–Romania (Old Kingdom): Bukovina's edge, then the Carpathian crest passes, to the Iron Gates. */
export const AT_RO_1914: LonLat[] = [
  [26.38, 48.3], [26.45, 48.05], [26.3, 47.75], [26.27, 47.67], [25.95, 47.52], [25.55, 47.3], [25.6, 47.05], [25.95, 46.75],
  [26.05, 46.5], [26.45, 46.2], [26.35, 45.85], [26.05, 45.6], [25.6, 45.5], [25.25, 45.45], [24.85, 45.4], [24.3, 45.52],
  [23.75, 45.4], [23.3, 45.35], [22.85, 45.1], [22.4, 44.72],
];

/** Roman Upper Germanic–Raetian Limes, Rheinbrohl (Rhine) → Eining (Danube); the Main river formed part of it. */
export const LIMES: LonLat[] = [
  [7.33, 50.5], [7.71, 50.33], [7.95, 50.37], [8.1, 50.25], [8.35, 50.24], [8.57, 50.27], [8.67, 50.43], [8.8, 50.48],
  [8.88, 50.39], [8.98, 50.21], [9.0, 50.08], [9.12, 49.95], [9.26, 49.7], [9.37, 49.58], [9.43, 49.43], [9.47, 49.31],
  [9.5, 49.2], [9.56, 49.07], [9.63, 48.88], [9.69, 48.8], [9.8, 48.8], [10.09, 48.84], [10.3, 48.93], [10.48, 49.04],
  [10.75, 49.11], [10.97, 49.03], [11.2, 48.98], [11.39, 48.95], [11.6, 48.89], [11.78, 48.85],
];

/** Approximate inner edge of the Black Belt prairie (Late Cretaceous chalk outcrop), Mississippi → Alabama → Georgia. */
export const BLACK_BELT_ARC: LonLat[] = [
  [-88.75, 34.6], [-88.6, 34.0], [-88.4, 33.4], [-88.1, 32.95], [-87.6, 32.6], [-87.0, 32.35], [-86.4, 32.25], [-85.8, 32.15],
  [-85.2, 32.05],
];

/** Former GDR / FRG Länder (Natural Earth iso_3166_2); Berlin is shown separately. */
export const DE_EAST = ['DE-MV', 'DE-BB', 'DE-BE', 'DE-ST', 'DE-SN', 'DE-TH'];
export const DE_WEST = ['DE-SH', 'DE-HH', 'DE-NI', 'DE-HB', 'DE-NW', 'DE-HE', 'DE-RP', 'DE-SL', 'DE-BW', 'DE-BY'];
