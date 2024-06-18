import { PropsWithoutRef, useMemo } from 'react'
import styles from './Move.module.css'
import classNames from 'classnames/bind'
import { BadgeWithIcon, IconName } from '../BadgeWithIcon'

type MoveProps = {
    label: string,
    reps?: number,
    equipment?: string
    focused?: boolean
}

export function Move({label, reps=undefined, equipment=undefined, focused=false}:PropsWithoutRef<MoveProps>) {
    const className = classNames.bind(styles)({
        container: true,
        hasEquipment: equipment !== undefined,
        focused
    })

    const equipmentNameToIconName = useMemo(():IconName|undefined => {
        if(equipment === "Bodyweight") {
            return "bodyweight";
        }

        if(equipment === "Agility Ladder") {
            return "ladder";
        }

        if(equipment === "Battle ropes") {
            return "battle-rope";
        }

        if(equipment === "Bosu") {
            return "bosu";
        }

        if(equipment === "Free Weights") {
            return "free-weight";
        }

        if(equipment === "Jump rope") {
            return "jump-rope";
        }

        if(equipment === "Kettlebells") {
            return "kettlebell"
        }

        if(equipment === "Plyo Box") {
            return "box";
        }

        if(equipment === "Resistance Bands") {
            return "resistance-band";
        }

        if(equipment === "Sandbag") {
            return "sandbag";
        }

        if(equipment === "Slam Ball") {
            return "slamball";
        }

        if(equipment === "TRX") {
            return "trx";
        }

        if(equipment === "Tubes") {
            return "resistance-tubes";
        }
    }, [equipment])

    const repsEl = reps && (
        <span className={styles.reps}>{reps} reps</span>
    )

    const equipmentEl = equipmentNameToIconName && (
        <div className={styles.equipment}>
            <BadgeWithIcon icon={equipmentNameToIconName} />
        </div>            
    )

    return (
        <div className={className}>
            {equipmentEl}
            <div className={styles.moveInfoEl}>
                <span className={styles.label}>{label}</span>
                {repsEl}
            </div>
        </div>
    )
}