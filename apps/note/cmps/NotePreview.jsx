const { useState, useEffect, useRef } = React
import { eventBusService } from "../../../services/event-bus.service.js"

export const NotePreview = ({ note, setNote, onSaveNote, inputType, setInputType, todos, setTodos, isAdding }) => {
  const [isOpen, setIsOpen] = useState(isAdding) // Initialize based on `isAdding`
  const accordionRef = useRef(null)

  const toggleAccordion = () => setIsOpen((prev) => !prev)

  const handleChange = (field, value) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, [field]: value },
    }))
  }

  const handleClickOutside = (event) => {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const removeListener = eventBusService.on("close-all-accordions", () => setIsOpen(false))
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      removeListener()
    }
  }, [])

  const handleInputTypeChange = (type) => {
    setInputType(type)
    setTodos(type === "list" ? note.info.todos || [""] : [""])
  }

  const handleAddTodo = () => setTodos((prev) => [...prev, ""])

  const handleTodoChange = (index, value) => {
    const updatedTodos = [...todos]
    updatedTodos[index] = value
    setTodos(updatedTodos)
  }

  const handleSave = () => {
    onSaveNote()
    setIsOpen(false) // Close the accordion after saving
  }

  return (
    <div className={`note-accordion ${isOpen ? "accordion-open" : ""}`} ref={accordionRef}>
      <div className={`accordion-header ${isOpen ? "active" : ""}`} onClick={toggleAccordion}>
        <input
          type="text"
          placeholder="New Note"
          value={note.info.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`accordion-title `}
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
            <textarea
              placeholder="Type note here..."
              value={note.info.txt}
              onChange={(e) => handleChange("txt", e.target.value)}
              className="accordion-text"
              rows="4"
              cols="54"
            />
          )}
          {inputType === "image" && (
            <input
              type="text"
              placeholder="Image URL"
              onChange={(e) => handleChange("url", e.target.value)}
              className="image-url-input"
            />
          )}
          {inputType === "list" && (
            <div>
              {todos.map((todo, index) => (
                <input
                  key={index}
                  type="text"
                  value={todo}
                  onChange={(e) => handleTodoChange(index, e.target.value)}
                  placeholder={`Todo ${index + 1}`}
                />
              ))}
              <button type="button" onClick={handleAddTodo}>Add Todo</button>
            </div>
          )}
          <div className="accordion-buttons">
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  )
}