interface YouTubeProps {
  id: string
  title?: string
}

export default function YouTube({ id, title = 'YouTube video' }: YouTubeProps) {
  return (
    <div className="media-breakout relative my-6 overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute left-0 top-0 h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
