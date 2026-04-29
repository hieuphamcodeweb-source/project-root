import type { ProductRecord } from '../types'
import { getCurrentUser } from './auth'
import { fetchMyCartFromApi, saveMyCartToApi } from './cartApi'

export interface CartItem {
  productId: string
  name: string
  price: number
  thumbnailUrl: string
  stock: number
  quantity: number
}

const CART_STORAGE_KEY_PREFIX = 'client_cart'
const CART_UPDATED_EVENT = 'client-cart-updated'
const DEBOUNCE_SYNC_MS = 2000
const MAX_SYNC_INTERVAL_MS = 10000

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null
let maxSyncTimer: ReturnType<typeof setTimeout> | null = null
let syncInFlight = false
let hasPendingChanges = false

function getCartStorageKey() {
  const currentUser = getCurrentUser()
  return currentUser?.id ? `${CART_STORAGE_KEY_PREFIX}_${currentUser.id}` : `${CART_STORAGE_KEY_PREFIX}_guest`
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}

export function getCartItems(): CartItem[] {
  const raw = localStorage.getItem(getCartStorageKey())
  if (!raw) return []

  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    localStorage.removeItem(getCartStorageKey())
    return []
  }
}

function setCartItems(items: CartItem[]) {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(items))
  notifyCartUpdated()
  scheduleCartSync()
}

function clearSyncTimers() {
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer)
    syncDebounceTimer = null
  }
  if (maxSyncTimer) {
    clearTimeout(maxSyncTimer)
    maxSyncTimer = null
  }
}

async function flushCartToApi() {
  if (syncInFlight) return

  syncInFlight = true
  try {
    await saveMyCartToApi(getCartItems())
    hasPendingChanges = false
    clearSyncTimers()
  } catch {
    // Keep dirty state; retry on next local change
  } finally {
    syncInFlight = false
  }
}

function scheduleCartSync() {
  hasPendingChanges = true

  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer)
  }

  syncDebounceTimer = setTimeout(() => {
    if (hasPendingChanges) {
      void flushCartToApi()
    }
  }, DEBOUNCE_SYNC_MS)

  if (!maxSyncTimer) {
    maxSyncTimer = setTimeout(() => {
      if (hasPendingChanges) {
        void flushCartToApi()
      }
    }, MAX_SYNC_INTERVAL_MS)
  }
}

export function getCartCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0)
}

export function getCartItemQuantity(productId: string) {
  const item = getCartItems().find((cartItem) => cartItem.productId === productId)
  return item?.quantity ?? 0
}

export function addToCart(product: ProductRecord, quantity = 1) {
  const items = getCartItems()
  const index = items.findIndex((item) => item.productId === product._id)

  if (index === -1) {
    if (product.stock <= 0) {
      return false
    }

    items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      thumbnailUrl: product.thumbnailUrl,
      stock: product.stock,
      quantity: Math.min(quantity, product.stock),
    })
  } else {
    if (items[index].quantity >= items[index].stock) {
      return false
    }

    items[index].quantity = Math.min(items[index].quantity + quantity, items[index].stock)
  }

  setCartItems(items)
  return true
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  const items = getCartItems()
  const updatedItems = items
    .map((item) => (item.productId === productId ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } : item))
    .filter((item) => item.quantity > 0)
  setCartItems(updatedItems)
}

export function removeCartItem(productId: string) {
  const items = getCartItems().filter((item) => item.productId !== productId)
  setCartItems(items)
}

export function applyPurchasedItems(purchasedItems: Array<{ productId: string; quantity: number }>) {
  const purchaseMap = new Map(purchasedItems.map((item) => [item.productId, Math.max(0, Number(item.quantity || 0))]))
  const nextItems = getCartItems()
    .map((cartItem) => {
      const purchasedQty = purchaseMap.get(cartItem.productId) || 0
      if (!purchasedQty) return cartItem
      return {
        ...cartItem,
        quantity: Math.max(0, cartItem.quantity - purchasedQty),
      }
    })
    .filter((cartItem) => cartItem.quantity > 0)

  setCartItems(nextItems)
}

export function clearCart() {
  localStorage.removeItem(getCartStorageKey())
  notifyCartUpdated()
  scheduleCartSync()
}

export async function initializeCartFromApi() {
  const remoteItems = await fetchMyCartFromApi()
  if (!remoteItems) return
  localStorage.setItem(getCartStorageKey(), JSON.stringify(remoteItems))
  notifyCartUpdated()
}

export function subscribeCartUpdates(callback: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
