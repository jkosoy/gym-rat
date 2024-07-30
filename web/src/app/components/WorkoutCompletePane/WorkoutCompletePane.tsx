
import { PropsWithoutRef, useCallback, useEffect, useState } from "react";
import styles from './WorkoutCompletePane.module.css';
import { RatAnimation } from "../RatAnimation";
import { useWorkout } from "@/app/hooks/useWorkout";
import { useAndroid } from "@/app/hooks/useAndroid";
import { useKeyboard } from "@/app/hooks/useKeyboard";
import { useSoundEffect } from "@/app/hooks/useSoundEffects";

type AudioState = "click";
type AudioMappings = Record<AudioState, string|undefined>

type WorkoutCompletePaneProps = {}

export function WorkoutCompletePane({}: PropsWithoutRef<WorkoutCompletePaneProps>) {
  const { closeWorkout } = useWorkout();
  const { isAndroid } = useAndroid();
  const [audioState, setAudioState] = useState<AudioState>();
  const [playEffect] = useSoundEffect()

  useEffect(() => {
    if(!audioState) {
      return;
    }
    
    const AUDIO_PATHS:AudioMappings = {
      "click": "/button.mp3",
    }

    playEffect(AUDIO_PATHS[audioState]!)    
    setAudioState(undefined);
  }, [audioState, setAudioState, playEffect]);    

  const handleCloseClick = useCallback(() => {
    setAudioState("click");
    setTimeout(() => {
      closeWorkout();
    },100);
  }, [closeWorkout,setAudioState])
  
  useEffect(() => {
    window.exitWorkout = handleCloseClick;
  }, [isAndroid, handleCloseClick])
  
  useKeyboard("Escape", { onKeyDown: handleCloseClick })
  
  return (
    <div className={styles.container}>
      <div className={styles.ratContainer}>
        <RatAnimation />
      </div>
     <div className={styles.text}>
        <h1>Workout Complete</h1>
        <button onClick={handleCloseClick}>Exit</button>
      </div>
    </div>
  );
}
