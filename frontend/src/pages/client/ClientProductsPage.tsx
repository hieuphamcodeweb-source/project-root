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

export function ClientProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const result = await getProducts()
        setProducts(result.data.filter((item) => item.status === 'active'))
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
              <Card
                cover={<img src={product.thumbnailUrl} alt={product.name} className="client-product-thumb" />}
                actions={[<Link key="detail" to={`/client/products/${product._id}`}>View detail</Link>]}
              >
                <Card.Meta title={product.name} description={product.category} />
                <div className="client-product-meta">
                  <strong>{toCurrency(product.price)}</strong>
                  <Tag color={statusColorMap[product.status]}>{product.status.toUpperCase()}</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  )
}
