import { PropsWithoutRef, useMemo } from 'react'
import styles from './BadgeWithIcon.module.css'
import { LadderIcon } from '../LadderIcon'
import { BosuIcon } from '../BosuIcon'
import { KettleBellIcon } from '../KettleBellIcon'
import { FreeWeightIcon } from '../FreeWeightIcon'
import { JumpRopeIcon } from '../JumpRopeIcon'
import { BoxIcon } from '../BoxIcon'
import { BattleRopeIcon } from '../BattleRopeIcon'
import { ResistanceBandIcon } from '../ResistanceBandIcon'
import { TRXIcon } from '../TRXIcon'
import { SandbagIcon } from '../SandbagIcon'
import { ResistanceTubesIcon } from '../ResistanceTubesIcon'
import { SlamballIcon } from '../SlamballIcon'

type BadgeWithIconProps = {
    icon: "ladder" | "bosu" | "kettlebell" | "free-weight" | "jump-rope" | "box" | "battle-rope" | "resistance-band" | "resistance-tubes" | "trx" | "sandbag" | "slamball"
}

export function BadgeWithIcon({icon}:PropsWithoutRef<BadgeWithIconProps>) {
    const iconEl = useMemo(() => {
        if(icon === "ladder") {
            return <LadderIcon />
        }

        if(icon === "bosu") {
            return <BosuIcon />
        }

        if(icon === "kettlebell") {
            return <KettleBellIcon />
        }

        if(icon === "free-weight") {
            return <FreeWeightIcon />
        }

        if(icon === "jump-rope") {
            return <JumpRopeIcon />
        }

        if(icon === "box") {
            return <BoxIcon />
        }

        if(icon === "battle-rope") {
            return <BattleRopeIcon />
        }

        if(icon === "resistance-tubes") {
            return <ResistanceTubesIcon />
        }

        if(icon === "resistance-band") {
            return <ResistanceBandIcon />
        }

        if(icon === "trx") {
            return <TRXIcon />
        }

        if(icon == "sandbag") {
            return <SandbagIcon />
        }

        if(icon == "slamball") {
            return <SlamballIcon />
        }        
    }, [icon])

    return (
        <div className={styles.container}>
            {iconEl}
        </div>
    )
}