import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSelectedRoutine } from './workoutPicker.utils';
import { Routine } from '../../types/Workout';

test('prefers the routine clicked by the user over the currently highlighted routine', () => {
  const routines = [
    { id: '1', name: 'First routine' },
    { id: '2', name: 'Second routine' },
  ] as Routine[];

  const selectedRoutine = resolveSelectedRoutine(routines, routines[0], routines[1]);

  assert.equal(selectedRoutine?.id, '2');
});

test('falls back to the current selection when no specific routine is provided', () => {
  const routines = [
    { id: '1', name: 'First routine' },
    { id: '2', name: 'Second routine' },
  ] as Routine[];

  const selectedRoutine = resolveSelectedRoutine(routines, routines[0]);

  assert.equal(selectedRoutine?.id, '1');
});
