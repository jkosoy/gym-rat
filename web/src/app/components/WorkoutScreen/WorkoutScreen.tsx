"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';
import { useEffect, useMemo, useRef } from 'react';
import { Status } from '@/app/contexts/WorkoutContext';
import { WorkoutCompletePane } from '../WorkoutCompletePane';

type AudioMappings = Record<Status, string|undefined>

export function WorkoutScreen() {
    const { status } = useWorkout()

    useEffect(() => {
        const AUDIO_PATHS:AudioMappings = {
            "circuit-recovery": "/circuit-recovery.mp3",
            "active": "/active.mp3",
            "recovery": "/recovery.mp3",
            "cooldown": "/cooldown.mp3",
            "warmup": "/warmup.mp3",
            "complete": "/complete.mp3",
        }
    
        if(AUDIO_PATHS[status] === undefined) {
            return
        }

        const url = AUDIO_PATHS[status];

        const a = new Audio(url);
        a.preload = 'auto';
        a.pause();
        a.load();
        a.play();
    }, [status]);
    
    const computedElement = useMemo(() => {
        return status === "complete" ? <WorkoutCompletePane /> : <ActiveMovePane />
    }, [status])

    return(
        <>
            <div className={styles.container}>
                {computedElement}
                <TimelinePane />
            </div>
        </>
    )
}