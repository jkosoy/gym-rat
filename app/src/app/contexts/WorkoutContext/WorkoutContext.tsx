"use client";

import { Context, createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Workout } from "@/app/types/Workout";

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
  moveIndex: number,
  status:Status,
  isPaused: boolean,
  pause: Function,
  play: Function,
  nextMove: Function,
  prevMove: Function,
}

export const WorkoutContext = createContext<WorkoutContextProps>({} as WorkoutContextProps)

export function WorkoutProvider({workout, children}: PropsWithChildren<WorkoutProviderProps>) {
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [status, setStatus] = useState<Status>('default')
  const [circuitIndex, setCircuitIndex] = useState(-1)
  const [moveIndex, setMoveIndex] = useState(-1)
  const [setIndex, setSetIndex] = useState(-1)
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

  }, [isPaused])

  return (<WorkoutContext.Provider 
    value={{
      workout,
      totalTime,
      currentTime,
      circuitIndex,
      setIndex,
      moveIndex,
      status,
      isPaused,
      pause,
      play,
      nextMove,
      prevMove
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}