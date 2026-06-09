import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, ChefHat, Wine, Eye, EyeOff } from 'lucide-react'

const roles = [
  { id: 'diner', label: 'I\'m a Diner', icon: User, desc: 'Discover & book dining experiences' },
  { id: 'restaurant', label: 'Restaurant', icon: ChefHat, desc: 'Manage your venue & menus' },
  { id: 'brand', label: 'Brand Rep', icon: Wine, desc: 'Run promotions & track spend' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('diner')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Please fill in all fields.')
    const ok = login(email, password, role)
    if (ok) {
      navigate(role === 'restaurant' ? '/restaurant' : role === 'brand' ? '/brand' : '/diner')
    } else {
      setError('Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-display text-4xl font-bold text-forest-500">ODE</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-charcoal mt-3 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                  role === r.id
                    ? 'border-forest-500 bg-forest-50 text-forest-600'
                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                <r.icon size={18} />
                <span className="text-xs font-medium leading-tight">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-coral text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-forest-500 font-semibold hover:underline">Join ODE</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <strong>Demo tip:</strong> Enter any email + password and select a role to explore the dashboards
        </p>
      </div>
    </div>
  )
}
