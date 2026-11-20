// Gym Rat service worker.
// Keeps the app shell, sounds and videos on the phone so downloaded workouts
// can be run in a gym with no signal. Workout data itself lives in
// localStorage (see src/app/helpers/offline.ts), not here.

const VERSION = "v1";
const CACHE = `gym-rat-${VERSION}`;

const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/transparent.png",
  "/active.mp3",
  "/button.mp3",
  "/circuit-recovery.mp3",
  "/complete.mp3",
  "/cooldown.mp3",
  "/recovery.mp3",
  "/select.mp3",
  "/warmup.mp3",
  "/flex.mp4",
  "/jump.mp4",
  "/laugh-intro.mp4",
  "/laugh-loop.mp4",
];

// the page's js/css chunks are content hashed, so pull them out of the html
// at install time rather than waiting for a second visit to cache them.
async function precacheShellAssets(cache) {
  try {
    const response = await fetch("/", { cache: "no-store" });
    if(!response.ok) {
      return;
    }

    await cache.put("/", response.clone());
    const html = await response.text();
    const urls = new Set(
      [...html.matchAll(/["'(](\/_next\/static\/[^"')\s]+)/g)].map(match => match[1])
    );
    await Promise.all([...urls].map(url => cache.add(url).catch(() => {})));
  }
  catch(e) {}
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(PRECACHE.map(url => cache.add(url).catch(() => {})));
    await precacheShellAssets(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/")
    || /\.(mp3|mp4|png|jpg|svg|woff2?|ico|webmanifest)$/.test(url.pathname);
}

// safari asks for videos in byte ranges and won't play a plain 200, so slice
// the cached file to whatever range was asked for.
async function rangeResponse(request, response) {
  const range = request.headers.get("range");
  if(!range || response.status !== 200) {
    return response;
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  if(!match) {
    return response;
  }

  const blob = await response.blob();
  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? parseInt(match[2], 10) : blob.size - 1;
  const slice = blob.slice(start, end + 1);

  return new Response(slice, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "video/mp4",
      "Content-Length": String(slice.size),
      "Content-Range": `bytes ${start}-${end}/${blob.size}`,
      "Accept-Ranges": "bytes",
    },
  });
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const key = new Request(request.url);
  let response = await cache.match(key);

  if(!response) {
    response = await fetch(key);
    if(response.ok) {
      await cache.put(key, response.clone());
    }
  }

  return rangeResponse(request, response);
}

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if(response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  }
  catch(e) {
    const cached = await cache.match(request, { ignoreSearch: true })
      || (fallbackUrl && await cache.match(fallbackUrl));
    if(cached) {
      return cached;
    }
    throw e;
  }
}

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // server actions are POSTs and anything cross origin is none of our business.
  if(request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if(request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/"));
    return;
  }

  if(isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
