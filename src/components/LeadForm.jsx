import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const PROJECT_TYPES = [...CATEGORIES.map((c) => c.label), 'Other']

export default function LeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [projectType, setProjectType] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // The leads table has a single free-text column for the request,
    // so the project type leads it.
    const projectNeed = note.trim() ? `${projectType}\n${note.trim()}` : projectType

    try {
      const { error: dbError } = await supabase.from('leads').insert({ name, phone, project_need: projectNeed })
      if (dbError) throw dbError

      // The lead is already saved, so a failed email alert shouldn't
      // tell the visitor their message was lost.
      if (WEB3FORMS_KEY) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New ${projectType} lead from portfolio site`,
            from_name: 'Rakhi Sau Portfolio',
            name,
            phone,
            project_type: projectType,
            note,
          }),
        }).catch(() => {})
      }

      setDone(true)
    } catch {
      setError('Something went wrong. Please try again or reach out on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="lead-form-thanks">
        <span className="lead-form-thanks-icon">✅</span>
        <h3>Thanks, {name.split(' ')[0] || 'there'}!</h3>
        <p>I'll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          placeholder="Your name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Phone / WhatsApp
        <input
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>
      <label className="lead-form-wide">
        Project type
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)} required>
          <option value="" disabled>Choose one…</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="lead-form-wide">
        Note
        <textarea
          rows={3}
          placeholder="A few words about what you need built"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {error && <p className="admin-error lead-form-wide">{error}</p>}
      <button className="btn btn-primary lead-form-wide" type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Get a free consultation'}
      </button>
    </form>
  )
}
