import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'

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
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('project-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('project-images').getPublicUrl(path)
  return data.publicUrl
}

export default function AdminDashboard() {
  const [session, setSession] = useState(undefined)
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [coverFile, setCoverFile] = useState(null)
  const [extraFiles, setExtraFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
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
  }, [session])

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
  }

  const loadExistingImages = async (projectId) => {
    const { data } = await supabase.from('project_images').select('*').eq('project_id', projectId).order('sort_order')
    setExistingImages(data || [])
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setCoverFile(null)
    setExtraFiles([])
    setExistingImages([])
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
    setCoverFile(null)
    setExtraFiles([])
    loadExistingImages(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    await supabase.from('projects').delete().eq('id', id)
    loadProjects()
    if (form.id === id) resetForm()
  }

  const handleDeleteImage = async (imageId) => {
    await supabase.from('project_images').delete().eq('id', imageId)
    setExistingImages((imgs) => imgs.filter((i) => i.id !== imageId))
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
        cover_image: coverUrl,
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

      if (extraFiles.length) {
        const urls = await Promise.all(extraFiles.map((f) => uploadFile(f, form.category)))
        const rows = urls.map((url, i) => ({ project_id: projectId, image_url: url, sort_order: i }))
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
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0] || null)}
            />
          </label>
          {form.cover_image && (
            <img src={form.cover_image} alt="Current cover" className="admin-cover-preview" />
          )}

          <label>
            Additional screenshots
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setExtraFiles(Array.from(e.target.files))}
            />
          </label>

          {existingImages.length > 0 && (
            <div className="admin-existing-images">
              {existingImages.map((img) => (
                <div className="admin-existing-image" key={img.id}>
                  <img src={img.image_url} alt="" />
                  <button type="button" onClick={() => handleDeleteImage(img.id)}>Remove</button>
                </div>
              ))}
            </div>
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
      </div>
    </main>
  )
}
