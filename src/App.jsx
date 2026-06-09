import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import DinerDashboard from './pages/DinerDashboard'
import RestaurantDashboard from './pages/RestaurantDashboard'
import BrandDashboard from './pages/BrandDashboard'
import ExperienceDetail from './pages/ExperienceDetail'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  const noFooterPaths = ['/login', '/register']

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to={`/${user.role === 'restaurant' ? 'restaurant' : user.role === 'brand' ? 'brand' : 'diner'}`} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/experience/:id" element={<ExperienceDetail />} />
          <Route path="/diner" element={<ProtectedRoute role="diner"><DinerDashboard /></ProtectedRoute>} />
          <Route path="/restaurant" element={<ProtectedRoute role="restaurant"><RestaurantDashboard /></ProtectedRoute>} />
          <Route path="/brand" element={<ProtectedRoute role="brand"><BrandDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
