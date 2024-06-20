import { useEffect } from "react";

interface KeyboardParams {
  onKeyDown?: () => void,
  onKeyUp?: () => void,
}

export function useKeyboard(key:string, {onKeyDown=undefined, onKeyUp=undefined}: KeyboardParams) {
    useEffect(() => {
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
    }, [onKeyDown, onKeyUp])
}