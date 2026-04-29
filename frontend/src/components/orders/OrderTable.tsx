import { Button, Select, Table, Tag, message } from 'antd'
import { useState } from 'react'
import type { OrderRecord, OrderStatus } from '../../types'

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
        <h1 id="order-table-title">Orders</h1>
      </div>

      <Table<OrderRecord>
        rowKey="_id"
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1100 }}
        columns={[
          { title: 'Order ID', dataIndex: '_id', key: '_id', width: 220 },
          { title: 'User ID', dataIndex: 'userId', key: 'userId', width: 100 },
          { title: 'Customer', dataIndex: 'customerName', key: 'customerName', width: 170 },
          {
            title: 'Items',
            key: 'itemsNames',
            width: 260,
            render: (_, record) =>
              record.items
                .map((item) => item.product?.name || item.name)
                .join(', '),
          },
          {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 140,
            render: (value: number) => toCurrency(value),
          },
          {
            title: 'Payment',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 100,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (status: OrderStatus, record) => (
              <div className="order-status-cell">
                <Tag color={statusColorMap[status]}>{status.toUpperCase()}</Tag>
                <Select<OrderStatus>
                  size="small"
                  value={status}
                  loading={updatingId === record._id}
                  options={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Cancelled', value: 'cancelled' },
                  ]}
                  onChange={async (nextStatus) => {
                    try {
                      setUpdatingId(record._id)
                      await onChangeStatus(record._id, nextStatus)
                      message.success('Order status updated successfully.')
                    } catch (error) {
                      message.error(error instanceof Error ? error.message : 'Update order status failed.')
                    } finally {
                      setUpdatingId(null)
                    }
                  }}
                  style={{ width: 120 }}
                />
              </div>
            ),
          },
          {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
          },
          {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
              <Button size="small" onClick={() => onView(record._id)}>
                Detail
              </Button>
            ),
          },
        ]}
      />
    </section>
  )
}
