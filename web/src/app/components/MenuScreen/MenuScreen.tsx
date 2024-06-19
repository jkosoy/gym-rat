import { Logo } from '@/app/components/Logo';
import { WorkoutPicker } from '@/app/components/WorkoutPicker';
import styles from './MenuScreen.module.css';

export function MenuScreen() {
    return (
        <div className={styles.container}>
          <div className={styles.containerContent}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.picker}>
              <WorkoutPicker />
            </div>
          </div>
        </div>
    )
}