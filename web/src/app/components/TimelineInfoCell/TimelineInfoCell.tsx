import { PropsWithChildren } from 'react'
import styles from './TimelineInfoCell.module.css'
import classNames from "classnames/bind"
import { formatTime } from '@/app/helpers/time'

type TimelineInfoCellProps = {
    duration: number,
    displayDuration?: boolean
}

export function TimelineInfoCell({duration, displayDuration=true, children}: PropsWithChildren<TimelineInfoCellProps>) {
    const computedDuration = displayDuration ? formatTime(duration) : '';

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <span className={styles.moveList}>{children}</span>
                <span className={styles.duration}>{computedDuration}</span>
            </div>
        </div>
    )
}