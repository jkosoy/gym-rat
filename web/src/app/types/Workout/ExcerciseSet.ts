import { Circuit } from "./Circuit";
import { Move } from "./Move"

export type ExcerciseSetType = "active" | "recovery" | "circuit-recovery" | "warmup" | "cooldown";

export type ExcerciseSet = {
    type: ExcerciseSetType
    time: number // in seconds
    moves: Move[],
    autoAdvance: boolean,
}