import type { ProductPayload, ProductRecord } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ProductListResponse {
  data: ProductRecord[]
  total: number
  page: number
  pageSize: number
}

interface ProductByIdResponse {
  data: ProductRecord
}

interface ProductMutationResponse {
  message: string
  data: ProductRecord
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(response.status, errorBody?.message ?? `Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getProducts(): Promise<ProductListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products`)
  return parseResponse<ProductListResponse>(response)
}

export async function getProductById(id: string): Promise<ProductByIdResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`)
  return parseResponse<ProductByIdResponse>(response)
}

export async function createProduct(payload: ProductPayload): Promise<ProductMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return parseResponse<ProductMutationResponse>(response)
}

export async function updateProduct(id: string, payload: ProductPayload): Promise<ProductMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return parseResponse<ProductMutationResponse>(response)
}

export async function deleteProduct(id: string): Promise<ProductMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
  })

  return parseResponse<ProductMutationResponse>(response)
}
