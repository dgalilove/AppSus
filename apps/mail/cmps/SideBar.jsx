import { NewCompose } from "./NewCompse.jsx"

const { useState, useEffect, useRef } = React

export function SideBar({ unreadMails, openCompose }) {


    return (
        <div className="side-bar">
            <div className="compose-container">
                <button onClick={openCompose} className="compose-btn"><i className="fa-solid fa-pencil"></i></button>
            </div>

            <button className="btn"><div></div> <span>Inbox</span><span>{unreadMails ? unreadMails : ''}</span></button>
            <button className="btn">Stared</button>
            <button className="btn">Sent</button>
            <button className="btn">Drafts</button>
            <button className="btn">Trash</button>
        </div>
    )
}