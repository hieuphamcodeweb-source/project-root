import { Button, Carousel, Descriptions, Divider, Spin, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../services/productsApi'
import { addToCart, applyPurchasedItems, getCartItemQuantity, subscribeCartUpdates } from '../../services/cart'
import { createCodOrder } from '../../services/ordersApi'
import type { ProductRecord } from '../../types'

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

const statusColors: Record<ProductRecord['status'], string> = {
  active: 'green',
  inactive: 'red',
  draft: 'gold',
}

export function ClientProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<ProductRecord | null>(null)
  const [cartQuantity, setCartQuantity] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        navigate('/client/products')
        return
      }

      try {
        setLoading(true)
        const result = await getProductById(id)
        setProduct(result.data)
      } catch {
        message.error('Cannot load product detail.')
        navigate('/client/products')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, navigate])

  useEffect(() => {
    function refreshCartQuantity() {
      if (!id) return
      setCartQuantity(getCartItemQuantity(id))
    }

    refreshCartQuantity()
    return subscribeCartUpdates(refreshCartQuantity)
  }, [id])

  if (loading || !product) {
    return (
      <div className="loading-panel">
        <Spin />
      </div>
    )
  }

  const isOutOfStock = product.status === 'inactive' || product.stock <= 0
  const isStockReached = cartQuantity >= product.stock || isOutOfStock
  const displayStatus: ProductRecord['status'] = isOutOfStock ? 'inactive' : product.status

  return (
    <section className="client-product-detail">
      <div className="client-product-topnav">
        <Link to="/client/products" className="client-back-link">
          Back to products
        </Link>
        <Button onClick={() => navigate('/admin/login')}>Admin login</Button>
      </div>

      <div className="client-product-hero">
        <div className="client-product-gallery">
          {isOutOfStock ? (
            <div className="client-product-out-overlay detail">
              <span>HET HANG</span>
            </div>
          ) : null}
          <Carousel autoplay className="client-carousel">
            {[product.thumbnailUrl, ...product.galleryUrls].map((url) => (
              <div key={url}>
                <img src={url} alt={product.name} className="client-product-detail-image" />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="client-product-summary">
          <Tag color={statusColors[displayStatus]}>{displayStatus.toUpperCase()}</Tag>
          <Typography.Title level={2} className="client-product-title">
            {product.name}
          </Typography.Title>
          <Typography.Paragraph className="client-product-category">{product.category}</Typography.Paragraph>
          <Typography.Title level={3} className="client-product-price">
            {toCurrency(product.price)}
          </Typography.Title>

          <div className="client-product-cta">
            <Button
              type="primary"
              size="large"
              loading={buyingNow}
              disabled={isOutOfStock}
              onClick={async () => {
                try {
                  setBuyingNow(true)
                  await createCodOrder([{ productId: product._id, quantity: 1 }])
                  applyPurchasedItems([{ productId: product._id, quantity: 1 }])
                  message.success('COD order placed successfully.')
                  navigate('/client/order-success')
                } catch (error) {
                  message.error(error instanceof Error ? error.message : 'Failed to place COD order.')
                } finally {
                  setBuyingNow(false)
                }
              }}
            >
              Buy now
            </Button>
            <Button
              size="large"
              loading={addingToCart}
              disabled={isStockReached || addingToCart}
              onClick={async () => {
                setAddingToCart(true)
                await new Promise((resolve) => {
                  setTimeout(resolve, 400)
                })
                const didAdd = addToCart(product, 1)
                if (didAdd) {
                  message.success(`${product.name} added to cart.`)
                } else {
                  message.warning('Stock limit reached. Cannot add more.')
                }
                setAddingToCart(false)
              }}
            >
              {isOutOfStock ? 'Het hang' : isStockReached ? 'INACTIVE in cart' : 'Add to cart'}
            </Button>
          </div>

          <div className="client-product-meta-list">
            <p>
              <strong>In stock:</strong> {product.stock} items
            </p>
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
          </div>
        </div>
      </div>

      <Divider />

      <Descriptions bordered column={1} className="client-product-specs">
        <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
        <Descriptions.Item label="Price">{toCurrency(product.price)}</Descriptions.Item>
        <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
      </Descriptions>
    </section>
  )
}