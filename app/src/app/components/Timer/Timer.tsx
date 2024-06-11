import { formatTime } from "@/app/helpers/time";
import { PropsWithoutRef, useMemo } from "react";
import styles from './Timer.module.css';
import classNames from "classnames/bind";

export interface TimerProps {
    style: "current" | "remaining" | "bar",
    currentTime: number,
    totalTime: number
}

export function Timer({style, currentTime, totalTime}:PropsWithoutRef<TimerProps>) {
    const percentCompleted = (currentTime/totalTime) || 1;

    const displayTime = useMemo(() => {
        if(style === "bar") {
            return `${percentCompleted * 100}%`
        }
        
        if(style === "current") {
            return formatTime(currentTime);
        }

        return formatTime(totalTime - currentTime);
    }, [style, currentTime, totalTime, percentCompleted]);

    const classes = classNames.bind(styles)({
        container: true,
        progressBar: style === "bar"
    });
    
    return (
        <div className={classes} style={{'--percent-completed': percentCompleted } as React.CSSProperties}>
            <span className={styles.time}>{displayTime}</span>
        </div>
    )
}