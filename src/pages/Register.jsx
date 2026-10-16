import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, ChefHat, Wine, Check, Loader2 } from 'lucide-react'

const roles = [
  { id: 'diner', label: 'Diner', icon: User, desc: 'Discover curated set menus, book open tables and unlock drinks promotions.', color: 'border-forest-500 bg-forest-50 text-forest-600' },
  { id: 'restaurant', label: 'Restaurant', icon: ChefHat, desc: 'List your venue, manage set menus, partner with brands and fill tables.', color: 'border-amber-500 bg-amber-50 text-amber-600' },
  { id: 'brand', label: 'Brand Rep', icon: Wine, desc: 'Run targeted drink promotions through our restaurant network and track ROI.', color: 'border-coral bg-red-50 text-coral' },
]

const roleExtraFields = {
  restaurant: [
    { name: 'restaurantName', label: 'Restaurant Name', placeholder: 'e.g. The Garden Table' },
    { name: 'city', label: 'City', placeholder: 'e.g. Cape Town' },
  ],
  brand: [
    { name: 'brandName', label: 'Brand / Company Name', placeholder: 'e.g. Simonsig Estate' },
    { name: 'category', label: 'Category', placeholder: 'e.g. Wine, Spirits, Beer' },
  ],
}

export default function Register() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'diner')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', restaurantName: '', city: '', brandName: '', category: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.firstName || !form.lastName || !form.email || !form.password) return setError('Please fill in all fields.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    const result = await register({ ...form, role })
    setLoading(false)
    if (result.error) return setError(result.error)
    // Supabase sends a confirmation email — show a message
    setEmailSent(true)
  }

  const selectedRole = roles.find(r => r.id === role)
  const extraFields = roleExtraFields[role] || []

  if (emailSent) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            We've sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/"><span className="font-display text-4xl font-bold text-forest-500">ODE</span></Link>
          <h1 className="font-display text-2xl font-bold text-charcoal mt-3 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm">Join the open dining community</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">I am a…</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${role === r.id ? r.color : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  {role === r.id && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-forest-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </span>
                  )}
                  <r.icon size={20} />
                  <span className="text-xs font-semibold">{r.label}</span>
                </button>
              ))}
            </div>
            {selectedRole && <p className="text-xs text-gray-500 mt-2 text-center">{selectedRole.desc}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">First Name</label>
                <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Alex"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Mokoena"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors" />
              </div>
            </div>

            {extraFields.map(f => (
              <div key={f.name}>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                <input type="text" value={form[f.name]} onChange={e => update(f.name, e.target.value)} placeholder={f.placeholder}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors" />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 6 characters"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors" />
            </div>

            {error && <p className="text-coral text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-forest-500 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">By joining, you agree to our Terms of Service & Community Guidelines</p>
      </div>
    </div>
  )
}
