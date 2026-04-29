import { Card, Col, Row, Spin, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/productsApi'
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

function isOutOfStock(product: ProductRecord) {
  return product.status === 'inactive' || product.stock <= 0
}

export function ClientProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const result = await getProducts()
        const nextProducts = result.data
          .filter((item) => item.status === 'active' || item.status === 'inactive' || item.stock <= 0)
          .sort((a, b) => Number(isOutOfStock(a)) - Number(isOutOfStock(b)))
        setProducts(nextProducts)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section className="client-products-page">
      <header className="client-products-header">
        <Typography.Title level={2}>Client Products</Typography.Title>
        <Typography.Paragraph type="secondary">Danh sach san pham dang hoat dong.</Typography.Paragraph>
      </header>

      {loading ? (
        <div className="loading-panel">
          <Spin />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} lg={8} key={product._id}>
              <div className="client-product-card-wrap">
                {isOutOfStock(product) ? (
                  <div className="client-product-out-overlay">
                    <span>HET HANG</span>
                  </div>
                ) : null}
                <Card
                  className={isOutOfStock(product) ? 'client-product-card is-out-of-stock' : 'client-product-card'}
                  cover={<img src={product.thumbnailUrl} alt={product.name} className="client-product-thumb" />}
                  actions={[<Link key="detail" to={`/client/products/${product._id}`}>View detail</Link>]}
                >
                  <Card.Meta title={product.name} description={product.category} />
                  <div className="client-product-meta">
                    <strong>{toCurrency(product.price)}</strong>
                    <Tag color={statusColorMap[isOutOfStock(product) ? 'inactive' : product.status]}>
                      {isOutOfStock(product) ? 'INACTIVE' : product.status.toUpperCase()}
                    </Tag>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </section>
  )
}
