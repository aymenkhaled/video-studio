import React, {useMemo} from 'react';
import {geoArea, geoConicConformal, geoGraticule, geoInterpolate, geoMercator, geoOrthographic, geoPath, GeoProjection, geoGraticule10} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Topology, GeometryCollection} from 'topojson-specification';
import land50 from 'world-atlas/land-50m.json';
import land110 from 'world-atlas/land-110m.json';
import {evolvePath, getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {loadFont as loadCinzel} from '@remotion/google-fonts/Cinzel';
import {clamp01, easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';

// Map engine v1 (channels A "History in Maps" and C "Money & Maps").
// Everything is a pure function of scene progress p (0..1) so scene length can follow the voice.
// Coastlines: Natural Earth 1:50m via world-atlas (public domain data, ISC package). No modern borders:
// historical territories are our own approximate polygons, clipped to land.

export const {fontFamily: CINZEL} = loadCinzel('normal', {weights: ['600', '700'], subsets: ['latin']});

export type LonLat = [number, number];
export type CamKey = {at: number; center: LonLat; zoom: number};
export type Territory = {id: string; rings: LonLat[][]; color: string; label?: string; labelAt?: LonLat; grow?: [number, number]; origin?: LonLat; opacity?: number; fadeOut?: [number, number]};
export type Route = {id: string; points: LonLat[]; color: string; draw: [number, number]; width?: number; dashed?: boolean; unit?: Unit};
export type Unit = {label: string; color: string; kind?: 'infantry' | 'cavalry' | 'elephant'};
export type City = {name: string; at: LonLat; appear?: number; size?: number; align?: 'left' | 'right'};
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
};

const toLand = (t: unknown) => {
  const topo = t as Topology<{land: GeometryCollection}>;
  return feature(topo, topo.objects.land);
};
// Level of detail: 1:110m coastlines when zoomed out (cheap), 1:50m when zoomed in.
const FINE_GRID = geoGraticule().step([2, 2])();
const LAND_LO = toLand(land110);
const LAND_HI = toLand(land50);

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

const UnitIcon: React.FC<{x: number; y: number; angle: number; unit: Unit; s?: number}> = ({x, y, unit, s = 1}) => {
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
export const MapShot: React.FC<{spec: MapSpec; p: number; width: number; height: number; uid?: string}> = ({spec, p, width, height, uid = 'm'}) => {
  const theme = spec.theme ?? PARCHMENT;
  const base = cameraAt(spec.camera, p);
  // "Living camera": a constant slow push-in so no shot is ever static (freezedetect rule), on top of keyframes.
  // 12 % over the scene: keeps eased starts on close-ups above the freezedetect threshold.
  const cam = {center: base.center, zoom: base.zoom * (1 + 0.12 * p)};
  const proj = makeProjection(spec.projection, cam, width, height);
  // Cull geometry outside the frame before building SVG paths (big win when zoomed in).
  if (spec.projection !== 'globe') proj.clipExtent([[-40, -40], [width + 40, height + 40]]);
  const path = geoPath(proj);
  const polys = useMemo(() => (spec.territories ?? []).map((t) => ({...t, geo: polygon(t.rings)})), [spec.territories]);
  const landD = path(cam.zoom < 9 ? LAND_LO : LAND_HI) ?? '';
  const px = (ll: LonLat) => proj(ll) ?? [-9999, -9999];
  const zoomS = Math.min(1.6, Math.max(0.75, Math.sqrt(cam.zoom / 6)));

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
            </g>
          );
        })}
      </g>

      {/* region labels */}
      {(spec.regions ?? []).map((r) => {
        const a = easeInOutCubic(ramp(p, r.appear ?? 0, (r.appear ?? 0) + 0.12));
        const [x, y] = px(r.at);
        return (
          <text key={r.text} x={x} y={y} textAnchor="middle" fontFamily={CINZEL} fontWeight={700} fontSize={(r.size ?? 44) * zoomS} letterSpacing={8} fill="#f4ecd8" fillOpacity={0.92 * a} stroke="rgba(27,18,8,0.55)" strokeWidth={4} paintOrder="stroke">
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
            {r.unit ? <UnitIcon x={tip.x} y={tip.y - 46 * zoomS} angle={ang} unit={r.unit} s={zoomS} /> : null}
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
        return (
          <g key={c.name} opacity={a}>
            <circle cx={x} cy={y} r={9 * s} fill="#f4ecd8" stroke="#1b1208" strokeWidth={3 * s} />
            <circle cx={x} cy={y} r={3.5 * s} fill="#1b1208" />
            <text x={x + (right ? 16 : -16) * s} y={y + 9 * s} textAnchor={right ? 'start' : 'end'} fontFamily={INTER} fontWeight={700} fontSize={30 * s} fill="#f4ecd8" stroke="#1b1208" strokeWidth={6 * s} paintOrder="stroke">
              {c.name}
            </text>
          </g>
        );
      })}
      <rect width={width} height={height} fill={`url(#${uid}-vig)`} />
    </svg>
  );
};

export {clamp01};
