import React from 'react';
import {Composition} from 'remotion';
import {Smoke} from './Smoke';
import {Bench2D} from './bench/Bench2D';
import {Bench3D} from './bench/Bench3D';
import {Bench25D} from './bench/Bench25D';
import {StageDemo} from './demo/StageDemo';
import {HannibalDemo, calculateHannibalMetadata} from './history/HannibalDemo';
import {HannibalEpisode, calculateHannibalEpisode} from './history/Hannibal';
import {HannibalThumb} from './history/HannibalThumb';
import {CarthageEpisode, calculateCarthageEpisode} from './history/Carthage';
import {CarthageThumb} from './history/CarthageThumb';
import {BiggestAnimal, BiggestAnimalThumb, calculateBiggestAnimal} from './scale/BiggestAnimal';

// Every brand registers its compositions here. Ids are stable: CI renders by id.
const portrait = {fps: 30, width: 1080, height: 1920} as const;

export const Root: React.FC = () => (
  <>
    <Composition id="Smoke" component={Smoke} durationInFrames={90} {...portrait} />
    <Composition id="Bench2D" component={Bench2D} durationInFrames={300} {...portrait} />
    <Composition id="Bench3D" component={Bench3D} durationInFrames={300} {...portrait} />
    <Composition id="Bench25D" component={Bench25D} durationInFrames={300} {...portrait} />
    <Composition id="StageDemo" component={StageDemo} durationInFrames={600} {...portrait} />
    <Composition
      id="HannibalDemo"
      component={HannibalDemo}
      durationInFrames={24 * 60}
      fps={24}
      width={1920}
      height={1080}
      defaultProps={{scenes: []}}
      calculateMetadata={calculateHannibalMetadata}
    />
    <Composition
      id="Hannibal"
      component={HannibalEpisode}
      durationInFrames={24 * 60 * 12}
      fps={24}
      width={1920}
      height={1080}
      defaultProps={{scenes: []}}
      calculateMetadata={calculateHannibalEpisode}
    />
    {([1, 2, 3] as const).map((v) => (
      <Composition key={v} id={`HannibalThumb${v}`} component={HannibalThumb} durationInFrames={1} fps={24} width={1280} height={720} defaultProps={{variant: v}} />
    ))}
    <Composition
      id="Carthage"
      component={CarthageEpisode}
      durationInFrames={24 * 60 * 12}
      fps={24}
      width={1920}
      height={1080}
      defaultProps={{scenes: []}}
      calculateMetadata={calculateCarthageEpisode}
    />
    {([1, 2, 3] as const).map((v) => (
      <Composition key={v} id={`CarthageThumb${v}`} component={CarthageThumb} durationInFrames={1} fps={24} width={1280} height={720} defaultProps={{variant: v}} />
    ))}
    <Composition
      id="BiggestAnimal"
      component={BiggestAnimal}
      durationInFrames={24 * 60 * 12}
      fps={24}
      width={1920}
      height={1080}
      defaultProps={{scenes: []}}
      calculateMetadata={calculateBiggestAnimal}
    />
    {([1, 2, 3] as const).map((v) => (
      <Composition key={v} id={`BiggestAnimalThumb${v}`} component={BiggestAnimalThumb} durationInFrames={1} fps={24} width={1280} height={720} defaultProps={{variant: v}} />
    ))}
  </>
);
