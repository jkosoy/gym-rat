import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextWorkoutItemLabel } from './ActiveMovePane.utils';

test('returns the next item in the workout sequence based on elapsed time', () => {
  const workout = {
    circuits: [
      {
        name: 'Circuit 1',
        type: 'manual',
        sets: [
          {
            type: 'active',
            time: 30,
            moves: [{ name: 'Jacks', equipment: '', group: 0 }, { name: 'Squats', equipment: '', group: 0 }, { name: 'Planks', equipment: '', group: 0 }],
          },
          {
            type: 'circuit-recovery',
            time: 10,
            moves: [],
          },
        ],
      },
    ],
  } as any;

  assert.equal(getNextWorkoutItemLabel(workout, workout.circuits[0].sets, 0, 0), 'Squats');
  assert.equal(getNextWorkoutItemLabel(workout, workout.circuits[0].sets, 0, 15), 'Planks');
  assert.equal(getNextWorkoutItemLabel(workout, workout.circuits[0].sets, 0, 30), 'Water Break');
});

test('returns a friendly label for recovery steps', () => {
  const workout = {
    circuits: [
      {
        name: 'Circuit 1',
        type: 'manual',
        sets: [
          {
            type: 'recovery',
            time: 10,
            moves: [],
          },
        ],
      },
    ],
  } as any;

  assert.equal(getNextWorkoutItemLabel(workout, workout.circuits[0].sets, 0, 0), 'Cooldown');
});

test('returns a friendly label for water breaks', () => {
  const workout = {
    circuits: [
      {
        name: 'Circuit 1',
        type: 'manual',
        sets: [
          {
            type: 'circuit-recovery',
            time: 10,
            moves: [],
          },
        ],
      },
    ],
  } as any;

  assert.equal(getNextWorkoutItemLabel(workout, workout.circuits[0].sets, 0, 0), 'Cooldown');
});
