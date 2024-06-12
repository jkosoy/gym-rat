"use client";

import { MenuScreen } from "@/app/components/MenuScreen";
import { WorkoutScreen } from "@/app/components/WorkoutScreen";
import { DeviceProvider } from "@/app/contexts/DeviceContext";
import { WorkoutProvider } from "@/app/contexts/WorkoutContext";
import { useDevice } from "@/app/hooks/useDevice";
import { tempWorkout } from "@/app/temp/workout";
import { PropsWithoutRef } from "react";

type AppProps = {
    isTV?:boolean
}

export function App({isTV=false}: PropsWithoutRef<AppProps>) {
    return (
        <DeviceProvider isTV={isTV}>
            <WorkoutProvider workout={tempWorkout}>
                <WorkoutScreen />
            </WorkoutProvider>        
        </DeviceProvider>
    )
}