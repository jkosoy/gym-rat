import { PropsWithoutRef } from 'react'
import styles from './Move.module.css'
import classNames from 'classnames/bind'

type MoveProps = {
    label: string,
    reps?: number,
    equipment?: string
    focused?: boolean
}

export function Move({label, reps=undefined, equipment=undefined, focused=false}:PropsWithoutRef<MoveProps>) {
    const repsEl = reps ? (
        <span className={styles.reps}>{reps}</span>
    ) : null

    const className = classNames.bind(styles)({
        container: true,
        focused
    })

    return (
        <div className={className}>
            {repsEl}
            <span className={styles.label}>{label}</span>
        </div>
    )
}