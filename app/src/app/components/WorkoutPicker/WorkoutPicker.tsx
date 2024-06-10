import { getRoutines } from "@/app/api/workouts";
import { Routine } from "@/app/types/Workout";

import styles from './WorkoutPicker.module.css';

export async function WorkoutPicker() {
    let routines:Routine[] = await getRoutines();
 
    return (
        <div className={styles.container}>
            <select>
                {routines.map(routine => (<option key={routine.id} value={routine.id}>{routine.name}</option>))}
            </select>
            <button>Start</button>
        </div>
    )
}