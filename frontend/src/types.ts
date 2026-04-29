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

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

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
  userId: number
  customerName: string
  paymentMethod: 'COD'
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}
