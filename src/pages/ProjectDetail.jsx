import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { supabase } from '../lib/supabaseClient'
import { categoryIcon, categoryLabel } from '../lib/categories'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_images').select('*').eq('project_id', id).order('sort_order'),
    ]).then(([projectRes, imagesRes]) => {
      setProject(projectRes.data)
      setImages(imagesRes.data || [])
      setActiveImage(projectRes.data?.cover_image || imagesRes.data?.[0]?.image_url || null)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="section"><div className="container"><p>Loading…</p></div></main>
        <SiteFooter />
      </>
    )
  }

  if (!project) {
    return (
      <>
        <SiteHeader />
        <main className="section">
          <div className="container">
            <p>Project not found.</p>
            <Link to="/#work" className="btn btn-outline">Back to work</Link>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  const gallery = [project.cover_image, ...images.map((i) => i.image_url)].filter(Boolean)

  return (
    <>
      <SiteHeader />
      <main className="section project-detail">
        <div className="container">
          <Link to="/#work" className="back-link">← Back to work</Link>

          <span className="eyebrow">{categoryIcon(project.category)} {categoryLabel(project.category)}</span>
          <h1 className="project-detail-title">{project.title}</h1>
          {project.short_description && (
            <p className="section-sub project-detail-sub">{project.short_description}</p>
          )}

          {activeImage && (
            <div className="project-gallery">
              <img src={activeImage} alt={project.title} className="project-gallery-main" />
              {gallery.length > 1 && (
                <div className="project-gallery-thumbs">
                  {gallery.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className={`project-gallery-thumb ${src === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(src)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="project-detail-body">
            {project.description && (
              <div className="project-detail-section">
                <h3>About this project</h3>
                <p>{project.description}</p>
              </div>
            )}
            {project.tech_stack && (
              <div className="project-detail-section">
                <h3>Tech stack</h3>
                <p>{project.tech_stack}</p>
              </div>
            )}
            {project.live_link && (
              <a
                className="btn btn-primary"
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit live project
              </a>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
