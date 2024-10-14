import { eventBusService , showSuccessMsg} from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React


export const NoteAccordion = ({ note, setNote }) => {
  const [isOpen, setIsOpen] = useState(false)
  const accordionRef = useRef(null)

  const toggleAccordion = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleTitleChange = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, title: event.target.value },
    }))
    showSuccessMsg("Title updated successfully!") 
  }

  const handleTextChange = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, txt: event.target.value },
    }))
    showSuccessMsg("Text updated successfully!")
  }

  const handleClickOutside = (event) => {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const removeListener = eventBusService.on("close-all-accordions", () => setIsOpen(false))
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      removeListener()
    }
  }, [])
  

  return (
    <div className="note-accordion" ref={accordionRef}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <input
          type="text"
          placeholder="Title"
          value={note.info.title}
          onChange={handleTitleChange}
          className="accordion-title"
        />
      </div>
      {isOpen && (
        <div className="accordion-body">
          <textarea
            placeholder="Type note here..."
            value={note.info.txt}
            onChange={handleTextChange}
            className="accordion-text"
          />
        <button>Save</button>
        </div>
      )}
    </div>
  )
}
