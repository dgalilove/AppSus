const { useEffect, useState, useRef } = React
import { NoteImg } from "./NoteImg.jsx"
import { NoteTodos } from "./NoteTodos.jsx"
import { eventBusService } from "../../../services/event-bus.service.js"
import { NoteTxt } from "./NoteTxt.jsx"
import { NoteVideo } from "./NoteVideo.jsx"

export function NotePreview({
  note,
  setNote,
  onSaveNote,
  inputType,
  setInputType,
  todos,
  setTodos,
  isAdding,
}) {
  const [isOpen, setIsOpen] = useState(isAdding)
  const accordionRef = useRef(null)

  function toggleAccordion() {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  function handleChange(field, value) {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, [field]: value },
    }))
  }

  function handleClickOutside(event) {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const removeListener = eventBusService.on("close-all-accordions", () =>
      setIsOpen(false)
    )
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      removeListener()
    }
  }, [])

  function inputTypeChange(type) {
    setInputType(type)
    setTodos(type === "list" ? note.info.todos || [""] : [""])
  }

  function addTodo() {
    setTodos((prev) => [...prev, ""])
  }

  function toDoChange(index, value) {
    const updatedTodos = [...todos]
    updatedTodos[index] = value
    setTodos(updatedTodos)
  }

  function extractYouTubeID(url) {
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/embed\/|v\/)|youtu\.be\/)([^&\n?%#]+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }
  function handleSave() {
    const videoID = extractYouTubeID(note.info.video)
    if (inputType === "video" && !videoID) {
      alert("Please enter a valid YouTube URL")
      return
    }
    onSaveNote()
    setIsOpen(false)
  }

  return (
    <div
      className={`note-accordion ${isOpen ? "accordion-open" : ""}`}
      ref={accordionRef}
    >
      <div
        className={`accordion-header ${isOpen ? "active" : ""}`}
        onClick={toggleAccordion}
      >
        <input
          type="text"
          placeholder="New Note"
          value={note.info.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`accordion-title`}
        />
        <div className="icon-container">
          <span
            className="icon-text"
            title="Text"
            onClick={() => inputTypeChange("text")}
          >
            <i className="fa-solid fa-t"></i>
          </span>
          <span
            className="icon-image"
            title="Image"
            onClick={() => inputTypeChange("image")}
          >
            <i className="fa-regular fa-image"></i>
          </span>
          <span
            className="icon-list"
            title="List"
            onClick={() => inputTypeChange("list")}
          >
            <i className="fa-solid fa-list-ul"></i>
          </span>
          <span
            className="icon-video"
            title="Video"
            onClick={() => inputTypeChange("video")}
          >
            <i className="fa-solid fa-video"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="accordion-body">
          {inputType === "text" && (
            <NoteTxt
              text={note.info.txt}
              onChange={(value) => handleChange("txt", value)}
            />
          )}
          {inputType === "image" && (
            <NoteImg
              url={note.info.url}
              onChange={(value) => handleChange("url", value)}
            />
          )}
          {inputType === "list" && (
            <NoteTodos
              todos={todos}
              onAddTodo={addTodo}
              onTodoChange={toDoChange}
            />
          )}
          {inputType === "video" && (
            <NoteVideo
              url={note.info.video}
              onChange={(value) => handleChange("video", value)}
            />
          )}
          <div className="accordion-buttons">
            <button onClick={handleSave}>
              <i class="fa-regular fa-note-sticky"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
