import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import LeadPopup from './components/LeadPopup'

function App() {
  const location = useLocation()
  const showPopup = !location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {showPopup && <LeadPopup />}
    </>
  )
}

export default App
