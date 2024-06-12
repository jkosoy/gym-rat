import { PropsWithChildren } from 'react'
import styles from './TimelineTitleCell.module.css'
import classNames from 'classnames/bind'
import { formatTime } from '@/app/helpers/time'

export type TimelineTitleCellProps = {
    title: string
    duration?: number
    isWarmupOrCooldown?: boolean
}

export function TimelineTitleCell({title, duration=0, isWarmupOrCooldown=false}: PropsWithChildren<TimelineTitleCellProps>) {
    const className = classNames.bind(styles)({
        container: true,
        noSets: isWarmupOrCooldown
    })

    const computedDuration = formatTime(duration)

    return (
        <div className={className}>
            <div className={styles.grid}>
                <span className={styles.title}>{title}</span>
                <span className={styles.duration}>{computedDuration}</span>
            </div>
        </div>
    )
}