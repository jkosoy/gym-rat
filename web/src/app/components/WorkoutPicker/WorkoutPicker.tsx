import { getRoutines, getWorkout } from "@/app/api/workouts";
import { Routine } from "@/app/types/Workout";
import { SkeletonPicker } from '@/app/components/SkeletonPicker';

import styles from './WorkoutPicker.module.css';
import classNames from 'classnames/bind'
import { CSSProperties, PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { ButtonWithIcon } from "../ButtonWithIcon";
import { useKeyboard } from "@/app/hooks/useKeyboard";
import { useWorkout } from "@/app/hooks/useWorkout";
import { useSoundEffect } from "@/app/hooks/useSoundEffects";

const ITEMS_PER_ROW = 6;

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

    const prevRow = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)-ITEMS_PER_ROW;
        while(index < 0) {
            index += routines.length;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("prev")
    }, [routines, selectedRoutine, setSelectedRoutine, setAudioState])

    const nextRow = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)+ITEMS_PER_ROW;
        while(index >= routines.length) {
            index -= routines.length;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("next")
    }, [routines, selectedRoutine, setSelectedRoutine, setAudioState])


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

    useKeyboard("ArrowLeft", { onKeyDown: prevRoutine })
    useKeyboard("ArrowRight", { onKeyDown: nextRoutine })
    useKeyboard("ArrowUp", { onKeyDown: prevRow })
    useKeyboard("ArrowDown", { onKeyDown: nextRow })

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
    
    const routineEls = (() => {
        if(routines.length === 0) {
            return;
        }

        return routines.map(routine => {
            const className = classNames.bind(styles)({
                routine: true,
                selected: selectedRoutine?.id === routine.id,
            });

            return (
                <div key={`rid_${routine.id}`} className={className}>
                    <button onClick={selectRoutine}>{routine.name}</button>
                </div>
            );
        });
    })();

    const computedComponent = (() => {
        if(isLoading || routines.length === 0 || workout !== undefined) {
            return <SkeletonPicker />
        }

        let selectedRow = 0;
        if(selectedRoutine) {
            selectedRow = Math.floor(routines.indexOf(selectedRoutine) / ITEMS_PER_ROW)
        }

        return (
            <div className={styles.pickerContainer} style={{
                "--selected-row-index": selectedRow
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