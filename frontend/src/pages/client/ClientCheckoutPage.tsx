import { Button, Card, Divider, Input, Space, Tag, Typography, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShippingAddressPicker } from '../../components/client/ShippingAddressPicker'
import { isAuthenticated } from '../../services/auth'
import { fetchMyProfile, type SavedAddress } from '../../services/authApi'
import {
  applyPurchasedItems,
  getCartItems,
  initializeCartFromApi,
  subscribeCartUpdates,
  type CartItem,
} from '../../services/cart'
import { createCodOrder } from '../../services/ordersApi'
import {
  getPublicPromoHints,
  normalizePromoCode,
  previewPromoCode,
  roundMoney,
  type PromoCheckoutMeta,
  type PublicPromoHint,
} from '../../services/promoPublicApi'
import { pickDefaultAddressId } from '../../utils/addressFormat'
import { clearPersistedCheckoutProductIds, persistCheckoutProductIds, readPersistedCheckoutProductIds } from '../../utils/checkoutSelection'

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPromoEnd(iso: string | null | undefined) {
  if (!iso) return 'Không có ngày kết thúc'
  return new Date(iso).toLocaleString('vi-VN')
}

function formatRemainingLine(meta: PromoCheckoutMeta) {
  if (meta.perUserUsageLimit == null) return 'Lượt dùng: không giới hạn / tài khoản'
  if (meta.remainingForUser == null) return `Tối đa ${meta.perUserUsageLimit} lần / tài khoản`
  return `Bạn còn dùng được: ${meta.remainingForUser} / ${meta.perUserUsageLimit} lần`
}

function metaFromPreview(r: {
  endsAt?: string | null
  startsAt?: string | null
  perUserUsageLimit?: number | null
  remainingForUser?: number | null
}): PromoCheckoutMeta {
  return {
    endsAt: r.endsAt ?? null,
    startsAt: r.startsAt ?? null,
    perUserUsageLimit: r.perUserUsageLimit ?? null,
    remainingForUser: r.remainingForUser ?? null,
  }
}

function PromoMetaLines({ meta }: { meta: PromoCheckoutMeta }) {
  return (
    <div className="client-checkout-promo-meta-lines">
      <Typography.Text type="secondary" className="client-checkout-promo-meta-line">
        Hết hạn: {formatPromoEnd(meta.endsAt)}
      </Typography.Text>
      <Typography.Text type="secondary" className="client-checkout-promo-meta-line">
        {formatRemainingLine(meta)}
      </Typography.Text>
    </div>
  )
}

export function ClientCheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [idsReady, setIdsReady] = useState(false)
  const [cartSynced, setCartSynced] = useState(false)
  const [checkoutIds, setCheckoutIds] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCartItems())
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [publicHints, setPublicHints] = useState<PublicPromoHint[]>([])
  const [promoMeta, setPromoMeta] = useState<PromoCheckoutMeta | null>(null)
  const [placingOrder, setPlacingOrder] = useState(false)

  useEffect(() => {
    const fromState = (location.state as { productIds?: string[] } | undefined)?.productIds
    const fromStorage = readPersistedCheckoutProductIds()
    const ids = fromState && fromState.length > 0 ? fromState : fromStorage
    if (!ids || ids.length === 0) {
      navigate('/client/cart', { replace: true })
      return
    }
    setCheckoutIds(ids)
    persistCheckoutProductIds(ids)
    setIdsReady(true)
  }, [location.state, navigate])

  useEffect(() => {
    let cancelled = false

    async function bootstrapCart() {
      try {
        await initializeCartFromApi()
      } catch {
        // keep local cart
      }
      if (!cancelled) {
        setCartItems(getCartItems())
        setCartSynced(true)
      }
    }

    void bootstrapCart()
    const unsubscribe = subscribeCartUpdates(() => setCartItems(getCartItems()))
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated()) {
      setAddresses([])
      setSelectedAddressId(null)
      return
    }

    let cancelled = false

    async function loadAddresses() {
      try {
        setAddressesLoading(true)
        const profile = await fetchMyProfile()
        if (cancelled) return
        const list = profile.addresses ?? []
        setAddresses(list)
        setSelectedAddressId((prev) => {
          if (prev && list.some((a) => a.id === prev)) return prev
          return pickDefaultAddressId(list)
        })
      } catch {
        if (!cancelled) {
          setAddresses([])
          setSelectedAddressId(null)
        }
      } finally {
        if (!cancelled) setAddressesLoading(false)
      }
    }

    void loadAddresses()
    return () => {
      cancelled = true
    }
  }, [location.key])

  useEffect(() => {
    let cancelled = false
    void getPublicPromoHints().then((hints) => {
      if (!cancelled) setPublicHints(hints)
    })
    return () => {
      cancelled = true
    }
  }, [location.key])

  const selectedItems = useMemo(
    () => cartItems.filter((item) => checkoutIds.includes(item.productId)),
    [cartItems, checkoutIds]
  )

  const total = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [selectedItems])

  const applyPromoFromString = useCallback(
    async (raw: string) => {
      const code = normalizePromoCode(raw)
      if (!code) {
        setAppliedPromoCode(null)
        setPromoDiscount(0)
        setPromoInput('')
        setPromoMeta(null)
        message.info('Đã bỏ mã giảm giá.')
        return true
      }
      try {
        const r = await previewPromoCode(code, total)
        if (r.error) {
          message.error(r.error)
          return false
        }
        setAppliedPromoCode(r.appliedCode)
        setPromoInput(r.appliedCode ?? '')
        setPromoDiscount(r.discount)
        setPromoMeta(metaFromPreview(r))
        message.success('Đã áp dụng mã giảm giá.')
        return true
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'Không kiểm tra được mã.')
        return false
      }
    },
    [total]
  )

  useEffect(() => {
    if (!idsReady || !cartSynced) return
    if (selectedItems.length === 0) {
      message.warning('Đã xóa sản phẩm sau khi đặt hàng.')
      navigate('/client/cart', { replace: true })
    }
  }, [idsReady, cartSynced, selectedItems.length, navigate])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!appliedPromoCode || total <= 0) {
        setPromoDiscount(0)
        setPromoMeta(null)
        return
      }
      try {
        const r = await previewPromoCode(appliedPromoCode, total)
        if (cancelled) return
        if (r.error) {
          message.warning(r.error)
          setAppliedPromoCode(null)
          setPromoInput('')
          setPromoDiscount(0)
          setPromoMeta(null)
          return
        }
        setPromoDiscount(r.discount)
        setPromoMeta(metaFromPreview(r))
      } catch {
        if (!cancelled) {
          setPromoDiscount(0)
          setPromoMeta(null)
        }
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [total, appliedPromoCode])

  const payableTotal = roundMoney(Math.max(0, total - promoDiscount))

  if (!idsReady || !cartSynced) {
    return (
      <section className="client-checkout-page">
        <Typography.Paragraph>Đang tải…</Typography.Paragraph>
      </section>
    )
  }

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <section className="client-checkout-page">
      <div className="client-checkout-header">
        <Typography.Title level={2} style={{ margin: 0 }}>
          Thanh toán
        </Typography.Title>
        <Link to="/client/cart">← Quay lại giỏ hàng</Link>
      </div>

      <Card title="Đơn hàng" className="client-checkout-items-card">
        <ul className="client-checkout-item-list">
          {selectedItems.map((item) => {
            const lineTotal = item.price * item.quantity
            return (
              <li key={item.productId} className="client-checkout-item-row">
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="client-checkout-item-thumb"
                />
                <div className="client-checkout-item-body">
                  <div className="client-checkout-item-name">{item.name}</div>
                  <div className="client-checkout-item-detail">
                    <span>{toCurrency(item.price)}</span>
                    <span className="client-checkout-item-sep">×</span>
                    <span>{item.quantity}</span>
                  </div>
                </div>
                <div className="client-checkout-item-line-total">{toCurrency(lineTotal)}</div>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card title="Tóm tắt & mã giảm giá" className="client-checkout-pay-card">
        <div className="client-checkout-money-row">
          <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
          <strong>{toCurrency(total)}</strong>
        </div>

        <div className="client-checkout-promo-integrated">
          <Typography.Text type="secondary" className="client-checkout-promo-label">
            Mã giảm giá
          </Typography.Text>
          {appliedPromoCode ? (
            <div className="client-checkout-applied-block">
              <div className="client-checkout-applied-tag">
                <Tag color="processing" style={{ margin: 0 }}>
                  {appliedPromoCode}
                  {promoDiscount > 0 ? (
                    <span className="client-checkout-applied-saving">
                      {' '}
                      (−{toCurrency(promoDiscount)})
                    </span>
                  ) : null}
                </Tag>
              </div>
              {promoMeta ? <PromoMetaLines meta={promoMeta} /> : null}
            </div>
          ) : null}
          <Space.Compact className="client-checkout-promo-compact">
            <Input
              placeholder="Nhập mã"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              onPressEnter={() => {
                void applyPromoFromString(promoInput)
              }}
            />
            <Button type="primary" onClick={() => void applyPromoFromString(promoInput)}>
              Áp dụng
            </Button>
            <Button
              disabled={!appliedPromoCode && !promoInput}
              onClick={() => {
                setAppliedPromoCode(null)
                setPromoInput('')
                setPromoDiscount(0)
                setPromoMeta(null)
                message.info('Đã xóa mã.')
              }}
            >
              Xóa mã
            </Button>
          </Space.Compact>
          <Typography.Paragraph type="secondary" className="client-checkout-hints-intro">
            Chọn nhanh mã đang hoạt động:
          </Typography.Paragraph>
          <div className="client-checkout-hint-tags">
            {publicHints.length === 0 ? (
              <Typography.Text type="secondary">
                Chưa có mã trong khung thời gian hiện tại — kiểm tra Admin / Promo codes (mã Active, ngày hiệu lực).
              </Typography.Text>
            ) : (
              publicHints.map((row) => (
                <button
                  key={row.code}
                  type="button"
                  className="client-checkout-hint-card"
                  onClick={() => {
                    setPromoInput(row.code)
                    void applyPromoFromString(row.code)
                  }}
                >
                  <Tag className="client-checkout-hint-card-tag">
                    {row.code}
                    {row.description ? ` — ${row.description}` : ''}
                  </Tag>
                  <PromoMetaLines meta={metaFromPreview(row)} />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="client-checkout-money-row client-checkout-money-row-discount">
          <span>Giảm giá</span>
          <strong className={promoDiscount > 0 ? 'is-active' : ''}>
            {promoDiscount > 0 ? `−${toCurrency(promoDiscount)}` : '—'}
          </strong>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="client-checkout-money-row client-checkout-money-row-grand">
          <span>Tổng thanh toán</span>
          <strong>{toCurrency(payableTotal)}</strong>
        </div>
      </Card>

      <Card title="Giao hàng" className="client-checkout-ship-card">
        {isAuthenticated() ? (
          <div className="client-cart-shipping-block" style={{ borderTop: 'none', paddingTop: 0 }}>
            <ShippingAddressPicker
              addresses={addresses}
              loading={addressesLoading}
              value={selectedAddressId}
              onChange={(id) => setSelectedAddressId(id)}
            />
            <Link to="/client/account" className="client-cart-manage-addresses">
              Quản lý địa chỉ
            </Link>
          </div>
        ) : (
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            <Link to="/admin/login" state={{ from: `${location.pathname}${location.search}` }}>
              Đăng nhập
            </Link>{' '}
            để chọn địa chỉ giao hàng và đặt hàng COD.
          </Typography.Paragraph>
        )}
      </Card>

      <div className="client-checkout-place-order">
        <Button
          type="primary"
          size="large"
          loading={placingOrder}
          disabled={
            !isAuthenticated()
            || !selectedAddressId
            || addresses.length === 0
            || selectedItems.length === 0
          }
          onClick={async () => {
            if (!isAuthenticated()) {
              message.warning('Vui lòng đăng nhập để đặt hàng.')
              return
            }
            if (!selectedAddressId || addresses.length === 0) {
              message.warning('Thêm địa chỉ giao hàng trong Tài khoản trước khi đặt hàng.')
              return
            }

            try {
              if (appliedPromoCode) {
                const check = await previewPromoCode(appliedPromoCode, total)
                if (check.error) {
                  message.error(check.error)
                  return
                }
              }
              setPlacingOrder(true)
              const placed = await createCodOrder(
                selectedItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
                selectedAddressId,
                appliedPromoCode ? { promoCode: appliedPromoCode } : undefined
              )
              applyPurchasedItems(
                selectedItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))
              )
              clearPersistedCheckoutProductIds()
              const oc = placed.data?.orderCode
              message.success(oc ? `Đặt hàng thành công. Mã đơn: ${oc}` : 'Đặt hàng COD thành công.')
              navigate('/client/order-success', { state: { orderCode: oc } })
            } catch (error) {
              message.error(error instanceof Error ? error.message : 'Đặt hàng thất bại.')
            } finally {
              setPlacingOrder(false)
            }
          }}
        >
          Xác nhận đặt hàng COD
        </Button>
      </div>
    </section>
  )
}
