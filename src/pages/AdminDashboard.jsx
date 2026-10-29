import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'
import { compressImage, formatBytes } from '../lib/compressImage'

const BUCKET = 'project-images'

const EMPTY_FORM = {
  id: null,
  category: CATEGORIES[0].key,
  title: '',
  short_description: '',
  description: '',
  tech_stack: '',
  live_link: '',
  cover_image: '',
}

async function uploadFile(file, folder) {
  const optimised = await compressImage(file)
  const ext = optimised.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, optimised)
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Best-effort cleanup of an uploaded file once nothing points at it.
async function removeStoredFile(url) {
  const marker = `/${BUCKET}/`
  const i = url ? url.indexOf(marker) : -1
  if (i === -1) return
  await supabase.storage.from(BUCKET).remove([decodeURIComponent(url.slice(i + marker.length))])
}

// Row-level security doesn't error on a blocked delete, it just deletes
// nothing, so ask for the deleted rows back and check there was one.
async function deleteRow(table, id) {
  const { data, error } = await supabase.from(table).delete().eq('id', id).select('id')
  if (error) return error.message
  if (!data?.length) return 'Nothing was deleted — check the Supabase delete policy for this table.'
  return null
}

// Shows what compression will do before anything is uploaded.
async function describeSavings(files) {
  if (!files.length) return null
  const before = files.reduce((n, f) => n + f.size, 0)
  const after = (await Promise.all(files.map(compressImage))).reduce((n, f) => n + f.size, 0)
  return {
    count: files.length,
    before,
    after,
    saved: before > 0 ? Math.round((1 - after / before) * 100) : 0,
  }
}

function FilePreview({ file, onRemove, label = 'Remove', className = 'admin-existing-image' }) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    const u = URL.createObjectURL(file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  return (
    <div className={className}>
      {url && <img src={url} alt="" />}
      <button type="button" onClick={onRemove}>{label}</button>
    </div>
  )
}

export default function AdminDashboard() {
  const [session, setSession] = useState(undefined)
  const [projects, setProjects] = useState([])
  const [leads, setLeads] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [originalCover, setOriginalCover] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [extraFiles, setExtraFiles] = useState([])
  const [savings, setSavings] = useState(null)
  const [existingImages, setExistingImages] = useState([])
  const [inputKey, setInputKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === undefined) return
    if (session === null) {
      navigate('/admin/login')
      return
    }
    loadProjects()
    loadLeads()
  }, [session])

  // Re-estimate whenever the picked files change, covering cover and
  // screenshots together so one doesn't overwrite the other's note.
  useEffect(() => {
    const files = [coverFile, ...extraFiles].filter((f) => f && f.type.startsWith('image/'))
    if (!files.length) {
      setSavings(null)
      return
    }
    let cancelled = false
    setSavings('working')
    describeSavings(files).then((s) => {
      if (!cancelled) setSavings(s)
    })
    return () => {
      cancelled = true
    }
  }, [coverFile, extraFiles])

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
  }

  const loadLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data || [])
  }

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return
    const problem = await deleteRow('leads', id)
    if (problem) {
      window.alert(`Couldn't delete the lead: ${problem}`)
      return
    }
    loadLeads()
  }

  const loadExistingImages = async (projectId) => {
    const { data } = await supabase.from('project_images').select('*').eq('project_id', projectId).order('sort_order')
    setExistingImages(data || [])
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setOriginalCover('')
    setCoverFile(null)
    setExtraFiles([])
    setExistingImages([])
    setInputKey((k) => k + 1)
    setError('')
  }

  const startEdit = (p) => {
    setForm({
      id: p.id,
      category: p.category,
      title: p.title,
      short_description: p.short_description || '',
      description: p.description || '',
      tech_stack: p.tech_stack || '',
      live_link: p.live_link || '',
      cover_image: p.cover_image || '',
    })
    setOriginalCover(p.cover_image || '')
    setCoverFile(null)
    setExtraFiles([])
    setInputKey((k) => k + 1)
    setError('')
    loadExistingImages(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    const problem = await deleteRow('projects', id)
    if (problem) {
      window.alert(`Couldn't delete the project: ${problem}`)
      return
    }
    loadProjects()
    if (form.id === id) resetForm()
  }

  const handleDeleteImage = async (img) => {
    if (!window.confirm('Remove this screenshot?')) return
    setError('')
    const problem = await deleteRow('project_images', img.id)
    if (problem) {
      setError(`Couldn't remove the screenshot: ${problem}`)
      return
    }
    setExistingImages((imgs) => imgs.filter((i) => i.id !== img.id))
    removeStoredFile(img.image_url)
  }

  const removeCover = () => {
    setCoverFile(null)
    setForm({ ...form, cover_image: '' })
    setInputKey((k) => k + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      let coverUrl = form.cover_image
      if (coverFile) {
        coverUrl = await uploadFile(coverFile, form.category)
      }

      const payload = {
        category: form.category,
        title: form.title,
        short_description: form.short_description,
        description: form.description,
        tech_stack: form.tech_stack,
        live_link: form.live_link,
        cover_image: coverUrl || null,
      }

      let projectId = form.id
      if (projectId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', projectId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('projects').insert(payload).select().single()
        if (error) throw error
        projectId = data.id
      }

      if (originalCover && originalCover !== coverUrl) removeStoredFile(originalCover)

      if (extraFiles.length) {
        const start = existingImages.reduce((n, img) => Math.max(n, (img.sort_order ?? -1) + 1), 0)
        const urls = await Promise.all(extraFiles.map((f) => uploadFile(f, form.category)))
        const rows = urls.map((url, i) => ({ project_id: projectId, image_url: url, sort_order: start + i }))
        const { error } = await supabase.from('project_images').insert(rows)
        if (error) throw error
      }

      await loadProjects()
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (!session) return null

  return (
    <main className="admin-dashboard">
      <div className="container">
        <div className="admin-header-row">
          <h1>Manage Projects</h1>
          <button className="btn btn-outline" onClick={handleLogout}>Log out</button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{form.id ? 'Edit project' : 'Add new project'}</h2>

          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </label>

          <label>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label>
            Short description (shown on the card/slider)
            <input
              type="text"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </label>

          <label>
            Full description (shown on the project detail page)
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label>
            Tech stack / tools used
            <input
              type="text"
              placeholder="e.g. React, Node.js, Supabase, n8n"
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            />
          </label>

          <label>
            Live link
            <input
              type="url"
              placeholder="https://..."
              value={form.live_link}
              onChange={(e) => setForm({ ...form, live_link: e.target.value })}
            />
          </label>

          <label>
            Cover image {form.cover_image && !coverFile && '(already set — choose a file to replace)'}
            <input
              key={`cover-${inputKey}`}
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0] || null)}
            />
          </label>
          {coverFile ? (
            <FilePreview file={coverFile} onRemove={removeCover} className="admin-existing-image admin-cover" />
          ) : form.cover_image ? (
            <div className="admin-existing-image admin-cover">
              <img src={form.cover_image} alt="Current cover" />
              <button type="button" onClick={removeCover}>Remove cover</button>
            </div>
          ) : null}
          {originalCover && !form.cover_image && !coverFile && (
            <p className="admin-note">The cover will be removed when you save.</p>
          )}

          <label>
            Additional screenshots
            <input
              key={`extra-${inputKey}`}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setExtraFiles([...extraFiles, ...Array.from(e.target.files)])}
            />
          </label>

          {(existingImages.length > 0 || extraFiles.length > 0) && (
            <div className="admin-existing-images">
              {existingImages.map((img) => (
                <div className="admin-existing-image" key={img.id}>
                  <img src={img.image_url} alt="" />
                  <button type="button" onClick={() => handleDeleteImage(img)}>Remove</button>
                </div>
              ))}
              {extraFiles.map((f, i) => (
                <FilePreview
                  key={`${f.name}-${f.lastModified}-${i}`}
                  file={f}
                  onRemove={() => setExtraFiles(extraFiles.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          )}

          {savings === 'working' && <p className="admin-note">Checking images…</p>}
          {savings && savings !== 'working' && (
            <p className="admin-note admin-note-good">
              {savings.count} new image{savings.count > 1 ? 's' : ''} will be resized to 1600px wide
              and converted to WebP — {formatBytes(savings.before)} → {formatBytes(savings.after)}
              {savings.saved > 0 && ` (${savings.saved}% smaller)`}
            </p>
          )}

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add project'}
            </button>
            {form.id && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-list">
          <h2>All projects</h2>
          {projects.length === 0 && <p>No projects yet — add your first one above.</p>}
          {projects.map((p) => (
            <div className="admin-list-row" key={p.id}>
              {p.cover_image && <img src={p.cover_image} alt="" />}
              <div className="admin-list-info">
                <span className="admin-list-category">{p.category}</span>
                <h3>{p.title}</h3>
              </div>
              <div className="admin-list-actions">
                <button className="btn btn-outline" onClick={() => startEdit(p)}>Edit</button>
                <button className="btn btn-outline admin-delete" onClick={() => handleDeleteProject(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-list">
          <h2>Leads ({leads.length})</h2>
          {leads.length === 0 && <p>No leads yet — they'll appear here when visitors submit the enquiry form.</p>}
          {leads.map((l) => (
            <div className="admin-leads-row" key={l.id}>
              <div className="admin-list-info">
                <h3>{l.name}</h3>
                <div className="admin-leads-meta">
                  <a href={`tel:${l.phone}`}>{l.phone}</a> · {new Date(l.created_at).toLocaleString()}
                </div>
                {l.project_need && <p className="admin-leads-need">{l.project_need}</p>}
              </div>
              <div className="admin-list-actions">
                <button className="btn btn-outline admin-delete" onClick={() => handleDeleteLead(l.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
