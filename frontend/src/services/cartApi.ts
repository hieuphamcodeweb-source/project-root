import { getAuthHeader, getCurrentUser } from './auth'
import type { CartItem } from './cart'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

interface CartResponse {
  data: {
    userId: number
    items: CartItem[]
  }
}

export async function fetchMyCartFromApi() {
  const user = getCurrentUser()
  if (!user || !Number.isInteger(user.id) || user.id <= 0) return null

  const response = await fetch(`${API_BASE_URL}/api/cart/me`, {
    headers: {
      ...getAuthHeader(),
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.')
    }
    throw new Error(`Failed to fetch cart: ${response.status}`)
  }

  const body = (await response.json()) as CartResponse
  return body.data.items
}

export async function saveMyCartToApi(items: CartItem[]) {
  const user = getCurrentUser()
  if (!user || !Number.isInteger(user.id) || user.id <= 0) return

  const response = await fetch(`${API_BASE_URL}/api/cart/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.')
    }
    throw new Error(`Failed to save cart: ${response.status}`)
  }
}
