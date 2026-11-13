import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
// 3D needs software WebGL on CI runners (no GPU). Harmless for 2D.
Config.setChromiumOpenGlRenderer('swangle');
