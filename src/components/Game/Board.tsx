import { useState } from "react"
import { io } from "socket.io-client"
import { useEffect } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { modalState } from "atoms/modalState"
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

    const setModal = useSetRecoilState(modalState)

    const [opponent, setOpponent] = useState<Opponent | null>(null)

    const [symbol, setSymbol] = useRecoilState(symbolState)

    const handleMatrixUpdate = (x: number, y: number) => {

        if (!!matrix[y][x]) return

        const newMatrix = [...matrix]
        newMatrix[y][x] = symbol
        setMatrix(newMatrix)

        // console.log({ opponent })
        if (!opponent) {
            // should never happen
            throw new Error("OPPONENT CAN'T BE NULL")
        }

        socketClient.emit("matrixUpdate", { matrix: newMatrix, opponent })
    }

    useEffect(() => {

        socketClient.on("connect", () => {
            console.log("connected...")
            console.log(name)
            socketClient.emit("loggedIn", { name, symbol })
        })

        socketClient.on("waitingForOpponent", () => {
            setModal({
                message: "Waiting for another player...",
                display: true
            })
        })

        socketClient.on("gameStarted", ({ opponent, symbol }) => {
            setSymbol(symbol)
            setOpponent(opponent)

            if (symbol === "X") {
                setModal({
                    message: "Waiting for your opponent move...",
                    display: true
                })
            } else {
                setModal(t => ({ ...t, display: false }))
            }

        })

        socketClient.on("waitingForMove", () => {
            setModal({
                message: "Waiting for your opponent...",
                display: true
            })
        })

        socketClient.on("yourTurn", ({ matrix }) => {
            setModal(t => ({
                ...t,
                display: false
            }))

            setMatrix(matrix)
        })

    }, [setModal])

    useEffect(() => {
        const gameOver = ({ winner, matrix }: { winner: Symbol, matrix: [Symbol, Symbol, Symbol][] }) => {
            const draw = winner === null
            const won = winner === symbol

            setMatrix(matrix)

            setModal({
                message: draw ? "Draw!" : won ? "You won!" : "You lost!",
                display: true
            })
        }
        socketClient.on("gameOver", gameOver)

        return () => { socketClient.off("gameOver", gameOver) }
    }, [symbol])


    return <>
        <header>
            <h4>{name}</h4>

            <h4>{opponent?.name}</h4>
        </header>
        <div id="board">
            {
                matrix.map((row, y) =>
                    <div className="board-row" key={`row_${y}`}>
                        {
                            row.map((symbol, x) =>
                                <div className="board-cell" key={`cell_${x}`} onClick={() => handleMatrixUpdate(x, y)}>
                                    {symbol && <img src={`/assets/${symbol}.png`} data-symbol={symbol} />}
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    </>
}

