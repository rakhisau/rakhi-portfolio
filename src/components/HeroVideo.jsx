import { useRef, useState } from 'react'

function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : null
}

function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

// Muted autoplay with every bit of YouTube chrome switched off. Browsers
// only allow autoplay when muted, so sound is a tap away instead.
function YouTubeAutoplay({ id, name }) {
  const frame = useRef(null)
  const [muted, setMuted] = useState(true)

  const toggleSound = () => {
    const func = muted ? 'unMute' : 'mute'
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      'https://www.youtube-nocookie.com'
    )
    setMuted(!muted)
  }

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id, // required for loop to work on a single video
    controls: '0',
    disablekb: '1',
    fs: '0',
    rel: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
    playsinline: '1',
    enablejsapi: '1',
  })

  return (
    <div className="hero-video">
      <div className="hero-video-frame hero-video-yt">
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={`${name} intro video`}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
        {/* Sits over the player so hovering never wakes YouTube's own UI. */}
        <button
          type="button"
          className="hero-video-shield"
          onClick={toggleSound}
          aria-label={muted ? 'Turn sound on' : 'Mute video'}
        >
          <span className="hero-video-sound">{muted ? '🔇 Tap for sound' : '🔊 Sound on'}</span>
        </button>
      </div>
    </div>
  )
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
  if (yt) return <YouTubeAutoplay id={yt} name={name} />

  const vimeo = vimeoId(src)

  // Vimeo stays as a lightweight thumbnail until clicked, so the hero
  // doesn't pay for a player iframe on first load.
  if (vimeo && !playing) {
    return (
      <div className="hero-video">
        <button
          className="hero-video-frame hero-video-facade"
          onClick={() => setPlaying(true)}
          aria-label={`Play intro video from ${name}`}
          style={poster ? { backgroundImage: `url(${poster})` } : undefined}
        >
          <span className="hero-video-play"><span /></span>
          <span className="hero-video-label">Watch my 60-second intro</span>
        </button>
      </div>
    )
  }

  if (vimeo) {
    return (
      <div className="hero-video">
        <div className="hero-video-frame">
          <iframe
            src={`https://player.vimeo.com/video/${vimeo}?autoplay=1`}
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
