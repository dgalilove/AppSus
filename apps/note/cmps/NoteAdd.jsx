const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { noteService } from "../services/note.service.js"
import { NotePreview } from "./NotePreview.jsx"

export function NoteAdd({ selectedNote, onNoteAdded, updateQueryParams }) {
  const [noteToEdit, setNoteToEdit] = useState(selectedNote || noteService.createEmptyNote())
  const [inputType, setInputType] = useState("text")
  const [todos, setTodos] = useState(noteToEdit.info.todos || [""])
  const { noteId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (noteId) loadNote()
  }, [noteId])

  useEffect(() => {
    if (selectedNote) {
      setNoteToEdit(selectedNote)
      setTodos(selectedNote.info.todos || [""])
    } else {
      setNoteToEdit(noteService.createEmptyNote())
    }
  }, [selectedNote])

  function loadNote() {
    noteService
      .get(noteId)
      .then(setNoteToEdit)
      .catch((err) => {
        console.log("Problem getting note", err)
        navigate("/note")
      })
  }

  function onSaveNote() {
    const filteredTodos = todos.filter((todo) => todo.trim() !== "")
    const newNote = {
      ...noteToEdit,
      type: inputType === "image" ? "NoteImg" : inputType === "text" ? "NoteTxt" : "NoteTodos",
      info: {
        ...noteToEdit.info,
        url: inputType === "image" ? noteToEdit.info.url : undefined,
        todos: inputType === "list" ? filteredTodos.map((todo) => ({ txt: todo, doneAt: null })) : undefined,
      },
    }
    noteService.save(newNote).then((note) => {
      if (onNoteAdded) onNoteAdded(note)
      setNoteToEdit(noteService.createEmptyNote())
      setTodos([""])
      navigate("/note")
    }).catch((err) => console.log("err:", err))
  }

  return (
    <section className="note-add">
      <NotePreview
        note={noteToEdit}
        setNote={setNoteToEdit}
        onSaveNote={onSaveNote}
        inputType={inputType}
        setInputType={setInputType}
        todos={todos}
        setTodos={setTodos}
        updateQueryParams={updateQueryParams}
      />
    </section>
  )
}