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

    const activeReadFilterClass = filterBy.isRead === 'unread' ? 'active' : ''

    return (
        <section className="search-bar">
            <input type="search" placeholder='Search mail' onChange={handleChange} />
            <button className={activeReadFilterClass} onClick={() => setIsUnreadOn(!isUnreadOn)}><i className="fa-regular fa-envelope-open"></i></button>

        </section>
    )
}