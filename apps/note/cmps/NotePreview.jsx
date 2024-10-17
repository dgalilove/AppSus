const { useEffect, useState, useRef } = React
import { NoteImg } from "./NoteImg.jsx";
import { NoteTodos } from "./NoteTodos.jsx";
import { eventBusService } from "../../../services/event-bus.service.js";
import { NoteTxt } from "./NoteTxt.jsx";

export function NotePreview({ note, setNote, onSaveNote, inputType, setInputType, todos, setTodos, isAdding }) {
  const [isOpen, setIsOpen] = useState(isAdding);
  const accordionRef = useRef(null);

  function toggleAccordion() {
    setIsOpen((prev) => !prev);
  }

  function handleChange(field, value) {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, [field]: value },
    }));
  }

  function handleClickOutside(event) {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    const removeListener = eventBusService.on("close-all-accordions", () => setIsOpen(false));
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      removeListener();
    };
  }, []);

  function handleInputTypeChange(type) {
    setInputType(type);
    setTodos(type === "list" ? note.info.todos || [""] : [""]);
  }

  function handleAddTodo() {
    setTodos((prev) => [...prev, ""]);
  }

  function handleTodoChange(index, value) {
    const updatedTodos = [...todos];
    updatedTodos[index] = value;
    setTodos(updatedTodos);
  }

  function handleSave() {
    onSaveNote();
    setIsOpen(false);
  }

  return (
    <div className={`note-accordion ${isOpen ? "accordion-open" : ""}`} ref={accordionRef}>
      <div className={`accordion-header ${isOpen ? "active" : ""}`} onClick={toggleAccordion}>
        <input
          type="text"
          placeholder="New Note"
          value={note.info.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`accordion-title`}
        />
        <div className="icon-container">
          <span className="icon-text" title="Text" onClick={() => handleInputTypeChange("text")}>
            <i className="fa-solid fa-t"></i>
          </span>
          <span className="icon-image" title="Image" onClick={() => handleInputTypeChange("image")}>
            <i className="fa-regular fa-image"></i>
          </span>
          <span className="icon-list" title="List" onClick={() => handleInputTypeChange("list")}>
            <i className="fa-solid fa-list-ul"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="accordion-body">
          {inputType === "text" && (
            <NoteTxt text={note.info.txt} onChange={(value) => handleChange("txt", value)} />
          )}
          {inputType === "image" && (
            <NoteImg url={note.info.url} onChange={(value) => handleChange("url", value)} />
          )}
          {inputType === "list" && (
            <NoteTodos todos={todos} onAddTodo={handleAddTodo} onTodoChange={handleTodoChange} />
          )}
          <div className="accordion-buttons">
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}