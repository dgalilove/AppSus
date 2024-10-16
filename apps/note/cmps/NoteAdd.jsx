const { useEffect, useState } = React
const { useNavigate } = ReactRouterDOM

import { noteService } from "../services/note.service.js"
import { NotePreview } from "./NotePreview.jsx"

export function NoteAdd({ selectedNote, onNoteAdded, onClose, isAdding }) {
  const [noteToEdit, setNoteToEdit] = useState(selectedNote || noteService.createEmptyNote())
  const [inputType, setInputType] = useState("text")
  const [todos, setTodos] = useState(noteToEdit.info.todos || [""])
  const navigate = useNavigate()

  // Navigate to edit URL when adding a new note
  useEffect(() => {
    if (isAdding) {
      navigate(`/note/edit/${noteToEdit.id}`, { replace: true })
    }
  }, [isAdding, noteToEdit.id])

  function onSaveNote() {
    const filteredTodos = todos.filter((todo) => todo.trim() !== "")
    const updatedNote = {
      ...noteToEdit,
      type: getNoteType(inputType),
      info: {
        ...noteToEdit.info,
        url: inputType === "image" ? noteToEdit.info.url : undefined,
        todos: inputType === "list" ? filteredTodos.map((todo) => ({ txt: todo, doneAt: null })) : undefined,
      },
    }

    noteService.save(updatedNote)
      .then((note) => {
        if (typeof onNoteAdded === 'function') {
          onNoteAdded(note);
        }
        resetForm()
        onClose()
      })
      .catch((err) => console.log("Error saving note:", err))
  }

  function getNoteType(type) {
    switch (type) {
      case "image":
        return "NoteImg"
      case "list":
        return "NoteTodos"
      default:
        return "NoteTxt"
    }
  }

  function resetForm() {
    setNoteToEdit(noteService.createEmptyNote())
    setTodos([""])
    setInputType("text")
  }

  return (
    <section className={`note-add ${isAdding ? "accordion-open" : ""}`}>
      <NotePreview
        note={noteToEdit}
        setNote={setNoteToEdit}
        onSaveNote={onSaveNote}
        inputType={inputType}
        setInputType={setInputType}
        todos={todos}
        setTodos={setTodos}
        isAdding={isAdding}
      />
    </section>
  )
}