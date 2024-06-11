"use client";

import { Timeline } from '../Timeline/Timeline';
import styles from './WorkoutScreen.module.css';

export function WorkoutScreen() {
    return(
        <div className={styles.container}>
            <div className={styles.workout}>Workout screen</div>
            <Timeline />
        </div>
    )
}