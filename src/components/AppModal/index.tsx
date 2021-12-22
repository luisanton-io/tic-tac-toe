import { socketClient } from "App"
import { modalState } from "atoms/modalState"
import { symbolState } from "atoms/symbolState"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"

export default function AppModal() {
    const [modal, setModal] = useRecoilState(modalState)

    const navigate = useNavigate()

    const goToHome = () => {
        navigate(-1)
        setModal(modal => ({ ...modal, display: false }))
    }

    const symbol = useRecoilValue(symbolState)
    console.log({ symbol })


    return modal.display
        ? <div className="overlay">
            <h2>{modal.message}</h2>

            <Button variant="primary" onClick={goToHome}>Go back</Button>
        </div>
        : null
}