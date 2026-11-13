import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {drift, easeInOutCubic, ramp} from '../packages/engine/src/motion';

// CI smoke test: proves install, bundling and render work end to end.
export const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scale = 1 + 0.08 * easeInOutCubic(ramp(t, 0, 3));
  return (
    <AbsoluteFill style={{background: '#14161c', alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          width: 420,
          height: 420,
          borderRadius: 32,
          background: '#e8b04a',
          transform: `translate(${drift(t, 7, 24)}px, ${drift(t, 11, 18)}px) scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
