const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React
import { noteService } from "../services/note.service.js"
import { NoteAccordion } from "./NoteAccordion.jsx"

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

  function onSaveNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteToEdit)
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
    <section
      className="note-edit"
    >
      <form onSubmit={onSaveNote}>
        <NoteAccordion note={noteToEdit} setNote={setNoteToEdit}/>
        
      </form>
    </section>
  )
}
