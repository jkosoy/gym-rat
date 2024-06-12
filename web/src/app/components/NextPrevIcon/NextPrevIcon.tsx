import { PropsWithoutRef } from 'react'
import styles from './NextPrevIcon.module.css'
import classNames from 'classnames/bind'

type NextPrevIconProps = {
    flip?: boolean
}

export function NextPrevIcon({flip=false}:PropsWithoutRef<NextPrevIconProps>) {
    const className = classNames.bind(styles)({
        flip
    })

    return (
        <svg className={className} width="215" height="215" viewBox="0 0 215 215" fill="none">
            <path d="M168.902 102.612L115.657 71.8321C113.736 70.7226 111.37 70.7226 109.447 71.8321C107.524 72.9416 106.341 75.0002 106.341 77.2193V102.487L53.3181 71.8321C51.3935 70.7226 49.0287 70.7226 47.106 71.8321C45.1833 72.9416 44 75.0002 44 77.2193V138.782C44 141.001 45.1833 143.055 47.106 144.165C48.0674 144.72 49.1388 145 50.2101 145C51.2815 145 52.3548 144.72 53.3162 144.165L106.337 113.514V138.782C106.337 141.001 107.518 143.055 109.441 144.165C110.402 144.72 111.478 145 112.547 145C113.617 145 114.692 144.72 115.649 144.165L168.894 113.385C170.817 112.275 172 110.22 172 107.998C172.008 105.779 170.824 103.722 168.902 102.612Z" fill="currentColor"/>
        </svg>
    )
}