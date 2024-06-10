import { Suspense } from 'react';
import { Logo } from '@/app/components/Logo';
import { SkeletonPicker } from '@/app/components/SkeletonPicker';
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
              <Suspense fallback={<SkeletonPicker />}>
                <WorkoutPicker />
              </Suspense>
            </div>
          </div>
        </div>
    )
}