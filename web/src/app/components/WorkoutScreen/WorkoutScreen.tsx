"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';
import { useEffect, useRef } from 'react';

export function WorkoutScreen() {
    const el = useRef(null);
    const { status } = useWorkout()
    const recoveryRef = useRef<HTMLAudioElement>(null);
    const circuitRecoveryRef = useRef<HTMLAudioElement>(null);
    const activeRef = useRef<HTMLAudioElement>(null);
    const cooldownRef = useRef<HTMLAudioElement>(null);

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
        function playAudio(url:string) {
            const a = new Audio(url);
            a.preload = 'auto';
            a.pause();
            a.load();
            a.play();
        }

        if(status === "circuit-recovery" && circuitRecoveryRef.current) {
            playAudio(circuitRecoveryRef.current.src);
        }

        if(status === "active" && activeRef.current) {
            playAudio(activeRef.current.src);

        }

        if(status === "recovery" && recoveryRef.current) {
            playAudio(recoveryRef.current.src);
        }
        if(status === "cooldown" && cooldownRef.current) {
            playAudio(cooldownRef.current.src);
        }
    }, [status, recoveryRef, activeRef, circuitRecoveryRef])
    

    return(
        <>
            <div ref={el} className={styles.container}>
                <ActiveMovePane />
                <TimelinePane />
            </div>
            <div style={{display: 'none'}}>
                <audio ref={recoveryRef} src='/recovery.mp3' preload="auto" />
                <audio ref={circuitRecoveryRef} src='/circuit-recovery.mp3' preload="auto" />
                <audio ref={activeRef} src='/active.mp3' preload="auto" />
                <audio ref={cooldownRef} src='/cooldown.mp3' preload='auto' />
            </div>
        </>
    )
}