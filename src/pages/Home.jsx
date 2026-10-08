import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ProjectSlider from '../components/ProjectSlider'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'
import { NAME, TITLE, EMAIL, PHONE, PHONE_DIAL, WHATSAPP_LINK, SOCIALS, SERVICES, STATS, TECH } from '../lib/siteInfo'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="hero">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
          <div className="container hero-inner">
            <p className="eyebrow">Available for freelance work</p>
            <h1>
              Hi, I'm {NAME.split(' ')[0]} —<br />
              I build <span className="accent-gradient">websites, software & AI automation</span> that get results.
            </h1>
            <p className="hero-sub">{TITLE}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">Get in touch</a>
              <a className="btn btn-outline" href="#work">See my work</a>
            </div>

            <div className="hero-stats">
              {STATS.map((s) => (
                <div className="hero-stat" key={s.label}>
                  <span className="hero-stat-value">{s.value}</span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tech-strip">
          <div className="tech-marquee">
            <div className="tech-track">
              {[...TECH, ...TECH].map((t, i) => (
                <span className="tech-chip" key={`${t}-${i}`}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <Reveal>
              <h2 className="section-title">About</h2>
              <p className="about-text">
                I'm {NAME}, a {TITLE}. I help businesses go from idea to
                working product — designing and building websites and landing pages, developing
                custom software, and setting up AI automation agents and voice-calling AI agents
                fully integrated with CRMs. My focus is delivering practical solutions that save
                time, generate leads, and scale with your business.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="services" className="section section-alt">
          <div className="container">
            <Reveal>
              <h2 className="section-title">Services</h2>
            </Reveal>
            <div className="grid services-grid">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="card card-glow">
                    <span className="card-icon">{s.icon}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section">
          <div className="container">
            <Reveal>
              <h2 className="section-title">My Work</h2>
              <p className="section-sub">A look at projects across every category I work in.</p>
            </Reveal>
            {!loading && (
              <div className="sliders-stack">
                {CATEGORIES.map((c, i) => (
                  <Reveal key={c.key} delay={i * 60}>
                    <ProjectSlider
                      icon={c.icon}
                      label={c.label}
                      projects={projects.filter((p) => p.category === c.key)}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="section section-alt">
          <div className="container contact-inner">
            <Reveal>
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
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
