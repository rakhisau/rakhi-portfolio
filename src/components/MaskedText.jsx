import { useEffect, useRef, useState } from 'react'

// Words rise out from behind a clipping mask, staggered — the effect
// that gives Kage its "expensive" feel.
export default function MaskedText({ text, as: Tag = 'h2', className = '', stagger = 55, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <Tag ref={ref} className={`masked-text ${visible ? 'is-visible' : ''} ${className}`}>
      {words.map((word, i) => (
        <span className="mask-line" key={`${word}-${i}`}>
          <span
            className="mask-word"
            style={{
              transitionDelay: `${delay + i * stagger}ms`,
              // Spread one continuous gradient across all the words
              // (only visible on lines that opt into a gradient fill).
              backgroundSize: `${words.length * 100}% 100%`,
              backgroundPosition: `${words.length > 1 ? (i / (words.length - 1)) * 100 : 0}% 0`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}
