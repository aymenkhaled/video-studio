// Render one frame-range chunk from the prebuilt bundle (muted; audio is muxed later).
// Usage: node tools/render_chunk.mjs <index>   (needs out/plan.json + out/bundle)
import {renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const index = Number(process.argv[2]);
const plan = JSON.parse(fs.readFileSync('out/plan.json', 'utf8'));
const range = plan.ranges.find((r) => r.index === index);
if (!range) throw new Error(`no chunk ${index}`);

const serveUrl = path.resolve('out/bundle');
const chromiumOptions = {gl: 'swangle'};
const composition = await selectComposition({serveUrl, id: plan.compId, inputProps: plan.inputProps, chromiumOptions});
const outputLocation = path.resolve(`out/chunks/chunk-${String(index).padStart(4, '0')}.ts`);
fs.mkdirSync(path.dirname(outputLocation), {recursive: true});

const frames = range.end - range.start + 1;
const t0 = Date.now();
let last = 0;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264-ts',
  frameRange: [range.start, range.end],
  outputLocation,
  inputProps: plan.inputProps,
  muted: true,
  chromiumOptions,
  timeoutInMilliseconds: 240000, // first frame per tab loads 3D models/HDRI on software WebGL
  // Software WebGL is itself multi-threaded: >2 tabs thrash a 4-vCPU runner on 3D scenes. Override via RENDER_CONCURRENCY.
  concurrency: Number(process.env.RENDER_CONCURRENCY || os.cpus().length),
  imageFormat: 'jpeg',
  jpegQuality: 90,
  onProgress: ({progress}) => {
    const pct = Math.floor(progress * 10);
    if (pct > last) {
      last = pct;
      console.log(`chunk ${index}: ${pct * 10}%`);
    }
  },
});
const seconds = (Date.now() - t0) / 1000;
const stats = {index, frames, seconds, fps: frames / seconds, cpus: os.cpus().length, concurrency: Number(process.env.RENDER_CONCURRENCY || os.cpus().length)};
fs.writeFileSync(outputLocation.replace(/\.ts$/, '.json'), JSON.stringify(stats));
console.log(`chunk ${index}: ${frames} frames in ${seconds.toFixed(1)} s = ${stats.fps.toFixed(2)} fps on ${stats.cpus} CPUs`);
