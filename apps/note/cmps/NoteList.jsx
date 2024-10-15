export function NoteList({ notes, onEditNote }) {
  if (!notes || notes.length === 0) {
    return <p>No notes available.</p>
  }

  return (
    <div className="note-list">
      {notes.map((note) => {
        const backgroundColor =
          note.style && note.style.backgroundColor
            ? note.style.backgroundColor
            : "#b95e5e"

        return (
          <div
            key={note.id}
            className="note-item"
            style={{ backgroundColor }}
            onClick={() => onEditNote(note)}
          >
            <h3>{note.info.title || "Untitled"}</h3>
            {note.type === "NoteTxt" && <p>{note.info.txt}</p>}
            {note.type === "NoteTodos" && (
              <ul>
                {note.info.todos.map((todo, idx) => (
                  <li key={idx}>{todo.txt}</li>
                ))}
              </ul>
            )}
            {note.type === "NoteImg" && (
              <img src={note.info.url} alt={note.info.title} />
            )}
          </div>
        )
      })}
    </div>
  )
}
