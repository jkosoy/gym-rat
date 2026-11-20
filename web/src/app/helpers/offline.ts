import { Routine, Workout } from "@/app/types/Workout";

// workouts are a few kb of json, so localStorage is plenty and survives
// the app being closed. everything here is best effort: private browsing or
// a full disk shouldn't stop anyone from working out online.

const ROUTINES_KEY = "gym-rat:routines";
const DURATIONS_KEY = "gym-rat:durations";
const DOWNLOADS_KEY = "gym-rat:downloads";

export type DownloadedWorkout = {
  routine: Routine,
  workout: Workout,
  savedAt: number,
}

type Downloads = Record<string, DownloadedWorkout>;

type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;

function storage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  }
  catch(e) {
    return undefined;
  }
}

function read<T>(key: string, fallback: T, store = storage()): T {
  try {
    const raw = store?.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  }
  catch(e) {
    return fallback;
  }
}

function write(key: string, value: unknown, store = storage()): boolean {
  try {
    store?.setItem(key, JSON.stringify(value));
    return store !== undefined;
  }
  catch(e) {
    console.error(`Failed to save ${key}.`, e);
    return false;
  }
}

export function getCachedRoutines(store?: Storage): Routine[] {
  return read<Routine[]>(ROUTINES_KEY, [], store);
}

export function cacheRoutines(routines: Routine[], store?: Storage) {
  write(ROUTINES_KEY, routines, store);
}

export function getCachedDurations(store?: Storage): Record<string, number> {
  return read<Record<string, number>>(DURATIONS_KEY, {}, store);
}

export function cacheDurations(durations: Record<string, number>, store?: Storage) {
  write(DURATIONS_KEY, durations, store);
}

export function getDownloads(store?: Storage): Downloads {
  return read<Downloads>(DOWNLOADS_KEY, {}, store);
}

export function getDownloadedWorkout(routineId: string, store?: Storage): Workout | undefined {
  return getDownloads(store)[routineId]?.workout;
}

export function saveDownload(routine: Routine, workout: Workout, store?: Storage): boolean {
  const downloads = getDownloads(store);
  downloads[routine.id] = { routine, workout, savedAt: Date.now() };
  return write(DOWNLOADS_KEY, downloads, store);
}

export function removeDownload(routineId: string, store?: Storage) {
  const downloads = getDownloads(store);
  delete downloads[routineId];
  write(DOWNLOADS_KEY, downloads, store);
}

// when notion can't be reached, show whatever routine list we last saw, plus
// any downloaded routine that has since dropped off of it.
export function getOfflineRoutines(store?: Storage): Routine[] {
  const cached = getCachedRoutines(store);
  const known = new Set(cached.map(routine => routine.id));
  const extras = Object.values(getDownloads(store))
    .map(download => download.routine)
    .filter(routine => !known.has(routine.id));

  return [...cached, ...extras];
}
