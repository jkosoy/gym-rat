import Image from "next/image";
import { Routine } from "@/app/types/Workout";
import { getRoutines } from "@/app/api/workouts";

import styles from './Logo.module.css';

export async function Logo() { 
    return (
        <div className={styles.container}>
            <Image
                className={styles.image}
                src="/icon.png" 
                alt={"Gym Rat"}
                width={512}
                height={512}
            />
        </div>
    )
}