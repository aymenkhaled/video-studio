# Visual & motion research — map / chart / scale explainers

Researched 2026-11-14 (all URLs accessed 2026-11-14). Scope: camera, transitions, living backgrounds, map styling, data-viz motion, art/photo use, typography, grading, variety cadence, licence-safe imagery. Every technique is translated to Remotion + d3-geo + three.js (CPU, `--gl=swangle`, `noPost`, frame-derived, no animated blur/turbulence).

Rule applied: extract **general techniques only**. No channel's characters, palette, mascot, typeface pairing or signature layout is to be copied.

Evidence caveat: most top channels (Kings and Generals, Historia Civilis, Wendover, Kurzgesagt, Melodysheep) have **no public, detailed making-of**. Searches for their process returned nothing primary [S10, S11, S12, S13]. Where a claim rests only on a vendor tutorial, a creator video summary or a secondary site it is marked *(secondary)*. Johnny Harris's own map workflow and the Remotion/d3 docs are primary.

---

## 1. Summary

1. **The biggest gap is not "more effects", it is continuity.** Top map/explainer channels hide cuts: the camera flies from one place to the next on one map (keyframed lat/lon/zoom/bearing/pitch with holds) [S1], scale videos chain zooms anchored to a human reference [S14], and math channels *morph* one state into the next instead of fading [S16]. Our cuts are the single most "cheap-looking" trait. Fix: a `FlyTo` camera (van Wijk smooth zoom, `d3.interpolateZoom`) [S17], morph transitions between charts (staged, per Heer & Robertson) [S18], and a shared-element match cut.
2. **Our map needs 3 looks, not 1.** Split "the same parchment map" into: (a) *context* (globe / locator, muted), (b) *story* map (tilted 2.5D, hillshade, glow routes), (c) *data* map (flat choropleth). Plus a licence-clean satellite look from **EOX Sentinel-2 cloudless 2016 (CC BY 4.0)** [S27] — the only free global satellite mosaic we found that fits our licence list.
3. **Photo starvation is solvable without CC BY-SA:** NASA/USGS/NOAA (US PD) [S21–S24], Met / Smithsonian / Rijksmuseum CC0 [S25, S26, S28], LoC maps "no known restrictions" [S29], Openverse filtered to CC0/BY [S31]. **Unsplash and Pexels use custom licences, not CC0** [S19, S20] → not on our allow-list; **ESA is CC BY-SA 3.0 IGO** [S30] → reject (but Copernicus Sentinel *data* has its own attribution-only legal notice [S32] — needs Aymen's decision).
4. **Charts feel infographic-like because they are static panels.** Fix with: staged morphs (bar → dot → map), unit/Isotype counts with an axis [S33], camera that *lives inside* the chart (push-in on the bar that matters), and annotation that draws on. Bar-chart races only with ≤10 bars and a clear point [S34].
5. **Living background, done deterministically:** paper texture as a static multiplied layer + slow drift, `noise2D(seed, frame)` jitter for particles/dust [S35], a frame-driven light sweep (Remotion `lightLeak()` is WebGL2 — test under swangle first [S36]), static grain plate cycled by frame index (not animated SVG turbulence).
6. **Variety budget** (section 4): no shot type above ~30 % of runtime; a "type change" every 6–15 s; a **hero shot** every ~90 s.

Overall self-rating of this research: **7/10**. Weaknesses: (1) little primary making-of evidence for most named channels — techniques inferred from tools/docs; (2) no frame-by-frame measurement of competitor shot lengths (would need video analysis, not allowed locally); (3) some licence statements verified via official pages, others via search excerpts (marked).

---

## 2. Techniques

Legend — Impact: H/M/L on perceived production value & retention. Effort: S (≤1 day), M (2–4 days), L (≥1 week). Status: DOING / PARTIAL / MISSING (from brief + `packages/engine/src` grep: `geoOrthographic`, `geoInterpolate`, `relief` exist in `map/map.tsx`; no `TransitionSeries`, grain, glow, extrusion found).

### A. Camera & continuity

**T1. Fly-to camera with holds (one continuous map move instead of cuts)**
- What: keyframe centre/zoom/bearing/pitch; camera flies between story locations on the same map, pausing (holds) on each.
- Evidence: Johnny Harris's own workflow — a single null controller drives zoom+pan; GEOlayers keyframes lat, lon, zoom, bearing, pitch; holds by pausing keyframes; orbit by delaying bearing keys [S1]. GEOlayers markets "scroll, zoom, pitch, rotate" as its core [S2]. Smooth zoom-pan: van Wijk/Nuij via `d3.interpolateZoom` [S17].
- Impact H · Effort S · Channels A, C · Status **PARTIAL** (geoInterpolate centre exists; no van Wijk zoom-out-then-in arc, no bearing/pitch).
- Remotion: `const t = easeInOutCubic(progress(frame))`; `const z = d3.interpolateZoom([x0,y0,w0],[x1,y1,w1])(t)` → projection `.center/.scale`. Zoom-out-arc between distant places is the key "pro" signal. Hold = clamp `t` for N frames. Keep absolute-time drift on top.

**T2. Globe → region → site ("earth zoom") single shot**
- What: start on orthographic globe, rotate to target (slerp), then switch projection to Mercator/conic at a threshold scale with a crossfade of ~8 frames, keep zooming.
- Evidence: d3 World Tour pattern — rotate tween to negated centroid, `d3.geoInterpolate` for great-arc paths [S17]; "earth zoom" defined as one continuous scale change ground↔orbit [S15].
- Impact H · Effort M · A, B(cosmic scale), C · **PARTIAL** (globe + locator exist; no seamless globe→flat handoff).
- Remotion: render both projections; at scale k* crossfade opacity over 8 frames with identical centre; or use `geoOrthographic().clipAngle` + increasing scale until it reads flat (works to ~country level).

**T3. Match cut / shared-element transition**
- What: an element in scene A (a country shape, a coin, a silhouette) becomes the anchor of scene B (country shape → its flag-free fill becomes a bar; dinosaur silhouette → its leg becomes the metre axis).
- Evidence: Manim's `Transform` morphs one object into another instead of fading — visual-continuity principle [S16] *(secondary)*; Harris copies a country outline as a vector mask and scales it into the next shot [S1].
- Impact H · Effort M · A, B, C · **MISSING**.
- Remotion: compute A's element bbox at last frame, B's at first frame; interpolate transform over 12–20 frames between scenes using `TransitionSeries.Overlay` or a custom presentation. For paths, `flubber`-style interpolation (MIT) of SVG `d`.

**T4. Whip pan (motion-streak cut) without blur**
- What: fast pan 6–10 frames to next location; we cannot animate blur, so fake streak with 3–4 offset, decreasing-opacity copies (deterministic "smear") on the fastest frames only.
- Evidence: Remotion `slide()` presentation pushes the old scene out [S37]; we add the smear ourselves.
- Impact M · Effort S · A, C · **MISSING**.
- Remotion: `TransitionSeries.Transition presentation={slide({direction:'from-right'})} timing={springTiming({config:{damping:200}})}` + static ghost copies (allowed: not animated CSS blur).

**T5. Parallax depth stack on every hero shot (2–3 layers)**
- What: foreground (labels, figures, frame elements), mid (map/art), background (paper/sea texture) moving at 1.15× / 1× / 0.85× of camera.
- Evidence: parallax = layers at different depths, closer moves more [S38] *(secondary)*; already our rule in CLAUDE.md.
- Impact M · Effort S · A, B, C · **PARTIAL** (PD art parallax yes; maps mostly single plane).
- Remotion: wrap layers in `<div style={{transform: translate(cam.x*f, cam.y*f) scale(1+(cam.z-1)*f)}}>` with f per layer.

**T6. Tilted 2.5D map (pitch) with terrain**
- What: perspective tilt of the map plane (pitch 35–55°) + hillshade, optional true terrain mesh for hero shots.
- Evidence: GEOlayers pitch/bearing [S1, S2]; 3D terrain in AE via GEOlayers + Helium, casting shadows [S3] *(vendor tutorial)*.
- Impact H · Effort M (CSS tilt) / L (three.js terrain) · A, C · **MISSING**.
- Remotion: cheap path: render the d3 SVG map inside `<div style={{transform:'perspective(1800px) rotateX(45deg)'}}>`, labels in an un-tilted overlay projected with the same matrix (labels must stay upright). Hero path: three.js `PlaneGeometry` displaced by SRTM/GMTED/GEBCO heightmap (PD) [S39, S40], `MeshLambertMaterial` with the map as texture, one directional light, no post — CPU-friendly at ≤512×512 segments.

### B. Transitions

**T7. Transition vocabulary (max 4 types per episode)**
- What: (1) camera-continuous (T1), (2) match cut (T3), (3) wipe along a meaningful line (a front, a river, a border), (4) chapter card push. Hard cut stays for emphasis beats.
- Evidence: Remotion `@remotion/transitions` ships fade, slide, wipe (8 directions), flip, clockWipe; `TransitionSeries` overlaps scenes (total = Σseq − Σtrans), `Overlay` sits on a cut without changing timing [S37, S41].
- Impact H · Effort S · all · **MISSING** (mostly cuts).
- Remotion: custom `TransitionPresentation` whose clip-path follows a GeoJSON line projected to screen ("border wipe") — unique, cheap, and on-topic.

**T8. Ink/paper reveals for maps (stroke-draw)**
- What: borders, rivers, routes draw on via `stroke-dashoffset`; territory fills reveal from the capital outward (radial clip).
- Evidence: Harris map reveals done with shape/mask animation [S1]; Adobe community explains reveal as animated shape mask [S4] *(secondary)*.
- Impact M · Effort S · A, C · **PARTIAL** (routes yes per brief; fills mostly fade).
- Remotion: `getTotalLength()` is DOM-dependent — precompute lengths at build time or with `@remotion/paths` `getLength()` (deterministic).

### C. Living backgrounds

**T9. Paper / sea texture as static multiply plate + slow drift**
- What: high-res scanned-paper (CC0) at 8–15 % multiply; sea gets a faint bathymetry gradient (GEBCO, PD with credit) [S40] instead of flat navy.
- Impact M · Effort S · A, C · **PARTIAL** (paper colour, relief yes; sea flat).
- Remotion: `<Img>` with `mixBlendMode:'multiply'`; translate by `frame*0.02 px` (frame-derived).

**T10. Deterministic particles / dust / embers**
- What: 30–80 slow motes or map "data dust" (for C: tiny coins drifting along trade routes).
- Evidence: `noise2D(seed,x,y)` returns same value for same inputs, range −1…1 — Remotion recommends it over `Math.random()` [S35].
- Impact L–M · Effort S · A, B, C · **MISSING**.
- Remotion: `x = base + 40*noise2D('p'+i, frame/300, 0)`; SVG circles; no blur.

**T11. Light sweep / light leak**
- What: soft diagonal highlight crossing the frame every chapter open, or warm leak on PD paintings.
- Evidence: `@remotion/light-leaks` deprecated → `lightLeak()` in `@remotion/effects`, WebGL2, progress must be frame-driven, seed + hueShift [S36].
- Impact M · Effort S · A, C · **MISSING**. Note: WebGL2 under `--gl=swangle` must be tested in CI; fallback = static radial-gradient PNG translated by frame (pure CSS transform, no blur animation).

**T12. Static grain plate + vignette**
- What: 4–8 pre-rendered grain PNGs cycled by `frame % n` at 3–5 % opacity; static vignette.
- Impact L · Effort S · A, C · **MISSING**. Avoids SVG turbulence rule. Check freezedetect still passes (grain does not affect it if <5 %).

### D. Map styling

**T13. Three map "registers" per episode (context / story / data)**
- What: context = muted globe + locator; story = tilted, hillshaded, glow routes, sparse labels; data = flat, no relief, choropleth + legend. Different background tone per register.
- Evidence: Harris strips clutter from base style (labels, minor boundaries, roads) and recolours [S1]. Our own weakness: "70 % same-looking map".
- Impact H · Effort S (style presets) · A, C · **MISSING** as a system.
- Remotion: `mapStyle: 'context'|'story'|'data'` prop driving palette, stroke widths, label density.

**T14. Satellite blend (licence-clean)**
- What: Sentinel-2 cloudless 2016 mosaic (CC BY 4.0) [S27] as a 20–60 % layer under paper/ink for "real place" moments; or NASA Blue Marble (US PD, credit NASA) [S22].
- Impact H · Effort M (tile fetch → asset release) · A (modern geography), C · **MISSING**.
- Remotion: pre-crop to episode bbox in CI, store in `assets-v1` with SHA256; `mix-blend-mode: luminosity` + sepia tone so it sits inside our brand. Credit text exactly as EOX specifies.

**T15. Glowing / animated routes without blur**
- What: route = 3 stacked strokes (wide 15 % opacity, mid 40 %, core 100 %) gives glow with no filter; moving dash "pulse" along route; arrowhead tip.
- Impact M · Effort S · A, C · **PARTIAL**.

**T16. Extruded regions / prism map**
- What: country or province extruded proportional to a value (C) or army size (A) — 2.5D prism.
- Impact H for C · Effort M (SVG side-walls) / M (three.js `ExtrudeGeometry` from projected polygons) · C, A · **MISSING**.
- Remotion: three.js `Shape` from projected d3 coords → `ExtrudeGeometry({depth: v})`; animate depth from frame; flat-shaded, one light; no post.

**T17. Label typography system**
- What: water labels italic + letter-spaced; country labels caps spaced; cities sentence case with dot; label fade by zoom band; labels counter-scale with camera so size is constant on screen.
- Evidence: GEOlayers label maker makes labels that scale with the map; labels parented to map anchor [S1].
- Impact M · Effort S · A, C · **PARTIAL** (collision avoidance exists).

### E. Data-viz motion

**T18. Staged morphs between chart types**
- What: never cut chart→chart; stage: (1) change axis, (2) move marks, (3) change mark shape. E.g. map choropleth → countries collapse to dots → dots line up as bar chart sorted.
- Evidence: Heer & Robertson: animated transitions "significantly improve graphical perception"; staging recommended for complex transitions [S18]; later work found staging preferred but not always measurably better [S42] *(secondary)*.
- Impact H · Effort M · C (also B) · **MISSING**.
- Remotion: each mark has an id; compute layouts A, B, C; `interpolate` per stage with 10–20 % stagger by rank.

**T19. Unit / Isotype charts with an axis**
- What: equal-size icons, more icons for more quantity (never scaled icons); add a numeric axis because counting is hard; avoid fractional icons beyond ½ [S33].
- Impact M · Effort S · B, C · **PARTIAL** (pictogram chart exists).

**T20. Camera inside the chart**
- What: chart is a world; camera pushes in to the bar/point being discussed, other marks desaturate; annotation draws on (leader line + value).
- Impact H · Effort S · C, B · **MISSING** (charts are static panels).

**T21. Bar race — restricted use**
- What: only when ranking change *is* the story; ≤10 bars, fixed value labels, year counter, slow tempo, end on hold.
- Evidence: critics call races entertaining but low-analysis; line charts often show the same faster; scrubber/pauses mitigate [S34].
- Impact M · Effort S · C · **MISSING**.

**T22. Scale reveal anchored to a human**
- What: every scale step keeps a human (or known object) in frame; camera zooms out and the previous object shrinks to a dot before the next appears.
- Evidence: Kurzgesagt scale videos zoom but compare each step against human scale [S14] *(secondary summary)*; Powers of Ten precedent [S15].
- Impact H · Effort S · B · **PARTIAL** (metre grid exists).
- Remotion: log-scale camera `z = exp(lerp(ln z0, ln z1, t))` — linear zoom feels wrong across orders of magnitude.

**T23. Textured silhouettes (fix "flat untextured")**
- What: 2-tone cel shading (base + one darker shape for shadow side), 1 highlight rim stroke, subtle pattern (scales, fur hatching) as SVG `<pattern>` (static), drop contact shadow on the grid.
- Impact H for B · Effort M · B · **MISSING**.

### F. Art & photo

**T24. Ken Burns with intent**
- What: move has a motive: push-in = intimacy/detail, pull-out = context reveal, pan = scanning [S43] *(secondary)*; Burns treats stills as shots (close-up, pan, reveal) [S44].
- Impact M · Effort S · A · **DOING** (drift) → upgrade: per-image "start rect → end rect" chosen on a face/detail.

**T25. Cut-out parallax from depth maps**
- What: split PD painting into 3 depth bands, inpaint gaps, move bands differently.
- Evidence: Depth Anything V2 **Small = Apache-2.0**; Base/Large/Giant = CC BY-NC-4.0 → use Small only [S45] *(secondary — confirm on HF model card)*.
- Impact H · Effort M · A · **DOING** (2.5D parallax) — check which checkpoint we use.

**T26. Photo-in-map ("pinned photo")**
- What: modern PD photo (NASA/USGS/NOAA) appears as a pinned card at its location with a leader line, camera pushes into it, it fills frame, then back out.
- Impact H · Effort S · A, C, B · **MISSING**.

### G. Typography, captions, grading

**T27. Kinetic numbers**
- What: big numbers count up frame-derived with tabular figures; unit shown smaller; source tag in corner (we already require source URLs).
- Impact M · Effort S · all · **PARTIAL**.

**T28. One grade per register**
- What: CSS `filter` *static* per register (sepia/contrast for history art; neutral for data). Static filters are fine; only *animated* blur is banned. Keep palettes colour-blind safe.
- Impact M · Effort S · all · **PARTIAL**.

**T29. Hero shot every ~90 s**
- What: one deliberately expensive shot (3D terrain flyover, extruded map, 3D dinosaur, globe-to-street) at fixed beats.
- Evidence: retention advice converges on "meaningful change" rather than timers; intervals vary widely (5 s–60 s) and are not platform rules [S46] *(secondary, low quality)*.
- Impact H · Effort M · all · **PARTIAL**.

---

## 3. Licence-verified imagery & data sources (verified 2026-11-14)

Allowed by policy: PD, CC0, CC BY (credit), OFL/MIT/BSD/Apache. Rejected: NC, ND, SA, unknown, custom.

| Source | Licence | Verdict | URL | Attribution / notes |
|---|---|---|---|---|
| NASA (images, video) | Generally not subject to US copyright; **insignia/logos not PD**; third-party content excluded | ✅ PD | https://www.nasa.gov/nasa-brand-center/images-and-media/ [S21] | Credit "NASA". No endorsement implied; avoid identifiable astronauts in promo; check each item for third-party credit. |
| NASA Earth Observatory / Visible Earth (Blue Marble) | Free reuse incl. commercial except where copyright indicated | ✅ PD (per item) | https://earthobservatory.nasa.gov/ImageUse [S22] | Use credit line attached to image; minimum "NASA". Older Visible Earth commercial limits (GeoEye) — skip third-party items. *(search excerpt)* |
| NASA Scientific Visualization Studio | PD unless noted; **music tracks may be licensed** | ✅ PD (visuals only) | https://svs.gsfc.nasa.gov/help/ [S23] | "NASA's Goddard Space Flight Center Scientific Visualization Studio"; strip audio. *(search excerpt)* |
| USGS (incl. Landsat, SRTM, GMTED) | USGS-authored = US public domain; non-USGS images marked © | ✅ PD | https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits [S24] | "Credit: U.S. Geological Survey". |
| NOAA Photo Library | Public domain | ✅ PD | https://photolib.noaa.gov/About [S47] | Credit NOAA + photographer; some captions carry © — check. *(search excerpt)* |
| GEBCO grid (bathymetry) | Public domain, acknowledgement required | ✅ PD | https://www.gebco.net/data-products/gridded-bathymetry/terms-of-use [S40] | "GEBCO Compilation Group (2025) GEBCO 2025 Grid (doi:10.5285/37c52e96-24ea-67ce-e063-7086abc05f29)". Not for navigation. |
| Natural Earth | Public domain | ✅ PD | https://www.naturalearthdata.com/about/terms-of-use/ [S48] | Credit optional ("Made with Natural Earth"). |
| AWS/Mapzen terrain tiles | Mixed per region: PD (SRTM/3DEP/ETOPO1), CC BY (AU, NO, AT, NZ), **OGL (UK, CA)**, INEGI terms | ⚠️ Partial | https://github.com/tilezen/joerd/blob/master/docs/attribution.md [S39] | OGL not on our list → prefer SRTM/GMTED direct from USGS for global, or restrict to PD/CC BY regions. |
| Copernicus DEM GLO-30 | Free licence with credit + no-liability notice | ⚠️ Aymen decision | https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf [S49] | Custom licence (attribution-only in spirit). Modified data notice "produced using Copernicus WorldDEM-30 © DLR e.V." *(search excerpt)* |
| Copernicus Sentinel data (raw) | EU legal notice: free, full, open; attribution notice | ⚠️ Aymen decision | https://sentinels.copernicus.eu (Sentinel Data Legal Notice) [S32] | "Contains modified Copernicus Sentinel data [Year]". Custom, not CC — functionally CC BY-like. *(search excerpt)* |
| **EOX Sentinel-2 cloudless 2016** | **CC BY 4.0** (2018+ versions are CC BY-NC-SA → reject) | ✅ CC BY | https://s2maps.eu [S27] | "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017)". Use **2016 layer only**. |
| ESA multimedia | CC BY-SA 3.0 IGO where stated; otherwise © ESA, non-commercial | ❌ Reject | https://www.esa.int/Services/Creative_Commons_Attribution-ShareAlike_3.0_IGO_CC_BY-SA_3.0_IGO_licence [S30] | SA not allowed. |
| Google Earth Studio | Proprietary; mandatory on-screen watermark, no commercial licence | ❌ Reject | https://earth.google.com/studio/docs/attribution/ [S50] | Not on allow-list; watermark cannot fade. |
| The Met Open Access | CC0 (PD works only, marked with OA icon) | ✅ CC0 | https://www.metmuseum.org/articles/open-access-at-the-met [S25] | ~406k images; CSV data on GitHub. Check icon per item. |
| Smithsonian Open Access | CC0 for designated items | ✅ CC0 | https://www.si.edu/openaccess ; FAQ https://dashboard.si.edu/openaccess/faq [S26] | Only CC0-flagged items; API via api.data.gov key. Third-party rights (people, trademarks) may remain. |
| Rijksmuseum | CC0 for PD objects ("Public domain" in metadata) | ✅ CC0 | https://www.rijksmuseum.nl/en/data/policy [S28] | Modern works excluded. |
| Library of Congress (Free to Use; G&M Division) | "No known restrictions" per item; user must verify | ✅ PD (per item) | https://www.loc.gov/free-to-use/ ; https://www.loc.gov/item/90680842/ [S29] | Credit "Library of Congress, Geography and Map Division". Read each item's Rights & Access. |
| Openverse | Aggregator; filter "commercial" + "modify", licences CC0 / BY / PDM | ✅ with source check | https://openverse.org [S31] | Always verify licence at original source; log source URL. |
| Wikimedia Commons | Per file | ✅ with filter | https://commons.wikimedia.org/wiki/Help:Searching [S51] | Search `haswbstatement:P275=Q6938433` (CC0); also PD-USGov, PD-old categories. Skip BY-SA. |
| Unsplash | **Unsplash License** (custom, not CC0); no selling unmodified, no competing service | ❌ Not on allow-list | https://unsplash.com/license [S19] | Permissive but custom. Needs Aymen decision to add. |
| Pexels | **Pexels License** (custom); no negative portrayal of people, no endorsement, no unaltered resale | ❌ Not on allow-list | https://www.pexels.com/license/ [S20] | Same. |
| Depth Anything V2 (tool) | Small: Apache-2.0; Base/Large/Giant: CC BY-NC-4.0 | ✅ Small only | https://github.com/DepthAnything/Depth-Anything-V2 [S45] | Confirm on HF model card. |

Decision candidates for Aymen (recorded here, not decided): (1) add "Copernicus legal notice" and "Copernicus DEM licence" as allowed attribution-only licences; (2) add Unsplash/Pexels custom licences (risk: identifiable people, trademarks).

---

## 4. Visual variety budget — 12-min (720 s) long-form

Principle: no single shot type > 30 % of runtime; change *type* every 6–15 s (CLAUDE.md rule), change *register* (context/story/data/art) at least every ~60 s; one hero shot ≈ every 90 s (8 per episode).

| Shot type | Share | Seconds | Count (avg length) | Channel emphasis |
|---|---|---|---|---|
| Story map (tilted, routes, fly-to, T1/T6/T15) | 25 % | 180 | ~18 × 10 s | A high, C mid |
| Data chart (morph, camera-in-chart, units, T18–T21) | 15 % | 108 | ~10 × 11 s | C high (raise to 30 %), A low |
| Art / photo (Ken Burns, cut-out parallax, photo-in-map, T24–T26) | 15 % | 108 | ~12 × 9 s | A high, B mid (NASA/USGS) |
| Context map / globe / locator (T2, T13) | 8 % | 58 | ~6 × 10 s | all |
| Scale stage / silhouettes (T22–T23) | 10 % | 72 | ~7 × 10 s | B high (raise to 35 %) |
| Hero 3D (terrain flyover, extrusion, 3D model) | 8 % | 58 | ~6–8 × 8 s | all |
| Kinetic type / big number / quote card (T27) | 7 % | 50 | ~8 × 6 s | all |
| Diagrams / timelines / org trees | 7 % | 50 | ~5 × 10 s | A, C |
| Chapter cards + transitions (T7) | 5 % | 36 | ~6 × 6 s | all |

Cadence checks for CI (add to contact-sheet review): count distinct shot types per 60 s window (target ≥ 3); flag any window > 15 s with no type change; flag > 2 consecutive hard cuts without a continuity transition.

---

## 5. Sources (all accessed 2026-11-14)

- [S1] Johnny Harris, "How I Make My Maps" (summary page) — https://rosetta.to/u/johnnyharris/how-i-make-my-maps
- [S2] aescripts, GEOlayers 3 product page — https://aescripts.com/geolayers/
- [S3] aescripts Learn, 3D terrains with GEOlayers 3 + Helium — https://aescripts.com/learn/create-3d-terrains-in-after-effects-using-geolayers-and-helium
- [S4] Adobe Community, "How does Johnny Harris do this mask reveal animation" — https://community.adobe.com/questions-529/how-does-johnny-harris-do-this-mask-reveal-animation-in-after-effects-59396
- [S5] aescripts Learn, "Making maps for Johnny Harris – Volcanoes" (403 on fetch; title confirms AE + GEOlayers 3) — https://aescripts.com/learn/making-maps-for-johnny-harris---volcanoes
- [S6] aescripts Learn, Markus Bergelt interview (GEOlayers creator) — https://aescripts.com/learn/creating-the-most-used-map-animation-tool-geolayers-markus-bergelt
- [S7] Kurzgesagt, "Our video process" — https://kurzgesagt.org/youtube/
- [S8] Skillshare, Motion Graphics with Kurzgesagt – Part 1 — https://www.skillshare.com/en/classes/Motion-Graphics-with-Kurzgesagt-%E2%80%93-Part-1/631970755
- [S9] 80.lv, Kurzgesagt uses Blender — https://80.lv/articles/kurzgesagt-revealed-how-it-uses-blender-for-new-video-game
- [S10] Search for Kings and Generals process — no primary source found (search 2026-11-14); genre context: https://r.datuan.dev/r/AnimatedBattleMaps
- [S11] Search for Historia Civilis process — no primary source found; fan thread https://reddit.fabiomanganiello.com/r/HistoriaCivilis/comments/1g5puoe/historia_civilis_style_video_whose_not_about
- [S12] Wendover / Sam Denby Oxford Union summary — https://summify.io/discover/wendover-productions-sam-denby-interview-at-the-oxford-union-_q8k3q
- [S13] A Sound Effect, Melodysheep "Timelapse of the Future" interview — https://www.asoundeffect.com/timelapse-of-the-future-sound/
- [S14] FlowingData, "Scale of all the things compared to you" — https://flowingdata.com/2023/12/21/scale-of-all-the-things-compared-to-you/
- [S15] Morphic, infinite zoom vs earth zoom — https://morphic.com/de/resources/vfx/infinite-zoom-effect ; Powers of Ten — https://abakcus.com/videos/powers-of-ten
- [S16] Manim Transform explanation (secondary) — https://codecut.ai/manim-mathematical-animations-python/ ; 3b1b Manim demo summary — https://rosetta.to/u/3blue1brown/how-i-animate-3blue1brown-a-manim-demo-with-ben-sparks
- [S17] d3 World Tour (Observable) — https://observablehq.com/notebook-kit/ex/d3/world-tour ; Jason Davies slerp gist — https://gist.github.com/jasondavies/4183701 ; interpolateZoom tour — https://vizhub.com/curran/4b2f8598f39b4ede8b2600dbce70e8a2
- [S18] Heer & Robertson 2007, Animated Transitions in Statistical Data Graphics — https://idl.uw.edu/papers/animated-transitions ; PDF https://homes.cs.washington.edu/~jheer/files/2007-AnimatedTrans-InfoVis.pdf
- [S19] Unsplash License — https://unsplash.com/license
- [S20] Pexels License — https://www.pexels.com/license/
- [S21] NASA Images and Media Usage Guidelines — https://www.nasa.gov/nasa-brand-center/images-and-media/
- [S22] NASA Earth Observatory Image Use Policy — https://earthobservatory.nasa.gov/ImageUse ; Visible Earth — https://www.visibleearth.nasa.gov/image-use-policy
- [S23] NASA SVS help/FAQ — https://svs.gsfc.nasa.gov/help/
- [S24] USGS Copyrights and Credits — https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits
- [S25] The Met, Open Access — https://www.metmuseum.org/articles/open-access-at-the-met ; policy https://www.metmuseum.org/en/policies/image-resources
- [S26] Smithsonian Open Access FAQ — https://dashboard.si.edu/openaccess/faq ; launch release https://www.si.edu/newsdesk/releases/smithsonian-releases-28-million-free-images-broader-public-use
- [S27] EOX Sentinel-2 cloudless — https://s2maps.eu ; licence history https://eox.at/2017/08/sentinel-2-global-cloudless-mosaic ; 2018 NC-SA https://eox.at/2019/02/sentinel-2-cloudless-2018/
- [S28] Rijksmuseum data policy — https://www.rijksmuseum.nl/en/data/policy
- [S29] Library of Congress Free to Use — https://www.loc.gov/free-to-use/ ; item rights example https://www.loc.gov/item/90680842/
- [S30] ESA CC BY-SA 3.0 IGO page — https://www.esa.int/Services/Creative_Commons_Attribution-ShareAlike_3.0_IGO_CC_BY-SA_3.0_IGO_licence ; ESA open access policy https://esa.int/About_Us/Digital_Agenda/ESA_affirms_Open_Access_policy_for_images_videos_and_data
- [S31] Openverse filters (Smartcopying guide) — https://smartcopying.edu.au/how-to-find-creative-commons-materials-using-the-openverse-search-portal/
- [S32] Copernicus Sentinel data licence (rev. 1) — https://ads.atmosphere.copernicus.eu/licences/ec-sentinel ; CDSE terms https://dataspace.copernicus.eu/node/10
- [S33] Trogu, "Counting But Losing Count" (Isotype) — https://journals.uc.edu/index.php/vl/article/view/5954 ; Datawrapper Isotype — https://www.datawrapper.de/blog/weeklychart-isotype
- [S34] Built In, "Why some experts hate bar chart races" — https://builtin.com/data-science/bar-chart-races ; Flourish docs https://flourish-kiln.helpscoutdocs.com/article/44-bar-chart-race-an-overview
- [S35] Remotion noise2D — https://remotion.dev/docs/noise/noise-2d
- [S36] Remotion light leaks (deprecated → effects) — https://www.remotion.dev/docs/light-leaks ; https://remotion.dev/docs/light-leaks/light-leak-effect
- [S37] Remotion transitions overview — https://remotion.dev/docs/transitions ; wipe https://www.remotion.dev/docs/transitions/presentations/wipe ; clockWipe https://www.remotion.dev/docs/transitions/presentations/clock-wipe
- [S38] Parallax principle (80.lv orbital parallax) — https://80.lv/articles/tutorial-an-orbital-parallax-effect-with-hexels/?amp=1
- [S39] Tilezen/Joerd terrain attribution — https://github.com/tilezen/joerd/blob/master/docs/attribution.md ; AWS registry https://registry.opendata.aws/terrain-tiles
- [S40] GEBCO terms of use — https://www.gebco.net/data-products/gridded-bathymetry/terms-of-use ; GEBCO 2025 grid https://www.gebco.net/data-products-gridded-bathymetry-data/gebco2025-grid
- [S41] Remotion TransitionSeries — https://www.remotion.dev/docs/transitions/transitionseries
- [S42] Kim et al. 2019 (staging preference) via NSF PAR — https://par.nsf.gov/servlets/purl/10172013
- [S43] Cloudinary Ken Burns guide (secondary) — https://cloudinary.com/guides/image-effects/ken-burns-effect-complete-guide-and-how-to-apply-it
- [S44] Poynter, "Meaning in Motion: Ken Burns and his effect" — https://www.poynter.org/news/meaning-motion-ken-burns-and-his-effect
- [S45] Depth Anything V2 README (licence split) — https://cdn.jsdelivr.net/gh/depthanything/depth-anything-v2@main/README.md
- [S46] Pattern-interrupt cadence is not a platform rule (secondary) — https://www.creatoressentials.com/glossary/pattern-interrupt/ ; AIR retention editing https://air.io/en/youtube-hacks/advanced-retention-editing-cutting-patterns-that-keep-viewers-past-minute-8
- [S47] NOAA Photo Library About — https://photolib.noaa.gov/About
- [S48] Natural Earth terms of use — https://www.naturalearthdata.com/about/terms-of-use/
- [S49] Copernicus DEM GLO-30 licence PDF — https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf
- [S50] Google Earth Studio attribution — https://earth.google.com/studio/docs/attribution/ ; Google geo guidelines https://about.google/brand-resource-center/products-and-services/geo-guidelines/
- [S51] Wikimedia Commons Help:Searching — https://commons.wikimedia.org/wiki/Help:Searching
