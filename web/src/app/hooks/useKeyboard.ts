import { useEffect } from "react";
import { useDevice } from "./useDevice";

interface KeyboardParams {
  onKeyDown?: () => void,
  onKeyUp?: () => void,
}

export function shouldEnableKeyboardNavigation(windowRef: Window = window, isTV = false) {
    if (typeof windowRef === "undefined") {
        return false;
    }

    if (isTV) {
        return true;
    }

    const isTouchDevice = windowRef.navigator?.maxTouchPoints > 0;
    const isSmallScreen = windowRef.innerWidth <= 480;

    return !(isTouchDevice && isSmallScreen);
}

export function useKeyboard(key:string, {onKeyDown=undefined, onKeyUp=undefined}: KeyboardParams) {
    const { isTV } = useDevice();

    useEffect(() => {
        if (!shouldEnableKeyboardNavigation(window, isTV)) {
            return;
        }

        function keyDownHandler(e: globalThis.KeyboardEvent) {
            if(onKeyDown === undefined) {
                return;
            }

            if(e.key === key) {
                onKeyDown();
            }
        }

        function keyUpHandler(e: globalThis.KeyboardEvent) {
            if(onKeyUp === undefined) {
                return;
            }

            if(e.key === key) {
                onKeyUp();
            }
        }

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        }
    }, [key, onKeyDown, onKeyUp, isTV])
}