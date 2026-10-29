import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router changes the URL but never scrolls, so "/#work" links from
// the header did nothing and new pages opened mid-scroll.
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    // The target may not be rendered yet straight after a route change.
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(hash.slice(1))
      if (el || ++tries > 20) {
        clearInterval(timer)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
    return () => clearInterval(timer)
  }, [pathname, hash, key])

  return null
}
