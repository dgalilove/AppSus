const { useState, useEffect, useRef } = React;

export function NoteEdit({
  note,
  setNote,
  onSave,
  onRemoveNote,
  onChangeColor,
  onTogglePin,
  onClose, // Receive the onClose function to close the edit mode
}) {
  const accordionRef = useRef(null);

  const handleTitleChange = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, title: event.target.value },
    }));
  };

  const handleTextChange = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, txt: event.target.value },
    }));
  };

  const handleTodoChange = (idx, newTodo) => {
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
      onSave(note); // Save changes when clicking outside   
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

  const handleDelete = () => {
    onRemoveNote(note.id); // Call the remove function
    onClose(); // Close the edit mode immediately after deleting
  };

  const handlePinToggle = () => {
    setNote((prevNote) => ({
      ...prevNote,
      isPinned: !prevNote.isPinned, // Toggle the pinned status
    }));
    onTogglePin(note.id); // Update the parent component
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
        onChange={handleTitleChange}
        placeholder="Edit title"
      />

      {note.type === "NoteTxt" && (
        <textarea
          value={note.info.txt}
          onChange={handleTextChange}
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
              onChange={(e) => handleTodoChange(idx, e.target.value)}
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
        <button onClick={handlePinToggle}>
          {note.isPinned ? "Unpin" : "Pin"}
        </button>
        <input
          type="color"
          value={backgroundColor}
          onChange={(ev) => onChangeColor(note.id, ev.target.value)}
        />
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
