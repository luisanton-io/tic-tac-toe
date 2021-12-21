import { useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { nameState } from "atoms/nameState";
import { symbolState } from "atoms/symbolState";
import { socketClient } from "App";
import { Symbol } from "types";

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

    return <div id="enter">
        <div className="login">
            <h1>Strive Tic Tac</h1>

            <Form className="pt-4" onSubmit={handleSubmit}>
                <Form.Control className="mt-3" type="text" value={name} onChange={e => setName(e.target.value)} />


                <input type="radio" name="symbol" value="O" onChange={e => setSymbol(e.target.value as Symbol)} id="radio-O" />
                <label htmlFor="radio-O">O</label>
                <input type="radio" name="symbol" value="X" onChange={e => setSymbol(e.target.value as Symbol)} id="radio-X" />
                <label htmlFor="radio-X">X</label>

                <Form.Control className="mt-5 btn-login" type="submit" disabled={!name} />
            </Form>
        </div>
    </div>
}