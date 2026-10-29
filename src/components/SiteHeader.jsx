import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { NAME } from '../lib/siteInfo'

const LINKS = [
  { href: '/#about', id: 'about', label: 'About' },
  { href: '/#services', id: 'services', label: 'Services' },
  { href: '/#work', id: 'work', label: 'Work' },
  { href: '/#contact', id: 'contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [navOpen, setNavOpen] = useState(false)
  const [active, setActive] = useState('')

  // highlight the nav item for the section currently on screen
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-logo-ring">
            <img src={logo} alt={`${NAME} logo`} className="brand-logo" />
          </span>
          <span className="brand-text">
            <span className="brand-name">{NAME}</span>
            <span className="brand-role">Developer &amp; AI Automation</span>
          </span>
        </Link>

        <nav className={`site-nav ${navOpen ? 'open' : ''}`}>
          <div className="nav-pill">
            {LINKS.map((l) => (
              <Link
                key={l.id}
                to={l.href}
                className={active === l.id ? 'is-active' : ''}
                onClick={() => setNavOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link to="/#enquire" className="header-cta" onClick={() => setNavOpen(false)}>
            Start a project
          </Link>
        </nav>

        <button
          className={`nav-toggle ${navOpen ? 'is-open' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
