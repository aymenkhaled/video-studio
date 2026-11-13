?import React, {useEffect, useState} from 'react';
import type * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../../brands/scale-power/episodes/000-stage-demo/timeline.json';
import {Actor, PALETTES, useModel} from '../../packages/three/src/model';
import {breathe, handheld, look, tailWave} from '../../packages/three/src/acting';
import {Blob, EnvLight, Instances, scatter, Spec, useHDRI, useLib} from '../../packages/three/src/env';
import {Bus, GridGround, Human} from '../../packages/three/src/stage';
import {Bracket, Cam, Captions, INTER, Label, SeriesHud, TimedLine, linesFromTimeline, project} from '../../packages/engine/src/overlay';
import {clamp01, easeInOutCubic, impulse, mix, ramp} from '../../packages/engine/src/motion';

// Brand-A engine demo: "How big was T. rex next to you?" — person → bus → T. rex on a metre grid.

const REX_LEN = 12.3; // Sue, Field Museum (see sources.md)
const BUS = {x: 8, z: -1.8, len: 12, h: 3.2};
const REX_Z = 3.2;
const STOP = 12.1; // rex starts slowing here, stands beside the bus from STOP + 0.5
const HUMAN_Z = 7;

const ENV: Spec = {
  pine1: ['assets/lpn/nature_tree_pine_01.glb', {'*': '#5f7f5c'}],
  pine2: ['assets/lpn/nature_tree_pine_02.glb', {'*': '#6b8a63'}],
  tree1: ['assets/lpn/nature_tree_deciduous_02.glb', {'*': '#7f9a68'}],
  fern: ['assets/lpn/nature_bush_01.glb', {'*': '#71875a'}],
};

const keepOut = (x: number, z: number) => z > -6 && z < 40 && x > -40 && x < 50; // keep lineup + camera corridor clear (low-poly vertex-colour trees: no alpha leaves, cheap on software WebGL)
const TREES = scatter(46, 'trees', (r) => ({p: [-60 + r('x') * 140, 0, -10 - r('z') * 70], s: 2.4 + r('s') * 1.8, r: r('r') * 6.28}), keepOut);
const SMALL = scatter(30, 'small', (r) => ({p: [-30 + r('x') * 80, 0, -12 - r('z') * 14], s: 1 + r('s') * 1.2, r: r('r') * 6.28}), (x, z) => z > -12);

/** Loads voice/word timings produced by the soundtrack step; falls back to slot timings in local preview. */
const useTiming = () => {
  const [lines, setLines] = useState<TimedLine[] | null>(null);
  const [h] = useState(() => delayRender('timing'));
  useEffect(() => {
    fetch(staticFile('generated/timing.json'))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => setLines(j.lines))
      .catch(() => setLines(linesFromTimeline(timeline.voice.lines)))
      .finally(() => continueRender(h));
  }, [h]);
  return lines;
};

const CameraRig: React.FC<{cam: Cam}> = ({cam}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.fov = cam.fov;
  camera.position.set(...cam.pos);
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

/** Tale-of-the-tape bars for the wide shot (uses the empty lower frame on purpose). */
const Compare: React.FC<{t: number}> = ({t}) => {
  const rows = [
    {label: 'You', value: 1.75, color: '#e9e4d8'},
    {label: 'City bus', value: 12, color: '#8fc1e8'},
    {label: 'T. rex (Sue)', value: REX_LEN, color: '#f2c14e'},
  ];
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 990, fontFamily: INTER}}>
      {rows.map((r, i) => {
        const p = easeInOutCubic(ramp(t, 0.2 + i * 0.35, 1.2 + i * 0.35));
        return (
          <div key={r.label} style={{display: 'flex', alignItems: 'center', height: 76, opacity: p, background: 'rgba(14,16,20,0.55)', borderRadius: 12, padding: '0 18px', marginBottom: 10}}>
            <div style={{width: 270, color: '#fff', fontWeight: 800, fontSize: 40, textShadow: '0 2px 0 rgba(0,0,0,.6)'}}>{r.label}</div>
            <div style={{height: 40, width: (420 * r.value * p) / REX_LEN, background: r.color, borderRadius: 6, boxShadow: '0 3px 0 rgba(0,0,0,.35)'}} />
            <div style={{marginLeft: 16, color: '#fff', fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', textShadow: '0 2px 0 rgba(0,0,0,.6)'}}>{(r.value * p).toFixed(r.value < 10 ? 2 : 1)} m</div>
          </div>
        );
      })}
    </div>
  );
};

type Pose = {x: number; clip: string; from?: string; blend: number; clipT: number};

export const StageDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const rex = useModel('assets/dinos/Trex.fbx', {axis: 'length', metres: REX_LEN}, PALETTES.Trex);
  const lib = useLib(ENV);
  const hdri = useHDRI('assets/hdri/misty_pines.hdr');
  const lines = useTiming();
  if (!rex || !lib || !lines) return null;

  const gait = rex.userData.gait.Walk || 1.6;
  const v = Math.abs(gait);
  const rotY = gait >= 0 ? Math.PI / 2 : -Math.PI / 2;
  const xAt = (tt: number) => {
    const xs = BUS.x - 0.25 * v;
    if (tt <= STOP) return xs - v * (STOP - tt);
    const d = Math.min(tt - STOP, 0.5);
    return xs + v * (d - (d * d) / (2 * 0.5));
  };
  const xr = xAt(t);
  const slow = clamp01((t - STOP) / 0.5);
  const pose: Pose = slow <= 0 ? {x: xr, clip: 'Walk', blend: 1, clipT: t} : {x: xr, clip: 'Idle', from: 'Walk', blend: slow, clipT: t - STOP};
  const hx = xAt(0) + 7; // person stands ~7 m ahead of the approaching rex at frame 0

  // ---------- shots ----------
  const [hxj, hyj] = handheld(t, 0.8);
  const shake = impulse(t, 12.7, 6) * 0.12;
  let cam: Cam;
  let shot: string;
  if (t < 5.4) {
    shot = 'hook';
    const k = easeInOutCubic(ramp(t, 0, 5.4));
    cam = {pos: [hx + 4.6 - 1.0 * k + hxj, 1.5 + hyj, HUMAN_Z + 4.4 - 0.8 * k], target: [mix(hx - 4, xr + 3, k), mix(2.6, 4.0, k), mix(5.4, REX_Z, k)], fov: 60};
  } else if (t < 9.2) {
    shot = 'bus';
    const k = easeInOutCubic(ramp(t, 5.4, 9.2));
    cam = {pos: [BUS.x + 16 - 2 * k, 6.5 - 0.6 * k, BUS.z + 16 - 1.5 * k], target: [BUS.x - 0.5, 1.2, BUS.z], fov: 50};
  } else if (t < 13.8) {
    shot = 'rex-pass';
    cam = {pos: [xr + 11 + hxj, 6.5 + hyj + shake, REX_Z + 14], target: [xr - 1, 2.6, 0.5], fov: 50};
  } else {
    shot = 'wide';
    const k = easeInOutCubic(ramp(t, 13.8, 20));
    cam = {pos: [BUS.x + 17 + 2 * k, 9 + 3 * k, 22 + 3 * k], target: [BUS.x - 1, 1.8, 0.5], fov: 46};
  }
  const st = (a: number) => t - a;

  // ---------- acting ----------
  const post = (o: THREE.Object3D) => {
    tailWave(o, t, {amp: 1, flick: impulse(t, 12.7, 3)});
    breathe(o, t);
    if (shot === 'wide') look(o, 0.45 * easeInOutCubic(ramp(t, 15, 17)), 0);
  };

  // ---------- overlay geometry ----------
  const P = (p: [number, number, number]) => project(cam, p, width, height);
  const rexH = rex.userData.size.y;
  const busFrontZ = BUS.z + 1.275 + 0.7; // bus bracket on the ground in front of the bus, rex bracket above the rex
  const busA = P([BUS.x - BUS.len / 2, 0.08, busFrontZ]);
  const busB = P([BUS.x + BUS.len / 2, 0.08, busFrontZ]);
  const rexA = P([xr - REX_LEN / 2, rexH + 0.5, REX_Z]);
  const rexB = P([xr + REX_LEN / 2, rexH + 0.5, REX_Z]);
  const head = P([hx, 1.95, HUMAN_Z]);

  return (
    <AbsoluteFill style={{background: '#aeb9b6'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 50, near: 0.1, far: 600}} gl={{antialias: true}}>
        <CameraRig cam={cam} />
        <color attach="background" args={['#aeb9b6']} />
        <fog attach="fog" args={['#aeb9b6', 50, 180]} />
        <EnvLight tex={hdri} intensity={0.35} />
        <hemisphereLight args={['#e6eef0', '#5d5540', 0.4]} />
        <directionalLight
          position={[BUS.x + 18, 30, 22]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-camera-far={120}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-20, 10, -25]} intensity={0.9} color="#ffe7c4" />
        <GridGround base="#857d62" line="#766f57" bold="#5d5744" />
        <Instances parts={lib.pine1} items={TREES.filter((_, i) => i % 3 === 0)} t={t} sway={0.01} />
        <Instances parts={lib.pine2} items={TREES.filter((_, i) => i % 3 === 1)} t={t} sway={0.01} />
        <Instances parts={lib.tree1} items={TREES.filter((_, i) => i % 3 === 2)} t={t} sway={0.012} />
        <Instances parts={lib.fern} items={SMALL} t={t} sway={0.03} />
        <Bus position={[BUS.x, 0, BUS.z]} length={BUS.len} />
        <Blob x={BUS.x} z={BUS.z} rx={13.5} rz={4} opacity={0.35} />
        <Human position={[hx, 0, HUMAN_Z]} rotationY={-0.6} />
        <Blob x={hx} z={HUMAN_Z} rx={0.9} opacity={0.4} />
        <Actor obj={rex} clip={pose.clip} from={pose.from} fromT={t} blend={pose.blend} t={pose.clipT} position={[xr, 0, REX_Z]} rotationY={rotY} post={post} />
        <Blob x={xr} z={REX_Z} rx={10} rz={3.4} opacity={0.4} />
      </ThreeCanvas>

      {/* overlays */}
      {shot === 'hook' && head.visible ? <Label x={head.x} y={head.y} text="1.75 m" sub="you" appear={ramp(t, 0.3, 0.9) - ramp(t, 4.9, 5.3)} /> : null}
      {shot === 'bus' || shot === 'rex-pass' ? <Bracket a={busA} b={busB} progress={shot === 'bus' ? ramp(t, 6.0, 7.8) : 1} value={12} decimals={shot === 'bus' ? 1 : 0} label="bus" color="#8fc1e8" /> : null}
      {shot === 'rex-pass' ? <Bracket a={rexA} b={rexB} progress={shot === 'rex-pass' ? ramp(t, 10.4, 12.6) : 1} value={REX_LEN} label="T. rex" /> : null}
      <SeriesHud tag="SIZE CHECK" progress={t / 20} />
      {shot === 'wide' ? <Compare t={t - 14.2} /> : null}
      <Captions lines={lines} t={t} top={1290} />
      {/* soft cut flash between shots */}
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, ...[5.4, 9.2, 13.8].map((c) => 0.35 * (1 - Math.abs(st(c)) / 0.12))), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

