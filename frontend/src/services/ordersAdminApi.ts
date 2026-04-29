import { getAuthHeader } from './auth'
import type { OrderRecord, OrderStatus } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

interface OrdersListResponse {
  data: OrderRecord[]
  total: number
  page: number
  pageSize: number
}

interface OrderByIdResponse {
  data: OrderRecord
}

interface OrderMutationResponse {
  message: string
  data: OrderRecord
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(errorBody?.message ?? `Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getOrders(): Promise<OrdersListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return parseResponse<OrdersListResponse>(response)
}

export async function getOrderById(id: string): Promise<OrderByIdResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return parseResponse<OrderByIdResponse>(response)
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  })
  return parseResponse<OrderMutationResponse>(response)
}
