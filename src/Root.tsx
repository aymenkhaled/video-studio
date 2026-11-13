import React from 'react';
import {Composition} from 'remotion';
import {Smoke} from './Smoke';

// Every brand registers its compositions here. Ids are stable: CI renders by id.
export const Root: React.FC = () => (
  <>
    <Composition id="Smoke" component={Smoke} durationInFrames={90} fps={30} width={1080} height={1920} />
  </>
);
