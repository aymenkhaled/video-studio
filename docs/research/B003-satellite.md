# B003 — licence-clean satellite imagery for a 1 km → 250 km zoom

**Episode:** Scale & Science 003 "The Biggest Living Thing" · **Research date:** 2026-11-18 · **Method:** web research on official sources + read-only HTTP tile probes. No video/media rendering was run locally (AGENTS.md / CLAUDE.md).

**Sites:** Shark Bay, WA ≈ (−26.0, 113.5); Malheur National Forest, OR ≈ (44.47, −118.47); Pando, UT ≈ (38.525, −111.75).

## Verdict

- **Primary licensed basemap for all three sites:** EOX **2016** Sentinel-2 cloudless `s2cloudless_3857`, CC BY 4.0, commercial use explicitly allowed; effective native detail ≈ 10 m/px (documented zoom 0–14 in EPSG:3857). Attribution must be burned into every exported frame ([EOX FAQ](https://cloudless.eox.at/documentation/faq), accessed 2026-11-18; [EOX licence page](https://cloudless.eox.at/license-non-commercial), accessed 2026-11-18; [WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), accessed 2026-11-18).
- **Never use EOX 2018–2025 layers** in a monetized video: CC BY-NC-SA 4.0 / non-commercial, paid licence required for commercial use ([EOX FAQ](https://cloudless.eox.at/documentation/faq), accessed 2026-11-18).
- **Best public-domain close-up (Pando, Oregon):** USDA NAIP via USGS The National Map, 0.6–1 m native, free/public domain ([USGS terms](https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map), accessed 2026-11-18; [USGS NAIP ImageServer](https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer), accessed 2026-11-18).
- **Best public-domain wide contextual still (Shark Bay):** NASA Earth Observatory's 2020 MODIS image, NASA PD; 2984 × 2480 px JPEG ([EO 147395](https://science.nasa.gov/earth/earth-observatory/sharks-seagrass-and-stromatolites-147395/), accessed 2026-11-18).
- **Esri World Imagery is excluded**: Esri's own terms prohibit reproduction/transmission for commercial purposes without a paid licence, and the layer is not in the public domain ([Esri Web Site and Service Terms](https://www.esri.com/en-us/legal/terms/web-site-service), accessed 2026-11-18; [Esri item record](https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9?f=json), accessed 2026-11-18).

---

## (a) EOX Sentinel-2 cloudless WMTS

### Exact 2016 layer, endpoint and zoom

| Item | Value | Source |
|---|---|---|
| WMTS capabilities | `https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml` | [EOX WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), accessed 2026-11-18 |
| 2016 layer title | "Sentinel-2 cloudless layer for 2016 by EOX - 3857" | same, accessed 2026-11-18 |
| **Layer identifier (EPSG:3857)** | **`s2cloudless_3857`** — *not* `s2cloudless-2016` | same, accessed 2026-11-18 |
| TileMatrixSets | `GoogleMapsCompatible` and `g` | same, accessed 2026-11-18 |
| **Exact ResourceURL template (as declared, HTTP)** | `http://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg` | same, accessed 2026-11-18 |
| **HTTPS template used in probes (works)** | `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg` | read-only probe, 2026-11-18: z10/13/14/15 all HTTP 200 `image/jpeg` at Shark Bay |
| Documented zoom / resolution | "Tile Layout: TilePyramid (zoom levels 0–13 for EPSG:4326, 0-14 for EPSG:3857)", "Resolution 10 m"; FAQ repeats "EPSG:3857 (Web Mercator): zoom levels 0-14" | [EOX product list](https://cloudless.eox.at/documentation/product-list), accessed 2026-11-18; [EOX FAQ](https://cloudless.eox.at/documentation/faq), accessed 2026-11-18 |
| Tile-matrix caveat | `GoogleMapsCompatible` advertises ids 0–21, but that is the matrix definition, not extra imagery; our probes at z15–17 returned 256 px JPEGs with falling pixel variance (z17 std ≈ 1.8/4.8/3.6 vs z14 ≈ 3.2/10.5/7.3) → resampling, **not** new 10 m detail | [EOX WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), accessed 2026-11-18; read-only probe, 2026-11-18 |
| Original GeoTIFF pyramid (reference only) | "Zoom levels available are 7 to 13, where 13 best resembles the original resolution (10 m)." (EPSG:4326 AWS originals, not the public tile endpoint) | [EOX 2017 post](https://eox.at/2017/03/sentinel-2-cloudless-original-tiles-available/), accessed 2026-11-18 |
| Max WMS/WMTS image request | "The maximum request size is limited to 4096px, but you may stitch multiple requests to fit your needs." | [EOX licence page](https://cloudless.eox.at/license-non-commercial), accessed 2026-11-18 |

### Licence quotes (required)

> "Yes, the 2016 vintage is published under the CC BY 4.0 license. You may use this data as an embedded basemap in commercial mobile apps, B2B portals, video templates, and websites, provided you:" … "2016 Layer: Commercial apps may access the free 2016 endpoint under CC BY 4.0, provided traffic is reasonable."
> — [EOX FAQ](https://cloudless.eox.at/documentation/faq), accessed 2026-11-18

> "For the year **2016**, EOxCloudless is licensed under the Creative Commons Attribution 4.0 International License."
> — [EOX licence page](https://cloudless.eox.at/license-non-commercial), accessed 2026-11-18

> "All **mosaics from 2018 onwards** are released under CC BY-NC-SA 4.0 (or proprietary commercial terms) and **require a paid commercial license** for any commercial use."
> — [EOX FAQ](https://cloudless.eox.at/documentation/faq), accessed 2026-11-18

> "For the years **2018 to 2025**, EOxCloudless WM(T)S layers is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License."
> — [EOX licence page](https://cloudless.eox.at/license-non-commercial), accessed 2026-11-18

The 2018 layer's own attribution wording is "Contains modified Copernicus Sentinel data 2017 & 2018" ([EOX licence page](https://cloudless.eox.at/license-non-commercial), accessed 2026-11-18). The current capabilities document exposes 2016, 2019, 2020, 2021, 2022, 2023, 2024 and 2025 3857 layers, not a 2017 layer ([EOX WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), accessed 2026-11-18).

### Required attribution (quote)

> "EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data **2016 & 2017**)"
> — 2016 row, [EOX licence page](https://cloudless.eox.at/license-non-commercial), accessed 2026-11-18

**Discrepancy to note in QA:** the WMTS layer abstract says "(Contains modified Copernicus Sentinel data 2016)" only ([EOX WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), accessed 2026-11-18). **Use the licence-page wording** ("2016 & 2017").

> "Any static screenshot, video export, or printed output generated by users that contains EOxCloudless imagery **must** have the attribution visibly embedded directly on the media."
> — [EOX FAQ](https://cloudless.eox.at/documentation/faq), accessed 2026-11-18

**CI/QA implication:** burn the credit line into the rendered video frames (not only the description); include it again in the description/UPLOAD.md credits.

---

## (b) NASA Earth Observatory — Shark Bay stills

NASA image-use policy:

> "Most materials published on the Earth Observatory, including images, are freely available for re-publication or re-use, including commercial purposes, except for where copyright is indicated." and "We ask that NASA's Earth Observatory be given credit for its original materials; the only mandatory credit is NASA."
> — [Earth Observatory image-use policy](https://earthobservatory.nasa.gov/image-use-policy), accessed 2026-11-18

> "NASA content … generally are not subject to copyright in the United States." / "NASA content used in a factual manner that does not imply endorsement may be used without needing explicit permission. NASA should be acknowledged as the source of the material."
> — [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/), accessed 2026-11-18

Caveat: don't use the NASA insignia/logotype as a decorative asset; it is not public domain ([NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/), accessed 2026-11-18).

| # | Page (accessed 2026-11-18) | Image date / sensor | Direct full-res JPEG (accessed 2026-11-18) | Pixel size | Credit line on page | Fit for the zoom |
|---|---|---|---|---|---|---|
| 1 | [Sharks, Seagrass, and Stromatolites](https://science.nasa.gov/earth/earth-observatory/sharks-seagrass-and-stromatolites-147395/) | 2020-09-30; page text says Terra/MODIS, metadata field says Aqua/MODIS — flag/confirm before on-screen sensor label | `https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/147000/147395/sharkbay_amo_2020274_lrg.jpg` | 2984 × 2480 | "NASA Earth Observatory image by Lauren Dauphin, using MODIS data from NASA EOSDIS/LANCE and GIBS/Worldview. Story by Kasha Patel." | **Best**: the whole bay at ~250 km; use as the wide end / truth reference |
| 2 | [Phytoplankton in Shark Bay](https://science.nasa.gov/earth/earth-observatory/phytoplankton-in-shark-bay-14212/) | 2004-11-06; Terra/MODIS | `https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/14000/14212/Australia_TMO_2004311_lrg.jpeg` | 1200 × 1600 | "NASA image courtesy Jeff Schmaltz, MODIS Land Rapid Response Team at NASA GSFC" | Alternate wide end; lower pixels than #1 |
| 3 | [Shark Bay, Australia](https://science.nasa.gov/earth/earth-observatory/shark-bay-australia-5036/) | 2004-11-12; ISS digital camera, Kodak 760C + 180 mm lens | `https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/5000/5036/ISS010E06681_SharkBay_color_crop_1000.jpg` | 1000 × 1332 | "Astronaut photograph ISS010-E-6681 … provided by the ISS Crew Earth Observations experiment and the Image Science & Analysis Group, Johnson Space Center." | Detail insert only (solar salt works), **not** the 250 km view |
| 4 (NASA but not Earth Observatory) | [Photojournal: Shark Bay, Australia (PIA16894)](https://science.nasa.gov/photojournal/shark-bay-australia/) | 2010-12-30; Terra/ASTER; page states 15–90 m spatial resolution | `https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia16/pia16894/PIA16894.jpg` | 2931 × 3045 | "NASA/GSFC/METI/ERSDAC/JAROS, and U.S./Japan ASTER Science Team" | Hamelin Pool close-up; useful for the fine-detail end inside the bay |

All four are NASA-created imagery with no copyright indicated on those pages, therefore reusable for commercial video with credit ([Earth Observatory image-use policy](https://earthobservatory.nasa.gov/image-use-policy), accessed 2026-11-18; [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/), accessed 2026-11-18). Pixel dimensions above were measured from the served JPEGs on 2026-11-18.

**Limitation:** MODIS (250 m class) and ASTER (15–90 m) cannot honestly show 1 m–class detail at 1 km width; use the EO images as wide shots/truth overlays and EOX/NAIP for the continuous zoom.

---

## (c) NASA GIBS — Landsat WELD / HLS public tiles

### Service and URL templates

GIBS REST pattern (accessed 2026-11-18): `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{LayerIdentifier}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{FormatExt}` — [GIBS Access Basics](https://nasa-gibs.github.io/gibs-api-docs/access-basics/), accessed 2026-11-18. Non-subdaily layers accept `YYYY-MM-DD` (implied `00:00:00Z`) and support the literal `default` date ([GIBS Access Basics](https://nasa-gibs.github.io/gibs-api-docs/access-basics/), accessed 2026-11-18).

| Layer | Template (EPSG:3857) | Coverage / time | Max zoom / resolution | Source (accessed 2026-11-18) |
|---|---|---|---|---|
| `Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual` (title "Surface Reflectance (NBAR, True Color, Global, Annual, v3.1, Landsat / WELD)") | `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/{Time}/GoogleMapsCompatible_Level12/{z}/{y}/{x}.jpeg` | Global annual; domain values `1983-12-01 … 2000-12-01` (default/latest `2000-12-01`); source product "NASA Global Web-Enabled Landsat Data Annual Global 30 m V031" | `GoogleMapsCompatible_Level12`; z0–12, 38.21851414258810 m/px at z12 | [WMTS capabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml), [layer metadata](https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual.json), [resolution table](https://nasa-gibs.github.io/gibs-api-docs/access-advanced-topics/) |
| `HLS_L30_Nadir_BRDF_Adjusted_Reflectance` (Landsat-8/9 OLI) | `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/HLS_L30_Nadir_BRDF_Adjusted_Reflectance/default/{Time}/GoogleMapsCompatible_Level12/{z}/{y}/{x}.png` | Global daily 30 m from 2013-03-22; use a recent clear date; coverage is patchy and 2–4 days delayed | same Level12, 38.21851414258810 m/px | [WMTS capabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml), [HLS L30 metadata](https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/HLS_L30_Nadir_BRDF_Adjusted_Reflectance.json), [NASA HLS tutorial](https://www.earthdata.nasa.gov/learn/tutorials/customize-hls-rgb-imagery-composites-worldview) |
| `HLS_S30_Nadir_BRDF_Adjusted_Reflectance` (Sentinel-2 MSI) | `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/HLS_S30_Nadir_BRDF_Adjusted_Reflectance/default/{Time}/GoogleMapsCompatible_Level12/{z}/{y}/{x}.png` | Global daily 30 m from 2015-11-28 | same Level12 | [WMTS capabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml), [HLS S30 metadata](https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/HLS_S30_Nadir_BRDF_Adjusted_Reflectance.json) |

NASA tutorial caution (accessed 2026-11-18): "the imagery is not available for recent dates and there isn't global coverage" ([NASA Earthdata HLS tutorial](https://www.earthdata.nasa.gov/learn/tutorials/customize-hls-rgb-imagery-composites-worldview)). The GIBS EPSG:3857 tile-matrix table quote (accessed 2026-11-18): `| 38.21851414258810m | GoogleMapsCompatible_Level12 | 12 | 156543.03390625 | 38.21851414258810 |` ([GIBS Advanced Topics](https://nasa-gibs.github.io/gibs-api-docs/access-advanced-topics/)).

Live tiles verified HTTP 200 + decoded as non-uniform images on 2026-11-18:

- WELD Shark Bay z11: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/2000-12-01/GoogleMapsCompatible_Level12/11/1177/1669.jpeg`
- WELD Malheur z12: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/2000-12-01/GoogleMapsCompatible_Level12/12/2354/3339.jpeg`
- HLS L30 Shark Bay: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/HLS_L30_Nadir_BRDF_Adjusted_Reflectance/default/2026-11-16/GoogleMapsCompatible_Level12/11/1177/1669.png`
- HLS S30 Malheur: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/HLS_S30_Nadir_BRDF_Adjusted_Reflectance/default/2026-02-12/GoogleMapsCompatible_Level12/11/740/350.png`

### Licence and credit

> "NASA content – images, audio, video, and media files … generally are not subject to copyright in the United States." and "NASA content used in a factual manner that does not imply endorsement may be used without needing explicit permission."
> — [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/), accessed 2026-11-18

> "If the NASA material is to be used for commercial purposes, including advertisements, it must not explicitly or implicitly convey NASA's endorsement of commercial goods or services."
> — [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/), accessed 2026-11-18

> "There are no restrictions on Landsat data downloaded from the USGS; it can be used or redistributed as desired. We do request that you include a statement of the data source when citing, copying, or reprinting USGS Landsat data or images."
> — [USGS Landsat public-domain FAQ](https://www.usgs.gov/faqs/are-landsat-data-cloud-still-considered-be-within-public-domain), accessed 2026-11-18

Recommended GIBS credit (exact): "We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS)." — [GIBS docs](https://nasa-gibs.github.io/gibs-api-docs/), accessed 2026-11-18.

---

## (d) USDA NAIP / USGS The National Map imagery — Pando

### Public-domain proof

> "Map services and data downloaded from The National Map are free and in the public domain. There are no restrictions; however, we request that the following acknowledgment statement of the originating agency be included in products and data derived from our map services when citing, copying, or reprinting: 'Map services and data available from U.S. Geological Survey, National Geospatial Program.'"
> — [USGS terms/licensing FAQ](https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map), accessed 2026-11-18

> "Since the start of NAIP in 2003, all acquired imagery has been placed in public domain allowing unrestricted use and sharing of the data."
> — [USDA FSA Notice AP-26](https://www.fsa.usda.gov/Internet/FSA_Notice/ap_26.pdf), accessed 2026-11-18

> "Imagery has been placed in the public domain and may be used and reproduced without permission or fee. Please credit 'NAIP imagery provided by USDA Farm Service Agency' on any use."
> — [USDA NAIP specification](https://www.fsa.usda.gov/Internet/FSA_File/ag-8447-c-12-0001_mod_3.pdf), accessed 2026-11-18

### Endpoints

| Service | Template | Zoom / resolution | Exact service credit | Source (accessed 2026-11-18) |
|---|---|---|---|---|
| **USGSImageryOnly** cached basemap (best for a smooth tile zoom) | `https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}` | LODs 0–23 defined but service `maxScale: 9027.977411` (1:9,028) ⇒ effective z16, 2.388657 m/px; native NAIP 1 m (6 in–1 m) | "USDA, USGS The National Map: Orthoimagery. Data refreshed June, 2024.v1.2" | [MapServer](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer), [item info](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/info/iteminfo) |
| **USGSNAIPImagery** ImageServer (best for a still/export at Pando) | `https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage?bbox={xmin},{ymin},{xmax},{ymax}&bboxSR=4326&imageSR=3857&size=256,256&format=jpg&f=image` | Mosaic primarily 0.6 m, 4-band, natural colour; `meanPixelSize: 0.3`; `exportTilesAllowed: false` (dynamic export, not XYZ tiles) | "USGS, USDA, The National Map: Orthoimagery. January 09, 2025." | [ImageServer](https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer) |
| **USDA NAIP+ ImageServer** (alternative) | `https://imagery.geoplatform.gov/iipp/rest/services/NAIP/NAIP_plus/ImageServer/exportImage?bbox={xmin},{ymin},{xmax},{ymax}&bboxSR=4326&imageSR=3857&size=256,256&format=jpg&f=image` | 0.3–0.6 m; IIPP/GTAC-served | "These datasets were provided by the USDA's Farm Production and Conservation office (FPAC) and are served by the U.S. Forest Service Geospatial Technology & Applications Center (GTAC)…" | [NAIP+ ImageServer](https://imagery.geoplatform.gov/iipp/rest/services/NAIP/NAIP_plus/ImageServer) |

**Pando coverage confirmed** (read-only query, 2026-11-18): the USGS NAIP index at (−111.75, 38.525) intersects tiles `m_3811126_se_12_060_20210913` and `m_3811127_sw_12_060_20210914`, **Year 2021**, `resolution_value: 0.6`, 4 bands, acquired 2021-09-13/14 ([index query](https://index.nationalmap.gov/arcgis/rest/services/USGSNAIPImageryIndex/MapServer/0/query?where=1%3D1&geometry=-111.75%2C38.525&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=Name%2CState%2CYear%2Cacquisition_date%2Cresolution_value%2Cband_count&returnGeometry=false&f=json), accessed 2026-11-18). Utah NAIP years on record include 2003, 2004, 2006, 2009, 2011, 2014, 2016, 2018, 2021 (2024 collected, services pending) ([UGRC](https://ugrc.utah.gov/products/sgid/aerial-photography/naip), accessed 2026-11-18).

---

## (e) Esri World Imagery — why it is NOT allowed

- The ArcGIS item record states: "This work is licensed under the Esri Master License Agreement" and "**Export:** This layer is not intended to be used to export tiles for offline." ([Esri item 10df…](https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9?f=json), accessed 2026-11-18).
- Esri's site terms: "The Services may be freely available to you, but they are not in the public domain unless specified as such" and "These Terms of Use do not transfer any rights to redistribute, prepare derivative works from, or acquire ownership interest in Services." ([Esri Web Site and Service Terms §2.1](https://www.esri.com/en-us/legal/terms/web-site-service), accessed 2026-11-18).
- Esri's site terms §2.2: "You may download, view, copy, and print Services … solely for your own internal purposes, or for your own noncommercial external purposes unless otherwise specified. **Services may not be reproduced or transmitted for commercial purposes, in any form or by any means…**" ([Esri Web Site and Service Terms](https://www.esri.com/en-us/legal/terms/web-site-service), accessed 2026-11-18). Paid commercial use requires the applicable licence fee ([same, §2.2.1](https://www.esri.com/en-us/legal/terms/web-site-service), accessed 2026-11-18).
- Esri also warns: "Use of third-party data and/or imagery may be subject to such third party's License Agreement or additional use restrictions" ([same, §2.5](https://www.esri.com/en-us/legal/terms/web-site-service), accessed 2026-11-18); World Imagery's commercial content is sourced from Maxar's satellite constellation ([Esri data-appliance doc](https://www.esri.com/content/dam/esri_content_doc/da/arcgis_data_appliance_2024.pdf), accessed 2026-11-18). Its credits field reads "Esri, Vantor, Earthstar Geographics, and the GIS User Community" ([Esri item record](https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9?f=json), accessed 2026-11-18).
- Attribution guidance only covers citing the basemap in an ArcGIS map ("should also be displayed in the lower right corner of the map or image") ([Esri support note](https://support.esri.com/en-us/knowledge-base/what-is-the-correct-way-to-cite-an-arcgis-online-basema-000012040), accessed 2026-11-18); it does **not** grant a commercial video-export licence.
- Studio rule: CLAUDE.md content policy rejects "unknown" licences and non-commercial imagery; Esri World Imagery is therefore excluded for a monetized video ([CLAUDE.md](D:/studio-b003/CLAUDE.md) lines 17–29, read 2026-11-18).

---

## Final recommendation table

All sources below verified 2026-11-18. Credit lines must be burned into the exported frames where required.

| Source | URL template | Zoom levels / best resolution | Licence | Credit line |
|---|---|---|---|---|
| **EOX 2016 cloudless (primary, all 3 sites)** | `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg` ([caps](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), 2026-11-18) | Documented z0–14; native ≈10 m/px; higher z served but resampled ([FAQ](https://cloudless.eox.at/documentation/faq), 2026-11-18) | **CC BY 4.0, commercial OK** ([FAQ](https://cloudless.eox.at/documentation/faq), 2026-11-18) | "EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017)" — on frame + description ([licence](https://cloudless.eox.at/license-non-commercial), 2026-11-18) |
| **EOX 2018–2025 layers** | `…/s2cloudless-20XX_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg` ([caps](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), 2026-11-18) | same matrix family | **REJECT: CC BY-NC-SA 4.0, paid licence for commercial use** ([FAQ](https://cloudless.eox.at/documentation/faq), 2026-11-18) | — |
| **NASA EO Shark Bay 2020 MODIS (wide/truth still)** | Page: [EO 147395](https://science.nasa.gov/earth/earth-observatory/sharks-seagrass-and-stromatolites-147395/); JPEG: `https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/147000/147395/sharkbay_amo_2020274_lrg.jpg` (2026-11-18) | 2984 × 2480 px; MODIS ≈250 m/px class ([EO page](https://science.nasa.gov/earth/earth-observatory/sharks-seagrass-and-stromatolites-147395/), 2026-11-18) | NASA PD / free for commercial reuse ([EO policy](https://earthobservatory.nasa.gov/image-use-policy), 2026-11-18) | "NASA Earth Observatory image by Lauren Dauphin, using MODIS data from NASA EOSDIS/LANCE and GIBS/Worldview" ([page](https://science.nasa.gov/earth/earth-observatory/sharks-seagrass-and-stromatolites-147395/), 2026-11-18) |
| **NASA GIBS WELD annual (global PD fallback)** | `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/2000-12-01/GoogleMapsCompatible_Level12/{z}/{y}/{x}.jpeg` ([caps](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml), 2026-11-18) | z0–12; 38.22 m/px at z12 ([GIBS resolutions](https://nasa-gibs.github.io/gibs-api-docs/access-advanced-topics/), 2026-11-18) | NASA PD; Landsat unrestricted, credit requested ([NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/), [USGS](https://www.usgs.gov/faqs/are-landsat-data-cloud-still-considered-be-within-public-domain), 2026-11-18) | "NASA GIBS (WELD Landsat annual); NASA EOSDIS/ESDIS. We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS)." ([GIBS credit](https://nasa-gibs.github.io/gibs-api-docs/), 2026-11-18) |
| **NASA GIBS HLS L30/S30 (global PD, recent 30 m)** | `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/HLS_L30_Nadir_BRDF_Adjusted_Reflectance/default/{YYYY-MM-DD}/GoogleMapsCompatible_Level12/{z}/{y}/{x}.png` (and `HLS_S30_…`) ([caps](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml), 2026-11-18) | z0–12; 38.22 m/px; patchy daily coverage, use z11 for reliability ([GIBS](https://nasa-gibs.github.io/gibs-api-docs/access-advanced-topics/), [tutorial](https://www.earthdata.nasa.gov/learn/tutorials/customize-hls-rgb-imagery-composites-worldview), 2026-11-18) | NASA PD ([NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/), 2026-11-18) | Same GIBS/EOSDIS acknowledgement + "HLS L30 (Landsat 8/9 OLI) / S30 (Sentinel-2 MSI), 30 m" ([GIBS credit](https://nasa-gibs.github.io/gibs-api-docs/), 2026-11-18) |
| **USGSImageryOnly (Pando + Oregon close-ups)** | `https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}` ([MapServer](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer), 2026-11-18) | Effective z0–16 (1:9,028; 2.39 m/px at z16); native NAIP 0.6–1 m ([MapServer](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer), 2026-11-18) | **Public domain**, no restrictions ([USGS FAQ](https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map), 2026-11-18) | "Imagery: USDA NAIP / USGS The National Map (Utah 2021). Map services and data available from U.S. Geological Survey, National Geospatial Program." ([USGS FAQ](https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map), 2026-11-18) |
| **USGSNAIPImagery / USDA NAIP+ (Pando exportImage, 0.6 m)** | `https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage?bbox={xmin},{ymin},{xmax},{ymax}&bboxSR=4326&imageSR=3857&size=256,256&format=jpg&f=image` ([ImageServer](https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer), 2026-11-18) | 0.6 m native, 4-band; confirmed Pando tiles 2021-09-13/14 ([index](https://index.nationalmap.gov/arcgis/rest/services/USGSNAIPImageryIndex/MapServer/0/query?where=1%3D1&geometry=-111.75%2C38.525&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=Name%2CState%2CYear%2Cacquisition_date%2Cresolution_value%2Cband_count&returnGeometry=false&f=json), 2026-11-18) | Public domain ([USDA FSA AP-26](https://www.fsa.usda.gov/Internet/FSA_Notice/ap_26.pdf), 2026-11-18) | USDA requests "NAIP imagery provided by USDA Farm Service Agency"; USGS service credit "USGS, USDA, The National Map: Orthoimagery. January 09, 2025." ([USDA spec](https://www.fsa.usda.gov/Internet/FSA_File/ag-8447-c-12-0001_mod_3.pdf), [ImageServer](https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer), 2026-11-18) |
| **Esri World Imagery** | — | — | **BANNED** — not PD; commercial reproduction/transmission requires paid licence; third-party (Maxar/Vantor) restrictions ([Esri terms](https://www.esri.com/en-us/legal/terms/web-site-service), 2026-11-18) | — |

### Shot-by-shot recommendation

1. **Wide (≈250 km) → medium (≈10–30 km)** at all three sites: EOX 2016 `s2cloudless_3857` tiles z8–z14, with the EOX credit burned in. At 3840 px wide, 250 km maps to ~65 m/px, so even GIBS z12 suffices for the widest frame; EOX gives a cleaner, consistent mosaic across all three countries/states ([EOX caps](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml), 2026-11-18; [GIBS resolutions](https://nasa-gibs.github.io/gibs-api-docs/access-advanced-topics/), 2026-11-18).
2. **Fine (≈1 km) at Pando and Malheur**: cross-fade from EOX z14 to USGSImageryOnly z16 / a NAIP `exportImage` still (0.6 m), because EOX 10 m gives only ~100 px across 1 km whereas NAIP gives ~1600 px ([MapServer](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer), 2026-11-18; [index query](https://index.nationalmap.gov/arcgis/rest/services/USGSNAIPImageryIndex/MapServer/0/query?where=1%3D1&geometry=-111.75%2C38.525&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=Name%2CState%2CYear%2Cacquisition_date%2Cresolution_value%2Cband_count&returnGeometry=false&f=json), 2026-11-18).
3. **Fine (≈1 km) at Shark Bay**: no free 0.6 m aerial was verified. Use NASA ASTER Hamelin Pool (15–90 m) or the ISS crop as a detail insert; do not fake sub-10 m detail by over-zooming EOX ([NASA Photojournal](https://science.nasa.gov/photojournal/shark-bay-australia/), 2026-11-18; [EOX FAQ](https://cloudless.eox.at/documentation/faq), 2026-11-18).
4. **Fallback if EOX endpoint is throttled/offline**: NASA GIBS HLS/WELD tiles (PD) — no SLA on the free EOX endpoint, and EOX asks that traffic be kept reasonable ([EOX FAQ](https://cloudless.eox.at/documentation/faq), 2026-11-18).

### Next actions for B003 build

- Add the EOX 2016, NASA EO, GIBS and NAIP rows to `docs/LICENSES.md` before using any asset; the EOX and NAIP credits must also be on-screen.
- In CI, cache/pull tiles rather than hammering EOX; no local rendering (render.yml only).
- Have the independent reviewer check that no 2018+ EOX layer or Esri imagery appears in any frame.
