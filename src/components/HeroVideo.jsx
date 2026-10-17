import { useState } from 'react'

function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : null
}

function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

export default function HeroVideo({ src, poster, name }) {
  const [playing, setPlaying] = useState(false)

  // Placeholder until the intro video is recorded.
  if (!src) {
    return (
      <div className="hero-video">
        <div className="hero-video-frame hero-video-empty">
          <span className="hero-video-play"><span /></span>
          <span className="hero-video-label">Intro video coming soon</span>
        </div>
      </div>
    )
  }

  const yt = youtubeId(src)
  const vimeo = vimeoId(src)
  const embedded = yt || vimeo
  const thumb = poster || (yt ? `https://img.youtube.com/vi/${yt}/maxresdefault.jpg` : '')

  // Embeds stay as a lightweight thumbnail until clicked, so the hero
  // doesn't pay for a player iframe on first load.
  if (embedded && !playing) {
    return (
      <div className="hero-video">
        <button
          className="hero-video-frame hero-video-facade"
          onClick={() => setPlaying(true)}
          aria-label={`Play intro video from ${name}`}
          style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
        >
          <span className="hero-video-play"><span /></span>
          <span className="hero-video-label">Watch my 60-second intro</span>
        </button>
      </div>
    )
  }

  if (embedded) {
    const url = yt
      ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`
      : `https://player.vimeo.com/video/${vimeo}?autoplay=1`
    return (
      <div className="hero-video">
        <div className="hero-video-frame">
          <iframe
            src={url}
            title={`${name} intro video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  return (
    <div className="hero-video">
      <div className="hero-video-frame">
        <video controls playsInline preload="metadata" poster={poster || undefined}>
          <source src={src} />
        </video>
      </div>
    </div>
  )
}
