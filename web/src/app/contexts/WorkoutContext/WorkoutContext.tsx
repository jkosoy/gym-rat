"use client";

import { Context, createContext, Dispatch, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Circuit, ExcerciseSet, Workout } from "@/app/types/Workout";

export type Status = 'active' | 'recovery' | 'warmup' | 'cooldown' | 'circuit-recovery' | 'complete';

type WorkoutContextProps = {
  workout?: Workout,
  set?: ExcerciseSet,
  sets: ExcerciseSet[],
  elapsedTime: number,
  totalTime: number,
  setIndex: number,
  isPaused: boolean,
  pause: Function,
  play: Function,
  nextSet: Function,
  prevSet: Function,
  togglePlayPause: Function,
  setWorkout: Dispatch<Workout|undefined>,
  closeWorkout: Function
}

export const WorkoutContext = createContext<WorkoutContextProps>({} as WorkoutContextProps)

export function WorkoutProvider({children}: PropsWithChildren) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [workout, setWorkout] = useState<Workout>()
  
  const sets = useMemo(() => {
    if(!workout) {
      return [];
    }

    return workout.circuits.flatMap(circuit => circuit.sets);
  }, [workout])

  const totalTime = useMemo(() => {
    if(!workout) { 
      return 0;
    }

    return sets.reduce((total, set) => total + set.time, 0);
  }, [workout, sets])

  const set = useMemo(() => workout ? sets[setIndex] : undefined, [workout, sets, setIndex]);
  
  const pause = useCallback(() => { 
    if(isPaused || set?.autoAdvance === false) {
      return
    }

    setIsPaused(true);
  },[isPaused, set])
  
  const play = useCallback(() => {
    if(!isPaused || set?.autoAdvance === false) {
      return
    }

    setIsPaused(false);
  },[isPaused, set])

  const togglePlayPause = useCallback(() => {
    if(isPaused) {
      play();
      return;
    }

    pause();
  },[isPaused, pause, play])

  const nextSet = useCallback(() => {
    if(!workout) {
      return;
    }

    setElapsedTime(0);

    const index = setIndex+1;

    if(index > sets.length)  {
      return;
    }
    
    setSetIndex(index);
  }, [workout, sets, setSetIndex, setIndex])

  const prevSet = useCallback(() => {
    if(!workout) {
      return;
    }

    setElapsedTime(0);
    const index = setIndex-1;

    if(index < 0) {
      return;
    }

    setSetIndex(index);
  }, [workout, setSetIndex, setIndex])

  const closeWorkout = useCallback(() => {
    setElapsedTime(0);
    setSetIndex(0);
    setIsPaused(false);
    setWorkout(undefined);
  }, [setElapsedTime,setSetIndex,setIsPaused,setWorkout])

  // timer
  useEffect(() => {
    if(!workout || !set) {
      return;
    }

    const interval = setInterval(() => {
      if(isPaused || setIndex === sets.length || set.autoAdvance === false) {
        return;
      }

      let time = elapsedTime+1;      
      const timeRemaining = set!.time - time;
      if(timeRemaining <= 0) {
        nextSet();
        return;
      }

      setElapsedTime(time)
    }, 1000)

    return () => {
      clearInterval(interval);
    }

  }, [workout, set, sets, setIndex, isPaused, elapsedTime, nextSet])

  return (<WorkoutContext.Provider 
    value={{
      workout,
      sets,
      set,
      elapsedTime,
      totalTime,
      setIndex,
      isPaused,
      pause,
      play,
      nextSet,
      prevSet,
      togglePlayPause,
      setWorkout,
      closeWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}