const { useEffect, useState } = React
const { useSearchParams, useNavigate } = ReactRouterDOM
import { noteService } from "../services/note.service.js"
import { NotePreview } from "./NotePreview.jsx"

export function NoteAdd({ selectedNote, onNoteAdded, onClose, isAdding }) {
  const [noteToEdit, setNoteToEdit] = useState(selectedNote || noteService.createEmptyNote())
  const [inputType, setInputType] = useState("text")
  const [todos, setTodos] = useState(noteToEdit.info.todos || [""])
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const title = searchParams.get("title") || ""
    const txt = searchParams.get("txt") || ""
    const url = searchParams.get("url") || ""
    const todosParam = searchParams.get("todos")
    const loadedTodos = todosParam ? JSON.parse(todosParam) : [""]

    const updatedNote = {
      ...noteToEdit,
      info: {
        ...noteToEdit.info,
        title,
        txt,
        url,
        todos: loadedTodos,
      },
    }

    setNoteToEdit(updatedNote)
    setTodos(loadedTodos)
    setInputType(url ? "image" : loadedTodos.length > 1 ? "list" : "text")
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (noteToEdit.info.title) params.set("title", noteToEdit.info.title)
    if (noteToEdit.info.txt) params.set("txt", noteToEdit.info.txt)
    if (noteToEdit.info.url) params.set("url", noteToEdit.info.url)
    if (todos.length > 1 || todos[0] !== "") params.set("todos", JSON.stringify(todos))

    setSearchParams(params)
  }, [noteToEdit, todos, setSearchParams])

  function onSaveNote() {
    const filteredTodos = todos.filter((todo) => todo.trim() !== "")
    const updatedNote = {
      ...noteToEdit,
      type: inputType === "image" ? "NoteImg" : inputType === "list" ? "NoteTodos" : "NoteTxt",
      info: {
        ...noteToEdit.info,
        txt: inputType === "text" ? noteToEdit.info.txt : undefined,
        url: inputType === "image" ? noteToEdit.info.url : undefined,
        todos: inputType === "list" ? filteredTodos.map((todo) => ({ txt: todo, doneAt: null })) : undefined,
      },
    }

    noteService
      .save(updatedNote)
      .then((note) => {
        if (typeof onNoteAdded === "function") {
          onNoteAdded(note)
        }
        resetForm()
        onClose()
      })
      .catch((err) => console.log("Error saving note:", err))
  }

  function resetForm() {
    setNoteToEdit(noteService.createEmptyNote())
    setTodos([""])
    setInputType("text")
    setSearchParams({})
  }

  function handleInputTypeChange(type) {
    const clearedInfo = { ...noteToEdit.info }

    if (type !== "text") clearedInfo.txt = ""
    if (type !== "image") clearedInfo.url = ""
    if (type !== "list") setTodos([""])

    setNoteToEdit({ ...noteToEdit, info: clearedInfo })
    setInputType(type)
  }

  return (
    <section className={`note-add ${isAdding ? "accordion-open" : ""}`}>
      <NotePreview
        note={noteToEdit}
        setNote={setNoteToEdit}
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