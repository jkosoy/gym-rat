"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';
import { useEffect, useMemo, useRef } from 'react';
import { Status } from '@/app/contexts/WorkoutContext';
import { WorkoutCompletePane } from '../WorkoutCompletePane';
import { useSoundEffect } from '@/app/hooks/useSoundEffects';
import { useAndroid } from '@/app/hooks/useAndroid';

type AudioMappings = Record<Status, string|undefined>

export function WorkoutScreen() {
    const { 
        set,
        sets,
        setIndex,
        closeWorkout
    } = useWorkout()
    const { isAndroid } = useAndroid();

    const [playEffect] = useSoundEffect()

    const isWorkoutComplete = sets && setIndex === sets.length;

    useEffect(() => {
        const AUDIO_PATHS:AudioMappings = {
            "circuit-recovery": "/circuit-recovery.mp3",
            "active": "/active.mp3",
            "recovery": "/recovery.mp3",
            "cooldown": "/cooldown.mp3",
            "warmup": "/warmup.mp3",
            "complete": "/complete.mp3",

        }

        const type = isWorkoutComplete ? "complete" : set?.type

        if(!type || AUDIO_PATHS[type] === undefined) {
            return
        }

        const url = AUDIO_PATHS[type];
        if(!url) {
            return;
        }

        playEffect(url);
    }, [set, isWorkoutComplete, playEffect]);


    const computedElement = useMemo(() => {
        if(!sets) {
            return;
        }

        return isWorkoutComplete ? <WorkoutCompletePane /> : <ActiveMovePane />
    }, [isWorkoutComplete, sets])

    useEffect(() => {
        window.exitWorkout = () => {
            playEffect("/button.mp3");
            closeWorkout();
        }

        return () => {
            window.exitWorkout = () => {}
        }
    }, [isAndroid,closeWorkout]);

    return(
        <>
            <div className={styles.container}>
                {computedElement}
                <TimelinePane />
            </div>
        </>
    )
}