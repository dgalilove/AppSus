const { useState, useEffect, useRef } = React

export function SearchBar({ onSetFilterBy, filterBy }) {

    const [isUnreadOn, setIsUnreadOn] = useState(false)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })


    useEffect(() => {
        if (isUnreadOn) onSetFilterBy({ isRead: 'unread' })
        else onSetFilterBy({ isRead: '' })
    }, [isUnreadOn])


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])



    function handleChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, search: value }))
    }


    return (
        <section className="search-bar">
            <input type="search" onChange={handleChange} />
            <button onClick={() => setIsUnreadOn(!isUnreadOn)}><i className="fa-regular fa-envelope-open"></i></button>
            <button onClick={() => onSetFilterBy({ sort: 'date' })}>date</button>
            <button onClick={() => onSetFilterBy({ sort: 'name' })}>name</button>
            <button onClick={() => onSetFilterBy({ sort: 'subject' })}>subject</button>
        </section>
    )
}