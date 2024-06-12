import { PropsWithChildren, useMemo } from 'react'
import styles from './ButtonWithIcon.module.css'
import { PlayIcon } from '../PlayIcon'
import { PauseIcon } from '../PauseIcon'
import { CloseIcon } from '../CloseIcon'
import { NextPrevIcon } from '../NextPrevIcon'

type ButtonWithIconProps = {
    icon: "play" | "pause" | "next" | "prev" | "close",
    onClick?: Function
}

export function ButtonWithIcon({icon, onClick=undefined}:PropsWithChildren<ButtonWithIconProps>) {    
    function handleOnClick() {
        if(onClick === undefined) {
            return
        }

        onClick()
    }

    const buttonEl = useMemo(() => {
        if(icon === "play") {
            return <PlayIcon />
        }

        if(icon === "pause") {
            return <PauseIcon />
        }

        if(icon === "close") {
            return <CloseIcon />
        }

        if(icon === "next") {
            return <NextPrevIcon />
        }

        if(icon == "prev") {
            return <NextPrevIcon flip />
        }
    }, [icon])

    return (
        <button className={styles.container} onClick={handleOnClick}>
            {buttonEl}
        </button>
    )
}