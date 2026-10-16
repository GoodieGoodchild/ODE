import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch the profile row for a given auth user
  const fetchProfile = async (authUser) => {
    if (!authUser) { setProfile(null); setUser(null); setLoading(false); return }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
    if (data) {
      setProfile(data)
      setUser({ ...authUser, ...data, avatar: data.name ? data.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??' })
    } else {
      // Profile not created yet (race condition on signup) — retry once
      setTimeout(() => fetchProfile(authUser), 800)
    }
    setLoading(false)
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { data }
  }

  const register = async ({ firstName, lastName, email, password, role, restaurantName, city, brandName, category }) => {
    const name = `${firstName} ${lastName}`

    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })
    if (error) return { error: error.message }

    const userId = data.user?.id
    if (!userId) return { error: 'Signup failed — no user ID returned.' }

    // 2. Create profile row
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      name,
      role,
    })
    if (profileError) return { error: profileError.message }

    // 3. Create role-specific row
    if (role === 'restaurant') {
      await supabase.from('restaurants').insert({
        owner_id: userId,
        name: restaurantName || name,
        location: city || '',
        cuisine: '',
      })
    }
    if (role === 'brand') {
      await supabase.from('brands').insert({
        owner_id: userId,
        name: brandName || name,
        category: category || '',
      })
    }

    return { data }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
