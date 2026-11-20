import { getRoutineDurations, getRoutines, getWorkout } from "@/app/api/workouts";
import { Routine } from "@/app/types/Workout";
import { SkeletonPicker } from '@/app/components/SkeletonPicker';
import { LoadingDots } from '@/app/components/LoadingDots';

import styles from './WorkoutPicker.module.css';
import classNames from 'classnames/bind'
import { CSSProperties, PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { ButtonWithIcon } from "../ButtonWithIcon";
import { useKeyboard } from "@/app/hooks/useKeyboard";
import { useWorkout } from "@/app/hooks/useWorkout";
import { useSoundEffect } from "@/app/hooks/useSoundEffects";
import { formatTime } from "@/app/helpers/time";
import { resolveSelectedRoutine } from "./workoutPicker.utils";
import { calculateScrollTop } from "./touchScroll.utils";
import { useDevice } from "@/app/hooks/useDevice";
import { getSets, getTotalTime } from "@/app/helpers/workout";
import {
    cacheDurations,
    cacheRoutines,
    getCachedDurations,
    getDownloadedWorkout,
    getDownloads,
    getOfflineRoutines,
    removeDownload,
    saveDownload,
} from "@/app/helpers/offline";

const ITEMS_PER_ROW = 6;

type AudioState = "prev" | "next" | "select";
type AudioMappings = Record<AudioState, string|undefined>

type WorkoutPickerProps = {
    callback: Function
}

export function WorkoutPicker({callback}: PropsWithoutRef<WorkoutPickerProps>) {
    const [isLoading, setIsLoading] = useState(true);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [selectedRoutine, setSelectedRoutine] = useState<Routine|undefined>();
    const [audioState, setAudioState] = useState<AudioState>();
    const [isTouchDragging, setIsTouchDragging] = useState(false);
    const [touchStartY, setTouchStartY] = useState(0);
    const [touchStartScrollTop, setTouchStartScrollTop] = useState(0);
    const [isOffline, setIsOffline] = useState(false);
    const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
    const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
    const { workout } = useWorkout();
    const { isTV } = useDevice();
    const [playEffect] = useSoundEffect();

    const prevRow = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)-ITEMS_PER_ROW;
        while(index < 0) {
            index += routines.length;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("prev")
    }, [routines, selectedRoutine, setSelectedRoutine, setAudioState])

    const nextRow = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)+ITEMS_PER_ROW;
        while(index >= routines.length) {
            index -= routines.length;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("next")
    }, [routines, selectedRoutine, setSelectedRoutine, setAudioState])


    const nextRoutine = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)+1;
        if(index >= routines.length) {
            index = 0;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("next")
    }, [routines, selectedRoutine, setSelectedRoutine,setAudioState])

    const prevRoutine = useCallback(() => {
        if(routines.length === 0 || !selectedRoutine) {
            return;
        }

        let index = routines.indexOf(selectedRoutine)-1;
        if(index < 0) {
            index = routines.length-1;
        }
        setSelectedRoutine(routines[index]);
        setAudioState("prev")
    }, [routines, selectedRoutine, setSelectedRoutine,setAudioState])

    const selectRoutine = useCallback(async (routine?: Routine) => {
        const resolvedRoutine = resolveSelectedRoutine(routines, selectedRoutine, routine);

        if(!resolvedRoutine || isLoading) {
            return;
        }

        const saved = getDownloadedWorkout(resolvedRoutine.id);
        if(!saved && isOffline) {
            return;
        }

        setSelectedRoutine(resolvedRoutine);
        setAudioState("select");

        // a downloaded workout starts right away, even with no signal. refresh
        // the saved copy quietly so edits in notion show up next time.
        if(saved) {
            callback(saved);
            getWorkout(resolvedRoutine)
                .then(fresh => saveDownload(resolvedRoutine, fresh))
                .catch(() => {});
            return;
        }

        setIsLoading(true);
        try {
            callback(await getWorkout(resolvedRoutine));
        }
        catch(e) {
            console.error(`Failed to load ${resolvedRoutine.name}.`, e);
            setIsOffline(true);
            setIsLoading(false);
        }
    }, [isLoading, isOffline, routines, selectedRoutine, setSelectedRoutine, setIsLoading, callback, setAudioState]);

    const toggleDownload = useCallback(async (routine: Routine) => {
        if(downloadingIds.has(routine.id)) {
            return;
        }

        if(downloadedIds.has(routine.id)) {
            removeDownload(routine.id);
            setDownloadedIds(new Set(Object.keys(getDownloads())));
            return;
        }

        setDownloadingIds(ids => new Set(ids).add(routine.id));
        try {
            const workout = await getWorkout(routine);
            if(!saveDownload(routine, workout)) {
                alert("Couldn't save this workout to your phone. Is storage full?");
            }
            setDurations(durations => ({...durations, [routine.id]: getTotalTime(getSets(workout))}));
        }
        catch(e) {
            console.error(`Failed to download ${routine.name}.`, e);
            setIsOffline(true);
        }
        finally {
            setDownloadedIds(new Set(Object.keys(getDownloads())));
            setDownloadingIds(ids => {
                const next = new Set(ids);
                next.delete(routine.id);
                return next;
            });
        }
    }, [downloadedIds, downloadingIds]);

    useKeyboard("ArrowLeft", { onKeyDown: prevRoutine })
    useKeyboard("ArrowRight", { onKeyDown: nextRoutine })
    useKeyboard("ArrowUp", { onKeyDown: prevRow })
    useKeyboard("ArrowDown", { onKeyDown: nextRow })

    useKeyboard("Enter", { onKeyDown: selectRoutine });

    const loadRoutines = useCallback(async () => {
        let routines: Routine[];
        let offline = false;

        try {
            routines = await getRoutines();
            cacheRoutines(routines);
        }
        catch(e) {
            // no signal (or notion is down): fall back to what's saved on this device.
            console.warn("Couldn't reach notion, using saved workouts.", e);
            routines = getOfflineRoutines();
            offline = true;
        }

        const downloads = getDownloads();
        const savedDurations = getCachedDurations();
        Object.values(downloads).forEach(({ routine, workout }) => {
            savedDurations[routine.id] ??= getTotalTime(getSets(workout));
        });

        setIsOffline(offline);
        setDownloadedIds(new Set(Object.keys(downloads)));
        setDurations(savedDurations);
        setRoutines(routines);
        setSelectedRoutine(routines[0]);
        setIsLoading(false);

        if(offline) {
            return;
        }

        // durations take a second pass through notion, so let the picker come up first.
        try {
            const durations = await getRoutineDurations(routines);
            setDurations(durations);
            cacheDurations(durations);
        }
        catch(e) {
            console.error("Failed to load routine durations.");
        }
    }, [setRoutines, setSelectedRoutine, setIsLoading, setDurations]);

    useEffect(() => {
        loadRoutines();
    }, [loadRoutines])

    const playAudio = useEffect(() => {
        if(!audioState) {
            return;
        }

        const AUDIO_PATHS:AudioMappings = {
            "prev": "/button.mp3",
            "next": "/button.mp3",
            "select": "/select.mp3",
        }

        playEffect(AUDIO_PATHS[audioState]!)
        setAudioState(undefined);
    }, [audioState, setAudioState, playEffect]);

    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        setIsTouchDragging(true);
        setTouchStartY(event.touches[0].clientY);
        setTouchStartScrollTop(event.currentTarget.scrollTop);
    }, []);

    const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        if (!isTouchDragging) {
            return;
        }

        const nextScrollTop = calculateScrollTop(
            touchStartY,
            event.touches[0].clientY,
            touchStartScrollTop,
        );

        event.currentTarget.scrollTop = nextScrollTop;
    }, [isTouchDragging, touchStartScrollTop, touchStartY]);

    const handleTouchEnd = useCallback(() => {
        setIsTouchDragging(false);
    }, []);
    
    const routineEls = (() => {
        if(routines.length === 0) {
            return;
        }

        return routines.map(routine => {
            const isDownloaded = downloadedIds.has(routine.id);
            const isDownloading = downloadingIds.has(routine.id);
            const isUnavailable = isOffline && !isDownloaded;

            const className = classNames.bind(styles)({
                routine: true,
                selected: selectedRoutine?.id === routine.id,
                unavailable: isUnavailable,
            });

            const duration = durations[routine.id];
            const durationEl = (() => {
                if(duration) {
                    return formatTime(duration);
                }
                return isOffline ? "" : <LoadingDots />;
            })();

            const downloadLabel = isDownloaded
                ? `Remove ${routine.name} from this device`
                : `Download ${routine.name} for offline use`;

            return (
                <div key={`rid_${routine.id}`} className={className}>
                    <button onClick={() => selectRoutine(routine)} disabled={isUnavailable}>
                        <span className={styles.routineName}>{routine.name}</span>
                        <span className={styles.routineDuration}>{durationEl}</span>
                    </button>
                    {!isTV && (isDownloaded || !isOffline) && (
                        <button
                            className={classNames.bind(styles)({
                                downloadButton: true,
                                isDownloaded,
                                isDownloading,
                            })}
                            onClick={() => toggleDownload(routine)}
                            aria-label={downloadLabel}
                            title={downloadLabel}
                            disabled={isDownloading || (isOffline && isDownloaded)}
                        >
                            <DownloadIcon state={isDownloading ? "downloading" : isDownloaded ? "downloaded" : "idle"} />
                        </button>
                    )}
                </div>
            );
        });
    })();

    const computedComponent = (() => {
        if(!isLoading && isOffline && routines.length === 0) {
            return (
                <p className={styles.offlineMessage}>
                    You&apos;re offline and no workouts are downloaded yet.
                    Tap the download button on a workout next time you have signal.
                </p>
            );
        }

        if(isLoading || routines.length === 0 || workout !== undefined) {
            return <SkeletonPicker />
        }

        let selectedRow = 0;
        if(selectedRoutine) {
            selectedRow = Math.floor(routines.indexOf(selectedRoutine) / ITEMS_PER_ROW)
        }

        return (
            <div className={styles.pickerContainer} style={{
                "--selected-row-index": selectedRow
            } as CSSProperties}>
                <div className={styles.prevButton}>
                    <ButtonWithIcon icon="play" onClick={prevRoutine}/>
                </div>
                <div className={styles.nextButton}>
                    <ButtonWithIcon icon="play" onClick={nextRoutine}/>
                </div>
                <div
                    className={styles.routineContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                >
                    <div className={styles.routineScroller}>
                        {routineEls}
                    </div>
                </div>
            </div>
        )
    })()


    return (
        <div className={styles.container}>
            {isOffline && routines.length > 0 && (
                <p className={styles.offlineBanner}>Offline: showing downloaded workouts</p>
            )}
            {computedComponent}
        </div>
    )
}
type DownloadIconProps = {
    state: "idle" | "downloading" | "downloaded"
}

function DownloadIcon({state}: PropsWithoutRef<DownloadIconProps>) {
    if(state === "downloading") {
        return <LoadingDots />;
    }

    if(state === "downloaded") {
        return (
            <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
            <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
