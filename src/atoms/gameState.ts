import { atom } from "recoil"

export const gameState = atom<"PLAYING" | "ENTERING">({
    key: "gameState",
    default: "PLAYING"
})