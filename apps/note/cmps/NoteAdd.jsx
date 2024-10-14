const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React
import { noteService } from "../services/note.service.js"
import { NoteAccordion } from "./NoteAccordion.jsx"

export function NoteAdd({ selectedNote, onNoteAdded }) {
  // If editing, load the note; if adding, create an empty note
  const [noteToEdit, setNoteToEdit] = useState(
    selectedNote || noteService.createEmptyNote()
  )
  const { noteId } = useParams() // Get the noteId from the URL if using routing
  const navigate = useNavigate()

  // Load the note if noteId is present (for editing)
  useEffect(() => {
    if (noteId) {
      loadNote()
    }
  }, [noteId])

  // Load the note if editing (or reset for adding)
  useEffect(() => {
    if (selectedNote) {
      setNoteToEdit(selectedNote)
    } else {
      setNoteToEdit(noteService.createEmptyNote())
    }
  }, [selectedNote])

  // Function to load a note by id (if editing)
  function loadNote() {
    noteService
      .get(noteId)
      .then(setNoteToEdit)
      .catch((err) => {
        console.log("Problem getting note", err)
        navigate("/note")
      })
  }

  // Handle input changes for the note fields
  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    // Update background color or other fields
    if (field === "backgroundColor") {
      setNoteToEdit((prevNote) => ({
        ...prevNote,
        style: { ...prevNote.style, backgroundColor: value },
      }))
    }
  }

  // Save the note (either update an existing note or create a new one)
  function onSaveNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteToEdit) // Update if note has an id, otherwise create new
      .then((note) => {
        if (onNoteAdded) onNoteAdded(note) // Callback to update parent
        navigate("/note") // Navigate back to note list after saving
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
        {/* Accordion with the note title and text pre-filled */}
        <NoteAccordion note={noteToEdit} setNote={setNoteToEdit} />

        {/* Background color input */}
        <label htmlFor="backgroundColor">Background Color</label>
        <input
          value={style.backgroundColor || "#ffffff"}
          onChange={handleChange}
          type="color"
          name="backgroundColor"
          id="backgroundColor"
        />

        {/* Save button */}
        <button type="submit">Save</button>
      </form>
    </section>
  )
}
