import type { CategoryPayload, CategoryRecord } from '../types'
import { getAuthHeader } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

interface CategoryListResponse {
  data: CategoryRecord[]
  total: number
  page: number
  pageSize: number
}

interface CategoryByIdResponse {
  data: CategoryRecord
}

interface CategoryMutationResponse {
  message: string
  data: CategoryRecord
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(errorBody?.message ?? `Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getCategories(): Promise<CategoryListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return parseResponse<CategoryListResponse>(response)
}

export async function getCategoryById(id: string): Promise<CategoryByIdResponse> {
  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return parseResponse<CategoryByIdResponse>(response)
}

export async function createCategory(payload: CategoryPayload): Promise<CategoryMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  })
  return parseResponse<CategoryMutationResponse>(response)
}

export async function updateCategory(id: string, payload: CategoryPayload): Promise<CategoryMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  })
  return parseResponse<CategoryMutationResponse>(response)
}

export async function deleteCategory(id: string): Promise<CategoryMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  })
  return parseResponse<CategoryMutationResponse>(response)
}
