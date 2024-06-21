
import { CSSProperties, PropsWithoutRef, useEffect, useMemo, useRef, useState } from "react";
import styles from './RatAnimation.module.css';
import { randomInt } from "@/app/helpers/math";
import classNames from "classnames/bind";

type AnimationState = "jump" | "flex" | "laugh-intro" | "laugh-loop";

type RatAnimationProps = {}

export function RatAnimation({}: PropsWithoutRef<RatAnimationProps>) {
  const [state,setState] = useState<AnimationState>(randomInt(0,1) === 1 ? "flex" : "jump");

  const handleVideoEnded = () => {
    if(state === "laugh-loop") {
      return;
    }

    if(state === "laugh-intro") {
      setState("laugh-loop");
      return;
    }

    setState("laugh-intro");
  }

  const videoEls = (() => {
    return ["jump", "flex", "laugh-intro", "laugh-loop"].map(name => {

      const className = classNames.bind(styles)({
        video: true,
        playing: name === state
      });

      return (
        <video key={`video_${name}`}  className={className} onEnded={handleVideoEnded} width="1920" height="1920" preload="auto" loop={name === "laugh-loop"} autoPlay={name === state}>
          <source src={`/${name}.mp4`} type="video/mp4" />
        </video>
      );
    })
  })();

  useEffect(() => {
    const video:HTMLVideoElement|null = document.querySelector("video[autoplay]");

    if(!video) {
      return;
    }

    const isVideoPlaying = !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    video.play();
    
  }, [state]);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        {videoEls}
      </div>
    </div>
  );
}
