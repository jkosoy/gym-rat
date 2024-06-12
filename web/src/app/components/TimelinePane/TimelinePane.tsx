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
    const { workout, totalWorkoutTime, elapsedTime, status, circuitIndex, setIndex } = useWorkout()
    const scrollEl = useRef<HTMLDivElement>(null);
    const timelineEl = useRef<HTMLDivElement>(null);

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

                // incomplete circuits
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
            if(["Warmup", "Cooldown"].includes(circuit.name)) {        
                const className = classNames.bind(styles)({
                    sticky: true,
                    noSets: true
                })

                return (
                    <TimelineTitleCell key={`c${i}`} title={circuit.name} duration={circuit.sets[0].recoverySeconds} isWarmupOrCooldown />
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
                    <TimelineInfoCell duration={set.recoverySeconds}>
                        <Move label={"Recovery"} />
                    </TimelineInfoCell>) : null;

                return (
                    <Fragment key={`c${i}s${j}`}>
                        <TimelineInfoCell duration={set.activeSeconds}>{moves}</TimelineInfoCell>
                        {recoveryCell}
                    </Fragment>
                )
            })

            return (
                <Fragment key={`c${i}`}>
                    <TimelineTitleCell title={circuit.name} />
                    {setElements}
                    <TimelineInfoCell duration={workout.recoverySeconds}>                    
                        <Move label={"Water Break"} />
                    </TimelineInfoCell>
                </Fragment>
            )
        }).flat()

    }, [workout])

    
    useEffect(() => {
        if(!scrollEl || !scrollEl.current || !timelineEl || !timelineEl.current) {
            return;
        }

        const top = (() => {
            if(status === 'warmup') {
                return 0;
            }

            const elements = Array.from(timelineEl.current!.querySelectorAll("div"));
            if(status === "cooldown" || status === "complete") {
                return elements[elements.length - 1].getBoundingClientRect().top;
            }

            let index = 0;
            for(let i=0;i<=circuitIndex;i++) {
                // completed circuits
                if(i < circuitIndex) {
                    index += workout.circuits[i].sets.length + 2; // 1 is for the circuit recovery cell
                }

                // incomplete circuits
                // for(let j=0;j<setIndex;j++) {
                //     if(status === "active") {
                //         index++;
                //     }

                //     if(status === "recovery") {
                //         index++;
                //     }

                //     if(status === "circuit-recovery") {
                //         index++;
                //     }
                // }
            }

            return elements[index].getBoundingClientRect().top;
        })();

        scrollEl.current.scroll({
            top,
            behavior: 'smooth'
        })
    }, [scrollEl, timelineEl, status, circuitIndex, setIndex, workout])

    return (
        <div className={styles.container}>
            <div ref={scrollEl} className={styles.innerContainer}>
                <div className={styles.timer}>
                    <div className={styles.timerInner}>
                        <div className={styles.timerText}><Timer style="current" currentTime={totalElapsedTime} totalTime={totalWorkoutTime} /></div>
                        <div className={styles.timerBar}><Timer style="bar" currentTime={totalElapsedTime} totalTime={totalWorkoutTime} /></div>
                        <div className={styles.timerText}><Timer style="remaining" currentTime={totalElapsedTime} totalTime={totalWorkoutTime} /></div>
                    </div>
                </div>
                <div ref={timelineEl} className={styles.timeline}>
                    {timelineElements}
                </div>
            </div>
        </div>
    )

}