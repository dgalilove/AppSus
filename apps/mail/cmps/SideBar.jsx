import { NewCompose } from "./NewCompse.jsx"

const { useState, useEffect, useRef } = React

export function SideBar({ unreadMails, openCompose, onSetFilterBy }) {

    return (
        <div className="side-bar">
            <div className="compose-container">
                <button onClick={openCompose} className="compose-btn"><i className="fa-solid fa-pencil"></i></button>
            </div>

            <button onClick={() => onSetFilterBy({ status: 'inbox' })} className="btn"><div></div> <span>Inbox</span><span>{unreadMails ? unreadMails : ''}</span></button>
            <button onClick={() => onSetFilterBy({ status: 'stared' })} className="btn">Stared</button>
            <button onClick={() => onSetFilterBy({ status: 'sent' })} className="btn">Sent</button>
            <button onClick={() => onSetFilterBy({ status: 'draft' })} className="btn">Drafts</button>
            <button onClick={() => onSetFilterBy({ status: 'trash' })} className="btn">Trash</button>
        </div>
    )
}