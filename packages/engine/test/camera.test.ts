import {test} from 'node:test';
import assert from 'node:assert/strict';
import {flyCamera, flyPath} from '../src/map/camera-logic.ts';

const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test('fly path hits both ends exactly', () => {
  const f = flyPath({cx: 0, cy: 0, w: 10}, {cx: 100, cy: 20, w: 5});
  const s = f(0);
  const e = f(1);
  close(s.cx, 0); close(s.cy, 0); close(s.w, 10);
  close(e.cx, 100); close(e.cy, 20); close(e.w, 5);
});

test('far flights zoom out in the middle, then back in', () => {
  const f = flyPath({cx: 0, cy: 0, w: 10}, {cx: 200, cy: 0, w: 10});
  assert.ok(f(0.5).w > 30, `mid width ${f(0.5).w}`);
  // monotonic travel along x
  let last = -1;
  for (let i = 0; i <= 20; i++) {
    const x = f(i / 20).cx;
    assert.ok(x >= last - 1e-9);
    last = x;
  }
});

test('pure zoom stays centred and is geometric', () => {
  const f = flyPath({cx: 5, cy: 5, w: 40}, {cx: 5, cy: 5, w: 10});
  close(f(0.5).w, 20, 1e-6);
  close(f(0.5).cx, 5);
});

test('flyCamera converts zoom ↔ width and lands on the target', () => {
  const end = flyCamera({center: [37.6, 55.7], zoom: 6}, {center: [129.7, 62.0], zoom: 8}, 1);
  close(end.center[0], 129.7); close(end.center[1], 62.0); close(end.zoom, 8, 1e-6);
  const mid = flyCamera({center: [37.6, 55.7], zoom: 6}, {center: [129.7, 62.0], zoom: 8}, 0.5);
  assert.ok(mid.zoom < 6, `mid zoom ${mid.zoom} should pull out`);
});
