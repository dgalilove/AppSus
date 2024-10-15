const { useEffect, useState } = React
const { useSearchParams } = ReactRouterDOM

import { utilService } from "../../../services/util.service.js"
import { NoteAdd } from "../cmps/NoteAdd.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { noteService } from "../services/note.service.js"

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    noteService.getFilterFromSearchParams(searchParams)
  )
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    setSearchParams(utilService.getTruthyValues(filterBy))
    loadNotes()
  }, [filterBy])

  function sortNotes(notes) {
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
    })
  }

  function loadNotes() {
    noteService
      .query(filterBy)
      .then((notes) => {
        setNotes(sortNotes(notes))
      })
      .catch((err) => {
        console.log("Problems getting notes:", err)
      })
  }

  function updateNote(noteId, updateCallback) {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? updateCallback(note) : note
    )
    const updatedNote = updatedNotes.find((note) => note.id === noteId)

    noteService
      .save(updatedNote)
      .then(() => {
        setNotes(sortNotes(updatedNotes))
      })
      .catch((err) => {
        console.log("Failed to update note", err)
      })
  }

  function onRemoveNote(noteId) {
    noteService
      .remove(noteId)
      .then(() => {
        setNotes((notes) => notes.filter((note) => note.id !== noteId))
      })
      .catch((err) => {
        console.log("Problems removing note:", err)
      })
  }

  function onNoteAdded(newNote) {
    if (newNote.id) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === newNote.id ? newNote : note))
      )
    } else {
      setNotes((prevNotes) => [...prevNotes, newNote])
    }
    loadNotes()
    setSelectedNote(null)
  }

  function onChangeColor(noteId, color) {
    updateNote(noteId, (note) => ({
      ...note,
      style: { ...note.style, backgroundColor: color }, // Ensure other style properties are preserved
    }))
  }

  function onTogglePin(noteId) {
    updateNote(noteId, (note) => ({ ...note, isPinned: !note.isPinned }))
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((preFilter) => ({ ...preFilter, ...filterBy }))
  }

  function onEditNote(note) {
    setSelectedNote(note)
  }

  if (!notes) return <h1>Loading...</h1>

  return (
    <section className="note-index">
      <NoteFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
      <NoteAdd selectedNote={selectedNote} onNoteAdded={onNoteAdded} />
      <NoteList
        notes={notes}
        onRemoveNote={onRemoveNote}
        onChangeColor={onChangeColor}
        onTogglePin={onTogglePin}
        onEditNote={onEditNote}
      />
    </section>
  )
}
