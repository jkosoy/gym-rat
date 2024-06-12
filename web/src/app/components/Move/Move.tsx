import { PropsWithoutRef } from 'react'
import styles from './Move.module.css'
import classNames from 'classnames/bind'
import { BadgeWithIcon } from '../BadgeWithIcon'

type MoveProps = {
    label: string,
    reps?: number,
    equipment?: string
    focused?: boolean
}

export function Move({label, reps=undefined, equipment=undefined, focused=false}:PropsWithoutRef<MoveProps>) {
    const className = classNames.bind(styles)({
        container: true,
        focused
    })

    const repsEl = reps && (
        <span className={styles.reps}>({reps}x)</span>
    )

    const equipmentEl = equipment && (
        <span className={styles.equipment}><BadgeWithIcon icon="trx" /></span>
    )

    return (
        <div className={className}>
            {equipmentEl}
            <span className={styles.label}>{label}</span>
            {repsEl}
        </div>
    )
}