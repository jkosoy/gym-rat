import { useEffect } from "react";

interface KeyboardParams {
  key: string
  onKeyDown?: () => void,
  onKeyUp?: () => void,
}

export function useKeyboard({key, onKeyDown=undefined, onKeyUp=undefined}: KeyboardParams) {
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

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        }
    }, [])
}