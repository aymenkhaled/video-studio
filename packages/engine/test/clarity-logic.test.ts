import {test} from 'node:test';
import assert from 'node:assert/strict';
import {yearsAgo, agoLabel, captionCues, layoutLabels} from '../src/map/clarity-logic.ts';

test('years ago, no year zero', () => {
  assert.equal(yearsAgo(-149), 2174);
  assert.equal(yearsAgo(-146), 2171);
  assert.equal(yearsAgo(1979), 47);
  assert.equal(agoLabel(-149), 'about 2,170 years ago');
  assert.equal(agoLabel(1979), 'about 50 years ago');
});

test('caption cues respect width, line count, order, sentence breaks', () => {
  const text = 'Carthage paid. Rome was still afraid of a city that kept getting richer every single year, and Cato said so in the Senate again and again.';
  const words = text.split(' ').map((w, i) => ({w, t: i * 0.3, end: i * 0.3 + 0.28}));
  const cues = captionCues(words);
  assert.ok(cues.every((c) => c.lines.length <= 2 && c.lines.every((l) => l.length <= 42)));
  assert.equal(cues.flatMap((c) => c.words.map((x) => x.w)).join(' '), text);
  assert.deepEqual(cues[0].lines, ['Carthage paid.']);
  assert.ok(cues.every((c, i) => i === 0 || c.t >= cues[i - 1].end - 1e-9));
});

test('a single 60-char token is kept on its own line, not dropped', () => {
  const long = 'x'.repeat(60);
  const cues = captionCues([{w: 'a', t: 0, end: 1}, {w: long, t: 1, end: 2}]);
  assert.ok(cues.some((c) => c.words.some((w) => w.w === long)));
});

test('labels: no overlaps, inside frame, top priority never moves', () => {
  const boxes = [
    {id: 'army', x: 900, y: 500, w: 160, h: 40, priority: 3},
    {id: 'city', x: 920, y: 510, w: 180, h: 36, priority: 2},
    {id: 'region', x: 910, y: 505, w: 300, h: 50, priority: 1},
    {id: 'edge', x: 1850, y: 1060, w: 200, h: 40, priority: 1},
  ];
  const out = layoutLabels(boxes, {w: 1920, h: 1080});
  const army = out.find((p) => p.id === 'army')!;
  assert.deepEqual([army.dx, army.dy, army.hidden], [0, 0, false]);
  const shown = out
    .filter((p) => !p.hidden)
    .map((p) => {
      const b = boxes.find((x) => x.id === p.id)!;
      return {...b, x: b.x + p.dx, y: b.y + p.dy};
    });
  for (const a of shown) assert.ok(a.x >= 0 && a.y >= 0 && a.x + a.w <= 1920 && a.y + a.h <= 1080, a.id);
  for (const a of shown)
    for (const b of shown)
      if (a !== b) assert.ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, `${a.id}/${b.id}`);
});

import {numeralize} from '../src/map/clarity-logic.ts';
const W = (s: string) => s.split(' ').map((w, i) => ({w, t: i, end: i + 0.9}));
test('numeralize spoken numbers for captions, keeping timings', () => {
  const out = numeralize(W('In one hundred forty-six B C, the city burned.'));
  assert.deepEqual(out.map((w) => w.w), ['In', '146 BC,', 'the', 'city', 'burned.']);
  assert.deepEqual([out[1].t, out[1].end], [1, 5.9]);
  assert.equal(numeralize(W('armour for two hundred thousand men')).map((w) => w.w).join(' '), 'armour for 200,000 men');
  assert.equal(numeralize(W('Since nineteen seventy-nine, they')).map((w) => w.w).join(' '), 'Since 1979, they');
  assert.equal(numeralize(W('over fifty years. Ten thousand talents')).map((w) => w.w).join(' '), 'over 50 years. 10,000 talents');
});

import {kmLabel, niceScale} from '../src/map/clarity-logic.ts';
test('km labels and scale bar', () => {
  assert.equal(kmLabel(587), '≈ 600 km');
  assert.equal(kmLabel(14.6), '≈ 15 km');
  assert.equal(kmLabel(1480), '≈ 1,500 km');
  const s = niceScale(0.9, 240); // 0.9 px per km, bar at most 240 px
  assert.deepEqual(s, {km: 200, px: 180});
  assert.equal(niceScale(40, 240).km, 5);
});
test('captions prefer to break after a comma', () => {
  const t = 'And since then, Carthage had paid, obeyed, and asked permission for almost everything.';
  const cues = captionCues(t.split(' ').map((w, i) => ({w, t: i, end: i + 0.9})));
  assert.ok(cues.every((c) => c.lines.every((l) => l.length <= 42)));
  assert.ok(cues[0].lines[0].endsWith(','), cues[0].lines[0]);
});

test('"a hundred" becomes 100 (no "a 0")', () => {
  assert.equal(numeralize(W('About a hundred years later, Caesar')).map((w) => w.w).join(' '), 'About 100 years later, Caesar');
  assert.equal(numeralize(W('more than six hundred years')).map((w) => w.w).join(' '), 'more than 600 years');
});
