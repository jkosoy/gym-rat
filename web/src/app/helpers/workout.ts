import { ExcerciseSet, Workout } from "@/app/types/Workout";

// every set of a workout, flattened into the order they're performed in.
export function getSets(workout?: Workout):ExcerciseSet[] {
    if(!workout) {
        return [];
    }

    return workout.circuits.flatMap(circuit => circuit.sets);
}

// how long a list of sets takes, in seconds.
export function getTotalTime(sets: ExcerciseSet[]):number {
    return sets.reduce((total, set) => total + set.time, 0);
}
