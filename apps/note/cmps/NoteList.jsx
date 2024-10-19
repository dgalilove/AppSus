export function NoteList({ notes, onEditNote }) {
  if (!notes || notes.length === 0) {
    return <p>No notes available.</p>
  }
  function extractYouTubeID(url) {
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/embed\/|v\/)|youtu\.be\/)([^&\n?%#]+)/
    const match = url.match(regExp)
    return match ? match[1] : null
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
              <ul>
                {note.info.todos.map((todo, idx) => (
                  <li key={idx}>{todo.txt}</li>
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
          </div>
        )
      })}
    </div>
  )
}
