import { getRoutines } from "@/app/api/workouts";
import { Routine } from "@/app/types/Workout";
import { SkeletonPicker } from '@/app/components/SkeletonPicker';

import styles from './WorkoutPicker.module.css';
import { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonWithIcon } from "../ButtonWithIcon";

export function WorkoutPicker() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<Routine|undefined>();

    const loadRoutines = useCallback(async () => {
        const routines = await getRoutines();
        setRoutines(routines);
        setSelectedRoutine(routines[0]);
    }, [routines, setRoutines, setSelectedRoutine]);

    useEffect(() => {
        loadRoutines();
    }, [])

    const computedComponent = useMemo(() => {
        if(routines.length === 0) {
            return <SkeletonPicker />
        }

        const routineEls = routines.map(routine => (
            <div key={`rid_${routine.id}`} className={styles.routine}>
                <h2>{routine.name}</h2>
            </div>
        ));

        return (
            <div className={styles.pickerContainer}>
                <div className={styles.controls}>
                    <div style={{
                        'transform': 'scaleX(-1) rotate(90deg)',
                        'transformOrigin': 'center'
                    }}>
                        <ButtonWithIcon icon="play" />
                    </div>
                    <div style={{
                        'transform': 'rotate(-90deg)',
                        'transformOrigin': 'center'
                    }}>
                       <ButtonWithIcon icon="play" />
                    </div>
                </div>
                <div className={styles.routineContainer}>
                    {routineEls}
                </div>
            </div>
        )
    }, [routines])

    return (
        <div className={styles.container}>
            {computedComponent}
        </div>
    )
}