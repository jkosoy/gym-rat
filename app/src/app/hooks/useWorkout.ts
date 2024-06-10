import { useContext } from "react";
import { WorkoutContext } from "../contexts/WorkoutContext";

export function useWorkout() {
    return useContext(WorkoutContext);
}