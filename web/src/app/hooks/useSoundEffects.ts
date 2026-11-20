import { useCallback, useEffect } from "react";

// one AudioContext for the whole app. iOS caps how many a page can open and
// starts every one of them suspended until a tap resumes it, so each component
// making its own meant sounds silently never played on an iPhone.
let sharedContext: AudioContext | undefined;
const buffers = new Map<string, Promise<AudioBuffer>>();

function getContext(): AudioContext | undefined {
  if(typeof window === "undefined") {
    return;
  }

  if(!sharedContext) {
    const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
    if(!Ctx) {
      return;
    }
    sharedContext = new Ctx() as AudioContext;
    unlockOnGesture(sharedContext);
  }

  return sharedContext;
}

function unlockOnGesture(context: AudioContext) {
  const events = ["touchend", "pointerup", "click", "keydown"];

  const unlock = () => {
    // playing a silent buffer inside the gesture is what actually wakes iOS up.
    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.start(0);

    context.resume().then(() => {
      if(context.state === "running") {
        events.forEach(event => document.removeEventListener(event, unlock, true));
      }
    });
  };

  events.forEach(event => document.addEventListener(event, unlock, true));

  // iOS suspends audio when the app is backgrounded; nudge it on return.
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible" && context.state !== "running") {
      context.resume().catch(() => {});
    }
  });
}

function loadBuffer(context: AudioContext, url: string): Promise<AudioBuffer> {
  let buffer = buffers.get(url);
  if(!buffer) {
    buffer = fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => context.decodeAudioData(data));
    buffer.catch(() => buffers.delete(url));
    buffers.set(url, buffer);
  }

  return buffer;
}

export function useSoundEffect() {
  const playEffect = useCallback(async (url:string) => {
    const context = getContext();
    if(!context) {
      return;
    }

    try {
      if(context.state !== "running") {
        await context.resume();
      }

      const source = context.createBufferSource();
      source.buffer = await loadBuffer(context, url);
      source.connect(context.destination);
      source.start();
    }
    catch(e) {
      console.error(`Failed to play ${url}.`, e);
    }
  }, [])

  useEffect(() => {
    getContext();
  }, [])

  return [playEffect]
}
