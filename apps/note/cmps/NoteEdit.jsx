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
  const accordionRef = useRef(null);

  const titleEdit = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, title: event.target.value },
    }));
  };

  const textEdit = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, txt: event.target.value },
    }));
  };

  const toDoEdit = (idx, newTodo) => {
    const updatedTodos = note.info.todos.map((todo, i) =>
      i === idx ? { ...todo, txt: newTodo } : todo
    );
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, todos: updatedTodos },
    }));
  };

  const handleClickOutside = (event) => {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      onSave(note);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [note]);

  const backgroundColor =
    note.style && note.style.backgroundColor
      ? note.style.backgroundColor
      : "#b95e5e";

  const deleteInEdit = () => {
    onRemoveNote(note.id);
    onClose();
  };

  const pinInEdit = () => {
    setNote((prevNote) => ({
      ...prevNote,
      isPinned: !prevNote.isPinned,
    }));
    onTogglePin(note.id);
  };

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
            <input
              key={idx}
              type="text"
              value={todo.txt}
              onChange={(e) => toDoEdit(idx, e.target.value)}
            />
          ))}
        </div>
      )}

      {note.type === "NoteImg" && (
        <div>
          <img src={note.info.url} alt={note.info.title} />
        </div>
      )}

      <div className="note-buttons">
        <button onClick={pinInEdit}>
          {note.isPinned ? "Unpin" : "Pin"}
        </button>
        <input
          type="color"
          value={backgroundColor}
          onChange={(ev) => {
            const newColor = ev.target.value;
            onChangeColor(note.id, newColor);
            setNote((prevNote) => ({
              ...prevNote,
              style: { ...prevNote.style, backgroundColor: newColor },
            }));
          }}
        />
        <button onClick={deleteInEdit}>Delete</button>
      </div>
    </div>
  );
}
