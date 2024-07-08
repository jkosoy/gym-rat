import { useEffect, useState } from "react";

declare global {
    interface Window {
        Android: object | undefined
    }
}

let sharedIsAndroid = false;
let sharedInWorkout = false;

export function useAndroid() {
    const [isAndroid, _setIsAndroid] = useState(false);
    const [inWorkout, _setInWorkout] = useState(false);

    // initialize
    useEffect(() => {
        sharedIsAndroid = window.Android !== undefined;
        _setIsAndroid(sharedIsAndroid);
    }, [])

    // create a shared state, https://stackoverflow.com/questions/66447553/react-preserve-state-in-custom-hook
    useEffect(() => {
        _setIsAndroid(sharedIsAndroid);
        _setInWorkout(sharedInWorkout);
    }, [_setInWorkout, _setIsAndroid]);
    
    function setIsAndroid(value: boolean) {
        sharedIsAndroid = value;
        _setIsAndroid(value);
    }

    function setInWorkout(value: boolean) {
        sharedInWorkout = value;
        _setInWorkout(value);
    }
    // end creating a shared state

    useEffect(() => {
        if(isAndroid) {
            // @ts-ignore: Custom binding for our native Android app, not worth adjusting 
            window.Android.setInWorkout(inWorkout);
        }
    }, [inWorkout, isAndroid]);

    return { inWorkout, setInWorkout, isAndroid };
}