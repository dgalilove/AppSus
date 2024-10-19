export function NoteTxt({ text, onChange }) {
  return (
    <textarea
      placeholder="Type note here..."
      value={text}
      onChange={(e) => onChange(e.target.value)}
      className="accordion-text"
      rows="4"
      cols="54"
    />
  )
}
