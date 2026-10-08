import { useRef } from 'react'
import { Link } from 'react-router-dom'

function PlaceholderCover({ icon }) {
  return (
    <div className="project-cover project-cover-placeholder">
      <span>{icon}</span>
    </div>
  )
}

export default function ProjectSlider({ icon, label, projects }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (!projects.length) {
    return (
      <div className="slider-block">
        <div className="slider-head">
          <h3 className="slider-title">
            <span className="slider-icon">{icon}</span> {label}
          </h3>
        </div>
        <p className="slider-empty">Projects coming soon.</p>
      </div>
    )
  }

  return (
    <div className="slider-block">
      <div className="slider-head">
        <h3 className="slider-title">
          <span className="slider-icon">{icon}</span> {label}
        </h3>
        <div className="slider-nav">
          <button aria-label="Scroll left" onClick={() => scrollBy(-1)}>‹</button>
          <button aria-label="Scroll right" onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>
      <div className="slider-track" ref={trackRef}>
        {projects.map((p) => (
          <Link to={`/project/${p.id}`} className="project-card" key={p.id}>
            {p.cover_image ? (
              <img className="project-cover" src={p.cover_image} alt={p.title} />
            ) : (
              <PlaceholderCover icon={icon} />
            )}
            <div className="project-card-body">
              <h4>{p.title}</h4>
              <p>{p.short_description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
