import { useState } from 'react'
import logo from './assets/logo.jpg'

const NAME = 'Rakhi Sau'
const TITLE = 'Full-Stack Developer & AI Automation Specialist'
const EMAIL = 'rakhisau30@gmail.com'
const PHONE = '+91 8967060021'
const PHONE_DIAL = '+918967060021'
const WHATSAPP_LINK = `https://wa.me/918967060021`

const SERVICES = [
  {
    icon: '🌐',
    title: 'Websites',
    desc: 'Custom business, portfolio, and e-commerce websites built to be fast, responsive, and easy to manage.',
  },
  {
    icon: '🚀',
    title: 'Landing Pages',
    desc: 'High-converting landing pages for product launches, campaigns, and lead generation.',
  },
  {
    icon: '🛠️',
    title: 'Custom Software',
    desc: 'End-to-end software solutions tailored to specific business workflows and requirements.',
  },
  {
    icon: '🤖',
    title: 'AI Automation Agents',
    desc: 'Automation agents that handle repetitive workflows, data processing, and integrations between your tools.',
  },
  {
    icon: '📞',
    title: 'AI Voice Calling Agents',
    desc: 'Voice call agents with full telephony setup, integrated directly with your CRM for seamless lead handling.',
  },
]

const WORK = [
  { icon: '🌐', category: 'Websites', count: '7-8', note: 'Business, portfolio & e-commerce sites delivered end-to-end.' },
  { icon: '🚀', category: 'Landing Pages', count: '3-4', note: 'Conversion-focused pages for campaigns and product launches.' },
  { icon: '🛠️', category: 'Custom Software', count: '2', note: 'Purpose-built software solving specific business problems.' },
  { icon: '🤖', category: 'Automation Agents', count: '4-5', note: 'AI-driven agents automating repetitive business workflows.' },
  { icon: '📞', category: 'Voice Calling Agent + CRM', count: '1', note: 'Full-stack AI voice agent with telephony and CRM integration.' },
]

const SOCIALS = [
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Upwork', href: '#' },
  { label: 'Fiverr', href: '#' },
]

function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand">
            <img src={logo} alt={`${NAME} logo`} className="brand-logo" />
            <span className="brand-name">{NAME}</span>
          </a>
          <nav className={`site-nav ${navOpen ? 'open' : ''}`}>
            <a href="#about" onClick={() => setNavOpen(false)}>About</a>
            <a href="#services" onClick={() => setNavOpen(false)}>Services</a>
            <a href="#work" onClick={() => setNavOpen(false)}>Work</a>
            <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
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

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <p className="eyebrow">Available for freelance work</p>
            <h1>
              Hi, I'm {NAME.split(' ')[0]} —<br />
              I build <span className="accent">websites, software & AI automation</span> that get results.
            </h1>
            <p className="hero-sub">{TITLE}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">Get in touch</a>
              <a className="btn btn-outline" href="#work">See my work</a>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">About</h2>
            <p className="about-text">
              I'm {NAME}, a {TITLE}. I help businesses go from idea to
              working product — designing and building websites and landing pages, developing
              custom software, and setting up AI automation agents and voice-calling AI agents
              fully integrated with CRMs. My focus is delivering practical solutions that save
              time, generate leads, and scale with your business.
            </p>
          </div>
        </section>

        <section id="services" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Services</h2>
            <div className="grid services-grid">
              {SERVICES.map((s) => (
                <div className="card" key={s.title}>
                  <span className="card-icon">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section">
          <div className="container">
            <h2 className="section-title">My Work</h2>
            <p className="section-sub">A snapshot of what I've delivered so far.</p>
            <div className="grid work-grid">
              {WORK.map((w) => (
                <div className="card work-card" key={w.category}>
                  <span className="card-icon">{w.icon}</span>
                  <span className="work-count">{w.count}</span>
                  <h3>{w.category}</h3>
                  <p>{w.note}</p>
                </div>
              ))}
            </div>
            <p className="work-note">
              Project details, links, and case studies coming soon — reach out for references
              and examples of past work.
            </p>
          </div>
        </section>

        <section id="contact" className="section section-alt">
          <div className="container contact-inner">
            <h2 className="section-title">Let's Work Together</h2>
            <p className="section-sub">
              Have a project in mind? Reach out and let's talk about how I can help.
            </p>
            <div className="contact-links">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>Email me</a>
              <a className="btn btn-outline" href={`tel:${PHONE_DIAL}`}>Call</a>
              <a className="btn btn-outline" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
            <div className="contact-details">
              <p>{EMAIL}</p>
              <p>{PHONE}</p>
            </div>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} className="social-link">{s.label}</a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} {NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default App
