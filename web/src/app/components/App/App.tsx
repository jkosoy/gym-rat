"use client";

import { MenuScreen } from "@/app/components/MenuScreen";
import { WorkoutScreen } from "@/app/components/WorkoutScreen";
import { DeviceProvider } from "@/app/contexts/DeviceContext";
import { useAndroid } from "@/app/hooks/useAndroid";
import { useWorkout } from "@/app/hooks/useWorkout";
import { PropsWithoutRef, useCallback, useEffect, useMemo, useState } from "react";

type AppProps = {
    isTV?:boolean
}

export function App({isTV=false}: PropsWithoutRef<AppProps>) {
    const { workout, set } = useWorkout();
    const { setInWorkout } = useAndroid();

    const type = set ? set.type : 'default';

    const screen = useMemo(() => {
        if(!workout) {
            return <MenuScreen />
        }

        return <WorkoutScreen />
    }, [workout])

    useEffect(() => {
        setInWorkout(workout === undefined ? false : true);
    }, [workout, setInWorkout]);

    useEffect(() => {
        const rootEl = document.documentElement;
        rootEl.style.setProperty('--color-background', `var(--color-background-${type})`);
    }, [type]);

    return (
        <DeviceProvider isTV={isTV}>
            {screen}
        </DeviceProvider>
    )
}