export function NoteVideo({ url, onChange }) {
  function extractYouTubeID(url) {
    if (!url) return null 
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/embed\/|v\/)|youtu\.be\/)([^&\n?%#]+)/
    const match = url.match(regExp)
    return match ? match[1] : null 
  }

  const videoID = extractYouTubeID(url)

  return (
    <div className="note-video">
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={url || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {videoID ? (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoID}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        url && <p>Invalid YouTube URL </p> 
      )}
    </div>
  )
}
