import { Descriptions, Image, Select, Spin, Table, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { getOrderById, updateOrderStatus } from '../../services/ordersAdminApi'
import type { OrderItem, OrderRecord, OrderStatus } from '../../types'
import { formatAddressLines } from '../../utils/addressFormat'
import { statusLabelVi, statusSelectOptions } from '../../utils/orderStatus'

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
        message.error('Không tải được chi tiết đơn hàng.')
      } finally {
        setLoading(false)
      }
    }

    void loadOrder()
  }, [id])

  if (loading || !order) {
    return (
      <>
        <Breadcrumbs items={['Trang chủ', 'Quản trị', 'Đơn hàng', 'Chi tiết']} />
        <div className="loading-panel">
          <Spin />
        </div>
      </>
    )
  }

  const itemsLineSubtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <>
      <Breadcrumbs items={['Trang chủ', 'Quản trị', 'Đơn hàng', 'Chi tiết']} />
      <section className="product-detail-card">
        <Descriptions bordered column={2} className="product-descriptions">
          <Descriptions.Item label="Mã đơn hàng">
            {order.orderCode || order._id}
          </Descriptions.Item>
          <Descriptions.Item label="Mã khách (User ID)">{order.userId}</Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Thanh toán">COD</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(order.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
          <Descriptions.Item label="Tạm tính sản phẩm">{toCurrency(itemsLineSubtotal)}</Descriptions.Item>
          {(order.discountAmount ?? 0) > 0 ? (
            <>
              <Descriptions.Item label="Mã giảm giá">{order.promoCode || '—'}</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">−{toCurrency(order.discountAmount ?? 0)}</Descriptions.Item>
            </>
          ) : null}
          <Descriptions.Item label="Tổng thanh toán">{toCurrency(order.totalAmount)}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <div className="order-status-cell">
              <Tag color={statusColorMap[order.status]}>{statusLabelVi(order.status)}</Tag>
              <Select<OrderStatus>
                value={order.status}
                loading={updatingStatus}
                style={{ width: 160 }}
                options={statusSelectOptions}
                onChange={async (nextStatus) => {
                  if (!id) return
                  try {
                    setUpdatingStatus(true)
                    const result = await updateOrderStatus(id, nextStatus)
                    setOrder((prev) =>
                      prev
                        ? { ...prev, status: result.data.status, updatedAt: result.data.updatedAt }
                        : prev
                    )
                    message.success('Cập nhật trạng thái đơn hàng thành công.')
                  } catch (error) {
                    message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.')
                  } finally {
                    setUpdatingStatus(false)
                  }
                }}
              />
            </div>
          </Descriptions.Item>
          {order.shippingAddress?.recipientName ? (
            <>
              <Descriptions.Item label="Người nhận" span={2}>
                {order.shippingAddress.recipientName} · {order.shippingAddress.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {formatAddressLines(order.shippingAddress)}
              </Descriptions.Item>
            </>
          ) : (
            <Descriptions.Item label="Giao hàng" span={2}>
              —
            </Descriptions.Item>
          )}
        </Descriptions>

        <Table<OrderItem>
          rowKey={(record) => `${record.productId}-${record.sku}`}
          dataSource={order.items}
          pagination={false}
          columns={[
            {
              title: 'Ảnh',
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
              title: 'Sản phẩm',
              key: 'productName',
              render: (_, record) => record.product?.name || record.name,
            },
            {
              title: 'Danh mục',
              key: 'category',
              width: 140,
              render: (_, record) => record.product?.category || '-',
            },
            { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 140 },
            { title: 'Giá lúc mua', dataIndex: 'price', key: 'price', width: 150, render: (value: number) => toCurrency(value) },
            {
              title: 'Giá hiện tại',
              key: 'currentPrice',
              width: 140,
              render: (_, record) => (record.product ? toCurrency(record.product.currentPrice) : '-'),
            },
            { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 100 },
            { title: 'Thành tiền', dataIndex: 'subtotal', key: 'subtotal', width: 140, render: (value: number) => toCurrency(value) },
          ]}
        />
      </section>
    </>
  )
}
