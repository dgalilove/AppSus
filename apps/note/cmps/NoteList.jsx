import { NotePreview } from "./NotePreview.jsx";

NotePreview

export function NoteList({ notes, onRemoveNote, onChangeColor, onTogglePin , onEditNote }) {
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
          onEditNote={onEditNote}
          onChangeColor={onChangeColor}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}