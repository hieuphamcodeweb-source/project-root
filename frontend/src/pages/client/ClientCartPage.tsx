import { Button, Checkbox, Empty, InputNumber, Typography, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { applyPurchasedItems, clearCart, getCartItems, initializeCartFromApi, removeCartItem, subscribeCartUpdates, updateCartItemQuantity, type CartItem } from '../../services/cart'
import { createCodOrder } from '../../services/ordersApi'

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function ClientCartPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    async function bootstrapCart() {
      try {
        await initializeCartFromApi()
      } catch {
        // keep local cart as fallback
      }
      refreshCart()
    }

    function refreshCart() {
      const cartItems = getCartItems()
      setItems(cartItems)
      setSelectedProductIds((prev) => prev.filter((id) => cartItems.some((item) => item.productId === id)))
    }

    void bootstrapCart()
    return subscribeCartUpdates(refreshCart)
  }, [location.key])

  const selectedItems = useMemo(
    () => items.filter((item) => selectedProductIds.includes(item.productId)),
    [items, selectedProductIds]
  )
  const total = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [selectedItems])

  return (
    <section className="client-cart-page">
      <div className="client-cart-header">
        <Typography.Title level={2}>Your Cart</Typography.Title>
        <Link to="/client/products">Continue shopping</Link>
      </div>

      {items.length === 0 ? (
        <div className="client-cart-empty">
          <Empty description="Your cart is empty." />
        </div>
      ) : (
        <>
          <div className="client-cart-list">
            {items.map((item) => (
              <article key={item.productId} className="client-cart-item">
                <Checkbox
                  checked={selectedProductIds.includes(item.productId)}
                  onChange={(event) => {
                    setSelectedProductIds((prev) =>
                      event.target.checked ? [...prev, item.productId] : prev.filter((id) => id !== item.productId)
                    )
                  }}
                />
                <img src={item.thumbnailUrl} alt={item.name} className="client-cart-thumb" />
                <div className="client-cart-info">
                  <strong>{item.name}</strong>
                  <span>{toCurrency(item.price)}</span>
                  <small>Stock: {item.stock}</small>
                </div>
                <InputNumber
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(value) => updateCartItemQuantity(item.productId, Number(value ?? 1))}
                />
                <strong>{toCurrency(item.price * item.quantity)}</strong>
                <Button danger onClick={() => removeCartItem(item.productId)}>
                  Remove
                </Button>
              </article>
            ))}
          </div>

          <div className="client-cart-summary">
            <Typography.Title level={4}>Total: {toCurrency(total)}</Typography.Title>
            <div className="client-cart-actions">
              <Button onClick={() => clearCart()}>Clear cart</Button>
              <Button
                type="primary"
                loading={checkingOut}
                disabled={selectedItems.length === 0}
                onClick={async () => {
                  if (selectedItems.length === 0) {
                    message.warning('Please select at least one product to checkout.')
                    return
                  }

                  try {
                    setCheckingOut(true)
                    await createCodOrder(selectedItems.map((item) => ({ productId: item.productId, quantity: item.quantity })))
                    applyPurchasedItems(selectedItems.map((item) => ({ productId: item.productId, quantity: item.quantity })))
                    message.success('COD order placed successfully.')
                    navigate('/client/order-success')
                  } catch (error) {
                    message.error(error instanceof Error ? error.message : 'Checkout failed.')
                  } finally {
                    setCheckingOut(false)
                  }
                }}
              >
                Checkout COD
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
