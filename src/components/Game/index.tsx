import { gameState } from "atoms/gameState"
import { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { nameState } from "../../atoms/nameState"
import Board from "./Board"



export default function Game() {

    const [game, setGameState] = useRecoilState(gameState)

    useEffect(() => {
        game === "ENTERING" && setGameState("PLAYING")
    }, [game])

    return <div id="game">

        <Board />

    </div >
}