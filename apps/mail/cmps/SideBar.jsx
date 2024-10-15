const { Link, NavLink } = ReactRouterDOM

export function SideBar({ unreadMails, openCompose, onSetFilterBy, filterBy }) {


    const numberOfUnreadMails = unreadMails ? unreadMails : ''
    return (
        <div className="side-bar">
            <div className="compose-container">
                <button onClick={openCompose} className="compose-btn"><i className="fa-solid fa-pencil"></i></button>
            </div>
            <button onClick={() => onSetFilterBy({ status: 'inbox' })} className={`btn ${filterBy.status === 'inbox' ? 'active' : ''}`} title={`Inbox`} title-2={numberOfUnreadMails}>{unreadMails ? <div className="unread-mails"></div> : ''} <span><i className="fa-solid fa-inbox"></i></span></button>
            <button onClick={() => onSetFilterBy({ status: 'stared' })} className={`btn ${filterBy.status === 'stared' ? 'active' : ''}`} title={`Stared`}>☆</button>
            <button onClick={() => onSetFilterBy({ status: 'sent' })} className={`btn ${filterBy.status === 'sent' ? 'active' : ''}`} title={`Sent`}><i className="fa-regular fa-paper-plane"></i></button>
            <button onClick={() => onSetFilterBy({ status: 'draft' })} className={`btn ${filterBy.status === 'draft' ? 'active' : ''}`} title={`Draft`}><i className="fa-regular fa-note-sticky fa-rotate-180"></i></button>
            <button onClick={() => onSetFilterBy({ status: 'trash' })} className={`btn ${filterBy.status === 'trash' ? 'active' : ''}`} title={`Trash`}><i className="fa-regular fa-trash-can"></i></button>
        </div>
    )
}