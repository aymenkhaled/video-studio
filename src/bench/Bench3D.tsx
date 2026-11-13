import React, {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {Actor, PALETTES, useModel} from '../../packages/three/src/model';
import {easeInOutCubic, ramp} from '../../packages/engine/src/motion';

// Benchmark + Brand-A "measurement stage" seed. 3D, no post-processing.
// A T. rex walks along a lineup next to a 1.75 m human block on a 2 m ground grid; dolly camera.

type V3 = [number, number, number];

/** Positions the default camera deterministically every frame. */
const CameraRig: React.FC<{pos: V3; target: V3}> = ({pos, target}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...pos);
  camera.lookAt(...target);
  camera.updateProjectionMatrix();
  return null;
};

export const Bench3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const trex = useModel('assets/dinos/Trex.fbx', {axis: 'height', metres: 4.6}, PALETTES.Trex);
  const grid = useMemo(() => new THREE.GridHelper(200, 100, '#efe6c8', '#7d7660'), []);
  const k = easeInOutCubic(ramp(t, 0, 10));
  const x = -6 + 12 * k;
  const pos: V3 = [x - 9 + 4 * k, 3.2 + 1.5 * k, 16 - 3 * k];

  return (
    <AbsoluteFill style={{background: '#b9c4c9'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 38, near: 0.1, far: 400}} gl={{antialias: true}}>
        <CameraRig pos={pos} target={[x, 2.2, 0]} />
        <color attach="background" args={['#b9c4c9']} />
        <fog attach="fog" args={['#b9c4c9', 30, 140]} />
        <hemisphereLight args={['#eef3f5', '#5a5440', 0.9]} />
        <directionalLight
          position={[12, 20, 8]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color="#9a9274" roughness={1} />
        </mesh>
        <primitive object={grid} position={[0, 0.01, 0]} />
        <mesh position={[2, 0.875, 3]} castShadow>
          <boxGeometry args={[0.45, 1.75, 0.25]} />
          <meshStandardMaterial color="#2b2f36" flatShading />
        </mesh>
        <Actor obj={trex} clip="Walk" t={t} position={[x, 0, 0]} rotationY={Math.PI / 2} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
