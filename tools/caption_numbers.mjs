// Print every caption line that contains a numeral, exactly as the burned-in captions will show it.
// Run before every render and read the output: the TTS script spells numbers as words, and the caption
// converter can merge neighbouring number words ("one twenty-four" became "25" once).
// Usage: node --experimental-strip-types --no-warnings tools/caption_numbers.mjs <episodeDir>/timeline.json
import fs from 'node:fs';
import {numeralize} from '../packages/engine/src/map/clarity-logic.ts';

const file = process.argv[2];
if (!file) throw new Error('usage: caption_numbers.mjs <timeline.json>');
const tl = JSON.parse(fs.readFileSync(file, 'utf8'));
let n = 0;
for (const s of tl.scenes)
  for (const line of s.lines) {
    const out = numeralize(line.split(' ').map((w, i) => ({w, t: i, end: i + 1}))).map((x) => x.w).join(' ');
    if (/\d/.test(out)) {
      n++;
      console.log(`${s.id}: ${out}`);
    }
  }
console.log(`${n} caption lines with numerals — check every number against sources.md`);
