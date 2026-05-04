import { Button, Select, Table, Tag, message } from 'antd'
import { useState } from 'react'
import type { OrderRecord, OrderStatus } from '../../types'
import { formatShippingSummary } from '../../utils/addressFormat'
import { statusLabelVi, statusSelectOptions } from '../../utils/orderStatus'

interface OrderTableProps {
  rows: OrderRecord[]
  loading?: boolean
  onView: (id: string) => void
  onChangeStatus: (id: string, status: OrderStatus) => Promise<void>
}

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

export function OrderTable({ rows, loading = false, onView, onChangeStatus }: OrderTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  return (
    <section className="datatable-card" aria-labelledby="order-table-title">
      <div className="datatable-header">
        <h1 id="order-table-title">Quản lý đơn hàng</h1>
      </div>

      <Table<OrderRecord>
        rowKey="_id"
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1320 }}
        columns={[
          {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            width: 130,
            render: (_, record) => record.orderCode || record._id,
          },
          { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: 170 },
          {
            title: 'Giao hàng',
            key: 'shipping',
            width: 260,
            ellipsis: true,
            render: (_, record) => formatShippingSummary(record.shippingAddress),
          },
          {
            title: 'Sản phẩm',
            key: 'itemsNames',
            width: 260,
            render: (_, record) =>
              record.items
                .map((item) => item.product?.name || item.name)
                .join(', '),
          },
          {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 140,
            render: (value: number) => toCurrency(value),
          },
          {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 110,
            render: () => 'COD',
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (status: OrderStatus, record) => (
              <div className="order-status-cell">
                <Tag color={statusColorMap[status]}>{statusLabelVi(status)}</Tag>
                <Select<OrderStatus>
                  size="small"
                  value={status}
                  loading={updatingId === record._id}
                  options={statusSelectOptions}
                  onChange={async (nextStatus) => {
                    try {
                      setUpdatingId(record._id)
                      await onChangeStatus(record._id, nextStatus)
                      message.success('Cập nhật trạng thái đơn hàng thành công.')
                    } catch (error) {
                      message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.')
                    } finally {
                      setUpdatingId(null)
                    }
                  }}
                  style={{ width: 140 }}
                />
              </div>
            ),
          },
          {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (createdAt: string) => new Date(createdAt).toLocaleString('vi-VN'),
          },
          {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
              <Button size="small" onClick={() => onView(record.orderCode || record._id)}>
                Chi tiết
              </Button>
            ),
          },
        ]}
      />
    </section>
  )
}
