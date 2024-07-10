import { Fragment, useMemo, useState } from "react";

import { useWorkout } from "@/app/hooks/useWorkout";
import styles from './TimelinePane.module.css';
import { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { TimelineTitleCell } from "@/app/components/TimelineTitleCell";
import { TimelineInfoCell } from "@/app/components/TimelineInfoCell";
import { Move } from "@/app/components/Move";
import { Timer } from "../Timer/Timer";

export function TimelinePane() {
    const { 
        workout,
        elapsedTime, 
        totalTime, 
        set, 
        sets,
        setIndex
    } = useWorkout()
    const timelineEls = useRef<HTMLDivElement[]>([])
    const [isTimelineIn, setIsTimelineIn] = useState(false);

    const totalElapsedTime = useMemo(() => {
        if(!workout) {
            return 0;
        }

        return sets.slice(0, setIndex).reduce((time, s) => time + s.time, 0) + elapsedTime
    }, [workout, sets, setIndex, elapsedTime]);


    const timelineElements = useMemo(() => {
        if(!workout) {
            return;
        }

        return workout.circuits.flatMap((circuit, i) => {
            if(i === 0 || i === workout.circuits.length-1) {        
                const className = classNames.bind(styles)({
                    sticky: true,
                    noSets: true
                })

                return (    
                    <div key={`c${i}`} className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}>
                        <TimelineTitleCell title={circuit.name} duration={circuit.sets[0].time} isWarmupOrCooldown />
                    </div>                        
                )
            }

            const setElements = circuit.sets.flatMap((set, j) => {
                const { moves, type, time } = set;
                const key = `c${i}s${j}`;

                const movesEl = (() => {

                    if(type === "circuit-recovery") {
                        return (
                            <Move key={`${key}m0`} label={"Water Break"} />
                        )
                    }

                    if(type === "recovery") {
                        return (
                            <Move key={`${key}m0`} label={"Recovery"} />
                        )
                    }

                    // active
                    return set.moves.flatMap((move, k) => {
                        const { reps, name, equipment } = move;

                        return (
                            <Move key={`${key}m${k}`} reps={reps} label={name} equipment={equipment} />
                        )
                    })
                })()

                return (
                    <div key={key} className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}>
                        <TimelineInfoCell duration={time} displayDuration={set.autoAdvance}>{movesEl}</TimelineInfoCell>
                    </div>
                )
            })

            return (
                <Fragment key={`c${i}`}>
                    <TimelineTitleCell title={circuit.name} />
                    {setElements}
                </Fragment>
            )
        })
    }, [workout])


    const handleTimelineInAnimation = () => {
        setIsTimelineIn(true)
    }

    useEffect(() => {
        if(!timelineEls || !timelineEls.current) {
            return;
        }

        const els = timelineEls.current as HTMLDivElement[]
        if(els.length === 0) { 
            return
        }

        if(isTimelineIn !== true) {
            return;
        }

        const el = els[setIndex === sets.length-1 ? sets.length-1 : setIndex];
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }, [timelineEls, sets, setIndex, isTimelineIn])

    return (
        <div className={styles.container} onAnimationEnd={handleTimelineInAnimation}>
            <div className={styles.innerContainer}>
                <div className={styles.timer}>
                    <div className={styles.timerInner}>
                        <div className={styles.timerText}><Timer style="current" currentTime={totalElapsedTime} totalTime={totalTime} /></div>
                        <div className={styles.timerBar}><Timer style="bar" currentTime={totalElapsedTime} totalTime={totalTime} /></div>
                        <div className={styles.timerText}><Timer style="remaining" currentTime={totalElapsedTime} totalTime={totalTime} /></div>
                    </div>
                </div>
                <div className={styles.timeline}>
                    {timelineElements}
                    {/* extra scroll cell to force the cooldown to stand alone */}
                    <div className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}></div>
                </div>
            </div>
        </div>
    )

}