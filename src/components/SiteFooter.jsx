import { Link } from 'react-router-dom'
import { NAME } from '../lib/siteInfo'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {NAME}. All rights reserved.</p>
        <Link to="/admin/login" className="admin-link">Admin</Link>
      </div>
    </footer>
  )
}
