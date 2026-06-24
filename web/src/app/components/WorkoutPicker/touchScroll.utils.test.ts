import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScrollTop } from './touchScroll.utils';

test('calculates vertical scroll position from touch drag', () => {
  const nextScrollTop = calculateScrollTop(100, 140, 200);

  assert.equal(nextScrollTop, 160);
});
