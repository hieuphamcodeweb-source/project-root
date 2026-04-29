export type AuthRole = 'admin' | 'user'

export interface AuthUser {
  id: number
  username: string
  fullName: string
  role: AuthRole
}

interface AuthSession {
  token: string
  user: AuthUser
}

const AUTH_STORAGE_KEY = 'auth_session'

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function setAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function getAccessToken() {
  return getAuthSession()?.token ?? null
}

export function getCurrentUser() {
  return getAuthSession()?.user ?? null
}

export function isAuthenticated() {
  return Boolean(getAccessToken())
}

export function isAdmin() {
  return getCurrentUser()?.role === 'admin'
}

export function getAuthHeader() {
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
