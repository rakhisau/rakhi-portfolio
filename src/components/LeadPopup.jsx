import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const SHOW_DELAY_MS = 6000
const SESSION_FLAG = 'leadPopupSeen'

export default function LeadPopup() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [projectNeed, setProjectNeed] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG)) return
    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_FLAG, '1')
      setOpen(true)
    }, SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const close = () => setOpen(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await supabase.from('leads').insert({ name, phone, project_need: projectNeed })

      if (WEB3FORMS_KEY) {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: 'New lead from portfolio site',
            from_name: 'Rakhi Sau Portfolio',
            name,
            phone,
            project_need: projectNeed,
          }),
        })
      }

      setDone(true)
      setTimeout(() => setOpen(false), 3000)
    } catch (err) {
      setError('Something went wrong. Please try again or reach out directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="lead-popup-overlay" onClick={close}>
      <div className="lead-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="lead-popup-close" aria-label="Close" onClick={close}>×</button>

        {done ? (
          <div className="lead-popup-thanks">
            <span className="lead-popup-thanks-icon">✅</span>
            <h3>Thanks, {name.split(' ')[0] || 'there'}!</h3>
            <p>I'll get back to you shortly.</p>
          </div>
        ) : (
          <>
            <p className="eyebrow">Free Consultation</p>
            <h3 className="lead-popup-title">Have a project in mind?</h3>
            <p className="lead-popup-sub">
              Share a few details and I'll reach out to discuss how I can help.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <textarea
                rows={3}
                placeholder="What do you need built? (website, automation, etc.)"
                value={projectNeed}
                onChange={(e) => setProjectNeed(e.target.value)}
              />
              {error && <p className="admin-error">{error}</p>}
              <button className="btn btn-primary lead-popup-submit" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Get in touch'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
