import { setAuthSession, type AuthRole, type AuthUser } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  message: string
  data: {
    token: string
    user: AuthUser
  }
}

interface RegisterPayload {
  username: string
  password: string
  role: AuthRole
}

interface RegisterResponse {
  message: string
  data: {
    id: number
    username: string
    role: string
  }
}

export async function loginWithCredentials(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = (await response.json().catch(() => null)) as { message?: string } | null
  if (!response.ok) {
    throw new Error(body?.message ?? 'Login failed.')
  }

  const result = body as LoginResponse
  setAuthSession(result.data)
  return result.data
}

export async function registerAccount(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = (await response.json().catch(() => null)) as { message?: string } | null
  if (!response.ok) {
    throw new Error(body?.message ?? 'Register failed.')
  }

  return body as RegisterResponse
}
