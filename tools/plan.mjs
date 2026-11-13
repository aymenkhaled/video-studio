// Bundle once, measure the composition, split it into frame-range chunks.
// Usage: node tools/plan.mjs <compId> <chunks> [propsJsonPath]
// Writes out/plan.json and (in CI) `matrix` + `frames` to $GITHUB_OUTPUT.
import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [compId, chunksArg = '1', propsPath = ''] = process.argv.slice(2);
if (!compId) throw new Error('usage: plan.mjs <compId> <chunks> [props.json]');
const inputProps = propsPath ? JSON.parse(fs.readFileSync(propsPath, 'utf8')) : {};

const t0 = Date.now();
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: path.resolve('out/bundle')});
const comp = await selectComposition({serveUrl, id: compId, inputProps});
const bundleSeconds = (Date.now() - t0) / 1000;

const total = comp.durationInFrames;
const chunks = Math.max(1, Math.min(Number(chunksArg) || 1, 256, total));
const size = Math.ceil(total / chunks);
const ranges = [];
for (let i = 0, start = 0; start < total; i++, start += size) {
  ranges.push({index: i, start, end: Math.min(total - 1, start + size - 1)});
}

const plan = {compId, inputProps, fps: comp.fps, width: comp.width, height: comp.height, durationInFrames: total, framesPerChunk: size, ranges, bundleSeconds};
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/plan.json', JSON.stringify(plan, null, 2));
console.log(`plan: ${compId} ${comp.width}x${comp.height}@${comp.fps} ${total} frames → ${ranges.length} chunks of ≤${size} (bundle ${bundleSeconds.toFixed(1)} s)`);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `matrix=${JSON.stringify(ranges.map((r) => r.index))}\nframes=${total}\nfps=${comp.fps}\nwidth=${comp.width}\nheight=${comp.height}\n`);
}
