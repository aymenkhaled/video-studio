import React, {useMemo} from 'react';
import {geoArea, geoConicConformal, geoGraticule, geoInterpolate, geoMercator, geoOrthographic, geoPath, GeoProjection, geoGraticule10} from 'd3-geo';
import {feature, mesh} from 'topojson-client';
import type {Topology, GeometryCollection} from 'topojson-specification';
import land50 from 'world-atlas/land-50m.json';
import land110 from 'world-atlas/land-110m.json';
import countries50 from 'world-atlas/countries-50m.json';
import countries110 from 'world-atlas/countries-110m.json';
import {evolvePath, getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {loadFont as loadCinzel} from '@remotion/google-fonts/Cinzel';
import {clamp01, easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';
import {kmLabel, layoutLabels, type LabelBox} from './clarity-logic';
import {usePublicJson} from './media';
import {Figure} from './figures';
import {staticFile} from 'remotion';
import {geoLength} from 'd3-geo';

// Map engine v1 (channels A "History in Maps" and C "Money & Maps").
// Everything is a pure function of scene progress p (0..1) so scene length can follow the voice.
// Coastlines + optional modern borders: Natural Earth 1:50m/1:110m via world-atlas (public domain data, ISC package).
// Historical territories are our own approximate polygons, clipped to land.

export const {fontFamily: CINZEL} = loadCinzel('normal', {weights: ['600', '700'], subsets: ['latin']});

export type LonLat = [number, number];
export type CamKey = {at: number; center: LonLat; zoom: number};
export type Territory = {id: string; rings: LonLat[][]; color: string; label?: string; labelAt?: LonLat; grow?: [number, number]; origin?: LonLat; opacity?: number; fadeOut?: [number, number]; pattern?: 'hatch' | 'dots'};
export type Route = {id: string; points: LonLat[]; color: string; draw: [number, number]; width?: number; dashed?: boolean; unit?: Unit; /** show "≈ N km" at the middle once drawn */ km?: boolean};
export type Unit = {label: string; color: string; kind?: 'infantry' | 'cavalry' | 'elephant'};
export type City = {name: string; at: LonLat; appear?: number; size?: number; align?: 'left' | 'right'; today?: string};
export type RegionLabel = {text: string; at: LonLat; appear?: number; size?: number};
export type MapTheme = {sea: string; land: string; coast: string; graticule: string; text: string};

export const PARCHMENT: MapTheme = {sea: '#1b2f3a', land: '#d8c9a3', coast: '#5a4a32', graticule: 'rgba(216,201,163,0.08)', text: '#2a2116'};

export type MapSpec = {
  projection?: 'mercator' | 'conic' | 'globe';
  camera: CamKey[];
  territories?: Territory[];
  routes?: Route[];
  cities?: City[];
  regions?: RegionLabel[];
  theme?: MapTheme;
  /** Clarity Kit: faint modern borders + modern country names, for orientation. */
  modern?: {labels: RegionLabel[]; opacity?: number};
  /** Clarity Kit: move labels so none overlap (units > cities > regions > modern names). */
  avoidLabels?: boolean;
  /** Clarity Kit: Natural Earth shaded relief under the land colour (Mercator only; needs fetch_media.py). */
  relief?: boolean;
  /** Clarity Kit: rivers to draw (Natural Earth names) + optional labels. */
  rivers?: {name: string; label?: string; at?: LonLat}[];
  /** Clarity Kit: minimum on-screen text size in px (phone readability). */
  minText?: number;
};

const toLand = (t: unknown) => {
  const topo = t as Topology<{land: GeometryCollection}>;
  return feature(topo, topo.objects.land);
};
// Level of detail: 1:110m coastlines when zoomed out (cheap), 1:50m when zoomed in.
const FINE_GRID = geoGraticule().step([2, 2])();
const LAND_LO = toLand(land110);
const LAND_HI = toLand(land50);
// Modern borders (internal borders only, coastlines come from the land layer).
const toBorders = (t: unknown) => {
  const topo = t as Topology<{countries: GeometryCollection}>;
  return mesh(topo, topo.objects.countries, (a, b) => a !== b);
};
const BORDERS_LO = toBorders(countries110);
const BORDERS_HI = toBorders(countries50);

/** d3 treats ring winding as meaningful: a ring with area > hemisphere means "everything but"; fix it. */
const polygon = (rings: LonLat[][]) => {
  const g = {type: 'Polygon' as const, coordinates: rings.map((r) => (r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] ? r : [...r, r[0]]))};
  if (geoArea(g) > 2 * Math.PI) g.coordinates = g.coordinates.map((r) => [...r].reverse());
  return g;
};

/** Camera at progress p: centre on a great circle, zoom geometric, eased between keys. */
export const cameraAt = (keys: CamKey[], p: number): {center: LonLat; zoom: number} => {
  if (p <= keys[0].at) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p <= b.at) {
      const k = easeInOutCubic((p - a.at) / Math.max(1e-6, b.at - a.at));
      const center = geoInterpolate(a.center, b.center)(k) as LonLat;
      return {center, zoom: Math.exp(mix(Math.log(a.zoom), Math.log(b.zoom), k))};
    }
  }
  return keys[keys.length - 1];
};

export const makeProjection = (kind: MapSpec['projection'], cam: {center: LonLat; zoom: number}, w: number, h: number): GeoProjection => {
  if (kind === 'globe') return geoOrthographic().rotate([-cam.center[0], -cam.center[1]]).scale((h / 2.3) * cam.zoom).translate([w / 2, h / 2]).clipAngle(90);
  if (kind === 'conic')
    return geoConicConformal().parallels([30, 50]).rotate([-cam.center[0], 0]).center([0, cam.center[1]]).scale((w / (2 * Math.PI)) * cam.zoom).translate([w / 2, h / 2]);
  return geoMercator().center(cam.center).scale((w / (2 * Math.PI)) * cam.zoom).translate([w / 2, h / 2]);
};

/** Smooth SVG path through points (Catmull-Rom → cubic Bézier). */
const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
};

const UnitIcon: React.FC<{x: number; y: number; angle: number; unit: Unit; s?: number; mt?: number}> = ({x, y, unit, s = 1, mt = 0}) => {
  if (mt) {
    // Clarity Kit: illustrated figure badge instead of a NATO-style box
    const r = 30 * s;
    const kind = unit.kind === 'cavalry' ? 'cavalry' : unit.kind === 'elephant' ? 'elephant' : 'infantry';
    return (
      <g transform={`translate(${x},${y})`}>
        <circle r={r} fill="#f4ecd8" stroke={unit.color} strokeWidth={6 * s} />
        <Figure kind={kind} x={0} y={2 * s} size={r * 1.45} color={unit.color} />
        <text y={-r - 12} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={Math.max(mt, 24 * s)} fill="#f4ecd8" stroke="#1b1208" strokeWidth={7} paintOrder="stroke">
          {unit.label}
        </text>
      </g>
    );
  }
  const w = 54 * s;
  const h = 36 * s;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={unit.color} stroke="#f4ecd8" strokeWidth={3 * s} rx={3 * s} />
      {unit.kind === 'cavalry' ? <line x1={-w / 2} y1={h / 2} x2={w / 2} y2={-h / 2} stroke="#f4ecd8" strokeWidth={3 * s} /> : null}
      {unit.kind !== 'cavalry' && unit.kind !== 'elephant' ? (
        <>
          <line x1={-w / 2} y1={-h / 2} x2={w / 2} y2={h / 2} stroke="#f4ecd8" strokeWidth={3 * s} />
          <line x1={-w / 2} y1={h / 2} x2={w / 2} y2={-h / 2} stroke="#f4ecd8" strokeWidth={3 * s} />
        </>
      ) : null}
      {unit.kind === 'elephant' ? (
        <text y={9 * s} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={24 * s} fill="#f4ecd8">
          E
        </text>
      ) : null}
      <text y={-h / 2 - 10 * s} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={24 * s} fill="#f4ecd8" stroke="#1b1208" strokeWidth={5 * s} paintOrder="stroke">
        {unit.label}
      </text>
    </g>
  );
};

/** Renders one map shot at progress p (0..1). */
export const MapShot: React.FC<{spec: MapSpec; p: number; width: number; height: number; uid?: string; elapsed?: number}> = ({spec, p, width, height, uid = 'm', elapsed = 0}) => {
  const theme = spec.theme ?? PARCHMENT;
  const base = cameraAt(spec.camera, p);
  // "Living camera": a constant slow push-in so no shot is ever static (freezedetect rule), on top of keyframes.
  // 12 % over the scene: keeps eased starts on close-ups above the freezedetect threshold.
  const cam = {center: base.center, zoom: base.zoom * (1 + 0.12 * p)};
  const proj = makeProjection(spec.projection, cam, width, height);
  // Constant drift in ABSOLUTE time (6 px/s): eased keyframes start/end at zero speed, and a push measured in
  // scene fractions is too slow in long scenes — this guarantees visible motion in every second.
  if (spec.projection !== 'globe') proj.translate([width / 2 - 6 * elapsed, height / 2 - 2 * elapsed]);
  // Cull geometry outside the frame before building SVG paths (big win when zoomed in).
  if (spec.projection !== 'globe') proj.clipExtent([[-40, -40], [width + 40, height + 40]]);
  const path = geoPath(proj);
  const polys = useMemo(() => (spec.territories ?? []).map((t) => ({...t, geo: polygon(t.rings)})), [spec.territories]);
  const landD = path(cam.zoom < 9 ? LAND_LO : LAND_HI) ?? '';
  const px = (ll: LonLat) => proj(ll) ?? [-9999, -9999];
  const zoomS = Math.min(1.6, Math.max(0.75, Math.sqrt(cam.zoom / 6)));
  const mt = spec.minText ?? 0;
  const fs = (base: number) => Math.max(mt, base);
  const relief = usePublicJson<{bounds: [number, number, number, number]; w: number; h: number}>('geo/relief.json', !!spec.relief);
  const riversGeo = usePublicJson<{features: {properties: {name: string}; geometry: {type: 'MultiLineString'; coordinates: LonLat[][]}}[]}>('geo/rivers.json', !!spec.rivers?.length);
  const modernA = spec.modern ? spec.modern.opacity ?? 1 : 0;

  // Label avoidance (opt-in): estimate boxes deterministically from text length, place greedily.
  const shift = new Map<string, {dx: number; dy: number; hidden: boolean}>();
  if (spec.avoidLabels) {
    const boxes: LabelBox[] = [];
    const onScreen = (x: number, y: number) => x > 40 && x < width - 40 && y > 40 && y < height - 40;
    if (mt) {
      // Clarity overlays are fixed obstacles: chapter tracker + source (top-left), legend/globe/scale (right),
      // captions (bottom centre) and the timeline bar (bottom).
      boxes.push({id: 'o:tl', x: 0, y: 0, w: 470, h: 210, priority: 9});
      boxes.push({id: 'o:right', x: width - 400, y: 0, w: 400, h: 700, priority: 9});
      boxes.push({id: 'o:cap', x: 170, y: height - 360, w: width - 340, h: 200, priority: 9});
      boxes.push({id: 'o:time', x: 0, y: height - 150, w: width, h: 150, priority: 9});
    }
    (spec.routes ?? []).forEach((r) => {
      const pr = easeInOutCubic(ramp(p, r.draw[0], r.draw[1]));
      if (!r.unit || pr <= 0) return;
      const d = smoothPath(r.points.map((ll) => px(ll) as [number, number]));
      const tip = getPointAtLength(d, getLength(d) * pr) ?? {x: -9999, y: -9999};
      const w = Math.max(54, r.unit.label.length * 24 * 0.6) * zoomS;
      boxes.push({id: `u:${r.id}`, x: tip.x - w / 2, y: tip.y - 96 * zoomS, w, h: 72 * zoomS, priority: 4});
    });
    (spec.cities ?? []).forEach((c) => {
      if (ramp(p, c.appear ?? 0, (c.appear ?? 0) + 0.1) <= 0) return;
      const [x, y] = px(c.at);
      const s = (c.size ?? 1) * zoomS;
      boxes.push({id: `d:${c.name}`, x: x - 12 * s, y: y - 12 * s, w: 24 * s, h: 24 * s, priority: 3.5});
      const w = Math.max(c.name.length * fs(30 * s) * 0.6, c.today ? (c.today.length + 7) * fs(20 * s) * 0.55 : 0);
      const h = c.today ? fs(30 * s) * 2.1 : fs(30 * s) * 1.2;
      const right = c.align !== 'left';
      boxes.push({id: `c:${c.name}`, x: right ? x + 16 * s : x - 16 * s - w, y: y - 18 * s, w, h, priority: 3, maxShift: 70});
    });
    (spec.rivers ?? []).forEach((r) => {
      if (!r.label || !r.at) return;
      const [x, y] = px(r.at);
      if (!onScreen(x, y)) return;
      const f = fs(26 * zoomS);
      const w = r.label.length * f * 0.55;
      boxes.push({id: `v:${r.name}`, x: x - w / 2, y: y - f * 0.85, w, h: f, priority: 2});
    });
    (spec.regions ?? []).forEach((r) => {
      const [x, y] = px(r.at);
      if (!onScreen(x, y)) return;
      const f = fs((r.size ?? 44) * zoomS);
      const w = r.text.length * (f * 0.95 + 10);
      boxes.push({id: `r:${r.text}`, x: x - w / 2, y: y - f * 0.85, w, h: f, priority: 2});
    });
    (spec.modern?.labels ?? []).forEach((r) => {
      const [x, y] = px(r.at);
      if (!onScreen(x, y)) return;
      const f = fs((r.size ?? 22) * zoomS);
      const w = r.text.length * f * 0.82;
      boxes.push({id: `m:${r.text}`, x: x - w / 2, y: y - f * 0.85, w, h: f, priority: 1});
    });
    for (const pl of layoutLabels(boxes, {w: width, h: height})) shift.set(pl.id, pl);
  }
  // with avoidance on, a label that was not placed (anchor off-screen) is hidden instead of drawn at the edge
  const off = (id: string) => shift.get(id) ?? {dx: 0, dy: 0, hidden: !!spec.avoidLabels && (id.startsWith('m:') || id.startsWith('r:'))};

  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0, background: theme.sea}}>
      <defs>
        <clipPath id={`${uid}-land`}>
          <path d={landD} />
        </clipPath>
        <radialGradient id={`${uid}-vig`} cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>
      <path d={path(geoGraticule10()) ?? ''} fill="none" stroke={theme.graticule} strokeWidth={1} />
      {/* soft coastal halo, then land */}
      <path d={landD} fill="none" stroke="rgba(216,201,163,0.14)" strokeWidth={14} strokeLinejoin="round" />
      <path d={landD} fill={theme.land} stroke={theme.coast} strokeWidth={1.6} strokeLinejoin="round" />
      {relief && spec.projection !== 'globe' && spec.projection !== 'conic' ? (
        <g clipPath={`url(#${uid}-land)`} opacity={Math.max(0, 0.5 - 0.016 * Math.max(0, cam.zoom - 6))} style={{mixBlendMode: 'multiply'}}>
          {Array.from({length: 40}, (_, k) => {
            // equirectangular raster → Mercator: draw 40 latitude strips, each stretched to its projected height
            const [x0, y0, x1, y1] = relief.bounds;
            const la = y1 - ((y1 - y0) * k) / 40;
            const lb = y1 - ((y1 - y0) * (k + 1)) / 40;
            const tl = proj([x0, la]);
            const br = proj([x1, lb]);
            if (!tl || !br || br[1] < -50 || tl[1] > height + 50) return null;
            const sy = (relief.h * k) / 40;
            const sh = relief.h / 40;
            return (
              <svg key={k} x={tl[0]} y={tl[1]} width={br[0] - tl[0]} height={br[1] - tl[1] + 1} viewBox={`0 ${sy} ${relief.w} ${sh}`} preserveAspectRatio="none">
                <image href={staticFile('geo/relief.webp')} width={relief.w} height={relief.h} />
              </svg>
            );
          })}
        </g>
      ) : null}
      {/* faint 2° survey grid over land: texture so slow camera moves stay visible on featureless zooms */}
      <path d={path(FINE_GRID) ?? ''} fill="none" stroke="rgba(70,55,30,0.11)" strokeWidth={1.2} clipPath={`url(#${uid}-land)`} />

      {/* territories, clipped to land, optionally growing from an origin */}
      <g clipPath={`url(#${uid}-land)`}>
        {polys.map((t) => {
          const g = t.grow ? easeInOutCubic(ramp(p, t.grow[0], t.grow[1])) : 1;
          if (g <= 0) return null;
          const o = px(t.origin ?? t.labelAt ?? t.rings[0][0]);
          const clipId = `${uid}-grow-${t.id}`;
          return (
            <g key={t.id}>
              <clipPath id={clipId}>
                <circle cx={o[0]} cy={o[1]} r={g * Math.hypot(width, height) * 1.2} />
              </clipPath>
              <path
                d={path(t.geo) ?? ''}
                fill={t.color}
                fillOpacity={(t.opacity ?? 0.62) * (t.fadeOut ? 1 - easeInOutCubic(ramp(p, t.fadeOut[0], t.fadeOut[1])) : 1)}
                stroke={t.color}
                strokeOpacity={t.fadeOut ? 1 - easeInOutCubic(ramp(p, t.fadeOut[0], t.fadeOut[1])) : 1}
                strokeWidth={3}
                clipPath={`url(#${clipId})`}
              />
              {t.pattern ? (
                <>
                  <pattern id={`${uid}-tp-${t.id}`} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    {t.pattern === 'hatch' ? <line x1={0} y1={0} x2={0} y2={16} stroke="rgba(255,240,220,0.45)" strokeWidth={4} /> : <circle cx={8} cy={8} r={2.8} fill="rgba(255,240,220,0.5)" />}
                  </pattern>
                  <path d={path(t.geo) ?? ''} fill={`url(#${uid}-tp-${t.id})`} opacity={t.fadeOut ? 1 - easeInOutCubic(ramp(p, t.fadeOut[0], t.fadeOut[1])) : 1} clipPath={`url(#${clipId})`} />
                </>
              ) : null}
            </g>
          );
        })}
      </g>

      {/* rivers (Clarity Kit) */}
      {riversGeo && spec.rivers?.length ? (
        <g>
          {riversGeo.features
            .filter((f) => spec.rivers!.some((r) => r.name === f.properties.name))
            .map((f, k) => (
              <path key={k} d={path(f.geometry) ?? ''} fill="none" stroke="#4f7fa3" strokeWidth={3.2 * zoomS} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
            ))}
          {spec.rivers.filter((r) => r.label && r.at).map((r) => {
            const o = off(`v:${r.name}`);
            if (o.hidden || (spec.avoidLabels && !shift.has(`v:${r.name}`))) return null;
            const [x0, y0] = px(r.at!);
            const x = x0 + o.dx;
            const y = y0 + o.dy;
            return (
              <text key={r.name} x={x} y={y} textAnchor="middle" fontFamily={INTER} fontStyle="italic" fontWeight={700} fontSize={fs(26 * zoomS)} fill="#2f5f86" stroke="rgba(244,236,216,0.85)" strokeWidth={5} paintOrder="stroke">
                {r.label}
              </text>
            );
          })}
        </g>
      ) : null}

      {/* modern borders + names (Clarity Kit): faint, dashed, under historical labels */}
      {modernA > 0 ? (
        <g opacity={modernA}>
          <path d={path(cam.zoom < 9 ? BORDERS_LO : BORDERS_HI) ?? ''} fill="none" stroke="rgba(42,33,22,0.38)" strokeWidth={1.4} strokeDasharray="6 5" clipPath={`url(#${uid}-land)`} />
          {spec.modern!.labels.map((r) => {
            const o = off(`m:${r.text}`);
            if (o.hidden) return null;
            const a = easeInOutCubic(ramp(p, r.appear ?? 0, (r.appear ?? 0) + 0.12));
            const [x, y] = px(r.at);
            return (
              <text key={r.text} x={x + o.dx} y={y + o.dy} textAnchor="middle" fontFamily={INTER} fontWeight={700} fontSize={fs((r.size ?? 22) * zoomS)} letterSpacing="0.12em" fill="rgba(42,33,22,0.62)" fillOpacity={a}>
                {r.text.toUpperCase()}
              </text>
            );
          })}
        </g>
      ) : null}

      {/* region labels */}
      {(spec.regions ?? []).map((r) => {
        const a = easeInOutCubic(ramp(p, r.appear ?? 0, (r.appear ?? 0) + 0.12));
        const o = off(`r:${r.text}`);
        if (o.hidden) return null;
        const [x0, y0] = px(r.at);
        const x = x0 + o.dx;
        const y = y0 + o.dy;
        return (
          <text key={r.text} x={x} y={y} textAnchor="middle" fontFamily={CINZEL} fontWeight={700} fontSize={fs((r.size ?? 44) * zoomS)} letterSpacing={8} fill="#f4ecd8" fillOpacity={0.92 * a} stroke="rgba(27,18,8,0.55)" strokeWidth={4} paintOrder="stroke">
            {r.text}
          </text>
        );
      })}

      {/* routes: draw progressively, arrowhead + optional unit at the tip */}
      {(spec.routes ?? []).map((r) => {
        const pr = easeInOutCubic(ramp(p, r.draw[0], r.draw[1]));
        if (pr <= 0) return null;
        const d = smoothPath(r.points.map((ll) => px(ll) as [number, number]));
        const len = getLength(d);
        const ev = evolvePath(pr, d);
        const tip = getPointAtLength(d, len * pr) ?? {x: -9999, y: -9999};
        const tan = getTangentAtLength(d, Math.max(0.01, len * pr)) ?? {x: 1, y: 0};
        const ang = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
        const w = (r.width ?? 9) * zoomS;
        return (
          <g key={r.id}>
            <path d={d} fill="none" stroke="rgba(10,6,2,0.45)" strokeWidth={w + 6} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
            <path d={d} fill="none" stroke={r.color} strokeWidth={w} strokeLinecap="round" strokeDasharray={r.dashed ? `${w * 2} ${w * 1.4}` : ev.strokeDasharray} strokeDashoffset={r.dashed ? 0 : ev.strokeDashoffset} />
            <polygon points={`0,${-w * 1.6} ${w * 2.6},0 0,${w * 1.6}`} fill={r.color} stroke="rgba(10,6,2,0.6)" strokeWidth={2} transform={`translate(${tip.x},${tip.y}) rotate(${ang})`} />
            {r.km && pr > 0.98 ? (() => {
              const mid = getPointAtLength(d, len / 2) ?? {x: 0, y: 0};
              const km = geoLength({type: 'LineString', coordinates: r.points}) * 6371;
              return (
                <text x={mid.x} y={mid.y - 18} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={fs(30 * zoomS)} fill="#f4ecd8" stroke="#1b1208" strokeWidth={6} paintOrder="stroke">
                  {kmLabel(km)}
                </text>
              );
            })() : null}
            {r.unit ? <UnitIcon x={tip.x} y={tip.y - 46 * zoomS} angle={ang} unit={r.unit} s={zoomS} mt={mt} /> : null}
          </g>
        );
      })}

      {/* cities */}
      {(spec.cities ?? []).map((c) => {
        const a = easeInOutCubic(ramp(p, c.appear ?? 0, (c.appear ?? 0) + 0.1));
        if (a <= 0) return null;
        const [x, y] = px(c.at);
        const s = (c.size ?? 1) * zoomS;
        const right = c.align !== 'left';
        const o = off(`c:${c.name}`);
        const tx = x + (right ? 16 : -16) * s + o.dx;
        const ty = y + 9 * s + o.dy;
        const ta = easeInOutCubic(ramp(p, (c.appear ?? 0) + 0.04, (c.appear ?? 0) + 0.14));
        return (
          <g key={c.name} opacity={a}>
            <circle cx={x} cy={y} r={9 * s} fill="#f4ecd8" stroke="#1b1208" strokeWidth={3 * s} />
            <circle cx={x} cy={y} r={3.5 * s} fill="#1b1208" />
            {o.hidden ? null : (
              <>
                {(o.dx || o.dy) && Math.hypot(o.dx, o.dy) < 140 ? <line x1={x} y1={y} x2={tx} y2={ty - 9 * s} stroke="#1b1208" strokeWidth={2 * s} opacity={0.7} /> : null}
                <text x={tx} y={ty} textAnchor={right ? 'start' : 'end'} fontFamily={INTER} fontWeight={800} fontSize={fs(30 * s)} fill="#f4ecd8" stroke="#1b1208" strokeWidth={6 * s} paintOrder="stroke">
                  {c.name}
                </text>
                {c.today ? (
                  <text x={tx} y={ty + Math.max(28 * s, mt * 0.95)} textAnchor={right ? 'start' : 'end'} fontFamily={INTER} fontStyle="italic" fontWeight={600} fontSize={fs(20 * s) * (mt ? 0.88 : 1)} fill="#f4ecd8" fillOpacity={ta} stroke="#1b1208" strokeWidth={5 * s} paintOrder="stroke">
                    today: {c.today}
                  </text>
                ) : null}
              </>
            )}
          </g>
        );
      })}
      <rect width={width} height={height} fill={`url(#${uid}-vig)`} />
    </svg>
  );
};

export {clamp01};
