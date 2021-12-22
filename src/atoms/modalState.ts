import { atom } from "recoil";

export const modalState = atom<AppModal>({
    key: "modalState",
    default: {
        message: "",
        display: false
    }
})