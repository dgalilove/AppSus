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
      case "number":
      case "range":
        value = +value
        break
      case "checkbox":
        value = target.checked
        break
    }
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  const { title, type } = filterByToEdit

  return (
    <section className="note-filter">
      <form>
        <input
          value={title || ''}
          onChange={handleChange}
          type="text"
          name="title"
          id="title"
          placeholder="Filter by title"
        />
        <select name="type" value={type} onChange={handleChange}>
          <option value="">All</option>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="todos">Todos</option>
        </select>
      </form>
    </section>
  )
}
