const { useEffect, useState } = React

export function NoteList({
  notes,
  onEditNote,
  onTogglePin,
  onRemoveNote,
  onChangeColor,
  onToggleTodo,
  onDeleteTodo,
}) {
  const [activeNoteId, setActiveNoteId] = useState(null)

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

  const toggleColorPalette = (noteId) => {
    if (activeNoteId === noteId) {
      setActiveNoteId(null)
    } else {
      setActiveNoteId(noteId)
    }
  }

  return (
    <div className="note-list">
      {notes.map((note) => {
        const backgroundColor =
          (note.style && note.style.backgroundColor) || "rgb(33, 33, 33)"

        return (
          <div
            key={note.id}
            className="note-item"
            style={{ backgroundColor }}
            onClick={() => onEditNote(note)}
          >
            <h3>{note.info.title || "Untitled"}</h3>
            {note.type === "NoteTxt" && <p>{note.info.txt || "Untitled"}</p>}
            {note.type === "NoteTodos" && (
              <ul className="todo-list">
                {note.info.todos.map((todo, idx) => (
                  <li
                    key={idx}
                    className={`todo-item ${todo.doneAt ? "completed" : ""}`} 
                    onClick={(e) => {
                      e.stopPropagation() 
                      onToggleTodo(note.id, idx) 
                    }}
                  >
                    {todo.txt}
                    <div>
                      <span className="todo-toggle">
                        {todo.doneAt ? (
                          <i class="fa-regular fa-circle"></i> 
                        ) : (
                          <i class="fa-solid fa-circle"></i> 
                        )}
                      </span>
                      <span
                        className="todo-delete"
                        onClick={(e) => {
                          e.stopPropagation() 
                          onDeleteTodo(note.id, idx) 
                        }} 
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {note.type === "NoteImg" && (
              <img src={note.info.url} alt={note.info.title} />
            )}
            {note.type === "NoteVideo" && note.info.video && (
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${extractYouTubeID(
                  note.info.video
                )}`}
                title={note.info.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            <button
              className="pinInAdd"
              onClick={(e) => {
                e.stopPropagation()
                onTogglePin(note.id)
              }}
            >
              {note.isPinned ? (
                <i className="fa-solid fa-thumbtack-slash"></i>
              ) : (
                <i className="fa-solid fa-thumbtack"></i>
              )}
            </button>
            <div className="note-action-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveNote(note.id)
                }}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleColorPalette(note.id)
                }}
              >
                <i className="fa-solid fa-palette"></i>
              </button>

              <div
                className={`color-palette-dropdown ${
                  activeNoteId === note.id ? "open" : ""
                }`}
              >
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onChangeColor(note.id, color)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function extractYouTubeID(url) {
  const regExp =
    /(?:youtube\.com\/(?:.*v=|.*\/embed\/|v\/)|youtu\.be\/)([^&\n?%#]+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}
