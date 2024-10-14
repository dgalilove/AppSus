const { useState, useEffect, useRef } = React

export function SideBar() {

    useEffect(() => {
        console.log(`SideBar`, `uploaded`)

        return () => {
            console.log(`SideBar`, `destroyed`)
        }
    }, [])

    return (
        <div className="side-bar">
            <div className="compose-container">
                <button className="compose-btn">New</button>
            </div>

            <button className="btn"><div></div> <span>Inbox</span><span>number</span></button>
            <button className="btn">Stared</button>
            <button className="btn">Sent</button>
            <button className="btn">Drafts</button>
            <button className="btn">Trash</button>
        </div>
    )
}