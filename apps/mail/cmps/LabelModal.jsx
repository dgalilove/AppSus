const { useState, useEffect, useRef } = React

export function LabelModal() {

    useEffect(() => {
        console.log(`LabelModal`, `uploaded`)

        return () => {
            console.log(`LabelModal`, `destroyed`)
        }
    }, [])

    return (
        <section className="label-modal">

        </section>
    )
}