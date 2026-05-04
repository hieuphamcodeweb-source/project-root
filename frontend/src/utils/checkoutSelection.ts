const STORAGE_KEY = 'client_checkout_product_ids'

export function persistCheckoutProductIds(productIds: string[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
}

export function readPersistedCheckoutProductIds(): string[] | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || !parsed.every((x) => typeof x === 'string')) return null
    return parsed
  } catch {
    return null
  }
}

export function clearPersistedCheckoutProductIds() {
  sessionStorage.removeItem(STORAGE_KEY)
}
