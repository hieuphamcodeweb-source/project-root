import type { SavedAddress } from '../services/authApi'
import type { OrderShippingAddress } from '../types'

export function formatAddressLines(a: {
  street: string
  ward?: string
  district?: string
  province: string
}) {
  return [a.street, a.ward, a.district, a.province].filter(Boolean).join(', ')
}

export function formatShippingSummary(s?: OrderShippingAddress | null) {
  if (!s?.recipientName) return '—'
  const place = formatAddressLines(s)
  return `${s.recipientName} · ${s.phone}${place ? ` — ${place}` : ''}`
}

export function pickDefaultAddressId(addresses: SavedAddress[]) {
  const def = addresses.find((a) => a.isDefault)
  return def?.id ?? addresses[0]?.id ?? null
}
