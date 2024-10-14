const { useState, useEffect , useRef } = React



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
  }

  const handleTextChange = (event) => {
    setNote((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, txt: event.target.value },
    }))
  }

  const handleClickOutside = (event) => {
    if (accordionRef.current && !accordionRef.current.contains(event.target)) {
      setIsOpen(false) 
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
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
        </div>
      )}
    </div>
  )
}
