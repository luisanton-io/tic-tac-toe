import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const nameState = atom<string>({
    key: "nameState",
    default: "",
    effects_UNSTABLE: [persistAtom]
})