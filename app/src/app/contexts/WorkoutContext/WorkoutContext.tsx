"use client";

import { Context, createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Circuit, ExcerciseSet, Workout } from "@/app/types/Workout";

type Status = 'active' | 'recovery' | 'warmup' | 'cooldown' | 'default';

type WorkoutProviderProps = {
  workout: Workout
}

type WorkoutContextProps = {
  workout: Workout
  totalTime: number,
  currentTime: number,
  circuitIndex: number,
  setIndex: number,
  status:Status,
  isPaused: boolean,
  pause: Function,
  play: Function,
  nextMove: Function,
  prevMove: Function,
  getCurrentCircuit: Function
  getCurrentSet: Function
}

export const WorkoutContext = createContext<WorkoutContextProps>({} as WorkoutContextProps)

export function WorkoutProvider({workout, children}: PropsWithChildren<WorkoutProviderProps>) {
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [status, setStatus] = useState<Status>('default')
  const [circuitIndex, setCircuitIndex] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(true)

  // convenience methods
  const pause = () => { 
    if(isPaused) {
      return
    }

    setIsPaused(true);
  }
  
  const play = () => {
    if(!isPaused) {
      return
    }

    setIsPaused(false);
  }
  
  const nextMove = () => {}
  const prevMove = () => {}

  const getCurrentCircuit = ():Circuit => {
    console.log(workout);
    return workout.circuits[circuitIndex]
  }

  const getCurrentSet = ():ExcerciseSet => {
    return getCurrentCircuit().sets[setIndex]
  }

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      if(status === 'default' || isPaused) {
        return;
      }

      setTotalTime(totalTime+1)
      setCurrentTime(currentTime+1)
    }, 1000)

    return () => {
      clearInterval(interval);
    }

  }, [isPaused, currentTime, status, totalTime])

  return (<WorkoutContext.Provider 
    value={{
      workout,
      totalTime,
      currentTime,
      circuitIndex,
      setIndex,
      status,
      isPaused,
      pause,
      play,
      nextMove,
      prevMove,
      getCurrentCircuit,
      getCurrentSet
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}