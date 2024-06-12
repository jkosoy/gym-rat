"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';
import { useEffect, useRef } from 'react';

export function WorkoutScreen() {
    const el = useRef(null);
    const { status } = useWorkout()

    useEffect(() => {
        const rootEl = document.documentElement;

        // make sure we go back to purple
        if(!el.current) {
            rootEl.style.setProperty('--color-background', `var(--color-background-default`);
            return;
        }

        rootEl.style.setProperty('--color-background', `var(--color-background-${status})`);
    }, [status, el])
    

    return(
        <div ref={el} className={styles.container}>
            <ActiveMovePane />
            <TimelinePane />
        </div>
    )
}