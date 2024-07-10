import { ExcerciseSet } from "./ExcerciseSet"

type CircuitType = "amrap" | "manual" | "stations" | "warmup" | "cooldown";

export type Circuit = {
    name: string,
    type: CircuitType
    sets: ExcerciseSet[]
}
