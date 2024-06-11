import { useWorkout } from '@/app/hooks/useWorkout'
import styles from './ActiveMovePane.module.css'
import { Timer } from '../Timer/Timer';
import { Move } from '../Move';
import { Circuit, ExcerciseSet } from '@/app/types/Workout';
import { ButtonWithIcon } from '../ButtonWithIcon';
import classNames from 'classnames/bind';

export function ActiveMovePane() {
    const { workout, getCurrentCircuit, getCurrentSet, status, isPaused } = useWorkout();


    const setEl = (() => {
        if(["warmup", "cooldown", "default"].includes(status) && false) {
            const circuit:Circuit = getCurrentCircuit()

            return (
                <h2>{circuit.name}</h2>
            )
        }

        const set:ExcerciseSet = workout.circuits[1].sets[1] // getCurrentSet()
        if(status === "recovery") {
            return (
                <h2>Recovery</h2>
            )            
        }

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

    return (
        <div className={styles.container}>
            <div className={styles.controlsContainer}>
                <div className={styles.controlsInnerContainer}>
                    <ButtonWithIcon icon="close" />
                </div>
            </div>
            <div className={styles.mainTimerContainer}>
                <Timer style="remaining" currentTime={28} totalTime={30} />
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.moveContainer}>
                    {setEl}
                </div>
                <div className={styles.progressBar}>
                    <Timer style="bar" currentTime={28} totalTime={30} />
                </div>
            </div>
            <div className={controlsClassName}>
                <div className={styles.controlsInnerContainer}>
                    <ButtonWithIcon icon="prev" />
                    <ButtonWithIcon icon={isPaused ? "play" : "pause"} />
                    <ButtonWithIcon icon="next" />
                </div>
            </div>
        </div>
    )
}