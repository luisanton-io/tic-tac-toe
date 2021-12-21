import { socketClient } from "App"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { toastState } from "../../atoms/toastState"

export default function Toaster() {
    const [toast, setToast] = useRecoilState(toastState)

    const navigate = useNavigate()

    // useEffect(() => {
    //     toast.display && setTimeout(() => {
    //         setToast(toast => ({ ...toast, display: false }))
    //     }, 3000)
    // }, [toast.display])

    // return <Alert className={`toast-message ${toast.display ? "slide-in-left" : "slide-out-right"}`} variant={toast.type}>
    //     {toast.message}
    // </Alert>
    const goToHome = () => {
        navigate("/")
        setToast(toast => ({ ...toast, display: false }))
        socketClient.emit("leave")
    }
    return toast.display
        ? <div className="overlay">
            <h2>{toast.message}</h2>

            <Button variant="primary" onClick={goToHome}>Go back</Button>
        </div>
        : null
}