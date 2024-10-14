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

        </div>
    )
}