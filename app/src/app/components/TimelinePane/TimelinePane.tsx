import { Fragment, useMemo } from "react";

import { useWorkout } from "@/app/hooks/useWorkout";
import styles from './TimelinePane.module.css';
import { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { formatTime } from "@/app/helpers/time";
import { TimelineTitleCell } from "@/app/components/TimelineTitleCell";
import { TimelineInfoCell } from "@/app/components/TimelineInfoCell";
import { Move } from "@/app/components/Move";
import { Timer } from "../Timer/Timer";

export function TimelinePane() {
    const { workout, currentTime, totalTime } = useWorkout()
    const scrollEl = useRef<HTMLDivElement>(null);

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
        if(!scrollEl) {
            return;
        }

        // TODO: scroll to the position of the latest cell.
        // scrollEl.current!.scroll({
        //     top,
        //     behavior: 'smooth'
        // })
    }, [scrollEl])

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.timer}>
                    <div className={styles.timerInner}>
                        <div className={styles.timerText}><Timer style="current" currentTime={currentTime} totalTime={totalTime} /></div>
                        <div className={styles.timerBar}><Timer style="bar" currentTime={currentTime} totalTime={totalTime} /></div>
                        <div className={styles.timerText}><Timer style="remaining" currentTime={currentTime} totalTime={totalTime} /></div>
                    </div>
                </div>
                <div className={styles.timeline}>
                    {timelineElements}
                </div>
            </div>
        </div>
    )

}