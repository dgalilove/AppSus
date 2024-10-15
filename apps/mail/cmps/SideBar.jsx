const { Link, NavLink } = ReactRouterDOM

export function SideBar({ unreadMails, openCompose, onSetFilterBy }) {

    return (
        <div className="side-bar">
            <div className="compose-container">
                <button onClick={openCompose} className="compose-btn"><i className="fa-solid fa-pencil"></i></button>
            </div>

            <button onClick={() => onSetFilterBy({ status: 'inbox' })} className="btn"><div></div> <span><i className="fa-solid fa-inbox"></i></span><span>{unreadMails ? unreadMails : ''}</span></button>
            <button onClick={() => onSetFilterBy({ status: 'stared' })} className="btn">☆</button>
            <button onClick={() => onSetFilterBy({ status: 'sent' })} className="btn"><i className="fa-regular fa-paper-plane"></i></button>
            <button onClick={() => onSetFilterBy({ status: 'draft' })} className="btn"><i className="fa-regular fa-note-sticky fa-rotate-180"></i></button>
            <button onClick={() => onSetFilterBy({ status: 'trash' })} className="btn"><i className="fa-regular fa-trash-can"></i></button>
        </div>
    )
}