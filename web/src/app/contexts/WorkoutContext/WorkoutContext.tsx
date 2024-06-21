"use client";

import { Context, createContext, Dispatch, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Circuit, ExcerciseSet, Workout } from "@/app/types/Workout";

export type Status = 'active' | 'recovery' | 'warmup' | 'cooldown' | 'circuit-recovery' | 'complete';

type WorkoutContextProps = {
  workout?: Workout
  elapsedTime: number,
  circuitIndex: number,
  setIndex: number,
  status:Status,
  isPaused: boolean,
  pause: Function,
  play: Function,
  nextSet: Function,
  prevSet: Function,
  getCurrentCircuit: Function
  getCurrentSet: Function,
  togglePlayPause: Function,
  totalWorkoutTime: number,
  setWorkout: Dispatch<Workout|undefined>,
  closeWorkout: Function
}

export const WorkoutContext = createContext<WorkoutContextProps>({} as WorkoutContextProps)

export function WorkoutProvider({children}: PropsWithChildren) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [status, setStatus] = useState<Status>('warmup')
  const [circuitIndex, setCircuitIndex] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [workout, setWorkout] = useState<Workout>()

  // convenience methods
  const pause = useCallback(() => { 
    if(isPaused) {
      return
    }

    setIsPaused(true);
  },[isPaused])
  
  const play = useCallback(() => {
    if(!isPaused) {
      return
    }

    setIsPaused(false);
  },[isPaused])

  const togglePlayPause = useCallback(() => {
    if(isPaused) {
      play();
      return;
    }

    pause();
  },[isPaused, pause, play])

  const getCurrentCircuit = useCallback(():Circuit|undefined => {
    if(!workout) {
      return;
    }

    return workout.circuits[circuitIndex]
  },[workout, circuitIndex])

  const getCurrentSet = useCallback(():ExcerciseSet|undefined => {
    const currenctCircuit = getCurrentCircuit()
    if(!currenctCircuit) {
      return
    }

    return currenctCircuit.sets[setIndex]
  }, [getCurrentCircuit, setIndex])

  const nextSet = useCallback(() => {
    if(!workout) {
      return;
    }

    setElapsedTime(0);
    // account for total time

    if(status === 'complete') {
      return;
    }

    if(status === 'cooldown') {
      setStatus('complete');
      return;
    }

    if(status === 'warmup') {
      setStatus('active');
      setCircuitIndex(circuitIndex+1);
      setSetIndex(0);
      return;
    }

    if(status === 'active' && getCurrentSet()!.recoverySeconds > 0) {
      setStatus('recovery');
      return;
    }

    let nextSetIndex = setIndex+1;
    if(nextSetIndex >= getCurrentCircuit()!.sets.length) {
      if(['active', 'recovery'].includes(status)) {
        setStatus('circuit-recovery');
        return;
      }

      nextSetIndex = 0;
      const nextCircuitIndex = circuitIndex+1;
      if(nextCircuitIndex >= workout.circuits.length-1) {
        setStatus('cooldown');
        setSetIndex(0);
        setCircuitIndex(nextCircuitIndex);
        return;
      }

      setCircuitIndex(nextCircuitIndex);
    }

    setSetIndex(nextSetIndex);
    setStatus('active');
  },[workout,circuitIndex,getCurrentCircuit,getCurrentSet,setIndex,status])

  const prevSet = useCallback(() => {
    if(!workout) {
      return;
    }

    setElapsedTime(0);
    // account for total time

    if(status === 'warmup') {
      return;
    }

    let lastSetIndex = setIndex-1;
    let lastCircuitIndex = circuitIndex;
    if(lastSetIndex < 0) {
      lastCircuitIndex = circuitIndex-1;
      lastSetIndex = workout.circuits[lastCircuitIndex].sets.length-1;
    }
    const lastSet = workout.circuits[lastCircuitIndex].sets[lastSetIndex];

    if(status === "cooldown" || status === "complete") {
      setCircuitIndex(lastCircuitIndex)
      setSetIndex(lastSetIndex);
      setStatus('circuit-recovery');
      return;
    }

    if(status === "active" && lastCircuitIndex <= 0) {
      setStatus('warmup');
      setSetIndex(0);
      setCircuitIndex(0);
      return;
    }

    if(status === "recovery") {
      setStatus("active");
      return;
    }

    if(status === "active") {
      setSetIndex(lastSetIndex);
      if(lastCircuitIndex !== circuitIndex) {
        setCircuitIndex(lastCircuitIndex);
        setStatus("circuit-recovery");
        return;
      }

      setStatus("recovery");
      return;
    }

    setStatus(getCurrentSet()!.recoverySeconds > 0 ? "recovery" : "active");
  },[workout,circuitIndex,getCurrentSet,setIndex,status])

  const totalWorkoutTime = useMemo(() => {
    let time = 0;

    if(!workout) {
      return time;
    }

    workout.circuits.forEach((circuit, idx) => {
      circuit.sets.forEach(set => {
        time += set.activeSeconds + set.recoverySeconds;
      })
      
      if(idx === 0 || idx === workout.circuits.length -1) {
        time += workout.recoverySeconds;
      }
    })

    return time;
  }, [workout])

  const closeWorkout = useCallback(() => {
    setElapsedTime(0);
    setStatus("warmup");
    setCircuitIndex(0);
    setSetIndex(0);
    setIsPaused(false);
    setWorkout(undefined);
  }, [setElapsedTime,setCircuitIndex,setSetIndex,setIsPaused,setWorkout])

  // timer
  useEffect(() => {
    if(!workout) {
      return;
    }

    const interval = setInterval(() => {
      if(status === 'complete' || isPaused) {
        return;
      }

      let ct = elapsedTime+1;
      
      const circuit = getCurrentCircuit();
      const set = getCurrentSet();

      let seconds = set!.activeSeconds;
      if(['warmup', 'cooldown', 'recovery'].includes(status)) {
        seconds = set!.recoverySeconds;
      }

      const timeRemaining = seconds - ct;
      if(timeRemaining <= 0) {
        nextSet();
        return;
      }

      setElapsedTime(ct)
    }, 1000)

    return () => {
      clearInterval(interval);
    }

  }, [workout, isPaused, elapsedTime, status, getCurrentSet, getCurrentCircuit, nextSet])

  return (<WorkoutContext.Provider 
    value={{
      workout,
      elapsedTime,
      circuitIndex,
      setIndex,
      status,
      isPaused,
      pause,
      play,
      nextSet,
      prevSet,
      getCurrentCircuit,
      getCurrentSet,
      togglePlayPause,
      setWorkout,
      totalWorkoutTime,
      closeWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}