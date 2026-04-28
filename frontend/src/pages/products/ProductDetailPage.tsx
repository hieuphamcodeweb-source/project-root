import { Button, Descriptions, Image, Spin, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { getProductById } from '../../services/productsApi'
import type { ProductRecord } from '../../types'

const statusColorMap: Record<ProductRecord['status'], string> = {
  active: 'green',
  inactive: 'red',
  draft: 'gold',
}

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<ProductRecord | null>(null)

  useEffect(() => {
    async function loadProductDetail() {
      if (!id) {
        navigate('/admin/products')
        return
      }

      try {
        setLoading(true)
        const result = await getProductById(id)
        setProduct(result.data)
      } catch {
        message.error('Cannot load product detail.')
        navigate('/admin/products')
      } finally {
        setLoading(false)
      }
    }

    loadProductDetail()
  }, [id, navigate])

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Products', 'Detail']} />

      {loading || !product ? (
        <div className="loading-panel">
          <Spin />
        </div>
      ) : (
        <section className="product-detail-card">
          <div className="product-detail-header">
            <h1>{product.name}</h1>
            <div className="product-actions">
              <Button onClick={() => navigate('/admin/products')}>Back to list</Button>
              <Button type="primary" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                Edit product
              </Button>
            </div>
          </div>

          <Descriptions bordered column={2} className="product-descriptions">
            <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
            <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
            <Descriptions.Item label="Price">{toCurrency(product.price)}</Descriptions.Item>
            <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColorMap[product.status]}>{product.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created at">{new Date(product.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>

          <div className="preview-row">
            <p>Thumbnail</p>
            <Image width={180} height={180} src={product.thumbnailUrl} alt={product.name} className="image-preview" />
          </div>

          <div className="preview-row">
            <p>Gallery</p>
            <div className="gallery-preview">
              {product.galleryUrls.length === 0 ? (
                <span className="empty-note">No gallery images.</span>
              ) : (
                product.galleryUrls.map((url) => (
                  <Image key={url} width={110} height={110} src={url} alt="Product gallery" className="image-preview" />
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
