import Image from "next/image";
import styles from './Logo.module.css';
import icon from './icon.png';

export function Logo() { 
    return (
        <div className={styles.container}>
            <Image
                className={styles.image}
                src={icon} 
                alt={"Gym Rat"}
                width={512}
                height={512}
            />
        </div>
    )
}