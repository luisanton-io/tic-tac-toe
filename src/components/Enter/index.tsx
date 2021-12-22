import { useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { nameState } from "atoms/nameState";
import { symbolState } from "atoms/symbolState";
import { socketClient } from "App";
import { Symbol } from "types";
import { gameState } from "atoms/gameState";
import { modalState } from "atoms/modalState";

export default function Enter() {

    const [name, setName] = useRecoilState(nameState);
    const [symbol, setSymbol] = useRecoilState(symbolState);

    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            navigate("/play")
            socketClient.emit("loggedIn", { name, symbol })
        }
    }

    const [game, setGameState] = useRecoilState(gameState);

    const setModal = useSetRecoilState(modalState)

    useEffect(() => {
        if (game === "PLAYING") {
            setGameState("ENTERING")
            setModal(modal => ({ ...modal, display: false }))
            socketClient.emit("leave")
        }
    }, [game])

    return <div id="enter">
        <div className="login">
            <h1>Strive <br /> Tic Tac</h1>

            <Form className="pt-4" onSubmit={handleSubmit}>
                <Form.Control className="mt-3" type="text" value={name} onChange={e => setName(e.target.value)} />


                <div className="symbols">
                    <input type="radio" name="symbol" value="O" checked={symbol === "O"}
                        onChange={e => setSymbol(e.target.value as Symbol)} id="radio-O" />
                    <label htmlFor="radio-O">
                        <img data-symbol="O" src="/assets/O.png" alt="" />
                    </label>

                    <input type="radio" name="symbol" value="X" checked={symbol === "X"}
                        onChange={e => setSymbol(e.target.value as Symbol)} id="radio-X" />
                    <label htmlFor="radio-X">
                        <img data-symbol="X" src="/assets/X.png" alt="" />
                    </label>
                </div>

                <Button className="mt-5 btn-login px-5 py-3" type="submit" disabled={!name}>
                    Play
                </Button>
            </Form>
        </div>
    </div>
}