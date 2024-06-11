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
            <path d="M203.159 99.3296L119.964 51.2985C116.963 49.5672 113.265 49.5672 110.261 51.2985C107.256 53.0298 105.408 56.2422 105.408 59.7049V99.1336L22.5595 51.2985C19.5523 49.5672 15.8574 49.5672 12.8532 51.2985C9.84898 53.0298 8 56.2422 8 59.7049V155.77C8 159.233 9.84898 162.439 12.8532 164.17C14.3553 165.036 16.0293 165.473 17.7033 165.473C19.3774 165.473 21.0544 165.036 22.5565 164.17L105.401 116.341V155.77C105.401 159.233 107.247 162.439 110.252 164.17C111.754 165.036 113.434 165.473 115.105 165.473C116.776 165.473 118.456 165.036 119.952 164.17L203.147 116.139C206.151 114.408 208 111.202 208 107.733C208.012 104.27 206.163 101.061 203.159 99.3296Z" fill="currentColor"/>
        </svg>
    )
}