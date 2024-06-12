"use client";

import { useWorkout } from '@/app/hooks/useWorkout';
import { ActiveMovePane } from '../ActiveMovePane';
import { TimelinePane } from '../TimelinePane';
import styles from './WorkoutScreen.module.css';
import { useEffect, useRef } from 'react';

export function WorkoutScreen() {
    const el = useRef(null);
    const { status } = useWorkout()

    // google tv hack
    useEffect(() => {
        alert(navigator.userAgent)

        if(navigator.userAgent && typeof screen != 'undefined' && screen.width) {
        const isAndroid = navigator.userAgent.includes('Android') || navigator.userAgent.includes('Google TV') || navigator.userAgent.includes('GoogleTV')
        if(isAndroid) {
            const content = `user-scalable=no, initial-scale:1, maximum-scale: 1, width=${screen.width}`
            const viewport = document.querySelector('meta[name=viewport]')
            viewport!.setAttribute('content', content)
        }
        }
    }, [])


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