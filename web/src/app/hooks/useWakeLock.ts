import { useEffect } from "react";

// keep the phone's screen on while a workout runs. the lock is dropped whenever
// the app is hidden, so grab it again when it comes back.
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if(!active || typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    let lock: WakeLockSentinel | undefined;
    let cancelled = false;

    const request = async () => {
      if(document.visibilityState !== "visible") {
        return;
      }

      try {
        const next = await navigator.wakeLock.request("screen");
        if(cancelled) {
          next.release();
          return;
        }
        lock = next;
      }
      catch(e) {}
    };

    request();
    document.addEventListener("visibilitychange", request);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", request);
      lock?.release().catch(() => {});
    };
  }, [active]);
}
