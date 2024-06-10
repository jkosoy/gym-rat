"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import styles from './WorkoutScreen.module.css';

export function WorkoutScreen() {
    const { workout, currentTime } = useWorkout()
console.log(workout);
    return(
        <div className={styles.container}>
            <div className={styles.workout}>{currentTime}</div>
            <div className={styles.progress}>
                <div className={styles.progressInside}>
                    Inside
                </div>
            </div>
        </div>
    )
}