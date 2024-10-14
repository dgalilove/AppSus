// note service

import { storageService } from "../../../services/async-storage.service.js"
import {
  saveToStorage,
  loadFromStorage,
} from "../../../services/storage.service.js"

const NOTE_KEY = "noteDB"
_createNotes()

export const noteService = {
  query,
  get,
  remove,
  save,
  createEmptyNote,
  getDefaultFilter,
  getFilterFromSearchParams,
}

function query(filterBy = {}) {
  return storageService.query(NOTE_KEY).then((notes) => {
    if (filterBy.title) {
      const regExp = new RegExp(filterBy.title, "i")

      notes = notes.filter((note) => {
        const titleMatch = regExp.test(note.info.title || "")
        const txtMatch = regExp.test(note.info.txt || "")
        const todosMatch = note.info.todos
          ? note.info.todos.some((todo) => regExp.test(todo.txt || ""))
          : false

        return titleMatch || txtMatch || todosMatch
      })
    }
    return notes
  })
}

function get(noteId) {
  return storageService
    .get(NOTE_KEY, noteId)
    .then((note) => _setNextPrevNoteId(note))
}

function remove(noteId) {
  return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
  if (note.id) {
    return storageService.put(NOTE_KEY, note)
  } else {
    return storageService.post(NOTE_KEY, note)
  }
}
function createEmptyNote() {
  return {
      id: "",
      createdAt: Date.now(),
      type: "NoteTxt",
      isPinned: false,
      style: {
          backgroundColor: "#ffffff", 
      },
      info: {
          title: "",
          txt: "",
      },
  }
}



function getDefaultFilter() {
  return {
    title: "",
    txt: "",
  }
}

function _createNotes() {
  let notes = loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    const notes = [
      {
        id: "n101",
        createdAt: 1112222,
        type: "NoteTxt",
        isPinned: true,
        style: {
          backgroundColor: "#00d",
        },
        info: {
          txt: "Fullstack Me Baby!",
        },
      },
      {
        id: "n102",
        createdAt: 1112223,
        type: "NoteImg",
        isPinned: false,
        info: {
          url: "https://www.deviantart.com/daemonstar/art/Kindred-Fanart-561181954",
          title: "Bobi and Me",
        },
        style: {
          backgroundColor: "#00d",
        },
      },
      {
        id: "n103",
        createdAt: 1112224,
        type: "NoteTodos",
        isPinned: false,
        info: {
          title: "Get my stuff together",
          todos: [
            { txt: "Driving license", doneAt: null },
            { txt: "Coding power", doneAt: 187111111 },
          ],
        },
      },
    ]
    saveToStorage(NOTE_KEY, notes)
  }
}

// function _createNote(title, txt) {
//   const note = getEmptyNote(title, txt)
//   note.id = utilService.makeId()
//   return note
// }

function getFilterFromSearchParams(searchParams) {
  const title = searchParams.get("title") || ""
  const txt = searchParams.get("txt") || ""
  return {
    title,
    txt,
  }
}

function _setNextPrevNoteId(note) {
  return query().then((notes) => {
    const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
    const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
    const prevNote = notes[noteIdx - 1]
      ? notes[noteIdx - 1]
      : notes[notes.length - 1]
    note.nextNoteId = nextNote.id
    note.prevNoteId = prevNote.id
    return note
  })
}
