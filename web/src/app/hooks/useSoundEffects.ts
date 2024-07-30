import { useCallback, useEffect, useState } from "react";

export function useSoundEffect() {
    const [context, setContext] = useState<AudioContext>()

    const playEffect = useCallback(async (url:string) => {
        if(!context) {
            return;
        }

        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await context.decodeAudioData(arrayBuffer)
    
        const source = context.createBufferSource()
        source.buffer = audioBuffer
        source.connect(context.destination)
        source.start()    
    }, [context])

    useEffect(() => {
        setContext(new AudioContext())
    }, [setContext])

    
    return [playEffect]
}