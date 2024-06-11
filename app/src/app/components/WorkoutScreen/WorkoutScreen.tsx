"use client";

import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';

export function WorkoutScreen() {
    return(
        <div className={styles.container}>
            <ActiveMovePane />
            <TimelinePane />
        </div>
    )
}