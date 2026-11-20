"use client";

import { useEffect } from "react";

// registers /sw.js so the app shell, sounds and videos are available offline.
// skipped in dev so hot reloading isn't fighting a cache.
export function ServiceWorker() {
  useEffect(() => {
    if(process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(e => {
      console.error("Service worker registration failed.", e);
    });
  }, []);

  return null;
}
