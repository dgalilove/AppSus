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
    const applyFilters = (note) => {
      const titleMatch = filterBy.title ? new RegExp(filterBy.title, "i").test(note.info.title || "") : true
      const txtMatch = filterBy.title ? new RegExp(filterBy.title, "i").test(note.info.txt || "") : true
      const todosMatch = filterBy.title && note.info.todos
        ? note.info.todos.some((todo) => new RegExp(filterBy.title, "i").test(todo.txt || ""))
        : false

      const matchesTitleOrText = titleMatch || txtMatch || todosMatch

      const matchesType = filterBy.type ? note.type === mapFilterType(filterBy.type) : true

      return matchesTitleOrText && matchesType
    }

    return notes.filter(applyFilters)
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
    return storageService.put(NOTE_KEY, note).then(() => note)
  } else {
    return storageService.post(NOTE_KEY, note).then(() => note)
  }
}

function createEmptyNote() {
  return {
    id: "",
    createdAt: Date.now(),
    type: "NoteTxt",
    isPinned: false,
    style: {
      backgroundColor: "rgb(33, 33, 33)",
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
          backgroundColor: "#212121",
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
          url: "https://images3.alphacoders.com/134/1347649.jpeg",
          title: "Bobi and Me",
        },
        style: {
          backgroundColor: "#212121",
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
        style: {
          backgroundColor: "#212121",
        },
        
      },
      {
        id: "n104",
        createdAt: 1112255,
        type: "NoteTxt",
        isPinned: true,
        style: {
          backgroundColor: "#212121",
        },
        info: {
          txt: "Learn React Hooks",
        },
      },
      {
        id: "n105",
        createdAt: 1112266,
        type: "NoteImg",
        isPinned: false,
        info: {
          url: "https://images.unsplash.com/photo-1542080255-e564af7ae266?q=80&w=2719&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
,
          title: "Beautiful Sunset",
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n106",
        createdAt: 1112277,
        type: "NoteTodos",
        isPinned: true,
        info: {
          title: "Project Tasks",
          todos: [
            { txt: "Finish UI", doneAt: null },
            { txt: "API Integration", doneAt: 187111111 },
          ],
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n107",
        createdAt: 1112288,
        type: "NoteTxt",
        isPinned: false,
        style: {
          backgroundColor: "#212121",
        },
        info: {
          txt: "Meeting with client at 2 PM.",
        },
      },
      {
        id: "n108",
        createdAt: 1112299,
        type: "NoteImg",
        isPinned: false,
        info: {
          url: "https://images.unsplash.com/photo-1541848952518-f6c52dbc7c94?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          title: "Mountain Landscape",
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n109",
        createdAt: 1112300,
        type: "NoteTodos",
        isPinned: true,
        info: {
          title: "Groceries",
          todos: [
            { txt: "Buy milk", doneAt: null },
            { txt: "Get bread", doneAt: null },
            { txt: "Buy eggs", doneAt: 187111222 },
          ],
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n110",
        createdAt: 1112311,
        type: "NoteTxt",
        isPinned: false,
        style: {
          backgroundColor: "#212121",
        },
        info: {
          txt: "Read JavaScript Patterns book.",
        },
      },
      {
        id: "n111",
        createdAt: 1112322,
        type: "NoteImg",
        isPinned: true,
        info: {
          url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          title: "Ocean Wave",
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n112",
        createdAt: 1112333,
        type: "NoteTodos",
        isPinned: false,
        info: {
          title: "Weekend Tasks",
          todos: [
            { txt: "Clean the house", doneAt: null },
            { txt: "Wash the car", doneAt: null },
            { txt: "Prepare dinner", doneAt: null },
          ],
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n113",
        createdAt: 1112344,
        type: "NoteTxt",
        isPinned: false,
        style: {
          backgroundColor: "#212121",
        },
        info: {
          txt: "Prepare for presentation.",
        },
      },
      {
        id: "n114",
        createdAt: 1112355,
        type: "NoteImg",
        isPinned: false,
        info: {
          url: "https://images3.alphacoders.com/128/1287397.jpeg",
          title: "City Lights",
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n115",
        createdAt: 1112366,
        type: "NoteTodos",
        isPinned: true,
        info: {
          title: "Travel Plans",
          todos: [
            { txt: "Book flights", doneAt: null },
            { txt: "Reserve hotel", doneAt: null },
          ],
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n116",
        createdAt: 1112377,
        type: "NoteTxt",
        isPinned: true,
        style: {
          backgroundColor: "#212121",
        },
        info: {
          txt: "Learn GraphQL and Apollo.",
        },
      },
      {
        id: "n117",
        createdAt: 1112388,
        type: "NoteImg",
        isPinned: false,
        info: {
          url: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          title: "Forest Path",
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n118",
        createdAt: 1112399,
        type: "NoteTodos",
        isPinned: false,
        info: {
          title: "Fitness Goals",
          todos: [
            { txt: "Go for a run", doneAt: null },
            { txt: "Do 20 push-ups", doneAt: null },
            { txt: "Drink more water", doneAt: null },
          ],
        },
        style: {
          backgroundColor: "#212121",
        },
      },
      {
        id: "n119",
        createdAt: 1112400,
        type: "NoteTxt",
        isPinned: false,
        style: {
          backgroundColor: "#212121",
        },
        info: {
          txt: "Complete React course by end of the week.",
        },
      },
      {
        id: "n120",
        createdAt: 1112411,
        type: "NoteImg",
        isPinned: true,
        info: {
          url: "https://images2.alphacoders.com/128/1287207.jpeg",
          title: "Starry Sky",
        },
        style: {
          backgroundColor: "#212121",
        },
      },
    ]
    
    
    saveToStorage(NOTE_KEY, notes)
  }
}


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
