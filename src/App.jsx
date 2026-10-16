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
import Pricing from './pages/Pricing'
import Profile from './pages/Profile'

const roleDash = { diner: '/diner', restaurant: '/restaurant', brand: '/brand' }

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={roleDash[user.role] || '/'} replace />
  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <span className="font-display text-4xl font-bold text-forest-500">ODE</span>
        <div className="mt-4 w-8 h-8 border-2 border-forest-200 border-t-forest-500 rounded-full animate-spin mx-auto" />
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  const dash = user ? (roleDash[user.role] || '/') : null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to={dash} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={dash} replace /> : <Register />} />
          <Route path="/experience/:id" element={<ExperienceDetail />} />
          <Route path="/diner" element={<ProtectedRoute role="diner"><DinerDashboard /></ProtectedRoute>} />
          <Route path="/restaurant" element={<ProtectedRoute role="restaurant"><RestaurantDashboard /></ProtectedRoute>} />
          <Route path="/brand" element={<ProtectedRoute role="brand"><BrandDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="diner"><Profile /></ProtectedRoute>} />
          <Route path="/pricing" element={<Pricing />} />
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
