export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned'

export type UserRole = 'Staff' | 'Admin' | 'Member' | 'User'

export interface UserRecord {
  id: number
  username: string
  dateRegistered: string
  role: UserRole
  status: UserStatus
}

export interface CreateUserPayload {
  username: string
  dateRegistered: string
  role: UserRole
  status: UserStatus
}

export type ProductStatus = 'active' | 'inactive' | 'draft'

export interface ProductRecord {
  _id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  thumbnailUrl: string
  galleryUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductPayload {
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  thumbnailUrl: string
  galleryUrls: string[]
}

export type CategoryStatus = 'active' | 'inactive' | 'draft'

export interface CategoryRecord {
  _id: string
  categoryCode: string
  categoryName: string
  status: CategoryStatus
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CategoryPayload {
  categoryCode: string
  categoryName: string
  status: CategoryStatus
  sortOrder: number
}

export type PromoDiscountType = 'percent' | 'fixed'

export interface PromoCodeRecord {
  _id: string
  code: string
  description: string
  discountType: PromoDiscountType
  value: number
  minOrderAmount: number
  maxDiscountAmount: number | null
  isActive: boolean
  /** Max successful checkouts per user account (null = unlimited per user). */
  perUserUsageLimit?: number | null
  /** @deprecated Legacy field; prefer perUserUsageLimit */
  usageLimit?: number | null
  usedCount?: number
  startsAt: string | null
  endsAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PromoCodePayload {
  code: string
  description: string
  discountType: PromoDiscountType
  value: number
  minOrderAmount: number
  maxDiscountAmount: number | null
  isActive: boolean
  perUserUsageLimit: number | null
  startsAt: string | null
  endsAt: string | null
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface OrderShippingAddress {
  addressId?: string
  recipientName: string
  phone: string
  street: string
  ward?: string
  district?: string
  province: string
}

export interface OrderItem {
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  subtotal: number
  product: {
    _id: string
    name: string
    category: string
    thumbnailUrl: string
    currentPrice: number
    sku?: string
  } | null
}

export interface OrderRecord {
  _id: string
  /** Mã đơn 8 ký tự (4 chữ + 4 số); đơn cũ có thể không có. */
  orderCode?: string
  userId: number
  customerName: string
  paymentMethod: 'COD'
  status: OrderStatus
  totalAmount: number
  discountAmount?: number
  promoCode?: string
  items: OrderItem[]
  shippingAddress?: OrderShippingAddress
  createdAt: string
  updatedAt: string
}
