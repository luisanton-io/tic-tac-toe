import { atom } from "recoil";
import { Symbol } from "types";

export const symbolState = atom<Symbol>({
    key: "symbolState",
    default: "X"
})