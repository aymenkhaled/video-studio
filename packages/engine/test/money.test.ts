import {test} from 'node:test';
import assert from 'node:assert/strict';
import {numeralize} from '../src/map/clarity-logic.ts';
import {classify, fmtValue, niceTicks, pictogramLayout, shareSegments} from '../src/map/chart-logic.ts';

const W = (s: string) => s.split(' ').map((w, i) => ({w, t: i, end: i + 0.9}));
const N = (s: string) => numeralize(W(s)).map((w) => w.w).join(' ');

test('money captions: dollars, percent, scale words', () => {
  assert.equal(N('about one hundred seven thousand dollars of goods'), 'about $107,000 of goods');
  assert.equal(N('for about four dollars.'), 'for about $4.');
  assert.equal(N('about eighteen hundred dollars. The'), 'about $1,800. The');
  assert.equal(N('only about nine percent of'), 'only about 9% of');
  assert.equal(N('about fifty-three percent of all'), 'about 53% of all');
  assert.equal(N('about nine million people'), 'about 9 million people');
  assert.equal(N('about twenty-six billion francs'), 'about 26 billion francs');
  assert.equal(N('two thousand four hundred billion francs'), '2,400 billion francs');
  assert.equal(N('about seventeen hundred francs a month'), 'about 1,700 francs a month');
});

test('years: teens, twenty-twenties, nineteen hundred seven', () => {
  assert.equal(N('In twenty twenty-four, it'), 'In 2024, it');
  assert.equal(N('In twenty sixteen, a new'), 'In 2016, a new');
  assert.equal(N('until nineteen hundred seven, Switzerland'), 'until 1907, Switzerland');
  assert.equal(N('in eighteen seventeen, some'), 'in 1817, some');
  assert.equal(N('in nineteen thirty-four, a'), 'in 1934, a');
});

test('small numbers without a unit stay words', () => {
  assert.equal(N('about two thirds of young people'), 'about two thirds of young people');
  assert.equal(N('nine, then percent'), 'nine, then percent');
});

test('chart helpers', () => {
  assert.equal(fmtValue(107702, {prefix: '$'}), '$107,702');
  assert.equal(fmtValue(120000, {prefix: '$', compact: true}), '$120k');
  assert.equal(fmtValue(2.4e9, {compact: true}), '2.4 bn');
  assert.deepEqual(niceTicks(0, 107702, 5), [0, 25000, 50000, 75000, 100000, 125000]);
  const s = shareSegments([53, 47]);
  assert.equal(s[1].start, 0.53);
  assert.equal(classify(5, [10, 20]), 0);
  assert.equal(classify(10, [10, 20]), 1);
  assert.equal(classify(99, [10, 20]), 2);
  const lay = pictogramLayout(119, 1200, 200, 34);
  assert.equal(lay.cells.length, 119);
  assert.ok(Math.max(...lay.cells.map((c) => c.y)) <= 200);
});
