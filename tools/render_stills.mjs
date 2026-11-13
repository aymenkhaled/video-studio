// Storyboard stills: N evenly spaced frames (or explicit frames) from the prebuilt bundle.
// Usage: node tools/render_stills.mjs [count=12] [frame,frame,...]
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const count = Number(process.argv[2] || 12);
const plan = JSON.parse(fs.readFileSync('out/plan.json', 'utf8'));
const explicit = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const total = plan.durationInFrames;
const frames = explicit ?? Array.from({length: count}, (_, i) => Math.min(total - 1, Math.round((i * (total - 1)) / Math.max(1, count - 1))));

const serveUrl = path.resolve('out/bundle');
const chromiumOptions = {gl: 'swangle'};
const composition = await selectComposition({serveUrl, id: plan.compId, inputProps: plan.inputProps, chromiumOptions});
fs.mkdirSync('out/stills', {recursive: true});
for (const frame of frames) {
  const t0 = Date.now();
  const output = `out/stills/${plan.compId}_f${String(frame).padStart(6, '0')}.jpg`;
  await renderStill({composition, serveUrl, frame, output, inputProps: plan.inputProps, chromiumOptions, imageFormat: 'jpeg', jpegQuality: 88});
  console.log(`still ${frame} (${(frame / plan.fps).toFixed(2)} s) in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
