const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { noteService } from "../services/note.service.js"
import { NotePreview } from "./NotePreview.jsx"
export function NoteAdd({ selectedNote, onNoteAdded }) {
  const [noteToEdit, setNoteToEdit] = useState(
    selectedNote || noteService.createEmptyNote()
  )
  const { noteId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (noteId) {
      loadNote()
    }
  }, [noteId])

  useEffect(() => {
    if (selectedNote) {
      setNoteToEdit(selectedNote)
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

  function onSaveNote(newNote) {
    noteService
      .save(newNote)
      .then((note) => {
        if (onNoteAdded) onNoteAdded(note)
        setNoteToEdit(noteService.createEmptyNote())
        navigate("/note")
      })
      .catch((err) => {
        console.log("err:", err)
      })
  }

  return (
    <section className="note-add">
      <NotePreview
        note={noteToEdit}
        setNote={setNoteToEdit}
        onSaveNote={onSaveNote}
      />
    </section>
  )
}
