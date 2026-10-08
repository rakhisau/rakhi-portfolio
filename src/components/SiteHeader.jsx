import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { NAME } from '../lib/siteInfo'

export default function SiteHeader() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img src={logo} alt={`${NAME} logo`} className="brand-logo" />
          <span className="brand-name">{NAME}</span>
        </Link>
        <nav className={`site-nav ${navOpen ? 'open' : ''}`}>
          <Link to="/#about" onClick={() => setNavOpen(false)}>About</Link>
          <Link to="/#services" onClick={() => setNavOpen(false)}>Services</Link>
          <Link to="/#work" onClick={() => setNavOpen(false)}>Work</Link>
          <Link to="/#contact" onClick={() => setNavOpen(false)}>Contact</Link>
        </nav>
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
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
