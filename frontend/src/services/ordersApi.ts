import { getAuthHeader } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

interface CheckoutItemPayload {
  productId: string
  quantity: number
}

interface CodOrderResponse {
  message: string
  data: {
    orderId: string
    orderCode?: string
    totalAmount: number
  }
}

export async function createCodOrder(
  items: CheckoutItemPayload[],
  addressId: string,
  options?: { promoCode?: string }
) {
  const response = await fetch(`${API_BASE_URL}/api/orders/cod`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      items,
      addressId,
      ...(options?.promoCode ? { promoCode: options.promoCode } : {}),
    }),
  })

  const body = (await response.json().catch(() => null)) as { message?: string } | null
  if (!response.ok) {
    throw new Error(body?.message ?? `Checkout failed: ${response.status}`)
  }

  return body as CodOrderResponse
}
