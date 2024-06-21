import { Logo } from '@/app/components/Logo';
import { WorkoutPicker } from '@/app/components/WorkoutPicker';
import styles from './MenuScreen.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { Workout } from '@/app/types/Workout';
import { useWorkout } from '@/app/hooks/useWorkout';

type AnimationState = 'in' | 'out';

export function MenuScreen() {
  const { setWorkout } = useWorkout();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();

  const animationState = useMemo(():AnimationState => {
    if(selectedWorkout) {
      return 'out';
    }

    return 'in';
  }, [selectedWorkout])

  useEffect(() => {
    // // const to = setTimeout(() => {
    // //   setWorkout(selectedWorkout);      
    // // }, 1000);

    // return () => clearTimeout(to);
  }, [selectedWorkout, setWorkout])

  const className = classNames.bind(styles)({
    container: true,
    in: animationState === 'in',
    out: animationState === 'out'
  })

  const handleAnimationEnd = useCallback(() => {
    if(!selectedWorkout) {
      return;
    }

    setWorkout(selectedWorkout);
  }, [selectedWorkout, setWorkout])

  return (
      <div className={className} onAnimationEnd={handleAnimationEnd}>
        <div className={styles.containerContent}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.picker}>
            <WorkoutPicker callback={setSelectedWorkout} />
          </div>
        </div>
      </div>
  )
}