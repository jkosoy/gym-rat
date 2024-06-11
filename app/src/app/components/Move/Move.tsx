import { PropsWithoutRef } from 'react'
import styles from './Move.module.css'

type MoveProps = {
    label: string,
    reps?: number,
    equipment?: string
}

export function Move({label, reps=undefined, equipment=undefined}:PropsWithoutRef<MoveProps>) {
    const repsEl = reps ? (
        <span className={styles.reps}>{reps}</span>
    ) : null

    return (
        <div className={styles.container}>
            {repsEl}
            <span className={styles.label}>{label}</span>
        </div>
    )
}