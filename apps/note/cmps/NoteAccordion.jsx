const { useState, useEffect } = React

export const NoteAccordion = ({ note, setNote }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Only open the accordion, don't close it once it's open
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

  return (
    <div className="note-accordion">
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
            placeholder="Type your note here..."
            value={note.info.txt}
            onChange={handleTextChange}
            className="accordion-text"
          />
        </div>
      )}
    </div>
  )
}
