import { useEffect, useState } from "react";

declare global {
    interface Window {
        Android: object | undefined
    }
}

export function useAndroid() {
    const [isAndroid, setIsAndroid] = useState(false);
    const [inWorkout, setInWorkout] = useState(false);

    useEffect(() => {
        setIsAndroid(window.Android !== undefined);
    }, [setIsAndroid])

    useEffect(() => {
        if(isAndroid) {
            // @ts-ignore: Custom binding for our native Android app, not worth adjusting 
            window.Android.setInWorkout(inWorkout);
        }
    }, [inWorkout, setInWorkout, isAndroid]);

    return { inWorkout, setInWorkout, isAndroid };
}