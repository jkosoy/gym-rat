import { useWorkout } from '@/app/hooks/useWorkout'
import styles from './ActiveMovePane.module.css'
import { Timer } from '../Timer/Timer';
import { Move } from '../Move';
import { Circuit, ExcerciseSet } from '@/app/types/Workout';
import { ButtonWithIcon } from '../ButtonWithIcon';
import classNames from 'classnames/bind';
import { useDevice } from '@/app/hooks/useDevice';
import { useAndroid } from '@/app/hooks/useAndroid';
import { useCallback, useEffect, useState } from 'react';
import { useKeyboard } from '@/app/hooks/useKeyboard';

declare global {
    interface Window { 
        exitWorkout: () => void, 
        onPause: () => void,
        onResume: () => void
    }
}

type AudioState = "click";
type AudioMappings = Record<AudioState, string|undefined>

export function ActiveMovePane() {
    const { 
        workout, 
        getCurrentCircuit, 
        getCurrentSet, 
        status, 
        isPaused, 
        elapsedTime, 
        togglePlayPause,
        nextSet,
        prevSet,
        closeWorkout,
        play,
        pause
    } = useWorkout();

    const { isTV } = useDevice()
    const { isAndroid } = useAndroid();
    const [audioState, setAudioState] = useState<AudioState>();

    let totalTime = 0;

    const setEl = (() => {
        if(!workout) {
            return;
        }

        if(["warmup", "cooldown", "complete"].includes(status)) {
            const circuit:Circuit = getCurrentCircuit()
            totalTime = circuit.sets[0].recoverySeconds;

            return (
                <h2>{circuit.name}</h2>
            )
        }

        if(status === "circuit-recovery") {
            totalTime = workout.recoverySeconds

            return (
                <h2>Water Break</h2>
            )
        }

        const set:ExcerciseSet = getCurrentSet()
        if(status === "recovery") {
            totalTime = set.recoverySeconds;

            return (
                <h2>Recovery</h2>
            )            
        }

        totalTime = set.activeSeconds;

        const moves = set.moves.flatMap((move, i) => {
            const { reps, name, equipment } = move;
            return (
                <Move key={`m${i}`} reps={reps} label={name} equipment={equipment} focused />
            )
        })
        
        return (
            <>
                <div className={styles.moves}>{moves}</div>
            </>
        )
    })();

    const controlsClassName = classNames.bind(styles)({
        controlsContainer: true,
        centered: true
    })

    const playAudio = useEffect(() => {
        if(!audioState) {
            return;
        }

        const AUDIO_PATHS:AudioMappings = {
            "click": "/button.mp3",
        }

        const a = new Audio(AUDIO_PATHS[audioState]);
        a.preload = 'auto';
        a.pause();
        a.load();
        a.play();

        setAudioState(undefined);
    }, [audioState, setAudioState]);    

    const handleOnClick = () => {
        togglePlayPause();
        setAudioState("click");
    }

    const handlePrevClick = () => {
        prevSet();
    }

    const handleNextClick = () => {
        nextSet();
    }

    const handleCloseClick = useCallback(() => {
        setAudioState("click");
        setTimeout(() => {
            closeWorkout();
        },100);
    }, [closeWorkout,setAudioState])

    const handleResume = useCallback(() => {
        if(!isPaused) {
            return;
        }
        setAudioState("click");
        play();
    }, [isPaused, play,setAudioState])

    const handlePause = useCallback(() => {
        if(isPaused) {
            return;
        }
        setAudioState("click");
        pause();
    }, [isPaused, pause,setAudioState]);

    // gross
    useKeyboard("Enter", { onKeyDown: handleOnClick })
    useKeyboard("ArrowLeft", { onKeyDown: handlePrevClick })
    useKeyboard("ArrowRight", { onKeyDown: handleNextClick })
    useKeyboard("Escape", { onKeyDown: handleCloseClick })

    useEffect(() => {
        window.exitWorkout = handleCloseClick;
        window.onPause = handlePause;
        window.onResume = handleResume;
    }, [isAndroid, handleCloseClick, handlePause, handleResume])

    const closeClassName = classNames.bind(styles)({
        controlsInnerContainer: true,
        hidden: isTV
    })

    return (
        <div className={styles.container}>
            <div className={styles.controlsContainer}>
                <div className={closeClassName}>
                    <ButtonWithIcon icon="close" onClick={handleCloseClick} />
                </div>
            </div>
            <div className={styles.mainTimerContainer}>
                <Timer style="remaining" currentTime={elapsedTime} totalTime={totalTime} />
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.moveContainer}>
                    {setEl}
                </div>
                <div className={styles.progressBar}>
                    <Timer style="bar" currentTime={elapsedTime} totalTime={totalTime} />
                </div>
            </div>
            <div className={controlsClassName}>
                <div className={styles.controlsInnerContainer}>
                    <ButtonWithIcon icon="prev" onClick={handlePrevClick} />
                    <ButtonWithIcon icon={isPaused ? "play" : "pause"} onClick={handleOnClick} />
                    <ButtonWithIcon icon="next" onClick={handleNextClick} />
                </div>
            </div>
        </div>
    )
}