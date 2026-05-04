import { Button, Checkbox, Empty, InputNumber, Space, Typography, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../../services/auth'
import {
  clearCart,
  getCartItems,
  initializeCartFromApi,
  removeCartItem,
  subscribeCartUpdates,
  updateCartItemQuantity,
  type CartItem,
} from '../../services/cart'
import { persistCheckoutProductIds } from '../../utils/checkoutSelection'

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
  const selectedSubtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  )

  function goToCheckout() {
    if (selectedItems.length === 0) {
      message.warning('Chọn ít nhất một sản phẩm để thanh toán.')
      return
    }
    persistCheckoutProductIds(selectedProductIds)
    if (!isAuthenticated()) {
      message.info('Đăng nhập để tiếp tục thanh toán.')
      navigate('/admin/login', { state: { from: '/client/checkout' } })
      return
    }
    navigate('/client/checkout', { state: { productIds: selectedProductIds } })
  }

  return (
    <section className="client-cart-page">
      <div className="client-cart-header">
        <Typography.Title level={2}>Giỏ hàng</Typography.Title>
        <Link to="/client/products">Tiếp tục mua sắm</Link>
      </div>

      {items.length === 0 ? (
        <div className="client-cart-empty">
          <Empty description="Giỏ hàng trống." />
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
                  <small>Tồn: {item.stock}</small>
                </div>
                <InputNumber
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(value) => updateCartItemQuantity(item.productId, Number(value ?? 1))}
                />
                <strong>{toCurrency(item.price * item.quantity)}</strong>
                <Button danger onClick={() => removeCartItem(item.productId)}>
                  Xóa
                </Button>
              </article>
            ))}
          </div>

          <div className="client-cart-footer-bar">
            <div className="client-cart-footer-summary">
              <Typography.Text type="secondary">
                Đã chọn {selectedItems.length} món — Tạm tính:{' '}
                <Typography.Text strong>{toCurrency(selectedSubtotal)}</Typography.Text>
              </Typography.Text>
              {!isAuthenticated() ? (
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 6 }}>
                  <Link to="/admin/login" state={{ from: `${location.pathname}${location.search}` }}>
                    Đăng nhập
                  </Link>{' '}
                  để thanh toán.
                </Typography.Paragraph>
              ) : null}
            </div>
            <Space wrap>
              <Button onClick={() => clearCart()}>Xóa giỏ</Button>
              <Button type="primary" disabled={selectedItems.length === 0} onClick={goToCheckout}>
                Thanh toán
              </Button>
            </Space>
          </div>
        </>
      )}
    </section>
  )
}
