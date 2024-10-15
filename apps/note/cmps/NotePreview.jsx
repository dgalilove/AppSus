const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function NotePreview({
  note,
  onRemoveNote,
  onChangeColor,
  onTogglePin,
  onEditNote,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const noteRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const toggleExpanded = () => {
    const newState = !isExpanded
    setIsExpanded(newState)

    if (newState) {
      // Add note ID to query params when expanded
      searchParams.set("noteId", note.id)
      setSearchParams(searchParams)
    } else {
      // Remove note ID from query params when collapsed
      searchParams.delete("noteId")
      setSearchParams(searchParams)
    }
  }

  const closeExpanded = () => {
    setIsExpanded(false)
    // Remove note ID from query params when collapsed
    searchParams.delete("noteId")
    setSearchParams(searchParams)
  }

  // Close note when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        closeExpanded()
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])
  
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen)
  }

  const backgroundColor =
    note.style && note.style.backgroundColor
      ? note.style.backgroundColor
      : "#b95e5e"

  return (
    <section
      ref={noteRef}
      className={`note-preview ${isExpanded ? "expanded" : ""}`}
      onClick={!isExpanded ? toggleExpanded : undefined}
      style={{ backgroundColor }} 
    >
      <div className="note-preview-scrollable">
        {note.type === "NoteTxt" && note.info.txt && (
          <div>
            <h2 className="note-title">{note.info.title || "Empty Title"}</h2>
            <h4 className="note-txt">{note.info.txt}</h4>
          </div>
        )}

        {note.type === "NoteTodos" && note.info.todos && (
          <div>
            <h2 className="note-title">{note.info.title}</h2>
            <h4>Todos:</h4>
            <ul>
              {note.info.todos.map((todo, idx) => (
                <li key={idx}>{todo.txt}</li>
              ))}
            </ul>
          </div>
        )}

        {note.type === "NoteImg" && note.info.url && (
          <div>
            <h2 className="note-title">{note.info.title}</h2>
            <img
              src={note.info.url}
              alt={note.info.title}
              
            />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="note-buttons">
          <button onClick={() => onTogglePin(note.id)}>
            {note.isPinned ? "Unpin" : "Pin"}
          </button>
          <input
            type="color"
            value={(note.style && note.style.backgroundColor) || "#b95e5e"}
            onChange={(ev) => onChangeColor(note.id, ev.target.value)}
          />
          <button onClick={() => onEditNote(note)}>Edit</button>
          <button onClick={() => onRemoveNote(note.id)}>Remove</button>
        </div>
      )}
    </section>
  )
}
