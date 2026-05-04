import type { PromoCodePayload, PromoCodeRecord } from '../types'
import { getAuthHeader } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

interface PromoCodeListResponse {
  data: PromoCodeRecord[]
  total: number
  page: number
  pageSize: number
}

interface PromoCodeByIdResponse {
  data: PromoCodeRecord
}

interface PromoCodeMutationResponse {
  message: string
  data: PromoCodeRecord
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(errorBody?.message ?? `Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getPromoCodes(): Promise<PromoCodeListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes`, {
    headers: { ...getAuthHeader() },
  })
  return parseResponse<PromoCodeListResponse>(response)
}

export async function getPromoCodeById(id: string): Promise<PromoCodeByIdResponse> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes/${id}`, {
    headers: { ...getAuthHeader() },
  })
  return parseResponse<PromoCodeByIdResponse>(response)
}

export async function createPromoCode(payload: PromoCodePayload): Promise<PromoCodeMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  })
  return parseResponse<PromoCodeMutationResponse>(response)
}

export async function updatePromoCode(id: string, payload: PromoCodePayload): Promise<PromoCodeMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  })
  return parseResponse<PromoCodeMutationResponse>(response)
}

export async function deletePromoCode(id: string): Promise<PromoCodeMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  })
  return parseResponse<PromoCodeMutationResponse>(response)
}
