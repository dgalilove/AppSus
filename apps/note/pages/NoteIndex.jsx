const { useEffect, useState } = React
const { useSearchParams, useNavigate, useParams } = ReactRouterDOM

import { utilService } from "../../../services/util.service.js"
import { NoteAdd } from "../cmps/NoteAdd.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { noteService } from "../services/note.service.js"
import { NoteEdit } from "../cmps/NoteEdit.jsx"

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    noteService.getFilterFromSearchParams(searchParams)
  )
  const [selectedNote, setSelectedNote] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const navigate = useNavigate()
  const { noteId } = useParams()

  useEffect(() => {
    loadNotes()
    if (noteId) {
      // Load selected note for editing or adding based on URL
      noteService.get(noteId).then(setSelectedNote).catch(() => {
        console.log("Failed to load the note.")
        navigate("/note")
      })
    }
  }, [noteId, filterBy])

  function loadNotes() {
    noteService.query(filterBy).then((notes) => {
      setNotes(notes)
    }).catch((err) => console.log("Problems getting notes:", err))
  }

  function onEditNote(note) {
    setSelectedNote(note)
    navigate(`/note/edit/${note.id}`, { replace: true }) // Use consistent edit URL
  }

  function onAddNote() {
    // Create a temporary new note with a generated ID
    const newNote = { ...noteService.createEmptyNote(), id: utilService.makeId() }
    setSelectedNote(newNote)
    setIsAdding(true)
    navigate(`/note/edit/${newNote.id}`, { replace: true }) // Use the same edit URL format
  }

  function closeEdit() {
    navigate("/note", { replace: true }) // Reset URL after adding or editing
    setSelectedNote(null)
    setIsAdding(false)
  }

  function saveNoteChanges(updatedNote) {
    noteService.save(updatedNote).then(() => {
      loadNotes()
      closeEdit()
    }).catch((err) => console.log("Failed to update note", err))
  }

  if (!notes) return <h1>Loading...</h1>

  return (
    <section className="note-index">
      <NoteFilter filterBy={filterBy} onSetFilterBy={(filterBy) => setFilterBy(filterBy)} />
      <NoteAdd
        selectedNote={selectedNote}
        onNoteAdded={loadNotes}
        onClose={closeEdit}
        isAdding={isAdding}
      />

      <NoteList notes={notes} onEditNote={onEditNote} />

      {selectedNote && (
        <div className="note-edit-wrapper">
          <NoteEdit
            note={selectedNote}
            setNote={setSelectedNote}
            onClose={closeEdit}
            onSave={saveNoteChanges}
          />
        </div>
      )}
    </section>
  )
}