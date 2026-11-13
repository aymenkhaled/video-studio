import React from 'react';
import {Composition} from 'remotion';
import {Smoke} from './Smoke';
import {Bench2D} from './bench/Bench2D';
import {Bench3D} from './bench/Bench3D';
import {Bench25D} from './bench/Bench25D';
import {StageDemo} from './demo/StageDemo';

// Every brand registers its compositions here. Ids are stable: CI renders by id.
const portrait = {fps: 30, width: 1080, height: 1920} as const;

export const Root: React.FC = () => (
  <>
    <Composition id="Smoke" component={Smoke} durationInFrames={90} {...portrait} />
    <Composition id="Bench2D" component={Bench2D} durationInFrames={300} {...portrait} />
    <Composition id="Bench3D" component={Bench3D} durationInFrames={300} {...portrait} />
    <Composition id="Bench25D" component={Bench25D} durationInFrames={300} {...portrait} />
    <Composition id="StageDemo" component={StageDemo} durationInFrames={600} {...portrait} />
  </>
);
