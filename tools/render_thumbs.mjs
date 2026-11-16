// Render thumbnail stills from the prebuilt bundle. Usage: node tools/render_thumbs.mjs <compPrefix> <count>
// e.g. node tools/render_thumbs.mjs HannibalThumb 3  →  out/package/thumb_1.jpg … thumb_3.jpg
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [prefix, count = '3', name = 'thumb'] = process.argv.slice(2);
const serveUrl = path.resolve('out/bundle');
const chromiumOptions = {gl: 'swangle'};
fs.mkdirSync('out/package', {recursive: true});
for (let i = 1; i <= Number(count); i++) {
  const composition = await selectComposition({serveUrl, id: `${prefix}${i}`, chromiumOptions});
  const output = `out/package/${name}_${i}.jpg`;
  // 1280×720 comps render at 1.5× = 1920×1080 (PLAYBOOK 3.3: ≥ 1920×1080; JPEG stays under YouTube's 2 MB limit)
  const scale = composition.width === 1280 ? 1.5 : 1;
  await renderStill({composition, serveUrl, frame: 0, output, chromiumOptions, imageFormat: 'jpeg', jpegQuality: 92, scale, timeoutInMilliseconds: 240000});
  console.log(`thumbnail ${output}`);
}
