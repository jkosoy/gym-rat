import { useWorkout } from '@/app/hooks/useWorkout'
import styles from './ActiveMovePane.module.css'
import { Timer } from '../Timer/Timer';
import { Move } from '../Move';
import { Circuit, ExcerciseSet } from '@/app/types/Workout';
import { ButtonWithIcon } from '../ButtonWithIcon';
import classNames from 'classnames/bind';
import { useDevice } from '@/app/hooks/useDevice';
import { useAndroid } from '@/app/hooks/useAndroid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyboard } from '@/app/hooks/useKeyboard';
import { useSoundEffect } from '@/app/hooks/useSoundEffects';

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
        set,
        elapsedTime,
        togglePlayPause,
        prevSet,
        nextSet,
        closeWorkout,
        play,
        pause,
        isPaused,
    } = useWorkout();
    const { isTV } = useDevice()
    const { isAndroid } = useAndroid();
    const [audioState, setAudioState] = useState<AudioState>();
    const [playEffect] = useSoundEffect()

    const { time, el } = useMemo(() => {
        if(!workout || !set) {
            return { time: 0, el: null }
        }

        const { type, time } = set;

        const el = (() => {
            if(type === "warmup") {
                return <h2>Warmup</h2>
            }

            if(type === "cooldown") {
                return <h2>Cooldown</h2>
            }

            if(type === "circuit-recovery") {
                return <h2>Water Break</h2>
            }

            if(type === "recovery") {
                return <h2>Recovery</h2>
            }

            // active
            const movesEl = set.moves.flatMap((move, i) => {
                const { reps, name, equipment } = move;
                return (
                    <Move key={`m${i}`} reps={reps} label={name} equipment={equipment} focused />
                )
            })

            return (
                <>
                    <div className={styles.moves}>{movesEl}</div>
                </>            
            )        
        })();

        return { time, el }        
    }, [workout, set])

    const controlsClassName = classNames.bind(styles)({
        controlsContainer: true,
        centered: true
    })

    useEffect(() => {
        if(!audioState) {
            return;
        }

        const AUDIO_PATHS:AudioMappings = {
            "click": "/button.mp3"
        };

        playEffect(AUDIO_PATHS[audioState]!)
        setAudioState(undefined);    

    }, [audioState, setAudioState, playEffect]);    

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
    }, [isPaused, pause, setAudioState]);

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
                <Timer style={set?.autoAdvance ? "remaining" : "dashes"} currentTime={elapsedTime} totalTime={time} />
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.moveContainer}>
                    {el}
                </div>
                <div className={styles.progressBar}>
                    <Timer style="bar" currentTime={elapsedTime} totalTime={time} />
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