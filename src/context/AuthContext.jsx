import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password, role) => {
    const mockUsers = {
      diner: { id: 1, name: 'Alex Mokoena', email, role: 'diner', avatar: 'AM', passions: ['Food', 'Wine', 'Travel'] },
      restaurant: { id: 2, name: 'Fohlio Restaurant', email, role: 'restaurant', restaurantId: 1 },
      brand: { id: 3, name: 'Simonsig Estate', email, role: 'brand', brandId: 1 },
    }
    setUser(mockUsers[role] || mockUsers.diner)
    return true
  }

  const register = (data) => {
    setUser({ id: 99, name: `${data.firstName} ${data.lastName}`, email: data.email, role: data.role, avatar: `${data.firstName[0]}${data.lastName[0]}` })
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
