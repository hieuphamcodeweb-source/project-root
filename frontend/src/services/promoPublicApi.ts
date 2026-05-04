import { getAuthHeader } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

export interface PromoCheckoutMeta {
  endsAt: string | null
  startsAt: string | null
  perUserUsageLimit: number | null
  /** Số lần còn có thể dùng với tài khoản hiện tại; null nếu chưa đăng nhập hoặc không giới hạn theo TK */
  remainingForUser: number | null
}

export interface PublicPromoHint extends PromoCheckoutMeta {
  code: string
  description: string
  /** false = user đã hết lượt với mã này (vẫn hiện để biết, không ẩn list) */
  canApply?: boolean
}

export interface PromoPreviewResponse extends PromoCheckoutMeta {
  discount: number
  appliedCode: string | null
  description: string
  error: string | null
}

export function normalizePromoCode(raw: string | undefined | null) {
  return String(raw ?? '')
    .trim()
    .toUpperCase()
}

export function roundMoney(n: number) {
  return Math.round((Number(n) || 0) * 100) / 100
}

export async function getPublicPromoHints(): Promise<PublicPromoHint[]> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes/public`, {
    headers: { ...getAuthHeader() },
  })
  if (!response.ok) {
    return []
  }
  const body = (await response.json()) as { data?: PublicPromoHint[] }
  const list = body.data ?? []
  return list.map((row) => ({
    ...row,
    canApply: row.canApply !== false,
  }))
}

export async function previewPromoCode(code: string, subtotal: number): Promise<PromoPreviewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/promo-codes/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ code, subtotal }),
  })
  const body = (await response.json().catch(() => null)) as PromoPreviewResponse & { message?: string }
  if (!response.ok) {
    throw new Error(body?.message ?? `Preview failed: ${response.status}`)
  }
  return {
    discount: Number(body.discount) || 0,
    appliedCode: body.appliedCode ?? null,
    description: body.description ?? '',
    error: body.error ?? null,
    endsAt: body.endsAt ?? null,
    startsAt: body.startsAt ?? null,
    perUserUsageLimit: body.perUserUsageLimit ?? null,
    remainingForUser: body.remainingForUser ?? null,
  }
}
