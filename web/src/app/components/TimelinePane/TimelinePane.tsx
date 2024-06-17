import { Fragment, useMemo } from "react";

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
        totalWorkoutTime, 
        elapsedTime, 
        status, 
        circuitIndex, 
        setIndex
    } = useWorkout()
    const timelineEls = useRef<HTMLDivElement[]>([])

    const totalElapsedTime = useMemo(() => {
        if(status === "warmup") {
            return elapsedTime;
        }

        if(status === "complete") {
            return totalWorkoutTime;
        }

        let totalElapsedTime = elapsedTime;
        for(let i=0;i<=circuitIndex;i++) {
            const addedTime = (() => {                // warmup and cooldown
                if(i === 0 || i === workout.circuits.length) {
                    return workout.circuits[i].sets[0].recoverySeconds;
                }

                // completed circuits
                if(i < circuitIndex) {
                    let time = workout.recoverySeconds;
                    workout.circuits[i].sets.forEach(set => { 
                        time += set.recoverySeconds + set.activeSeconds;
                    })
                    return time;
                }

                // current circuit
                let time = 0;
                for(let j=0;j<=setIndex;j++) {
                    const { activeSeconds, recoverySeconds } = workout.circuits[i].sets[j];
                    const addedTime = (() => {
                        if(j < setIndex || status === "circuit-recovery") {
                            return activeSeconds + recoverySeconds;
                        }
                        
                        if(status === "recovery") {
                            return activeSeconds;
                        }

                        return 0;
                    })()

                    time += addedTime;
                }

                return time;    
            })();

            totalElapsedTime += addedTime;
        }

        return totalElapsedTime;
    }, [circuitIndex, setIndex, elapsedTime, status, workout, totalWorkoutTime])

    const timelineElements = useMemo(() => {
        return workout.circuits.flatMap((circuit, i) => {
            if(i === 0 || i === workout.circuits.length-1) {        
                const className = classNames.bind(styles)({
                    sticky: true,
                    noSets: true
                })

                return (    
                    <div key={`c${i}`} className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}>
                        <TimelineTitleCell title={circuit.name} duration={circuit.sets[0].recoverySeconds} isWarmupOrCooldown />
                    </div>                        
                )
            }

            const setElements = circuit.sets.flatMap((set, j) => {
                const moves = set.moves.flatMap((move, k) => {
                    const { reps, name, equipment } = move;

                    return (
                        <Move key={`c${i}s${j}m${k}`} reps={reps} label={name} equipment={equipment} />
                    )
                })

                
                const recoveryCell = (set.recoverySeconds > 0) ? (
                    <div className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}>
                        <TimelineInfoCell duration={set.recoverySeconds}>
                            <Move label={"Recovery"} />
                        </TimelineInfoCell>
                    </div>
                ) : null;

                return (
                    <Fragment key={`c${i}s${j}`}>
                        <div className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}>
                            <TimelineInfoCell duration={set.activeSeconds}>{moves}</TimelineInfoCell>
                        </div>
                        {recoveryCell}
                    </Fragment>
                )
            })

            return (
                <Fragment key={`c${i}`}>
                    <TimelineTitleCell title={circuit.name} />
                    {setElements}
                    <div className={styles.scrollCell} ref={el => {timelineEls.current[timelineEls.current.length] = el!}}>
                        <TimelineInfoCell duration={workout.recoverySeconds}>                    
                            <Move label={"Water Break"} />
                        </TimelineInfoCell>
                    </div>
                </Fragment>
            )
        }).flat()

    }, [workout])


    const totalItems = useMemo(() => {
        let counter = 0;
        workout.circuits.forEach((circuit, idx) => {
            if(idx === 0 || idx === workout.circuits.length-1) {
                counter++;
                return;
            }

            circuit.sets.forEach(set => {
                counter++;
                if(set.recoverySeconds > 0) {
                    counter++;
                }
            });

            if(workout.recoverySeconds > 0) {
                counter++
            }
        });

        return counter;
    }, [workout])

    const currentItem = useMemo(() => {
        if(status === 'warmup') {
            return 0;
        }

        if(status === 'cooldown' || status === 'complete') {
            return totalItems-1;
        }

        let counter = -1;
        workout.circuits.slice(0, circuitIndex+1).forEach((circuit, idx) => {
            // warmup
            if(idx === 0) {
                counter++;
                return;
            }

            // completed circuits
            if(idx < circuitIndex) {
                circuit.sets.forEach(set => {
                    counter++;

                    if(set.recoverySeconds > 0) {
                        counter++;
                    }
                })

                if(workout.recoverySeconds > 0) {
                    counter++;
                }

                return;
            }

            // current circuit, completed sets
            circuit.sets.slice(0, setIndex).forEach(set => {
                counter++;

                if(set.recoverySeconds > 0) {
                    counter++;
                }
            })

            // current circuit, current set
            counter++;

            if(status === 'recovery') {
                counter++;
            }

            if(status === 'circuit-recovery') {
                if(workout.circuits[circuitIndex].sets[setIndex].recoverySeconds > 0) {
                    counter++;
                }

                counter++; 
            }
        })

        return counter;
    }, [status, workout, circuitIndex, setIndex, totalItems]);


    useEffect(() => {
        if(!timelineEls || !timelineEls.current) {
            return;
        }

        const els = timelineEls.current as HTMLDivElement[]
        if(els.length === 0) { 
            return
        }

        const el = els[currentItem === totalItems-1 ? totalItems : currentItem];
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }, [timelineEls, currentItem, totalItems])

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.timer}>
                    <div className={styles.timerInner}>
                        <div className={styles.timerText}><Timer style="current" currentTime={totalElapsedTime} totalTime={totalWorkoutTime} /></div>
                        <div className={styles.timerBar}><Timer style="bar" currentTime={totalElapsedTime} totalTime={totalWorkoutTime} /></div>
                        <div className={styles.timerText}><Timer style="remaining" currentTime={totalElapsedTime} totalTime={totalWorkoutTime} /></div>
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