import { atom } from "recoil";
import { Symbol } from "types";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const symbolState = atom<Symbol>({
    key: "symbolState",
    default: null,
    effects_UNSTABLE: [persistAtom]
})