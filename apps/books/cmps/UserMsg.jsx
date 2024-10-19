const { useState, useEffect, useRef } = React
import { eventBusService } from "../../../services/event-bus.service"


export function UserMsg() {

    const [msg, setMsg] = useState(null)
    const intervalIdRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', msg => {
            clearInterval(intervalIdRef.current)
            setMsg(msg)
            intervalIdRef.current = setTimeout(closeMsg, 3000);
        })

        return () => unsubscribe()
    }, [])

    function closeMsg() {
        setMsg(null)
    }

    if (!msg) return null
    return (
        <section className={`user-msg ${msg.type}`}>
            <h4>{msg.txt}</h4>
            <button onClick={closeMsg} className="close-btn">X</button>
        </section>
    )
}