const AUTH_STORAGE_KEY = 'isAuthenticated'

export function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function login() {
  localStorage.setItem(AUTH_STORAGE_KEY, 'true')
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
