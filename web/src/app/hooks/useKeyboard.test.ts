import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldEnableKeyboardNavigation } from './useKeyboard';

test('disables keyboard navigation on small touch screens', () => {
  const enabled = shouldEnableKeyboardNavigation({
    innerWidth: 375,
    navigator: { maxTouchPoints: 5 } as Navigator,
  } as Window);

  assert.equal(enabled, false);
});

test('keeps keyboard navigation enabled on desktops', () => {
  const enabled = shouldEnableKeyboardNavigation({
    innerWidth: 1280,
    navigator: { maxTouchPoints: 0 } as Navigator,
  } as Window);

  assert.equal(enabled, true);
});

test('keeps keyboard navigation enabled in TV mode', () => {
  const enabled = shouldEnableKeyboardNavigation({
    innerWidth: 375,
    navigator: { maxTouchPoints: 5 } as Navigator,
  } as Window, true);

  assert.equal(enabled, true);
});
