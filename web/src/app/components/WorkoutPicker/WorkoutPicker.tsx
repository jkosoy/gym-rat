import { getRoutines, getWorkout } from "@/app/api/workouts";
import { Routine } from "@/app/types/Workout";
import { SkeletonPicker } from '@/app/components/SkeletonPicker';

import styles from './WorkoutPicker.module.css';
import { CSSProperties, PropsWithoutRef, useCallback, useEffect, useMemo, useState } from "react";
import { ButtonWithIcon } from "../ButtonWithIcon";
import { useKeyboard } from "@/app/hooks/useKeyboard";
import { useWorkout } from "@/app/hooks/useWorkout";
import { useSoundEffect } from "@/app/hooks/useSoundEffects";

type AudioState = "prev" | "next" | "select";
type AudioMappings = Record<AudioState, string|undefined>

type WorkoutPickerProps = {
    callback: Function
}

export function WorkoutPicker({callback}: PropsWithoutRef<WorkoutPickerProps>) {
    const [isLoading, setIsLoading] = useState(true);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<Routine|undefined>();
    const [audioState, setAudioState] = useState<AudioState>();
    const { workout } = useWorkout();
    const [playEffect] = useSoundEffect();

    const nextRoutine = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)+1;
        if(index >= routines.length) {
            index = 0;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("next")
    }, [routines, selectedRoutine, setSelectedRoutine,setAudioState])

    const prevRoutine = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)-1;
        if(index < 0) {
            index = routines.length-1;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("prev")
    }, [routines, selectedRoutine, setSelectedRoutine,setAudioState])

    const selectRoutine = useCallback(async () => {
        if(!selectedRoutine || isLoading) {
            return;
        }

        setAudioState("select");
        setIsLoading(true);
        const workout = await getWorkout(selectedRoutine);
        callback(workout);
    }, [isLoading, setIsLoading, selectedRoutine, callback, setAudioState]);

    useKeyboard("ArrowUp", { onKeyDown: prevRoutine })
    useKeyboard("ArrowDown", { onKeyDown: nextRoutine })
    useKeyboard("Enter", { onKeyDown: selectRoutine });

    const loadRoutines = useCallback(async () => {
        const routines = await getRoutines();
        setRoutines(routines);
        setSelectedRoutine(routines[0]);
        setIsLoading(false);
    }, [setRoutines, setSelectedRoutine, setIsLoading]);

    useEffect(() => {
        loadRoutines();
    }, [loadRoutines])

    const playAudio = useEffect(() => {
        if(!audioState) {
            return;
        }

        const AUDIO_PATHS:AudioMappings = {
            "prev": "/button.mp3",
            "next": "/button.mp3",
            "select": "/select.mp3",
        }

        playEffect(AUDIO_PATHS[audioState]!)
        setAudioState(undefined);
    }, [audioState, setAudioState, playEffect]);
    
    const routineEls = useMemo(() => {
        if(routines.length === 0) {
            return;
        }

        return routines.map(routine => (
            <div key={`rid_${routine.id}`} className={styles.routine}>
                <button onClick={selectRoutine}>{routine.name}</button>
            </div>
        ));
    }, [routines, selectRoutine]);

    const computedComponent = (() => {
        if(isLoading || routines.length === 0 || workout !== undefined) {
            return <SkeletonPicker />
        }

        return (
            <div className={styles.pickerContainer} style={{
                "--selected-routine-index": selectedRoutine ? routines.indexOf(selectedRoutine) : 0 
            } as CSSProperties}>
                <div className={styles.prevButton}>
                    <ButtonWithIcon icon="play" onClick={prevRoutine}/>
                </div>
                <div className={styles.nextButton}>
                    <ButtonWithIcon icon="play" onClick={nextRoutine}/>
                </div>
                <div className={styles.routineContainer}>
                    <div className={styles.routineScroller}>
                        {routineEls}
                    </div>
                </div>
            </div>
        )
    })()


    return (
        <div className={styles.container}>
            {computedComponent}
        </div>
    )
}