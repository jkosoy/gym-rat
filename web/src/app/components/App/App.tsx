import { MenuScreen } from "@/app/components/MenuScreen";
import { WorkoutScreen } from "@/app/components/WorkoutScreen";
import { WorkoutProvider } from "@/app/contexts/WorkoutContext";
import { tempWorkout } from "@/app/temp/workout";

export function App() {
    return (
        <>
            <WorkoutProvider workout={tempWorkout}>
                <WorkoutScreen />
            </WorkoutProvider>        
        </>
    )
}