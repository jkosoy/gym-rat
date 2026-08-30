import test from 'node:test';
import assert from 'node:assert/strict';
import { getSets, getTotalTime } from './workout';
import { formatDuration } from './time';
import { Workout } from '../types/Workout';

const workout = {
  name: 'Test workout',
  circuits: [
    { name: 'Warmup', type: 'warmup', sets: [{ type: 'warmup', time: 300, autoAdvance: true, moves: [] }] },
    {
      name: 'Circuit 1',
      type: 'amrap',
      sets: [
        { type: 'active', time: 45, autoAdvance: true, moves: [] },
        { type: 'recovery', time: 15, autoAdvance: true, moves: [] },
        { type: 'circuit-recovery', time: 60, autoAdvance: true, moves: [] },
      ],
    },
  ],
} as Workout;

test('flattens every circuit into a single list of sets', () => {
  assert.equal(getSets(workout).length, 4);
});

test('has no sets without a workout', () => {
  assert.deepEqual(getSets(), []);
});

test('totals the time of every set in the workout', () => {
  assert.equal(getTotalTime(getSets(workout)), 420);
});

test('has no total time without a workout', () => {
  assert.equal(getTotalTime(getSets()), 0);
});

test('formats a duration as HH:MM:SS', () => {
  assert.equal(formatDuration(0), '00:00:00');
  assert.equal(formatDuration(420), '00:07:00');
  assert.equal(formatDuration(3661), '01:01:01');
  assert.equal(formatDuration(-30), '00:00:00');
});
