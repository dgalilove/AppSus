import { eventBusService, showSuccessMsg } from "../../../services/event-bus.service.js"
const { useState, useEffect, useRef } = React

export const NoteAccordion = ({ note, setNote }) => {
  const [isOpen, setIsOpen] = useState(false)
  const accordionRef = useRef(null)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
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
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const removeListener = eventBusService.on("close-all-accordions", () => setIsOpen(false))
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      removeListener()
    }
  }, [])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    if (field === "backgroundColor") {
      setNote((prevNote) => ({
        ...prevNote,
        style: { ...prevNote.style, backgroundColor: value },
      }));
    }
  }

  return (
    <div className={`note-accordion ${isOpen ? "accordion-open" : ""}`} ref={accordionRef}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <input
          type="text"
          placeholder="New Note"
          value={note.info.title}
          onChange={handleTitleChange}
          className={`accordion-title ${isOpen ? "active" : ""}`} 
        />
      </div>
      {isOpen && (
        <div className="accordion-body">
          <textarea
            placeholder="Type note here..."
            value={note.info.txt}
            onChange={handleTextChange}
            className="accordion-text"
            rows="4"
            cols="50"
          />
          <div className="accordion-buttons">
            <input
              type="color"
              value={(note.style && note.style.backgroundColor) || "#b95e5e"}
              onChange={handleChange}
              name="backgroundColor"
              id="backgroundColor"
            />
            <button>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};
