import { Routine, getRoutines } from "../api/workouts";

export async function WorkoutPicker() {
    let routines:Routine[] = await getRoutines();
 
    return (
        <select>
            {routines.map(routine => (<option key={routine.id} value={routine.id}>{routine.name}</option>))}
        </select>
    )
}