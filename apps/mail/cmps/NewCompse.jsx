const { useState, useEffect, useRef } = React

export function NewCompose() {

    useEffect(() => {
        console.log(`NewCompose`, `uploaded`)

        return () => {
            console.log(`NewCompose`, `destroyed`)
        }
    }, [])

    return (
        <div className="new-compose">
            <h2>New Message</h2>
            <input type="text" placeholder={'To'} name='to' />
            <input type="text" placeholder={'Subject'} name='subject' />
            <textarea type="text" name='body' />
            <button>Send</button>
        </div>
    )
}