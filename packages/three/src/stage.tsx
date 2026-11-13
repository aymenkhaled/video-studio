import React, {useMemo} from 'react';
import * as THREE from 'three';

// Brand-A "measurement stage" props: metre-grid ground and real-size scale references.

/** Ground plane with 1 m lines and bold 5 m lines (real scale, so viewers can count metres). */
export const GridGround: React.FC<{size?: number; base?: string; line?: string; bold?: string}> = ({size = 400, base = '#a89f7f', line = '#8f866a', bold = '#6f6750'}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 1000; // 10 m tile → 100 px per metre
    const g = c.getContext('2d')!;
    g.fillStyle = base;
    g.fillRect(0, 0, 1000, 1000);
    for (let i = 0; i <= 10; i++) {
      const isBold = i % 5 === 0;
      g.strokeStyle = isBold ? bold : line;
      g.lineWidth = isBold ? 7 : 3;
      g.beginPath();
      g.moveTo(i * 100, 0);
      g.lineTo(i * 100, 1000);
      g.moveTo(0, i * 100);
      g.lineTo(1000, i * 100);
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(size / 10, size / 10);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [size, base, line, bold]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={tex} roughness={1} metalness={0} />
    </mesh>
  );
};

const slate = '#2a2f38';
/** Low-poly person, `height` metres tall (default 1.75 m), facing +z. */
export const Human: React.FC<{height?: number; position?: [number, number, number]; rotationY?: number; color?: string}> = ({height = 1.75, position = [0, 0, 0], rotationY = 0, color = slate}) => {
  const k = height / 1.75;
  const mat = <meshStandardMaterial color={color} roughness={0.8} flatShading />;
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={k}>
      <mesh position={[-0.1, 0.43, 0]} castShadow>
        <boxGeometry args={[0.15, 0.86, 0.17]} />
        {mat}
      </mesh>
      <mesh position={[0.1, 0.43, 0]} castShadow>
        <boxGeometry args={[0.15, 0.86, 0.17]} />
        {mat}
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.42, 0.6, 0.22]} />
        {mat}
      </mesh>
      <mesh position={[-0.27, 1.12, 0]} rotation={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[0.1, 0.62, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[0.27, 1.12, 0]} rotation={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[0.1, 0.62, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <icosahedronGeometry args={[0.13, 1]} />
        {mat}
      </mesh>
    </group>
  );
};

/** Generic city bus, 12.0 × 2.55 × 3.2 m, long axis along x, centred at `position`. */
export const Bus: React.FC<{position?: [number, number, number]; length?: number; color?: string}> = ({position = [0, 0, 0], length = 12, color = '#d9a441'}) => {
  const w = 2.55;
  const h = 3.2;
  const wheels = [-length / 2 + 2.4, length / 2 - 3.2];
  return (
    <group position={position}>
      <mesh position={[0, 0.35 + (h - 0.35) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, h - 0.35, w]} />
        <meshStandardMaterial color={color} roughness={0.55} flatShading />
      </mesh>
      {[1, -1].map((side) => (
        <mesh key={side} position={[0.3, 2.05, (side * w) / 2 + side * 0.01]}>
          <boxGeometry args={[length - 1.6, 1.05, 0.02]} />
          <meshStandardMaterial color="#1d2730" roughness={0.25} metalness={0.1} />
        </mesh>
      ))}
      <mesh position={[length / 2 + 0.01, 1.95, 0]}>
        <boxGeometry args={[0.02, 1.4, w - 0.3]} />
        <meshStandardMaterial color="#1d2730" roughness={0.25} />
      </mesh>
      {wheels.flatMap((x) =>
        [1, -1].map((side) => (
          <mesh key={`${x}${side}`} position={[x, 0.5, (side * w) / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.32, 14]} />
            <meshStandardMaterial color="#151515" roughness={0.9} />
          </mesh>
        )),
      )}
    </group>
  );
};
