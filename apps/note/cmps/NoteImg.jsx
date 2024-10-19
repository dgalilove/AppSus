export function NoteImg({ url, onChange }) {
  return (
    <input
      type="text"
      placeholder="Image URL"
      value={url}
      onChange={(e) => onChange(e.target.value)}
      className="image-url-input"
    />
  )
}
