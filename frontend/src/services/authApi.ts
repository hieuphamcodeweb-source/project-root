import { getAuthHeader, setAuthSession, type AuthRole, type AuthUser } from './auth'

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

export interface SavedAddress {
  id: string
  label: string
  recipientName: string
  phone: string
  street: string
  ward: string
  district: string
  province: string
  isDefault: boolean
}

export interface SavedAddressPayload {
  label?: string
  recipientName: string
  phone: string
  street: string
  ward?: string
  district?: string
  province: string
  isDefault?: boolean
}

export interface MyProfile {
  id: number
  username: string
  dateRegistered: string
  role: string
  status: string
  createdAt?: string
  updatedAt?: string
  addresses: SavedAddress[]
}

interface MeResponse {
  message: string
  data: MyProfile
}

export async function fetchMyProfile(): Promise<MyProfile> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      ...getAuthHeader(),
    },
  })

  const body = (await response.json().catch(() => null)) as { message?: string } | null
  if (!response.ok) {
    throw new Error(body?.message ?? 'Could not load profile.')
  }

  const data = (body as MeResponse).data
  return { ...data, addresses: data.addresses ?? [] }
}

export async function createMyAddress(payload: SavedAddressPayload): Promise<SavedAddress> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  })

  const body = (await response.json().catch(() => null)) as { message?: string; data?: SavedAddress } | null
  if (!response.ok) {
    throw new Error(body?.message ?? 'Could not save address.')
  }
  if (!body?.data) {
    throw new Error('Invalid response from server.')
  }
  return body.data
}

export async function updateMyAddress(addressId: string, payload: SavedAddressPayload): Promise<SavedAddress> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/addresses/${encodeURIComponent(addressId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  })

  const body = (await response.json().catch(() => null)) as { message?: string; data?: SavedAddress } | null
  if (!response.ok) {
    throw new Error(body?.message ?? 'Could not update address.')
  }
  if (!body?.data) {
    throw new Error('Invalid response from server.')
  }
  return body.data
}

export async function deleteMyAddress(addressId: string): Promise<SavedAddress[]> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/addresses/${encodeURIComponent(addressId)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  })

  const body = (await response.json().catch(() => null)) as { message?: string; data?: { addresses: SavedAddress[] } } | null
  if (!response.ok) {
    throw new Error(body?.message ?? 'Could not remove address.')
  }
  return body?.data?.addresses ?? []
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
