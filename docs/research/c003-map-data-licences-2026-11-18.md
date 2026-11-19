# C003 map-data licence research — phantom borders

Access date for every URL below: **2026-11-18**. Allowlist: public domain, CC0, CC BY, OFL, MIT, BSD, Apache. Reject CC BY-SA, GPL, ODbL, NC, ND, unknown or noncommercial-only data.

## Decision

- **Four-country admin-1 animation (DEU/POL/ROU/UKR):** use Natural Earth `ne_10m_admin_1_states_provinces`; public domain, no attribution required. Treat borders as cartographic representation, not legal adjudication.
- **Alabama / Selma area:** use Census 2025 cartographic county boundaries; public domain for US federal work. Use Dallas County (`STATEFP='01'`, `COUNTYFP='047'`) as the Selma-area county proxy; this is not a Selma city boundary.
- **geoBoundaries:** use only ROU ADM2 (CC BY 4.0) and USA ADM2 (public domain). Reject POL ADM2 (ODbL 1.0), DEU ADM2 (Data license Germany – Attribution – Version 2.0, outside the strict allowlist), and all `gbAuthoritative` data (official docs say it cannot be used for commercial purposes).
- Do not show legal-border claims from Natural Earth: its policy is de facto boundaries and it explicitly displays disputed areas/boundaries.

## URL table

| Source / content | URL | Verdict | Licence / proof URL |
|---|---|---|---|
| Natural Earth terms | https://www.naturalearthdata.com/about/terms-of-use/ | USE | Public domain; proof is this URL. |
| Natural Earth 10m cultural index | https://www.naturalearthdata.com/downloads/10m-cultural-vectors/ | Reference | Admin-1 theme listed as v5.1.1; proof is this URL. |
| Natural Earth admin-1 theme page | https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/ | USE, with caveat | “Over 4,500 internal administrative divisions”; de facto boundaries by default; proof is this URL. |
| Natural Earth disputed-boundary policy | https://www.naturalearthdata.com/about/disputed-boundaries-policy/ | Caveat | Disputed areas/boundaries shown; proof is this URL. |
| Natural Earth Crimea/ISO issue | https://github.com/nvkelso/natural-earth-vector/issues/791 | Caveat | Issue “Consistency of ISO worldview (e.g. Crimea)”; proof is this URL. |
| Natural Earth shapefile ZIP | https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip | USE | Oversize fetch (`Response too large (exceeds 5MB limit)`) confirms it resolves; licence proof: https://www.naturalearthdata.com/about/terms-of-use/ |
| GitHub tags | https://api.github.com/repos/nvkelso/natural-earth-vector/tags | Reference | Current tag `v5.1.2`, sha `f1890d9f152c896d250a77557a5751a93d494776`; proof is this URL. |
| GitHub file metadata | https://api.github.com/repos/nvkelso/natural-earth-vector/contents/geojson/ne_10m_admin_1_states_provinces.geojson?ref=v5.1.2 | Reference | File size `40726851`; proof is this URL. |
| GitHub raw GeoJSON | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson | USE if GeoJSON needed | Same Natural Earth public-domain terms: https://www.naturalearthdata.com/about/terms-of-use/ |
| NACIS GeoJSON | https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.geojson | DO NOT USE | `StatusCode: non 2xx status code (403 GET ...)`; use ZIP or GitHub raw. |
| Natural Earth ArcGIS schema | https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/layers | Reference | Fields include `adm1_code`, `iso_3166_2`, `iso_a2`, `name`, `adm0_a3`, `type`, `type_en`; proof is this URL. |
| DEU/POL/ROU/UKR distinct query | https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=adm0_a3%20IN%20(%27DEU%27%2C%27POL%27%2C%27ROU%27%2C%27UKR%27)&returnDistinctValues=true&outFields=adm0_a3&returnGeometry=false&f=pjson | USE | Returned all four codes; proof is this URL. |
| Crimea/Sevastopol query | https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=name%20IN%20(%27Crimea%27%2C%27Sevastopol%27)&outFields=adm0_a3%2Cname%2Ciso_3166_2%2Ctype%2Ctype_en&returnGeometry=false&f=pjson | Caveat | `Crimea`: `adm0_a3=RUS`, `iso_3166_2=UA-43`; `Sevastopol`: `adm0_a3=RUS`, `iso_3166_2=UA-40`; proof is this URL. |
| Kyiv/Kiev query | https://services3.arcgis.com/HZiQ86FNEvCVDWWt/ArcGIS/rest/services/ne_10m_admin_1_states_provinces/FeatureServer/0/query?where=adm0_a3%3D%27UKR%27%20AND%20(name%20like%20%27%25Kyiv%25%27%20OR%20name%20like%20%27%25Kiev%25%27)&outFields=adm0_a3%2Cname%2Ciso_3166_2%2Ctype%2Ctype_en&returnGeometry=false&f=pjson | USE, with caveat | Layer has `Kiev` (`UA-32`) and `Kiev City` (`UA-30`); exact `Kyiv` query was empty; proof is this URL. |
| geoBoundaries homepage | https://www.geoboundaries.org/ | Reference | General “open license (CC BY 4.0)” statement; per-layer API metadata controls. |
| geoBoundaries API docs | https://www.geoboundaries.org/api.html | USE `gbOpen` only | `gbOpen`, `gbHumanitarian`, `gbAuthoritative`; `gbAuthoritative` “cannot be used for commerical purposes”; proof is this URL. |
| geoBoundaries data page | https://www.geoboundaries.org/data.html | BLOCKED | `StatusCode: non 2xx status code (404 GET https://www.geoboundaries.org/data.html)`. |
| POL ADM2 metadata | https://www.geoboundaries.org/api/current/gbOpen/POL/ADM2/ | REJECT | ODbL 1.0; proof is this URL. |
| DEU ADM2 metadata | https://www.geoboundaries.org/api/current/gbOpen/DEU/ADM2/ | REJECT | Data license Germany – Attribution – Version 2.0; proof is this URL. |
| ROU ADM2 metadata | https://www.geoboundaries.org/api/current/gbOpen/ROU/ADM2/ | USE + credit | CC BY 4.0; proof is this URL. |
| USA ADM2 metadata | https://www.geoboundaries.org/api/current/gbOpen/USA/ADM2/ | USE | Public Domain; proof is this URL. |
| ROU ADM1 metadata | https://www.geoboundaries.org/api/current/gbOpen/ROU/ADM1/ | USE + credit | Counties (judete), CC BY 4.0, 42 units; proof is this URL. |
| DEU ADM1 metadata | https://www.geoboundaries.org/api/current/gbOpen/DEU/ADM1/ | REJECT | Länder, Data license Germany – Attribution – Version 2.0; proof is this URL. |
| POL ADM1 metadata | https://www.geoboundaries.org/api/current/gbOpen/POL/ADM1/ | REJECT | ODbL 1.0, 16 units; proof is this URL. |
| POL ADM2 simplified GeoJSON | https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/POL/ADM2/geoBoundaries-POL-ADM2_simplified.geojson | REJECT | Licence proof: https://www.geoboundaries.org/api/current/gbOpen/POL/ADM2/ |
| DEU ADM2 simplified GeoJSON | https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/DEU/ADM2/geoBoundaries-DEU-ADM2_simplified.geojson | REJECT | Licence proof: https://www.geoboundaries.org/api/current/gbOpen/DEU/ADM2/ |
| ROU ADM2 simplified GeoJSON | https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/ROU/ADM2/geoBoundaries-ROU-ADM2_simplified.geojson | USE + credit | Oversize fetch (`Response too large (exceeds 5MB limit)`) confirms it resolves; licence proof: https://www.geoboundaries.org/api/current/gbOpen/ROU/ADM2/ |
| USA ADM2 simplified GeoJSON | https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/USA/ADM2/geoBoundaries-USA-ADM2_simplified.geojson | USE | Oversize fetch (`Response too large (exceeds 5MB limit)`) confirms it resolves; licence proof: https://www.geoboundaries.org/api/current/gbOpen/USA/ADM2/ |
| `gbAuthoritative` POL/DEU/ROU/USA ADM2 | https://www.geoboundaries.org/api/current/gbAuthoritative/POL/ADM2/ · https://www.geoboundaries.org/api/current/gbAuthoritative/DEU/ADM2/ · https://www.geoboundaries.org/api/current/gbAuthoritative/ROU/ADM2/ · https://www.geoboundaries.org/api/current/gbAuthoritative/USA/ADM2/ | REJECT | All four returned `StatusCode: non 2xx status code (404 GET ...)`; official docs prohibit commercial use: https://www.geoboundaries.org/api.html |
| Census cartographic boundaries | https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html | USE | Simplified MAF/TIGER boundaries for small-scale thematic mapping; proof is this URL. |
| Census CB description | https://www.census.gov/programs-surveys/geography/technical-documentation/naming-convention/cartographic-boundary-file.html | Caveat | Not for area/perimeter calculation, geocoding or precise relationships; proof is this URL. |
| Census product guide | https://www.census.gov/programs-surveys/geography/guidance/tiger-data-products-guide.html | Reference | CB shapefiles 2013–2025; TIGERweb current ACS 2025 / BAS 2026; proof is this URL. |
| Census 2025 counties ZIP | https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip | USE | Oversize fetch confirms it resolves; public-domain proof: https://www2.census.gov/foia/ds_policies/ds027.pdf |
| Census 2024 counties ZIP | https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip | Alternative | Oversize fetch confirms it resolves; licence proof: https://www2.census.gov/foia/ds_policies/ds027.pdf |
| Census 2023 counties ZIP | https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip | Alternative | Oversize fetch confirms it resolves; licence proof: https://www2.census.gov/foia/ds_policies/ds027.pdf |
| Census 2025 states ZIP | https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_state_500k.zip | Alternative | Fetched binary ZIP (`PK...`); licence proof: https://www2.census.gov/foia/ds_policies/ds027.pdf |
| Census GENZ2025 index | https://www2.census.gov/geo/tiger/GENZ2025/shp/ | Reference | `cb_2025_us_county_500k.zip`, last modified `2026-04-23 09:45`, size `11M`; proof is this URL. |
| TIGERweb viewer | https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_main.html | Reference | Resolves; proof is this URL. |
| TIGERweb State_County service | https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer?f=pjson | USE as online check | `copyrightText`: `Source: U.S. Census Bureau`; proof is this URL. |
| Dallas County query | https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/5/query?where=STATE%3D%2701%27%20AND%20NAME%3D%27Dallas%20County%27&outFields=STATE%2CCOUNTY%2CNAME%2CBASENAME&returnGeometry=false&f=pjson | USE | Returned `STATE=01`, `COUNTY=047`, `NAME=Dallas County`; proof is this URL. |
| Census DS027 policy PDF | https://www2.census.gov/foia/ds_policies/ds027.pdf | USE | “Data/works created by Census Bureau employees generally are not subject to copyright protection within the United States”; proof is this URL. |
| Selma Census profile | https://data.census.gov/profile/Selma_city,_Alabama?g=160XX00US0169120 | Context only | Selma profile; proof is this URL. |
| Census privacy URL | https://www.census.gov/about/policies/privacy/data.html | BLOCKED | `StatusCode: non 2xx status code (404 GET ...)`; not used as proof. |

## geoBoundaries metadata snippets (verbatim fields)

```json
"boundaryLicense": "Open Data Commons Open Database License 1.0"
"licenseSource": "www.openstreetmap.org/copyright"
"boundaryCanonical": "Unknown"
"admUnitCount": "380"
```

```json
"boundaryLicense": "Data license Germany - Attribution - Version 2.0"
"licenseSource": "www.govdata.de/dl-de/by-2-0"
"boundaryCanonical": "Government District"
"admUnitCount": "38"
```

```json
"boundaryLicense": "Creative Commons Attribution 4.0 International (CC BY 4.0)"
"licenseSource": "data.gov.ro/pages/licence"
"boundaryCanonical": "municipalities"
"admUnitCount": "3235"
```

```json
"boundaryLicense": "Public Domain"
"licenseSource": "www.census.gov/programs-surveys/geography/technical-documentation/naming-convention/cartographic-boundary-file.html"
"boundaryCanonical": "Counties"
```

Do not relabel DEU ADM2 as Kreise (the layer reports 38 Government Districts) or ROU ADM2 as judete (the layer reports 3,235 municipalities). ROU ADM1 is the judete layer (42 units).

## Copy-pastable subsetting commands

Run where GDAL is installed; studio policy says rendering/media work runs in GitHub Actions, not locally.

```bash
curl -L -o ne_10m_admin_1_states_provinces.zip https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip
unzip -o ne_10m_admin_1_states_provinces.zip -d ne_10m_admin_1_states_provinces
ogr2ogr -f GeoJSON -where "adm0_a3 IN ('DEU','POL','ROU','UKR')" -select "adm1_code,iso_3166_2,iso_a2,name,adm0_a3,type,type_en" c003_admin1.geojson ne_10m_admin_1_states_provinces/ne_10m_admin_1_states_provinces.shp
```

```bash
curl -L -o cb_2025_us_county_500k.zip https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip
unzip -o cb_2025_us_county_500k.zip -d cb_2025_us_county_500k
ogr2ogr -f GeoJSON -where "STATEFP = '01'" -select "STATEFP,COUNTYFP,GEOID,NAME" alabama_counties.geojson cb_2025_us_county_500k/cb_2025_us_county_500k.shp
ogr2ogr -f GeoJSON -where "STATEFP = '01' AND COUNTYFP = '047'" -select "STATEFP,COUNTYFP,GEOID,NAME" dallas_county_selma_area.geojson cb_2025_us_county_500k/cb_2025_us_county_500k.shp
```

## On-screen wording

Use: “Administrative boundaries shown for context, from Natural Earth / US Census Bureau cartographic boundaries.” If geoBoundaries ROU/USA appears, credit “geoBoundaries (CC BY 4.0 / public domain)” as appropriate. Do not claim any dataset proves the legal status of Crimea, Sevastopol, Kyiv, or any disputed border.
