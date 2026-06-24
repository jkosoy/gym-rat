import { Routine } from '@/app/types/Workout';

export function resolveSelectedRoutine(
  routines: Routine[],
  currentSelection?: Routine,
  clickedRoutine?: Routine,
): Routine | undefined {
  if (clickedRoutine) {
    return routines.find((routine) => routine.id === clickedRoutine.id) ?? clickedRoutine;
  }

  return currentSelection;
}
