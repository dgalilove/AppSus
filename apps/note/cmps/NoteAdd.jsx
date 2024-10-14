const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React
import { noteService } from "../services/note.service.js"
import { NoteAccordion } from "./NoteAccordion.jsx"

export function NoteAdd({ onNoteAdded }) {
  const [noteToEdit, setNoteToEdit] = useState(noteService.createEmptyNote())
  const { noteId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (noteId) loadNote()
  }, [])

  function loadNote() {
    noteService
      .get(noteId)
      .then(setNoteToEdit)
      .catch((err) => {
        console.log("Problem getting note", err)
        navigate("/note")
      })
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    if (field === "backgroundColor") {
      setNoteToEdit((prevNote) => ({
        ...prevNote,
        style: { ...prevNote.style, backgroundColor: value },
      }))
    }
  }

  function onSaveNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteToEdit)
      .then((note) => {
        if (onNoteAdded) onNoteAdded(note)
        navigate("/note")
      })
      .catch((err) => {
        console.log("err:", err)
      })
  }

  const { style } = noteToEdit

  return (
    <section
      className="note-edit"
      style={{ backgroundColor: style.backgroundColor || "#ffffff" }}
    >
      <form onSubmit={onSaveNote}>
        <NoteAccordion note={noteToEdit} setNote={setNoteToEdit} />

        <label htmlFor="backgroundColor">Background Color</label>
        <input
          value={style.backgroundColor || "#ffffff"}
          onChange={handleChange}
          type="color"
          name="backgroundColor"
          id="backgroundColor"
        />

        <button>Save</button>
      </form>
    </section>
  )
}
