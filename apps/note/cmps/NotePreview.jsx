
const { useState, useEffect, useRef } = React
const { useNavigate, useLocation } = ReactRouterDOM
import { eventBusService } from "../../../services/event-bus.service.js"

export const NotePreview = ({ note, setNote, onSaveNote }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputType, setInputType] = useState("text")
  const [todos, setTodos] = useState(note.info.todos || [""])
  const accordionRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleAccordion = () => setIsOpen((prev) => !prev)

  const handleChange = (field, value) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, [field]: value },
    }))
    updateQueryParams(field, value)
  }

  const updateQueryParams = (field, value) => {
    const searchParams = new URLSearchParams(location.search)
    if (field === "title") {
      searchParams.set("title", value)
    } else if (field === "txt") {
      searchParams.set("text", value)
    } else if (field === "url") {
      searchParams.set("image", value)
    } else if (field === "todos") {
      const todosString = value.join(",")
      searchParams.set("todos", todosString)
    }
    navigate({ search: searchParams.toString() }, { replace: true })
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

  const handleSave = () => {
    const filteredTodos = todos.filter((todo) => todo.trim() !== "")
    const newNote = {
      ...note,
      type:
        inputType === "image"
          ? "NoteImg"
          : inputType === "text"
            ? "NoteTxt"
            : "NoteTodos",
      info: {
        ...note.info,
        url: inputType === "image" ? note.info.url : undefined,
        todos:
          inputType === "list"
            ? filteredTodos.map((todo) => ({ txt: todo, doneAt: null }))
            : undefined,
      },
    }
    onSaveNote(newNote)
    setTodos([""])
    setIsOpen(false)
  }

  const handleAddTodo = () => setTodos((prev) => [...prev, ""])

  const handleTodoChange = (index, value) => {
    const updatedTodos = [...todos]
    updatedTodos[index] = value
    setTodos(updatedTodos)
    updateQueryParams("todos", updatedTodos)
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