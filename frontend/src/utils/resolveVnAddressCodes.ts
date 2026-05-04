import { getProvinces, getWardsByProvince } from 'vn-provinces-wards'
import type { SavedAddress } from '../services/authApi'

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Best-effort match saved text fields to vn-provinces-wards codes (for edit modal). */
export function resolveVnAddressCodes(addr: SavedAddress): { provinceCode?: string; wardCode?: string } {
  const provinces = getProvinces()
  const p = provinces.find((x) => norm(x.name) === norm(addr.province))
  if (!p) {
    return {}
  }

  const wards = getWardsByProvince(p.code)
  const wn = norm(addr.ward)
  const w = wards.find((x) => norm(x.name) === wn || norm(x.full_name) === wn)
  return { provinceCode: p.code, wardCode: w?.code }
}
