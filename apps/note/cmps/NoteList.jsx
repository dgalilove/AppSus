import { NotePreview } from "./NotePreview.jsx"


export function NoteList({ notes, onRemoveNote, onChangeColor, onTogglePin }) {
  if (!notes || notes.length === 0) {
    return <p>No notes available.</p>;
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <NotePreview
          key={note.id}
          note={note}
          onRemoveNote={onRemoveNote}
          onChangeColor={onChangeColor}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}