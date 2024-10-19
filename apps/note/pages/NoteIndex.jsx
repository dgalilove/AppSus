const { useEffect, useState } = React
const { useSearchParams, useNavigate, useParams } = ReactRouterDOM

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
      noteService
        .get(noteId)
        .then(setSelectedNote)
        .catch(() => {
          console.log("Failed to load the note.")
          navigate("/note")
        })
    }
  }, [noteId, filterBy])

  function loadNotes() {
    noteService
      .query(filterBy)
      .then((notes) => {
        setNotes(notes)
      })
      .catch((err) => console.log("Problems getting notes:", err))
  }

  function onEditNote(note) {
    setSelectedNote(note)
    navigate(`/note/edit/${note.id}`, { replace: true })
  }

  function saveNoteChanges(updatedNote) {
    noteService
      .save(updatedNote)
      .then(() => {
        const updatedNotes = notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
        setNotes(sortNotes(updatedNotes))
        onClose()
      })
      .catch((err) => console.log("Failed to update note", err))
  }

  function sortNotes(notes) {
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })
  }

  function updateNote(noteId, updateCallback) {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? updateCallback(note) : note
    )
    const updatedNote = updatedNotes.find((note) => note.id === noteId)

    noteService
      .save(updatedNote)
      .then(() => setNotes(sortNotes(updatedNotes)))
      .catch((err) => console.log("Failed to update note", err))
  }

  function onRemoveNote(noteId) {
    noteService
      .remove(noteId)
      .then(() => {
        setNotes((notes) => notes.filter((note) => note.id !== noteId))
        loadNotes()
      })
      .catch((err) => console.log("Problems removing note:", err))
  }

  function onChangeColor(noteId, color) {
    updateNote(noteId, (note) => ({
      ...note,
      style: { ...note.style, backgroundColor: color },
    }))
  }

  function loadNotes() {
    noteService
      .query(filterBy)
      .then((notes) => {
        setNotes(sortNotes(notes))
      })
      .catch((err) => console.log("Problems getting notes:", err))
  }

  function onTogglePin(noteId) {
    updateNote(noteId, (note) => {
      const updatedNote = { ...note, isPinned: !note.isPinned }
      noteService
        .save(updatedNote)
        .then(() => {
          const updatedNotes = notes.map((n) =>
            n.id === updatedNote.id ? updatedNote : n
          )
          setNotes(sortNotes(updatedNotes))
        })
        .catch((err) => console.log("Failed to update pin state", err))
      return updatedNote
    })
  }
  function onClose() {
    navigate("/note", { replace: true })
    setSelectedNote(null)
    setIsAdding(false)
  }

  if (!notes) return <h1>Loading...</h1>

  return (
    <section className="note-index">
      <NoteFilter
        filterBy={filterBy}
        onSetFilterBy={(filterBy) => setFilterBy(filterBy)}
      />
      <NoteAdd
        selectedNote={selectedNote}
        onNoteAdded={loadNotes}
        onClose={onClose}
        isAdding={isAdding}
      />

      <NoteList notes={notes} onEditNote={onEditNote} />

      {selectedNote && (
        <div className="note-edit-wrapper">
          <NoteEdit
            note={selectedNote}
            setNote={setSelectedNote}
            onSave={saveNoteChanges}
            onRemoveNote={onRemoveNote}
            onChangeColor={onChangeColor}
            onTogglePin={onTogglePin}
            onClose={onClose}
          />
        </div>
      )}
    </section>
  )
}
