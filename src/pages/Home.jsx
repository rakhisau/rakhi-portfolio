import { Suspense, lazy, useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ProjectSlider from '../components/ProjectSlider'
import Reveal from '../components/Reveal'
import MaskedText from '../components/MaskedText'
import ScrollProgress from '../components/ScrollProgress'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useDeviceTier } from '../hooks/useDeviceTier'
import {
  NAME, TITLE, EMAIL, PHONE, PHONE_DIAL, WHATSAPP_LINK,
  SOCIALS, SERVICES, STATS, TECH,
} from '../lib/siteInfo'

const Scene3D = lazy(() => import('../three/Scene3D'))

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { progressRef, progress } = useScrollProgress()
  const tier = useDeviceTier()

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
    <div className="world">
      <div className="scene-layer">
        <Suspense fallback={null}>
          <Scene3D progressRef={progressRef} tier={tier} />
        </Suspense>
      </div>

      <ScrollProgress progress={progress} />
      <SiteHeader />

      <main id="top" className="chapters">
        {/* ---------- Chapter 1 ---------- */}
        <section className="chapter chapter-hero">
          <div className="container">
            <div className="glass-panel hero-panel">
              <p className="eyebrow">01 — Available for freelance work</p>
              <MaskedText as="h1" text={`Hi, I'm ${NAME.split(' ')[0]}.`} className="hero-line" />
              <MaskedText
                as="h1"
                text="I build websites, software & AI agents."
                className="hero-line hero-line-accent"
                delay={220}
              />
              <p className="hero-sub">{TITLE}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#contact">Start a project</a>
                <a className="btn btn-outline" href="#work">Explore the work</a>
              </div>
            </div>

            <div className="hero-stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={300 + i * 90}>
                  <div className="hero-stat">
                    <span className="hero-stat-value">{s.value}</span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="scroll-cue"><span /></div>
        </section>

        {/* ---------- Chapter 2 ---------- */}
        <section id="about" className="chapter">
          <div className="container">
            <div className="glass-panel narrow-panel">
              <p className="eyebrow">02 — About</p>
              <MaskedText as="h2" text="Built to work, not just to look good." className="chapter-title" />
              <p className="chapter-body">
                I'm {NAME}, a {TITLE}. I help businesses go from idea to working product —
                designing and building websites and landing pages, developing custom software,
                and deploying AI automation agents and voice-calling agents wired directly into
                your CRM. Every build is measured by one thing: does it save time or make money.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Chapter 3 ---------- */}
        <section id="services" className="chapter">
          <div className="container">
            <div className="chapter-head">
              <p className="eyebrow">03 — Services</p>
              <MaskedText as="h2" text="Five ways I can help you." className="chapter-title" />
            </div>
            <div className="grid services-grid">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="glass-panel card card-glow">
                    <span className="card-icon">{s.icon}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Chapter 4 ---------- */}
        <section id="work" className="chapter">
          <div className="container">
            <div className="chapter-head">
              <p className="eyebrow">04 — Work</p>
              <MaskedText as="h2" text="Projects across every category." className="chapter-title" />
            </div>
            {!loading && (
              <div className="sliders-stack">
                {CATEGORIES.map((c, i) => (
                  <Reveal key={c.key} delay={i * 70}>
                    <div className="glass-panel slider-panel">
                      <ProjectSlider
                        icon={c.icon}
                        label={c.label}
                        projects={projects.filter((p) => p.category === c.key)}
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------- Tech strip ---------- */}
        <section className="tech-strip">
          <div className="tech-marquee">
            <div className="tech-track">
              {[...TECH, ...TECH].map((t, i) => (
                <span className="tech-chip" key={`${t}-${i}`}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Chapter 5 ---------- */}
        <section id="contact" className="chapter chapter-contact">
          <div className="container">
            <div className="glass-panel narrow-panel contact-inner">
              <p className="eyebrow">05 — Contact</p>
              <MaskedText as="h2" text="Let's build something that works." className="chapter-title" />
              <p className="chapter-body">
                Tell me what you need and I'll come back with a plan, a timeline, and a price.
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
