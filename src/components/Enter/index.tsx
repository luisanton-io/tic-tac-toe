import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { nameState } from "atoms/nameState";

export default function Enter() {

    const [name, setName] = useRecoilState(nameState);
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        name && navigate("/play")
    }

    return <div id="enter">
        <div className="login">
        <h1>Strive Tic Tac</h1>
        
        <Form className="pt-4" onSubmit={handleSubmit}>
            <Form.Control className="mt-3" type="text" value={name} onChange={e => setName(e.target.value)} />
            <Form.Control className="mt-5 btn-login" type="submit" disabled={!name} />
        </Form>
        </div>
    </div>
}