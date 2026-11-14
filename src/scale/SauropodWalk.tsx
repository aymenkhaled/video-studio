import React from 'react';
import type * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {Actor, PALETTES, useModel} from '../../packages/three/src/model';
import {breathe, handheld} from '../../packages/three/src/acting';
import {Blob} from '../../packages/three/src/env';
import {Bus, GridGround, Human} from '../../packages/three/src/stage';
import {Cam, INTER, project} from '../../packages/engine/src/overlay';
import {easeInOutCubic, mix, ramp} from '../../packages/engine/src/motion';
import type {CustomShotProps} from '../../packages/engine/src/map/episode';

// 3D hero shot for "Titans on land": a licensed CC0 Apatosaurus model (Quaternius) at its real ~22 m length walks past
// a 12 m bus and a 1.75 m person on a 1 m grid. Real walk cycle at the measured gait speed (no sliding), no fog,
// rim light for silhouette, no post-processing. Two camera parts so each scene stays <= 15 s.

const LEN = 22; // Apatosaurus louisae, ~21-23 m (see sources.md)
const BUS = {x: 6, z: -7, len: 12};
const HUMAN: [number, number, number] = [14, 0, 5];
const PART_A = 11.5; // seconds of part A, so part B continues the walk

const CameraRig: React.FC<{cam: Cam}> = ({cam}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.fov = cam.fov;
  camera.position.set(...cam.pos);
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

const CONIFERS = Array.from({length: 18}, (_, i) => ({x: -60 + i * 8.3 + ((i * 37) % 7), z: -26 - ((i * 53) % 17), h: 9 + ((i * 29) % 9)}));

const Tag: React.FC<{x: number; y: number; title: string; sub: string; a: number; you?: boolean}> = ({x, y, title, sub, a, you}) =>
  a <= 0 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)', opacity: a, textAlign: 'center', fontFamily: INTER, color: '#f6f1e4', textShadow: '0 2px 0 rgba(0,0,0,0.7)'}}>
      <div style={{fontWeight: 900, fontSize: 40, whiteSpace: 'nowrap'}}>
        {you ? <span style={{background: '#f2c14e', color: '#1a1408', borderRadius: 8, padding: '0 10px', marginRight: 10, textShadow: 'none'}}>YOU</span> : null}
        {title}
      </div>
      <div style={{display: 'inline-block', marginTop: 4, background: 'rgba(10,14,18,0.78)', borderRadius: 10, padding: '2px 12px', fontWeight: 800, fontSize: 32, color: '#f2c14e', whiteSpace: 'nowrap'}}>{sub}</div>
      <div style={{width: 3, height: 26, background: '#f6f1e4', margin: '4px auto 0'}} />
    </div>
  );

const Walk: React.FC<CustomShotProps & {part: 'a' | 'b'}> = ({p, elapsed, width, height, part}) => {
  const t = part === 'a' ? elapsed : PART_A + elapsed;
  const dino = useModel('assets/dinos/Apatosaurus.fbx', {axis: 'length', metres: LEN}, PALETTES.Apatosaurus);
  if (!dino) return <AbsoluteFill style={{background: '#9cc3d8'}} />;
  const gait = dino.userData.gait.Walk || 1.2;
  const v = Math.abs(gait);
  const rotY = gait >= 0 ? Math.PI / 2 : -Math.PI / 2;
  const xd = -26 + v * t; // walks along +x past the bus
  const [hx, hy] = handheld(t, 0.6);
  let cam: Cam;
  if (part === 'a') {
    // from the person's eye level, looking up at the passing giant, then craning back
    const k = easeInOutCubic(ramp(p, 0, 1));
    cam = {pos: [mix(HUMAN[0] + 3, HUMAN[0] + 9, k) + hx, mix(1.7, 7, k) + hy, mix(HUMAN[2] + 6, HUMAN[2] + 22, k)], target: [mix(xd + 4, xd, k), mix(5, 4, k), 0], fov: mix(62, 50, k)};
  } else {
    // wide side view: the whole animal, the bus and the person in one frame
    const k = easeInOutCubic(ramp(p, 0, 1));
    cam = {pos: [mix(4, 16, k) + hx, 9 + hy, 52], target: [mix(4, 14, k), 4.5, -2], fov: 50};
  }
  const P = (q: [number, number, number]) => project(cam, q, width, height);
  const head = P([HUMAN[0], 2.2, HUMAN[2]]);
  const bus = P([BUS.x, 3.8, BUS.z]);
  const top = P([xd + LEN * 0.18, 8.2, 0]);
  const tagA = (from: number) => easeInOutCubic(ramp(p, from, from + 0.08)) * (1 - easeInOutCubic(ramp(p, 0.93, 1)));
  return (
    <AbsoluteFill style={{background: '#9cc3d8'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 50, near: 0.1, far: 700}} gl={{antialias: true}}>
        <CameraRig cam={cam} />
        <color attach="background" args={['#9cc3d8']} />
        <hemisphereLight args={['#eaf4f8', '#6b5d3e', 0.75]} />
        <directionalLight
          position={[30, 40, 30]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-camera-far={140}
          shadow-bias={-0.0004}
        />
        {/* rim light from behind: separates the silhouette from the sky (no fog: it flattens low-poly) */}
        <directionalLight position={[-20, 18, -40]} intensity={1.3} color="#ffe2b8" />
        <GridGround base="#9a8b62" line="#887a55" bold="#6c6043" />
        {CONIFERS.map((c, i) => (
          <group key={i} position={[c.x, 0, c.z]}>
            <mesh position={[0, c.h * 0.15, 0]}>
              <cylinderGeometry args={[0.35, 0.45, c.h * 0.3, 6]} />
              <meshStandardMaterial color="#4d4330" roughness={1} flatShading />
            </mesh>
            <mesh position={[0, c.h * 0.6, 0]}>
              <coneGeometry args={[c.h * 0.22, c.h * 0.8, 7]} />
              <meshStandardMaterial color={i % 2 ? '#4f6b45' : '#5d7a4f'} roughness={1} flatShading />
            </mesh>
          </group>
        ))}
        <Bus position={[BUS.x, 0, BUS.z]} length={BUS.len} />
        <Blob x={BUS.x} z={BUS.z} rx={7} rz={2} opacity={0.3} />
        <Human position={HUMAN} rotationY={-0.5} color="#2f3a46" />
        <Blob x={HUMAN[0]} z={HUMAN[2]} rx={0.6} opacity={0.4} />
        <Actor obj={dino} clip="Walk" t={t} position={[xd, 0, 0]} rotationY={rotY} post={(o) => breathe(o, t)} />
        <Blob x={xd} z={0} rx={LEN * 0.45} rz={3} opacity={0.35} />
      </ThreeCanvas>
      {head.visible ? <Tag x={head.x} y={head.y} title="" sub="1.75 m · 5.7 ft" a={tagA(0.05)} you /> : null}
      {part === 'b' && bus.visible ? <Tag x={bus.x} y={bus.y} title="Bus" sub="12 m · 39 ft" a={tagA(0.12)} /> : null}
      {top.visible && (part === 'b' || p > 0.55) ? <Tag x={top.x} y={top.y} title="Apatosaurus" sub="about 22 m · 72 ft" a={tagA(part === 'b' ? 0.2 : 0.6)} /> : null}
      <div style={{position: 'absolute', right: 36, top: 32, background: 'rgba(10,14,18,0.7)', borderRadius: 10, padding: '6px 16px', fontFamily: INTER, fontWeight: 800, fontSize: 30, color: '#f6f1e4'}}>
        3D RECONSTRUCTION <span style={{color: '#f2c14e'}}>· grid lines every 1 m</span>
      </div>
    </AbsoluteFill>
  );
};

export const SauropodWalkA: React.FC<CustomShotProps> = (props) => <Walk {...props} part="a" />;
export const SauropodWalkB: React.FC<CustomShotProps> = (props) => <Walk {...props} part="b" />;
