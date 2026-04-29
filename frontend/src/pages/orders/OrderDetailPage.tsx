import { Descriptions, Image, Select, Spin, Table, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { getOrderById, updateOrderStatus } from '../../services/ordersAdminApi'
import type { OrderItem, OrderRecord, OrderStatus } from '../../types'

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'gold',
  confirmed: 'blue',
  completed: 'green',
  cancelled: 'red',
}

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    async function loadOrder() {
      if (!id) return
      try {
        setLoading(true)
        const result = await getOrderById(id)
        setOrder(result.data)
      } catch {
        message.error('Cannot load order detail.')
      } finally {
        setLoading(false)
      }
    }

    void loadOrder()
  }, [id])

  if (loading || !order) {
    return (
      <>
        <Breadcrumbs items={['Home', 'Management', 'Orders', 'Detail']} />
        <div className="loading-panel">
          <Spin />
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Orders', 'Detail']} />
      <section className="product-detail-card">
        <Descriptions bordered column={2} className="product-descriptions">
          <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
          <Descriptions.Item label="User ID">{order.userId}</Descriptions.Item>
          <Descriptions.Item label="Customer">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Payment">{order.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Created at">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Total">{toCurrency(order.totalAmount)}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <div className="order-status-cell">
              <Tag color={statusColorMap[order.status]}>{order.status.toUpperCase()}</Tag>
              <Select<OrderStatus>
                value={order.status}
                loading={updatingStatus}
                style={{ width: 140 }}
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Confirmed', value: 'confirmed' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                onChange={async (nextStatus) => {
                  if (!id) return
                  try {
                    setUpdatingStatus(true)
                    const result = await updateOrderStatus(id, nextStatus)
                    setOrder(result.data)
                    message.success('Order status updated successfully.')
                  } catch (error) {
                    message.error(error instanceof Error ? error.message : 'Update order status failed.')
                  } finally {
                    setUpdatingStatus(false)
                  }
                }}
              />
            </div>
          </Descriptions.Item>
        </Descriptions>

        <Table<OrderItem>
          rowKey={(record) => `${record.productId}-${record.sku}`}
          dataSource={order.items}
          pagination={false}
          columns={[
            {
              title: 'Image',
              key: 'thumbnail',
              width: 90,
              render: (_, record) =>
                record.product?.thumbnailUrl ? (
                  <Image width={54} height={54} src={record.product.thumbnailUrl} alt={record.product.name} className="image-preview" />
                ) : (
                  '-'
                ),
            },
            {
              title: 'Product',
              key: 'productName',
              render: (_, record) => record.product?.name || record.name,
            },
            {
              title: 'Category',
              key: 'category',
              width: 140,
              render: (_, record) => record.product?.category || '-',
            },
            { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 140 },
            { title: 'Price at purchase', dataIndex: 'price', key: 'price', width: 150, render: (value: number) => toCurrency(value) },
            {
              title: 'Current price',
              key: 'currentPrice',
              width: 140,
              render: (_, record) => (record.product ? toCurrency(record.product.currentPrice) : '-'),
            },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 100 },
            { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', width: 140, render: (value: number) => toCurrency(value) },
          ]}
        />
      </section>
    </>
  )
}
