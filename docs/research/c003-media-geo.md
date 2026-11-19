# C003 "Phantom Borders" — licence-safe geometry + imagery

Research date **2026-11-18**. Every URL below was checked on **2026-11-18** (cited as `accessed 2026-11-18` in the tables/prose). Allowlist only: **public domain, CC0, CC BY (any version), OFL, MIT, BSD, Apache**. Reject: CC BY-SA, GPL, ODbL, NC, ND, unknown, noncommercial-only. Rendering/media generation stays in GitHub Actions; this file only records research and paste-ready entries.

**Headline verdicts (accessed 2026-11-18):**
- Modern admin-1: **Natural Earth 10m admin-1, public domain** — use for Germany/Poland/Romania/Ukraine and to derive the inner-German border.
- Finer regions: **geoBoundaries ROU ADM2 + USA ADM2 only** (CC BY 4.0 / public domain). **POL ADM2 is ODbL → reject**; **DEU ADM2 is `Data license Germany – Attribution – Version 2.0` → reject** under the strict allowlist.
- Historic border lines: **no licence-safe digital line dataset found**. Use hand-digitised waypoints from PD maps (Section A3).
- Imagery: 14 verified PD/CC0/CC BY items in Section B; modern CC BY-SA sources (Bundesarchiv, most Limes photos) are rejected.

---

## A. GEOMETRY

### A1. Admin-1 regions — Germany Länder, Poland voivodeships, Romania județe, Ukraine oblasts

The correct CDN host is **`naciscdn.org`**, not `naciscacdn.org` (the name in the brief); both the CDN ZIP and the pinned GitHub raw GeoJSON resolve (accessed 2026-11-18).

| Item | Format | Downloadable URL (accessed 2026-11-18) | Licence + proof (accessed 2026-11-18) | Verdict |
|---|---|---|---|---|
| Natural Earth 10m admin-1 states/provinces — CDN | ESRI shapefile ZIP | `https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip` | Public domain — https://www.naturalearthdata.com/about/terms-of-use/ | **USE** (primary) |
| Natural Earth 10m admin-1 — GitHub nvkelso, pinned tag v5.1.2 | GeoJSON (40,726,851 bytes) | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson` | Same Natural Earth public-domain terms: https://www.naturalearthdata.com/about/terms-of-use/; tag verified via https://api.github.com/repos/nvkelso/natural-earth-vector/tags | **USE** (direct `geo.rivers`-style URL for `fetch_media.py`) |
| NACIS GeoJSON mirror | GeoJSON | `https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.geojson` | HTTP 403 on fetch (accessed 2026-11-18) | **DO NOT USE** — use ZIP or GitHub raw |
| Theme page / disputed-boundary policy | documentation | https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/ · https://www.naturalearthdata.com/about/disputed-boundaries-policy/ | "Over 4,500 internal administrative divisions"; de facto boundaries; disputed areas shown (accessed 2026-11-18) | context/caveat |

Fields used for subsetting: `adm0_a3`, `iso_3166_2`, `name`, `type_en` (schema: https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/layers, accessed 2026-11-18). All four codes `DEU`, `POL`, `ROU`, `UKR` are present (distinct-value query: https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=adm0_a3%20IN%20(%27DEU%27%2C%27POL%27%2C%27ROU%27%2C%27UKR%27)&returnDistinctValues=true&outFields=adm0_a3&returnGeometry=false&f=pjson, accessed 2026-11-18).

**Caveats (accessed 2026-11-18):** Crimea and Sevastopol are coded `adm0_a3=RUS` with `iso_3166_2=UA-43` / `UA-40` (query: https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=name%20IN%20(%27Crimea%27%2C%27Sevastopol%27)&outFields=adm0_a3%2Cname%2Ciso_3166_2%2Ctype%2Ctype_en&returnGeometry=false&f=pjson). Kyiv appears as `Kiev` (`UA-32`) and `Kiev City` (`UA-30`), not `Kyiv` (query: https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=adm0_a3%3D%27UKR%27&outFields=name%2Ciso_3166_2%2Ctype_en&returnGeometry=false&f=pjson, accessed 2026-11-18). Issue record: https://github.com/nvkelso/natural-earth-vector/issues/791. On screen say "administrative boundaries for context", never a legal-border claim.

**Subset — preferred in `assets/media.json`:** set `geo.admin1.url` to the GitHub raw GeoJSON and `geo.admin1.countries` to `["DEU","POL","ROU","UKR"]`; `tools/fetch_media.py` filters on `adm0_a3`, rounds coordinates, writes `public/geo/admin1.json`, and can derive shared-edge lines (format documented at `tools/fetch_media.py`, accessed 2026-11-18 in the working tree).

**Subset — one-off shell (run in CI, not locally):**
```bash
curl -L -o ne_10m_admin_1_states_provinces.zip https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip
unzip -o ne_10m_admin_1_states_provinces.zip -d ne_admin1
ogr2ogr -f GeoJSON -where "adm0_a3 IN ('DEU','POL','ROU','UKR')" \
  -select "adm1_code,iso_3166_2,iso_a2,name,adm0_a3,type,type_en" \
  c003_admin1.geojson ne_admin1/ne_10m_admin_1_states_provinces.shp
```
```bash
curl -L -o ne_10m_admin_1_states_provinces.geojson \
  https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson
jq -c '{type:"FeatureCollection",features:[.features[] | select(
  .properties.adm0_a3=="DEU" or .properties.adm0_a3=="POL" or
  .properties.adm0_a3=="ROU" or .properties.adm0_a3=="UKR")]}' \
  ne_10m_admin_1_states_provinces.geojson > c003_admin1.geojson
```

### A2. Finer regions — geoBoundaries ADM2 and US Census counties

**Read the metadata, not the marketing.** The geoBoundaries API does not expose a literal `license` key; the fields are `boundaryLicense`, `licenseDetail`, `licenseSource` (all four metadata endpoints accessed 2026-11-18).

| Layer requested | Exact `boundaryLicense` in API metadata | Direct GeoJSON (`gjDownloadURL`, accessed 2026-11-18) | Licence proof | Verdict |
|---|---|---|---|---|
| Poland ADM2 (powiaty), 380 units | `Open Data Commons Open Database License 1.0` | `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/POL/ADM2/geoBoundaries-POL-ADM2.geojson` | https://www.geoboundaries.org/api/current/gbOpen/POL/ADM2/ | **REJECT — ODbL** |
| Germany ADM2, 38 "Government District" units (not Kreise) | `Data license Germany - Attribution - Version 2.0` | `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/DEU/ADM2/geoBoundaries-DEU-ADM2.geojson` | https://www.geoboundaries.org/api/current/gbOpen/DEU/ADM2/ | **REJECT — outside allowlist** |
| Romania ADM2, 3,235 municipalities (not județe) | `Creative Commons Attribution 4.0 International (CC BY 4.0)` | `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/ROU/ADM2/geoBoundaries-ROU-ADM2.geojson` | https://www.geoboundaries.org/api/current/gbOpen/ROU/ADM2/ | **ALLOW with credit** |
| Romania ADM1, 42 județe/municipalities | CC BY 4.0 | `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/ROU/ADM1/geoBoundaries-ROU-ADM1.geojson` | https://www.geoboundaries.org/api/current/gbOpen/ROU/ADM1/ | **ALLOW with credit** — use this for județe |
| USA ADM2, 3,233 counties | `Public Domain` | `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/USA/ADM2/geoBoundaries-USA-ADM2.geojson` | https://www.geoboundaries.org/api/current/gbOpen/USA/ADM2/ | **ALLOW** |
| `gbAuthoritative` (any country) | noncommercial-only per official docs | — | https://www.geoboundaries.org/api.html ("cannot be used for commerical purposes") | **REJECT** |

Verbatim metadata relied on (accessed 2026-11-18): POL — `"boundaryLicense": "Open Data Commons Open Database License 1.0"`, `"licenseSource": "www.openstreetmap.org/copyright"`; DEU — `"boundaryLicense": "Data license Germany - Attribution - Version 2.0"`, `"boundaryCanonical": "Government District"`; ROU — `"boundaryLicense": "Creative Commons Attribution 4.0 International (CC BY 4.0)"`, `"licenseSource": "data.gov.ro/pages/licence"`; USA — `"boundaryLicense": "Public Domain"`, `"boundaryCanonical": "Counties"`. Simplified GeoJSON endpoints (e.g. `geoBoundaries-ROU-ADM2_simplified.geojson`, `geoBoundaries-USA-ADM2_simplified.geojson`) resolve and are smaller; they inherit the same licence (accessed 2026-11-18).

**No licence-safe powiat/Kreis layer was verified.** Do not relabel DEU ADM2 as Kreise (38 government districts) or ROU ADM2 as județe (3,235 municipalities). If a shot needs a finer German/Polish mosaic, animate the allowed Natural Earth admin-1 and label it as such.

**US Census cartographic counties (public domain, safer for the Black Belt):**

| Item | URL (accessed 2026-11-18) | Licence + proof | Format / verdict |
|---|---|---|---|
| 2025 county cartographic boundary ZIP | `https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip` | Public domain (US federal work): https://www2.census.gov/foia/ds_policies/ds027.pdf — "Data/works created by Census Bureau employees generally are not subject to copyright protection within the United States" (accessed 2026-11-18) | Shapefile ZIP; **USE** |
| 2024 / 2023 alternatives | `https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip` · `https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip` | Same DS027 proof | Shapefile ZIP; alternatives |
| Product page / naming caveat | https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html · https://www.census.gov/programs-surveys/geography/technical-documentation/naming-convention/cartographic-boundary-file.html | Simplified MAF/TIGER for small-scale thematic mapping; **not** for area/perimeter, geocoding or precise relationships (accessed 2026-11-18) | docs |
| GENZ2025 directory listing | https://www2.census.gov/geo/tiger/GENZ2025/shp/ | `cb_2025_us_county_500k.zip`, last modified 2026-04-23 09:45, 11M (accessed 2026-11-18) | index |
| Dallas County = Selma-area county proxy | https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/5/query?where=STATE%3D%2701%27%20AND%20NAME%3D%27Dallas%20County%27&outFields=STATE%2CCOUNTY%2CNAME%2CBASENAME&returnGeometry=false&f=pjson | `STATE=01`, `COUNTY=047`, `NAME=Dallas County` (accessed 2026-11-18) | proxy, **not** a Selma city boundary |

```bash
curl -L -o cb_2025_us_county_500k.zip https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip
unzip -o cb_2025_us_county_500k.zip -d cb_2025_us_county_500k
ogr2ogr -f GeoJSON -where "STATEFP = '01'" -select "STATEFP,COUNTYFP,GEOID,NAME" \
  alabama_counties.geojson cb_2025_us_county_500k/cb_2025_us_county_500k.shp
ogr2ogr -f GeoJSON -where "STATEFP = '01' AND COUNTYFP = '047'" \
  -select "STATEFP,COUNTYFP,GEOID,NAME" dallas_county_selma_area.geojson \
  cb_2025_us_county_500k/cb_2025_us_county_500k.shp
```

### A3. Historic border lines — NO licence-safe digital dataset; use PD-map waypoints

| Dataset checked | Licence (verified 2026-11-18) | Proof URL | Download URL | Verdict |
|---|---|---|---|---|
| MPIDR Population History GIS Collection (incl. Austro-Hungarian Empire 1910, German Empire 1871–1945, Poland 1770–1978) | Custom: "freely used for **non-commercial scientific purposes**", registration + citation required | https://mosaic.ipums.org/historical-gis-datafiles | https://mosaic.ipums.org/downloads/supplementals/mosaic_gis_austro-hungarian_empire_1910.zip (listed 2026-11-18; direct fetch 403) | **REJECT** — noncommercial |
| DARE — Digital Atlas of the Roman Empire | Conflict: code repo Apache-2.0, site/data CC BY-SA 3.0/4.0; API dump has no `Limes`/Raetian line | https://raw.githubusercontent.com/johaahlf/dare/master/LICENSE · https://open-epihub.cnr.it/resources/135 | https://imperium.ahlfeldt.se/api/geojson.php | **REJECT** — CC BY-SA conflict |
| Pleiades | CC BY 3.0 (allowed) but gazetteer points, not continuous border lines | https://pleiades.stoa.org/downloads | https://atlantides.org/downloads/pleiades/json/ · https://github.com/isawnyu/pleiades.datasets/releases | **LIMITED** — no line layer |
| AWMC geodata | ODbL-1.0 | https://raw.githubusercontent.com/AWMC/geodata/master/LICENSE.txt | https://github.com/AWMC/geodata | **REJECT — ODbL** |
| OpenStreetMap / OSM-derived historical boundaries | ODbL | https://www.openstreetmap.org/copyright | — | **REJECT — ODbL** |
| Histogis "Europe Stateborders 1914" | Mixed/unclear; source list includes © OpenStreetMap contributors | https://histogis.acdh.oeaw.ac.at/shapes/source/detail/160 | — | **REJECT** |
| Euratlas historical GIS | Proprietary, non-exclusive/non-transferable | https://www.euratlas.net/shop/licences/licence_gis_ext_gb.pdf | — | **REJECT** |
| Natural Earth | Public domain, but **no historical border layers** | https://www.naturalearthdata.com/about/terms-of-use/ | — | usable only as modern base |

**Conclusion (accessed 2026-11-18): no licence-safe vector dataset for the 1914 imperial borders or the Limes line.** Hand-digitise the following approximate `[lon, lat]` arrays from public-domain scans; verify visually against the scan before animating, label as "approximate reconstruction", and do not use as a legal or scholarly boundary source.

**Source maps (all accessed 2026-11-18):**
- 1914 German–Russian / Austro-Russian borders: LoC map, rights statement "free to use and reuse" — https://www.loc.gov/resource/gdcwdl.wdl_18964?r=0.255; Commons PD map (Richard Andree, *Times Atlas*, 1895, red 1914 / blue 1920 borders added) — https://commons.wikimedia.org/wiki/File:Austria-Hungary_(ethnic_1890,_with_red_1914_and_blue_1920_borders).jpg (Commons API `LicenseShortName: Public domain`, artist Richard Andree, accessed 2026-11-18); Commons PD Carl Flemming war map No. 7, "Austrian-Russian borderland", 1914 — https://commons.wikimedia.org/wiki/File:07-Das_%C3%96sterreich-Russische_Grenzgebiet_(1914).png (Commons API `LicenseShortName: Public domain`, accessed 2026-11-18).
- Tripoint anchor: Three Emperors' Corner, 50.2297°N 19.1575°E, near Mysłowice/Sosnowiec/Jaworzno, 1871–1918 — https://en.wikipedia.org/wiki/Three_Emperors%27_Corner (accessed 2026-11-18). The arrays below end/start at `[19.16, 50.23]`.
- Limes: Commons PD scan, A. von Cohausen, *Der Römische Grenzwall in Deutschland 2* (1884), `LicenseShortName: Public domain` — https://commons.wikimedia.org/wiki/File:Der_R%C3%B6mische_Grenzwall_in_Deutschland_2_(1884)_-_001.jpg (accessed 2026-11-18); ORL section Rheinbrohl → Kastell Eining ≈ 550 km — https://commons.wikimedia.org/wiki/Category:Upper_German_-_Raetian_Limes (accessed 2026-11-18).

German–Russian border c.1914, north → south (29 waypoints, approximate):
```json
[[21.06,55.92],[21.20,55.70],[21.35,55.45],[21.60,55.20],[21.95,54.95],[22.30,54.75],[22.65,54.55],[22.90,54.42],[22.55,54.25],[22.20,54.08],[21.85,53.90],[21.55,53.70],[21.20,53.55],[20.85,53.42],[20.20,53.22],[19.95,52.95],[19.70,52.70],[19.45,52.50],[19.25,52.30],[19.10,52.10],[19.00,51.85],[18.90,51.60],[18.95,51.35],[19.05,51.10],[19.10,50.90],[19.00,50.70],[19.05,50.50],[19.10,50.35],[19.16,50.23]]
```

Austro-Russian / Habsburg–Romanian edge c.1914, west → south (37 waypoints, approximate):
```json
[[19.16,50.23],[19.50,50.20],[19.90,50.30],[20.30,50.35],[20.70,50.30],[21.10,50.25],[21.50,50.15],[21.95,50.10],[22.40,50.05],[22.85,50.00],[23.30,50.10],[23.80,50.25],[24.30,50.25],[24.80,50.20],[25.30,50.15],[25.75,50.05],[26.15,49.90],[26.45,49.60],[26.55,49.30],[26.50,49.00],[26.40,48.75],[26.25,48.50],[25.95,48.30],[25.40,48.15],[24.90,47.95],[24.50,47.75],[24.20,47.55],[23.90,47.30],[23.60,47.05],[23.35,46.80],[23.10,46.55],[22.85,46.30],[22.65,46.05],[22.50,45.80],[22.45,45.55],[22.40,45.30],[22.35,45.00],[22.40,44.75]]
```

Upper Germanic–Raetian Limes, Rheinbrohl → Danube/Eining (36 waypoints, approximate):
```json
[[7.32,50.42],[7.36,50.47],[7.32,50.52],[7.50,50.48],[7.65,50.42],[7.80,50.44],[7.95,50.50],[8.08,50.60],[8.22,50.51],[8.35,50.44],[8.50,50.35],[8.60,50.29],[8.58,50.22],[8.78,50.20],[8.95,50.14],[9.10,50.10],[9.25,49.95],[9.43,49.80],[9.55,49.65],[9.48,49.50],[9.42,49.43],[9.52,49.30],[9.65,49.15],[9.70,48.95],[9.70,48.79],[9.85,48.82],[10.00,48.85],[10.09,48.84],[10.30,48.88],[10.55,48.92],[10.80,48.95],[11.05,48.96],[11.30,48.96],[11.55,48.95],[11.65,48.89],[11.58,48.93]]
```

These waypoints are **not** `assets/media.json` entries (`geo.extra` only copies byte-for-byte downloads from URLs). Paste them into an episode-local file, e.g. `brands/money-maps/episodes/003-phantom-borders/borders.json`, and read them from the scene code.

**Former inner German border — derived from the same public-domain admin-1 layer (accessed 2026-11-18):**
- West/FRG side: Schleswig-Holstein `DE-SH`, Niedersachsen `DE-NI`, Hessen `DE-HE`, Rheinland-Pfalz `DE-RP`, Baden-Württemberg `DE-BW`, Bayern `DE-BY`.
- East/GDR side: Mecklenburg-Vorpommern `DE-MV`, Brandenburg `DE-BB`, Sachsen-Anhalt `DE-ST`, Thüringen `DE-TH`, Sachsen `DE-SN`.
- Berlin `DE-BE` is a separate enclave inside Brandenburg: the Wall is **not** the inner-German border and should be shown separately (https://en.wikipedia.org/wiki/Inner_German_border; state list https://www.bundesrat.de/DE/bundesrat/laender/laender-node.html, accessed 2026-11-18).
- State codes verified from the Natural Earth layer query: https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=adm0_a3%3D%27DEU%27&outFields=name%2Ciso_3166_2%2Ctype_en&returnGeometry=false&f=pjson (accessed 2026-11-18).
- `tools/fetch_media.py` already extracts exact shared edges between two sets of `iso_3166_2` ids and writes `public/geo/lines.json`; use the `admin1.borders` JSON in Section C. The match is coordinate-exact after rounding to 3 decimals, so inspect the output chain count — if the source vertices do not match, fall back to a hand-digitised line.

---

## B. PHOTOS / ART (14 verified items)

Every licence below was read from Commons `extmetadata` (`LicenseShortName`, `UsageTerms`, `Artist`) or the file page on **2026-11-18**; the proof URL is the file page. Real photos/maps preferred; drawings excluded unless noted.

| # | Commons file name | Proof URL (accessed 2026-11-18) | Licence | Author | Type | Why it fits |
|---|---|---|---|---|---|---|
| 1 | `Berlin at Night.jpg` | https://commons.wikimedia.org/wiki/File:Berlin_at_Night.jpg | Public domain (PD NASA/ESA) | NASA/ESA (ISS photo by Chris Hadfield, NightPod) | Photo | ISS night view of Berlin — modern "border from orbit" hook. **Caveat:** 620×387 px and dated 2014; it does **not** prove the 1961–1989 east/west lamp-colour contrast — narrate the lamp-colour claim only with a dated source, or drop it. |
| 2 | `Checkpoint Charlie 1977.jpg` | https://commons.wikimedia.org/wiki/File:Checkpoint_Charlie_1977.jpg | Public domain (US Government) | HELGA T.H. MELLMANN | Photo | Checkpoint Charlie as the foreigner crossing point, 1 May 1977; 3000×2400. |
| 3 | `Checkpoint Charlie in 1982.JPEG` | https://commons.wikimedia.org/wiki/File:Checkpoint_Charlie_in_1982.JPEG | Public domain (US Government) | Thomas Farr | Photo | US security policemen salute a West German diplomatic vehicle entering West Berlin, 19 Aug 1982; GDR flag and border post. |
| 4 | `DDR steel watch tower cropped.jpg` | https://commons.wikimedia.org/wiki/File:DDR_steel_watch_tower_cropped.jpg | Public domain (US Army) | SPC5 Vincent Kitts | Photo | East German guards in a steel watchtower on the East/West German border, 15 Aug 1984 — the physical border. |
| 5 | `0594 1989 Berlin Mauer (28 dec) (14121954819).jpg` | https://commons.wikimedia.org/wiki/File:0594_1989_Berlin_Mauer_(28_dec)_(14121954819).jpg | CC BY 2.0 | Aad van der Drift | Photo | BT-9 watchtower at the Berlin Wall, 28 Dec 1989; high-res (4466×6804). Credit required. |
| 6 | `Map of the partition of the Kingdom of Poland and the Grand Duchy of Lithuania from 1799.jpg` | https://commons.wikimedia.org/wiki/File:Map_of_the_partition_of_the_Kingdom_of_Poland_and_the_Grand_Duchy_of_Lithuania_from_1799.jpg | Public domain | William Faden (1749–1836) | Map | 2 Apr 1799 partition map: Prussia yellow, Austria green, Russia beige; includes Galicia. 6330×5677. |
| 7 | `07-Das Österreich-Russische Grenzgebiet (1914).png` | https://commons.wikimedia.org/wiki/File:07-Das_%C3%96sterreich-Russische_Grenzgebiet_(1914).png | Public domain | Unknown author (Carl Flemming, Berlin/Glogau 1914) | Map | "Austrian-Russian borderland", war map No. 7 — visual source for the Galicia/Bukovina frontier. 12285×9917 (large fetch; use in CI). |
| 8 | `Austria-Hungary (ethnic 1890, with red 1914 and blue 1920 borders).jpg` | https://commons.wikimedia.org/wiki/File:Austria-Hungary_(ethnic_1890,_with_red_1914_and_blue_1920_borders).jpg | Public domain | Richard Andree (1835–1912); 1895 base with later borders added | Map | Habsburg ethnic map with 1914/1920 borders overlaid — clear "phantom border" visual (5150×3395). Use as map, not as a photo. |
| 9 | `Roemturmmainhard5.jpg` | https://commons.wikimedia.org/wiki/File:Roemturmmainhard5.jpg | CC BY 3.0 | Matthias Süßen | Photo | Reconstructed Limes watchtower at Mainhardt (Wp 9/64), 19 Sep 2010; Commons description says *falsch rekonstruiert* — label "modern reconstruction", not authentic. Credit required. |
| 10 | `Irrigation in Cotton Field - 51488231980.jpg` | https://commons.wikimedia.org/wiki/File:Irrigation_in_Cotton_Field_-_51488231980.jpg | CC0 1.0 | Alabama Extension; photo by Katie Wendland Nichols | Photo | Centre-pivot irrigation in flowering cotton, Alabama, 30 Jul 2016 — modern Black Belt agriculture. Credit optional, CC0. |
| 11 | `Black cotton farming family.jpg` | https://commons.wikimedia.org/wiki/File:Black_cotton_farming_family.jpg | Public domain (US) | Unknown author | Photo | "Black cotton farmers in the US", c. 1890s — period Black Belt labour visual (822×630). |
| 12 | `Mississippi Embayment Top Cretaceous Contour Map.png` | https://commons.wikimedia.org/wiki/File:Mississippi_Embayment_Top_Cretaceous_Contour_Map.png | Public domain (USGS) | E. M. Gushing, E. H. Boswell, R. L. Hosman | Map | 1964 USGS contour map of the top of the Cretaceous in the Mississippi Embayment — buried coastal-plain geology beneath Alabama. |
| 13 | `Map showing the distribution of the Cretaceous formation in North America – Geology (1907) (14589719039).jpg` | https://commons.wikimedia.org/wiki/File:Map_showing_the_distribution_of_the_Cretaceous_formation_in_North_America_%E2%80%93_Geology_(1907)_(14589719039).jpg | Public domain ("no known copyright restrictions", 1907) | Thomas C. Chamberlin; Rollin D. Salisbury | Map | 1907 textbook map of the Cretaceous outcrop belt including the Gulf/Atlantic coastal plain — period-science map. |
| 14 | `Image of Europe at night, a composite assembled from data acquired by the Suomi NPP satellite in April and October 2012.jpg` | https://commons.wikimedia.org/wiki/File:Image_of_Europe_at_night,_a_composite_assembled_from_data_acquired_by_the_Suomi_NPP_satellite_in_April_and_October_2012.jpg | Public domain (NASA) | NASA Goddard Space Flight Center | Satellite image | NASA Black Marble, Europe already framed (1079×830); crop `[80,60,1000,700]`, `gamma: 1.9` per `tools/fetch_media.py` crop/gamma handling. |

**Optional verified alternative (accessed 2026-11-18):** `ISS-66 City lights of Northern Europe.jpg` — public domain (NASA), 5568×3712, Berlin visible among city lights — https://commons.wikimedia.org/wiki/File:ISS-66_City_lights_of_Northern_Europe.jpg. Use instead of #1 when resolution matters; it is a wide regional night shot, not a Berlin close-up. Also `Black Marble - City Lights 2012 (8246892319).jpg` (PD NASA, global 1920×1080, approximate Europe crop `[980,280,1220,500]`) — https://commons.wikimedia.org/wiki/File:Black_Marble_-_City_Lights_2012_(8246892319).jpg.

**Rejected on licence (accessed 2026-11-18):**
- Bundesarchiv Berlin Wall/Wall-building photos (e.g. `Bundesarchiv Bild 183-88574-0003, Berlin, Mauerbau, Friedrichstraße, Panzersperre.jpg`) — CC BY-SA 3.0 DE → reject.
- ESA "Berlin at night" (Kuipers 2012) and "Berlin at night in 2022" (Cristoforetti/Maurer) — ESA Standard Licence / CC BY-NC-SA 2.0 → reject.
- Modern partition maps (`Partitions of Poland.png`, `Rzeczpospolita Rozbiory 3.png`) — GFDL / CC BY-SA → reject.
- Limes photos `Roman.Watchtower.WP-4-49.Grueningen.01.JPG`, `Limesturm in Erkertshofen.jpg`, `RomanTowerSayn.jpg` — CC BY-SA → reject.
- `Western-seaway.pdf`, `Reconstruction of Hadrian's wall – geograph.org.uk` — CC BY-SA → reject.

**Gaps (accessed 2026-11-18):** no licence-safe high-resolution ISS **Berlin close-up** showing historical lamp colours was found; no verified PD Alabama **chalk-soil close-up** or Alabama-specific **Cretaceous coastline** map (items 12–13 are the closest PD geology maps); no Transylvania-specific pre-1929 PD map (items 7–8 cover Galicia/Bukovina and the Habsburg border generally). All crops above are approximate pixel coordinates on the stated source sizes — verify visually before render.

---

## C. READY-TO-PASTE JSON ENTRIES FOR `assets/media.json`

These are fragments for a **new C003 media manifest** (not a patch to the current C001 manifest). `tools/fetch_media.py` prints `PIN <name> <sha>` on first fetch; add those values to `sha256` afterwards (accessed 2026-11-18). Do not add `"src"` sharing between different crops unless intended.

### C1. `art` array entries (14)

```json
[
 {
  "id": "berlin-iss-night",
  "source": "commons",
  "file": "Berlin at Night.jpg",
  "licence": "Public domain (NASA/ESA)",
  "credit": "NASA/ESA, Photo of Berlin at night from the ISS with the NightPod camera by Chris Hadfield, 2014 (public domain)"
 },
 {
  "id": "checkpoint-charlie-1977",
  "source": "commons",
  "file": "Checkpoint Charlie 1977.jpg",
  "licence": "Public domain (US Government)",
  "credit": "HELGA T.H. MELLMANN, Checkpoint Charlie, crossing point for foreigners visiting East Berlin, 1 May 1977 (public domain)"
 },
 {
  "id": "checkpoint-charlie-1982",
  "source": "commons",
  "file": "Checkpoint Charlie in 1982.JPEG",
  "licence": "Public domain (US Government)",
  "credit": "Thomas Farr, US security policemen salute a West German diplomatic vehicle entering West Berlin via Checkpoint Charlie, 19 Aug 1982 (public domain)"
 },
 {
  "id": "ddr-border-tower",
  "source": "commons",
  "file": "DDR steel watch tower cropped.jpg",
  "licence": "Public domain (US Army)",
  "credit": "SPC5 Vincent Kitts, East German border guards man a steel guard tower on the East-West German border, 15 Aug 1984 (public domain)"
 },
 {
  "id": "berlin-wall-watchtower-1989",
  "source": "commons",
  "file": "0594 1989 Berlin Mauer (28 dec) (14121954819).jpg",
  "licence": "CC BY 2.0",
  "credit": "Aad van der Drift, Watchtower at the Berlin Wall, 28 Dec 1989 (CC BY 2.0)"
 },
 {
  "id": "faden-partition-map-1799",
  "source": "commons",
  "file": "Map of the partition of the Kingdom of Poland and the Grand Duchy of Lithuania from 1799.jpg",
  "licence": "Public domain",
  "credit": "William Faden, A map of the Kingdom of Poland and the Grand Duchy of Lithuania divided according to their dismemberments, 2 Apr 1799 (public domain)"
 },
 {
  "id": "austrian-russian-border-1914",
  "source": "commons",
  "file": "07-Das Österreich-Russische Grenzgebiet (1914).png",
  "licence": "Public domain",
  "credit": "Unknown author, Austrian-Russian borderland, Carl Flemming war map No. 7, Berlin and Glogau, 1914 (public domain)"
 },
 {
  "id": "habsburg-ethnic-map-1914-borders",
  "source": "commons",
  "file": "Austria-Hungary (ethnic 1890, with red 1914 and blue 1920 borders).jpg",
  "licence": "Public domain",
  "credit": "Richard Andree, Austria-Hungary ethnic map 1890 with 1914 (red) and 1920 (blue) borders added, Times Atlas, 1895 (public domain)"
 },
 {
  "id": "limes-watchtower-mainhardt",
  "source": "commons",
  "file": "Roemturmmainhard5.jpg",
  "licence": "CC BY 3.0",
  "credit": "Matthias Süßen, Reconstructed Roman Limes watchtower at Mainhardt (Wp 9/64), 19 Sep 2010 — modern reconstruction, not authentic (CC BY 3.0)"
 },
 {
  "id": "alabama-cotton-irrigation",
  "source": "commons",
  "file": "Irrigation in Cotton Field - 51488231980.jpg",
  "licence": "CC0 1.0",
  "credit": "Alabama Extension, photo by Katie Wendland Nichols, centre-pivot irrigation in a cotton field at bloom, Alabama, 30 Jul 2016 (CC0 1.0)"
 },
 {
  "id": "black-cotton-farmers-1890s",
  "source": "commons",
  "file": "Black cotton farming family.jpg",
  "licence": "Public domain",
  "credit": "Unknown author, Black cotton farmers in the US, circa 1890s (public domain)"
 },
 {
  "id": "mississippi-embayment-cretaceous-map",
  "source": "commons",
  "file": "Mississippi Embayment Top Cretaceous Contour Map.png",
  "licence": "Public domain (USGS)",
  "credit": "E. M. Gushing, E. H. Boswell and R. L. Hosman, Top of the Cretaceous in the Mississippi Embayment, USGS Professional Paper 448-B, 1964 (public domain)"
 },
 {
  "id": "cretaceous-distribution-1907",
  "source": "commons",
  "file": "Map showing the distribution of the Cretaceous formation in North America – Geology (1907) (14589719039).jpg",
  "licence": "Public domain (no known copyright restrictions, 1907)",
  "credit": "Thomas C. Chamberlin and Rollin D. Salisbury, Map showing the distribution of the Cretaceous formation in North America, Geology, 1907 (public domain)"
 },
 {
  "id": "europe-at-night-2012",
  "source": "commons",
  "file": "Image of Europe at night, a composite assembled from data acquired by the Suomi NPP satellite in April and October 2012.jpg",
  "licence": "Public domain (NASA)",
  "credit": "NASA Goddard Space Flight Center, Europe and the Middle East at night, Suomi NPP VIIRS, 2012 (public domain)",
  "crop": [80, 60, 1000, 700],
  "gamma": 1.9,
  "max": 2000
 }
]
```

Optional swap/addition (verified 2026-11-18): `{"id":"iss-66-northern-europe","source":"commons","file":"ISS-66 City lights of Northern Europe.jpg","licence":"Public domain (NASA)","credit":"NASA, ISS-66 city lights of Northern Europe, 2021 (public domain)","gamma":1.9,"max":2000}`.

### C2. `geo` fragment — admin-1, derived inner-German border, extra county layer

```json
{
  "bbox": [4, 44, 41, 57],
  "rivers": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson",
  "relief": [
    "https://naciscdn.org/naturalearth/50m/raster/GRAY_50M_SR.zip",
    "https://naciscdn.org/naturalearth/50m/raster/GRAY_50M_SR_W.zip"
  ],
  "admin1": {
    "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson",
    "countries": ["DEU", "POL", "ROU", "UKR"],
    "round": 3,
    "borders": [
      {
        "name": "inner_german_border",
        "a": ["DE-SH", "DE-NI", "DE-HE", "DE-RP", "DE-BW", "DE-BY"],
        "b": ["DE-MV", "DE-BB", "DE-ST", "DE-TH", "DE-SN"]
      }
    ]
  },
  "extra": [
    {
      "name": "alabama_counties.geojson",
      "url": "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/USA/ADM2/geoBoundaries-USA-ADM2_simplified.geojson"
    }
  ],
  "licence": "Natural Earth public domain; US Census public domain; geoBoundaries USA ADM2 public domain",
  "credit": "Admin-1 and rivers: Natural Earth (public domain); relief: Natural Earth (public domain); US counties: geoBoundaries / U.S. Census Bureau (public domain)"
}
```

Notes (accessed 2026-11-18): the single `bbox` drives the rivers/relief crop, so `[4,44,41,57]` covers Germany–Poland–Romania–Ukraine and the Limes but **not Alabama**; for an Alabama relief pass use a second manifest/release with a US bbox rather than one continent-wide crop. To use the smaller US Census county layer instead of geoBoundaries, precompute `alabama_counties.geojson` in CI from the Census ZIP in Section A2 and point `extra[0].name` at it (no URL needed if you add it to the manifest differently — keep `extra` URL-only as implemented). Add `{"boundaryLicense":"CC BY 4.0"}` credit on screen if the ROU ADM1/ADM2 layer is ever added: "geoBoundaries (CC BY 4.0)".

### C3. `docs/LICENSES.md` rows

Map-data rows are already recorded in `docs/LICENSES.md` (accessed 2026-11-18). When the art entries above are adopted into a shipped episode, add one row per asset with author, licence, proof URL and credit from Section B before use.

---

## D. On-screen source note (short, honest)

"Modern borders: Natural Earth (public domain) and U.S. Census Bureau (public domain). Historical lines: approximate hand-digitised reconstruction from public-domain 1895/1914 maps; not a legal boundary. Photos/maps: NASA, US Army/US Government, William Faden, Carl Flemming, Alabama Extension (CC0), Aad van der Drift (CC BY 2.0), Matthias Süßen (CC BY 3.0) — full credits in the description." (All source URLs and dates in Sections A–B, accessed 2026-11-18.)
