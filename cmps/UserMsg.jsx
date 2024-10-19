import { eventBusService } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"
const { useState, useEffect, useRef } = React

export function UserMsg() {

  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()
  const userMsgRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
      console.log('Got msg', msg)
      setMsg(msg)
      if (timeoutIdRef.current) {
        timeoutIdRef.current = null
        clearTimeout(timeoutIdRef.current)
      }
      timeoutIdRef.current = setTimeout(closeMsg, 1500)
    })
    return unsubscribe
  }, [])

  function closeMsg() {
    utilService.animateCSS(userMsgRef.current, 'backOutDown')
      .then(() => {
        setMsg(null)
      })
  }

  if (!msg) return <span></span>
  return (
    <section ref={userMsgRef} className={`user-msg ${msg.type}`}>
      <button onClick={closeMsg}>x</button>
      {msg.txt}
    </section>
  )
}

