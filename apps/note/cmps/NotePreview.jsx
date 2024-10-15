const { useEffect, useState } = React;
const { useSearchParams } = ReactRouterDOM;

export function NotePreview({ note, onRemoveNote, onChangeColor, onTogglePin, onEditNote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const noteRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      searchParams.set("noteId", note.id);
    } else {
      searchParams.delete("noteId");
    }
    setSearchParams(searchParams);
  };

  const closeExpanded = () => {
    setIsExpanded(false);
    searchParams.delete("noteId");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        closeExpanded();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <section
      ref={noteRef}
      className={`note-preview ${isExpanded ? "expanded" : ""}`}
      onClick={!isExpanded ? toggleExpanded : undefined}
      style={{ backgroundColor: note.style?.backgroundColor || "#b95e5e" }}
    >
      <div className="note-preview-scrollable">
        <h2 className="note-title">{note.info.title || "Untitled"}</h2>
        {note.type === "NoteTxt" && <p>{note.info.txt}</p>}
        {note.type === "NoteTodos" && (
          <ul>
            {note.info.todos.map((todo, idx) => (
              <li key={idx}>{todo.txt}</li>
            ))}
          </ul>
        )}
        {note.type === "NoteImg" && <img src={note.info.url} alt={note.info.title} />}
      </div>
      {isExpanded && (
        <div className="note-buttons">
          <button onClick={() => onTogglePin(note.id)}>{note.isPinned ? "Unpin" : "Pin"}</button>
          <input
            type="color"
            value={note.style?.backgroundColor || "#b95e5e"}
            onChange={(ev) => onChangeColor(note.id, ev.target.value)}
          />
          <button onClick={() => onEditNote(note)}>Edit</button>
          <button onClick={() => onRemoveNote(note.id)}>Remove</button>
        </div>
      )}
    </section>
  );
}
