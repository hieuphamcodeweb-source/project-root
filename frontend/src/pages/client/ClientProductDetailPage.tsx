import { Button, Carousel, Descriptions, Spin, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../services/productsApi'
import type { ProductRecord } from '../../types'

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function ClientProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<ProductRecord | null>(null)

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

  if (loading || !product) {
    return (
      <div className="loading-panel">
        <Spin />
      </div>
    )
  }

  return (
    <section className="client-product-detail">
      <div className="client-product-detail-header">
        <Typography.Title level={2}>{product.name}</Typography.Title>
        <div className="product-actions">
          <Link to="/client/products">Back to products</Link>
          <Button type="primary" onClick={() => navigate('/admin/login')}>
            Admin login
          </Button>
        </div>
      </div>

      <Carousel autoplay className="client-carousel">
        {[product.thumbnailUrl, ...product.galleryUrls].map((url) => (
          <div key={url}>
            <img src={url} alt={product.name} className="client-product-detail-image" />
          </div>
        ))}
      </Carousel>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
        <Descriptions.Item label="Price">{toCurrency(product.price)}</Descriptions.Item>
        <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
      </Descriptions>
    </section>
  )
}
