const { useEffect, useState } = React
const { useSearchParams, useNavigate } = ReactRouterDOM
import { noteService } from "../services/note.service.js"
import { NotePreview } from "./NotePreview.jsx"

export function NoteAdd({ selectedNote, onNoteAdded, onClose, isAdding }) {
  const [noteToAdd, setNoteToAdd] = useState(
    selectedNote || noteService.createEmptyNote()
  )
  const [inputType, setInputType] = useState("text")
  const [todos, setTodos] = useState(noteToAdd.info.todos || [""])
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const title = searchParams.get("title") || ""
    const txt = searchParams.get("txt") || ""
    const url = searchParams.get("url") || ""
    const video = searchParams.get("video") || ""
    const todosParam = searchParams.get("todos")
    const loadedTodos = todosParam ? JSON.parse(todosParam) : [""]

    const updatedNote = {
      ...noteToAdd,
      info: {
        ...noteToAdd.info,
        title,
        txt,
        url,
        video,
        todos: loadedTodos,
      },
    }

    setNoteToAdd(updatedNote)
    setTodos(loadedTodos)
    setInputType(
      url ? "image" : video ? "video" : loadedTodos.length > 1 ? "list" : "text"
    )
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (noteToAdd.info.title) params.set("title", noteToAdd.info.title)
    if (noteToAdd.info.txt) params.set("txt", noteToAdd.info.txt)
    if (noteToAdd.info.url) params.set("url", noteToAdd.info.url)
    if (noteToAdd.info.video) params.set("video", noteToAdd.info.video)

    if (todos.length > 1 || todos[0] !== "")
      params.set("todos", JSON.stringify(todos))

    setSearchParams(params)
  }, [noteToAdd, todos, setSearchParams])

  function onSaveNote() {
    const filteredTodos = todos.filter((todo) => todo.trim() !== "")
    const updatedNote = {
      ...noteToAdd,
      type:
        inputType === "image"
          ? "NoteImg"
          : inputType === "list"
          ? "NoteTodos"
          : inputType === "video"
          ? "NoteVideo"
          : "NoteTxt",
      info: {
        ...noteToAdd.info,
        todos:
          inputType === "list"
            ? filteredTodos.map((todo) => ({ txt: todo }))
            : undefined,
      },
    }

    noteService
      .save(updatedNote)
      .then((note) => {
        onNoteAdded(note)
        resetForm()
        onClose()
      })
      .catch((err) => console.log("Error saving note:", err))
  }

  function resetForm() {
    setNoteToAdd(noteService.createEmptyNote())
    setTodos([""])
    setInputType("text")
    setSearchParams({})
  }

  function handleInputTypeChange(type) {
    const clearedInfo = { ...noteToAdd.info }

    if (type !== "text") clearedInfo.txt = ""
    if (type !== "image") clearedInfo.url = ""
    if (type !== "list") setTodos([""])
    if (type !== "video") clearedInfo.video = ""

    setNoteToAdd({ ...noteToAdd, info: clearedInfo })
    setInputType(type)
  }

  return (
    <section className={`note-add ${isAdding ? "accordion-open" : ""}`}>
      <NotePreview
        note={noteToAdd}
        setNote={setNoteToAdd}
        onSaveNote={onSaveNote}
        inputType={inputType}
        setInputType={handleInputTypeChange}
        todos={todos}
        setTodos={setTodos}
        isAdding={isAdding}
      />
    </section>
  )
}
