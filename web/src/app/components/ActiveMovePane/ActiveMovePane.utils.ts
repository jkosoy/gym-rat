import { ExcerciseSet, Workout } from '@/app/types/Workout';

function getSequenceItems(workout?: Workout): string[] {
  if (!workout) {
    return [];
  }

  return workout.circuits.flatMap((circuit) => circuit.sets).flatMap((set) => {
    if (set.type === 'active') {
      return set.moves.map((move) => move.name);
    }

    if (set.type === 'circuit-recovery') {
      return ['Water Break'];
    }

    if (set.type === 'recovery') {
      return ['Break'];
    }

    if (set.type === 'warmup') {
      return ['Warmup'];
    }

    if (set.type === 'cooldown') {
      return ['Cooldown'];
    }

    return [];
  });
}

export function getNextWorkoutItemLabel(workout?: Workout, sets: ExcerciseSet[] = [], setIndex = 0, elapsedTime = 0): string | undefined {
  if (!workout || sets.length === 0) {
    return undefined;
  }

  const sequence = getSequenceItems(workout);

  if (sequence.length === 0) {
    return undefined;
  }

  const currentSetIndex = Math.min(setIndex, sets.length - 1);
  const currentSet = sets[currentSetIndex];

  if (!currentSet) {
    return sequence[0];
  }

  let currentPosition = 0;

  for (let index = 0; index < currentSetIndex; index += 1) {
    const previousSet = sets[index];

    if (previousSet.type === 'active') {
      currentPosition += previousSet.moves.length;
      continue;
    }

    currentPosition += 1;
  }

  if (currentSet.type === 'active') {
    const moves = currentSet.moves ?? [];

    if (moves.length === 0) {
      return sequence[currentPosition + 1] ?? 'Cooldown';
    }

    const averageTimePerMove = currentSet.time / moves.length;
    const currentMoveIndex = Math.min(Math.floor(elapsedTime / averageTimePerMove), moves.length - 1);
    const nextPosition = currentPosition + currentMoveIndex + 1;

    return sequence[nextPosition] ?? 'Cooldown';
  }

  const nextPosition = currentPosition + 1;
  return sequence[nextPosition] ?? 'Cooldown';
}
