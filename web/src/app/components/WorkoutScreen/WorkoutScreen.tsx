"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';
import { useEffect, useRef } from 'react';
import { Status } from '@/app/contexts/WorkoutContext';

type AudioMappings = Record<Status, string|undefined>

export function WorkoutScreen() {
    const el = useRef(null);
    const { status } = useWorkout()

    const AUDIO_PATHS:AudioMappings = {
        "circuit-recovery": "/circuit-recovery.mp3",
        "active": "/active.mp3",
        "recovery": "/recovery.mp3",
        "cooldown": "/cooldown.mp3",
        "warmup": undefined,
        "complete": undefined,
    }

    useEffect(() => {
        const rootEl = document.documentElement;

        // make sure we go back to purple
        if(!el.current) {
            rootEl.style.setProperty('--color-background', `var(--color-background-default`);
            return;
        }

        rootEl.style.setProperty('--color-background', `var(--color-background-${status})`);
    }, [status, el]);

    useEffect(() => {
        if(AUDIO_PATHS[status] === undefined) {
            return
        }

        const url = AUDIO_PATHS[status];

        const a = new Audio(url);
        a.preload = 'auto';
        a.pause();
        a.load();
        a.play();
    }, [status])
    

    return(
        <>
            <div ref={el} className={styles.container}>
                <ActiveMovePane />
                <TimelinePane />
            </div>
        </>
    )
}