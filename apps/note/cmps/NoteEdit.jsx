const { useState, useEffect, useRef } = React

export function NoteEdit({
  note,
  setNote,
  onSave,
  onRemoveNote,
  onChangeColor,
  onTogglePin,
  onClose,
}) {
  const accordionRef = useRef(null)
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false)
  const colorOptions = [
    "#621708",
    "#96897B",
    "#156064",
    "#364652",
    "#63372C",
    "#55038C",
    "#2C0735",
    "rgb(33, 33, 33)",
  ]

  const selectColor = (color) => {
    onChangeColor(note.id, color)
    setNote((prevNote) => ({
      ...prevNote,
      style: { ...prevNote.style, backgroundColor: color },
    }))
    setIsColorPaletteOpen(false)
  }

  const titleEdit = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, title: event.target.value },
    }))
  }

  const textEdit = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, txt: event.target.value },
    }))
  }

  const toDoEdit = (idx, newTodo) => {
    const updatedTodos = note.info.todos.map((todo, i) =>
      i === idx ? { ...todo, txt: newTodo } : todo
    )
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, todos: updatedTodos },
    }))
  }
  const addTodo = () => {
    const newTodo = { txt: "", doneAt: null }
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, todos: [...prevNote.info.todos, newTodo] },
    }))
  }

  const handleClickOutside = (event) => {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      onSave(note)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [note])

  const backgroundColor =
    note.style && note.style.backgroundColor
      ? note.style.backgroundColor
      : "rgb(33, 33, 33)"

  const deleteInEdit = () => {
    onRemoveNote(note.id)
    onClose()
  }

  const pinInEdit = () => {
    setNote((prevNote) => {
      const updatedNote = { ...prevNote, isPinned: !prevNote.isPinned }
      onTogglePin(updatedNote.id)
      return updatedNote
    })
  }

  return (
    <div
      ref={accordionRef}
      className="note-accordion-edit"
      style={{ backgroundColor }}
    >
      <input
        type="text"
        value={note.info.title}
        onChange={titleEdit}
        name="title"
        placeholder="Edit title"
      />

      {note.type === "NoteTxt" && (
        <textarea
          value={note.info.txt}
          onChange={textEdit}
          placeholder="Edit content"
        />
      )}

      {note.type === "NoteTodos" && (
        <div>
          {note.info.todos.map((todo, idx) => (
            <div>
              <input
                key={idx}
                type="text"
                placeholder="Edit content"
                value={todo.txt}
                onChange={(e) => toDoEdit(idx, e.target.value)}
              />
            </div>
          ))}
          <button className='todo-add-button' onClick={addTodo}><i class="fa-solid fa-plus"></i></button>
        </div>
      )}

      {note.type === "NoteImg" && (
        <div>
          <img src={note.info.url} alt={note.info.title} />
        </div>
      )}

      <div className="note-buttons">
        <button onClick={pinInEdit}>
          {note.isPinned ? (
            <i className="fa-solid fa-thumbtack-slash"></i>
          ) : (
            <i className="fa-solid fa-thumbtack"></i>
          )}
        </button>
        <button onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}>
          <i className="fa-solid fa-palette"></i>
        </button>

        {isColorPaletteOpen && (
          <div className="color-palette">
            {colorOptions.map((color) => (
              <div
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
              />
            ))}
          </div>
        )}
        <button onClick={deleteInEdit}>
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  )
}
