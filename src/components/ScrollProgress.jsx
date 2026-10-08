const CHAPTERS = ['Arrival', 'About', 'Services', 'Work', 'Contact']

export default function ScrollProgress({ progress }) {
  const percent = Math.round(progress * 100)
  const index = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length))

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      <div className="scroll-progress-meta">
        <span className="scroll-chapter">
          {String(index + 1).padStart(2, '0')} — {CHAPTERS[index]}
        </span>
        <span className="scroll-percent">{percent}%</span>
      </div>
    </div>
  )
}
