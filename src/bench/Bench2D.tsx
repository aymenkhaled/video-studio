import React, {useMemo} from 'react';
import {geoNaturalEarth1, geoPath, geoGraticule10} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Topology, GeometryCollection} from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOutCubic, ramp, mix, drift} from '../../packages/engine/src/motion';

// Benchmark + Brand-B map seed: d3-geo world map with an eased virtual camera (pan/zoom),
// a self-drawing route, unit blocks, and an animated bar chart with counters.

const BARS = [
  {label: 'Blue whale', value: 30},
  {label: 'Argentinosaurus', value: 35},
  {label: 'Megalodon', value: 18},
  {label: 'T. rex', value: 12.3},
];

export const Bench2D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  const {countries, graticule, path, project} = useMemo(() => {
    const topo = world as unknown as Topology<{countries: GeometryCollection}>;
    const fc = feature(topo, topo.objects.countries);
    const projection = geoNaturalEarth1().fitSize([width, width * 0.55], fc);
    const p = geoPath(projection);
    return {
      countries: fc.features.map((f) => p(f) ?? ''),
      graticule: p(geoGraticule10()) ?? '',
      path: p,
      project: (lon: number, lat: number) => projection([lon, lat]) ?? [0, 0],
    };
  }, [width]);

  // Virtual camera: world → zoom on the Mediterranean (Carthage → Rome) between 1 s and 5 s.
  const z = easeInOutCubic(ramp(t, 1, 5));
  const [cx, cy] = project(12, 40);
  const scale = mix(1, 3.4, z);
  const tx = mix(width / 2, cx, z);
  const ty = mix(width * 0.275, cy, z);

  const route = path({type: 'LineString', coordinates: [[10.32, 36.85], [9.2, 39.2], [12.5, 41.9]]}) ?? '';
  const draw = easeInOutCubic(ramp(t, 4, 7.5));
  const bars = easeInOutCubic(ramp(t, 6, 9.5));
  const max = Math.max(...BARS.map((b) => b.value));

  return (
    <AbsoluteFill style={{background: '#0f1a24', fontFamily: 'sans-serif'}}>
      <svg width={width} height={height * 0.62} style={{position: 'absolute', top: 120}}>
        <g transform={`translate(${width / 2 + drift(t, 3, 6)}, ${height * 0.31}) scale(${scale}) translate(${-tx}, ${-ty})`}>
          <path d={graticule} fill="none" stroke="#24384a" strokeWidth={1 / scale} />
          {countries.map((d, i) => (
            <path key={i} d={d} fill={i % 7 === 0 ? '#3d5a45' : '#2f4a3a'} stroke="#8fae8f" strokeWidth={0.6 / scale} />
          ))}
          <path d={route} fill="none" stroke="#e8b04a" strokeWidth={4 / scale} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {Array.from({length: 12}, (_, i) => {
            const [ux, uy] = project(9.6 + (i % 4) * 0.35, 38.4 + Math.floor(i / 4) * 0.35);
            const s = 10 / scale;
            return <rect key={i} x={ux + draw * 18 / scale} y={uy - draw * 30 / scale} width={s} height={s * 0.6} fill="#c8483a" stroke="#1b0d0a" strokeWidth={1 / scale} />;
          })}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1260}}>
        {BARS.map((b, i) => (
          <div key={b.label} style={{display: 'flex', alignItems: 'center', marginBottom: 26, opacity: ramp(t, 6 + i * 0.3, 6.6 + i * 0.3)}}>
            <div style={{width: 300, color: '#e6e2d6', fontSize: 34}}>{b.label}</div>
            <div style={{height: 46, width: (600 * b.value * bars) / max, background: '#e8b04a', borderRadius: 6}} />
            <div style={{marginLeft: 16, color: '#e6e2d6', fontSize: 34, fontVariantNumeric: 'tabular-nums'}}>{(b.value * bars).toFixed(1)} m</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
