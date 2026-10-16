import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, ChefHat, Wine } from 'lucide-react'

const roleConfig = {
  diner: { label: 'My Table', icon: User, dash: '/diner' },
  restaurant: { label: 'Restaurant Hub', icon: ChefHat, dash: '/restaurant' },
  brand: { label: 'Brand Studio', icon: Wine, dash: '/brand' },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const config = user ? roleConfig[user.role] : null

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? (config?.dash || '/') : '/'} className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-forest-500 tracking-tight">ODE</span>
            <span className="hidden sm:block text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Open Dining Experiences</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={config?.dash}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-forest-500 transition-colors"
                >
                  {config?.icon && <config.icon size={16} />}
                  {config?.label}
                </Link>
                {user.role === 'diner' && (
                  <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-forest-500 transition-colors hidden sm:block">
                    My Profile
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  {user.role === 'diner' ? (
                    <Link to="/profile" className="w-8 h-8 rounded-full bg-forest-500 text-white text-xs font-bold flex items-center justify-center hover:bg-forest-600 transition-colors">
                      {user.name[0]}
                    </Link>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-forest-500 text-white text-xs font-bold flex items-center justify-center">
                      {user.name[0]}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm text-gray-700 font-medium">{user.name.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-1 p-1.5 text-gray-400 hover:text-coral transition-colors rounded-lg hover:bg-gray-50"
                    title="Sign out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-forest-500 transition-colors hidden sm:block">
                  Pricing
                </Link>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-forest-500 transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors"
                >
                  Join ODE
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
