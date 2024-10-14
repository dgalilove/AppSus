const { useNavigate, useParams } = ReactRouterDOM

import { noteService } from "../services/note.service.js"

const { useState, useEffect } = React

export function NoteAdd() {
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

    if (field.startsWith("info.")) {
      // Update nested info object
      const infoField = field.split(".")[1]
      setNoteToEdit((prevNote) => ({
        ...prevNote,
        info: { ...prevNote.info, [infoField]: value },
      }))
    } else if (field === "backgroundColor") {
      setNoteToEdit((prevNote) => ({
        ...prevNote,
        style: { ...prevNote.style, backgroundColor: value },
      }))
    } else {
      setNoteToEdit((prevNote) => ({ ...prevNote, [field]: value }))
    }
  }

  function onSaveNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteToEdit)
      .then((note) => {

      })
      .catch((err) => {
        console.log("err:", err)
      })
      .finally(() => {
        navigate("/note")
      })
  }

    const { info, style } = noteToEdit;
    return (
        <section className="note-edit">
            <h1>{noteId ? "Edit Note" : "Add New Note"}</h1>
            <form onSubmit={onSaveNote}>
                <label htmlFor="title">Title</label>
                <input value={info.title} onChange={handleChange} type="text" name="info.title" id="title" />

                <label htmlFor="txt">Text</label>
                <input value={info.txt} onChange={handleChange} type="text" name="info.txt" id="txt" />

                <label htmlFor="backgroundColor">Background Color</label>
                <input value={style.backgroundColor} onChange={handleChange} type="color" name="backgroundColor" id="backgroundColor" />

                <label htmlFor="isPinned">Pin Note</label>
                <input type="checkbox" checked={noteToEdit.isPinned} onChange={({ target }) => setNoteToEdit(prevNote => ({ ...prevNote, isPinned: target.checked }))} id="isPinned" />

                <button>Save</button>
            </form>
        </section>
    );
}
