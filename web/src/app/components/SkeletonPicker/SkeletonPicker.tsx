import styles from './SkeletonPicker.module.css';

export function SkeletonPicker() { 
    return (
        <div className={styles.container}>
            <div className={styles.skeleton}></div>
        </div>
    )
}