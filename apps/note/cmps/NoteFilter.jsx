
const { useState, useEffect } = React

export function NoteFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    function onSubmit(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { title, txt } = filterByToEdit

    const isValid = !!title || !!txt
    return (
        <section className="note-filter">
            <form onSubmit={onSubmit}>
                <input value={title || txt} onChange={handleChange} type="txt" name="title" id="title" />


                <button disabled={!isValid}>Search</button>
            </form>
        </section>
    )
}