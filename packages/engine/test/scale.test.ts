import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gridStep, howMany, lengthLabel, massLabel, scaleCamAt} from '../src/scale/units.ts';
import {numeralize} from '../src/map/clarity-logic.ts';
import {pathFor, SHAPES} from '../src/scale/shapes.ts';

test('metric + imperial labels', () => {
  assert.equal(lengthLabel(30), '30 m · 98 ft');
  assert.equal(lengthLabel(1.75), '1.75 m · 5.7 ft');
  assert.equal(lengthLabel([16, 24]), '16–24 m · 52–79 ft');
  assert.equal(massLabel(150), '150 t · 165 US tons');
  assert.equal(massLabel([60, 114]), '60–114 t · 66–126 US tons');
});

test('grid step keeps lines readable at every zoom', () => {
  assert.equal(gridStep(100), 0.2);
  assert.equal(gridStep(4800), 0.01);
  assert.equal(lengthLabel(0.06), "6 cm · 2.4 in");
  assert.equal(gridStep(10), 2);
  assert.equal(gridStep(2), 10);
  assert.ok(gridStep(0.05) >= 200);
});

test('camera eases between keys and holds at the ends', () => {
  const keys = [{at: 0, x: 0, width: 10}, {at: 1, x: 20, width: 40}];
  assert.ok(Math.abs(scaleCamAt(keys, 0).width - 10) < 1e-9 && scaleCamAt(keys, 0).x === 0);
  const end = scaleCamAt(keys, 1);
  assert.equal(end.x, 20);
  assert.ok(Math.abs(end.width - 40) < 1e-9);
  assert.ok(Math.abs(scaleCamAt(keys, 0.5).width - 20) < 1e-9); // log-space midpoint
});

test('comparisons', () => {
  assert.equal(howMany(150, 6), 25);
  assert.equal(howMany(30, 1.75), 17);
});

test('captions: decimals and small numbers before units become numerals', () => {
  const ws = (s: string) => s.split(' ').map((w, i) => ({w, t: i, end: i + 0.9}));
  const out = (s: string) => numeralize(ws(s)).map((w) => w.w).join(' ');
  assert.equal(out('a person, one point seven five metres tall'), 'a person, 1.75 metres tall');
  assert.equal(out('up to six tonnes of krill'), 'up to 6 tonnes of krill');
  assert.equal(out('three point six million years ago'), '3.6 million years ago');
  assert.equal(out('one hundred fifty tonnes or more'), '150 tonnes or more');
  assert.equal(out('in twenty twenty-three, scientists'), 'in 2023, scientists');
  assert.equal(out('in two thousand twenty-three, scientists'), 'in 2023, scientists');
  assert.equal(out('three hundred thousand years'), '300,000 years');
  assert.equal(out('two school buses'), 'two school buses');
});

test('every silhouette builds a closed path', () => {
  for (const [name, s] of Object.entries(SHAPES)) {
    const d = pathFor(s, {x: 0, y: 500, len: 300, t: 1.2});
    assert.ok(d.startsWith('M') && d.endsWith('Z'), name);
    assert.ok(!d.includes('NaN'), name);
  }
});
