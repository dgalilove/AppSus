const { useNavigate, useParams } = ReactRouterDOM

const { useState, useRef } = React



export function SideBar({ unreadMails, openCompose, isOpen, setIsMobileSideBarOpen, isMobileSideBarOpen, setIsMobileBackDrop }) {

    const [hoverClass, setHoverClass] = useState('')
    const navigate = useNavigate()

    const { status } = useParams()
    const timeOutRef = useRef()

    function onSideBarBtn(status) {
        // onSetFilterBy({ status })
        navigate('/mail/' + status)
        setIsMobileSideBarOpen(false)
        setIsMobileBackDrop(false)
    }

    function onHover(hover) {
        if (hover) {
            clearTimeout(timeOutRef.current)
            if (isOpen) return
            timeOutRef.current = setTimeout(() => {
                setHoverClass('hover')
            }, 1000)
        } else {
            clearTimeout(timeOutRef.current)
            setHoverClass('')
        }
    }

    const isMobileBarOpenClass = isMobileSideBarOpen ? 'open-mobile' : ''
    const numberOfUnreadMails = unreadMails ? unreadMails : ''
    const isOpenClass = isOpen ? 'open' : ''
    return (
        <div
            onMouseEnter={() => {
                onHover(true)
            }}
            onMouseLeave={() => {
                onHover(false)
            }}
            className={`side-bar ${isOpenClass} ${hoverClass} ${isMobileBarOpenClass}`
            }>
            <div className="compose-container">
                <button onClick={openCompose} className="compose-btn"><i className="fa-solid fa-pencil"></i></button>
            </div>
            <button onClick={() => onSideBarBtn('inbox')} className={`btn ${status === 'inbox' ? 'active' : ''}`} title={`Inbox`} title-2={numberOfUnreadMails}>{unreadMails ? <div className="unread-mails"></div> : ''} <span><i className="fa-solid fa-inbox"></i></span></button>
            <button onClick={() => onSideBarBtn('stared')} className={`btn ${status === 'stared' ? 'active' : ''}`} title={`Stared`}>☆</button>
            <button onClick={() => onSideBarBtn('sent')} className={`btn ${status === 'sent' ? 'active' : ''}`} title={`Sent`}><i className="fa-regular fa-paper-plane"></i></button>
            <button onClick={() => onSideBarBtn('draft')} className={`btn ${status === 'draft' ? 'active' : ''}`} title={`Draft`}><i className="fa-regular fa-note-sticky fa-rotate-180"></i></button>
            <button onClick={() => onSideBarBtn('trash')} className={`btn ${status === 'trash' ? 'active' : ''}`} title={`Trash`}><i className="fa-regular fa-trash-can"></i></button>
        </div>
    )
}