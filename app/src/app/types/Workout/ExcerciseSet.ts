import { Move } from "./Move"

export type ExcerciseSet = {
    activeSeconds: number, // "high" in notion
    recoverySeconds: number, // "low" in notion
    moves: Move[]
}