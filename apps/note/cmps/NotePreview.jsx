export function NotePreview({
  note,
  onRemoveNote,
  onChangeColor,
  onTogglePin,
}) {

  if (!note) return <h1>Loading...</h1>
  return (
    <section className="note-preview">
      {note.type === "NoteTxt" && note.info.txt && (
        <div>
          <h2 className='note-title'>{note.info.title || 'Empty Title'}</h2>
          <h4 className='note-txt'>{note.info.txt}</h4>
        </div>
      )}

      {note.type === "NoteTodos" && note.info.todos && (
        <div>
        <h2 className='note-title'>{note.info.title}</h2>
        <h4>Todos:</h4>
          <ul>
            {note.info.todos.map((todo, idx) => (
              <li key={idx}>
                {todo.txt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {note.type === "NoteImg" && note.info.url && (
        <div>
        <h2 className='note-title'>{note.info.title}</h2>
        <img
            src={note.info.url}
            alt={note.info.title}
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
      <div className='note-buttons'>
      <button onClick={() => onTogglePin(note.id)}>
        {note.isPinned ? "Unpin" : "Pin"}
      </button>

        <input
          type="color"
          value={(note.style && note.style.backgroundColor) || "#ffffff"}
          onChange={(ev) => onChangeColor(note.id, ev.target.value)}
        />

      <button onClick={() => onRemoveNote(note.id)}>Remove</button>
      </div>
    </section>
  )
}
