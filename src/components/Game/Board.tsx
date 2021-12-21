import { useState } from "react"
import { io } from "socket.io-client"
import { useEffect } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { toastState } from "atoms/toastState"
import { nameState } from "atoms/nameState"
import { socketClient } from "App"
import { Symbol } from "types"
import { symbolState } from "atoms/symbolState"

interface Opponent {
    name: string
    socketId: string
}

export default function Board() {

    const [matrix, setMatrix] = useState<[Symbol, Symbol, Symbol][]>([
        //00    01    02
        [null, null, null],
        //10    11    12
        [null, null, null],
        //20    21    22
        [null, null, null],
    ])

    const name = useRecoilValue(nameState)

    const setToast = useSetRecoilState(toastState)

    const [opponent, setOpponent] = useState<Opponent | null>(null)

    const [symbol, setSymbol] = useRecoilState(symbolState)

    const handleMatrixUpdate = (x: number, y: number) => {
        const newMatrix = [...matrix]
        newMatrix[y][x] = symbol
        setMatrix(newMatrix)

        socketClient.emit("matrixUpdate", { matrix: newMatrix, opponent })
    }

    useEffect(() => {

        socketClient.on("connect", () => {
            console.log("connected...")
            console.log(name)
            socketClient.emit("loggedIn", { name, symbol })
        })

        // socketClient.on("hello", () => { console.log("hello world") })

        socketClient.on("waitingForOpponent", () => {
            setToast({
                message: "Waiting for another player...",
                display: true
            })
        })

        socketClient.on("gameStarted", ({ name, socketId, symbol }) => {
            setSymbol(symbol)
            setOpponent({ name, socketId })

            if (symbol === "X") {
                setToast({
                    message: "Waiting for your opponent move...",
                    display: true
                })
            } else {
                setToast(t => ({ ...t, display: false }))
            }

        })

        socketClient.on("waitingForMove", () => {
            setToast({
                message: "Waiting for your opponent...",
                display: true
            })
        })

        socketClient.on("yourTurn", ({ matrix }) => {
            setToast(t => ({
                ...t,
                display: false
            }))

            setMatrix(matrix)
        })

        socketClient.on("matrixUpdated", (matrix) => {
            setMatrix(matrix)
        })

        socketClient.on("newGame", ({ symbol, gameId }) => {
            setMatrix([
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ])
            //setSymbol(symbol)
            //setGameId(gameId)
        })

    }, [setToast])

    useEffect(() => {
        const gameOver = ({ winner, matrix }: { winner: Symbol, matrix: [Symbol, Symbol, Symbol][] }) => {
            const won = winner === symbol

            console.log({ won, winner, symbol })

            setMatrix(matrix)

            setToast({
                message: won ? "You won!" : "You lost!",
                display: true
            })
        }
        socketClient.on("gameOver", gameOver)

        return () => { socketClient.off("gameOver", gameOver) }
    }, [symbol])

    console.log({ symbol })

    return <div id="board">
        {
            matrix.map((row, y) =>
                <div className="board-row" key={`row_${y}`}>
                    {
                        row.map((symbol, x) =>
                            <div className="board-cell" key={`cell_${x}`} onClick={() => handleMatrixUpdate(x, y)}>
                                {symbol}
                            </div>
                        )
                    }
                </div>
            )
        }
    </div>
}

