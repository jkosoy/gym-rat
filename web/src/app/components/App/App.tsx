"use client";

import { MenuScreen } from "@/app/components/MenuScreen";
import { WorkoutScreen } from "@/app/components/WorkoutScreen";
import { DeviceProvider } from "@/app/contexts/DeviceContext";
import { WorkoutProvider } from "@/app/contexts/WorkoutContext";
import { useAndroid } from "@/app/hooks/useAndroid";
import { useWorkout } from "@/app/hooks/useWorkout";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";

type AppProps = {
    isTV?:boolean
}

export function App({isTV=false}: PropsWithoutRef<AppProps>) {
    const { workout } = useWorkout();
    const { isAndroid, inWorkout, setInWorkout } = useAndroid();
    const screen = workout ? <WorkoutScreen /> : <MenuScreen />;
    
    useEffect(() => {
        setInWorkout(workout !== undefined);
    }, [workout]);

    return (
        <DeviceProvider isTV={isTV}>
            <WorkoutProvider workout={workout}>
                {screen}
            </WorkoutProvider>        
        </DeviceProvider>
    )
}