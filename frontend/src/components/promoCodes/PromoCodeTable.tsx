import { Button, Popconfirm, Table, Tag, message } from 'antd'
import type { PromoCodeRecord } from '../../types'

interface PromoCodeTableProps {
  rows: PromoCodeRecord[]
  loading?: boolean
  deletingId?: string | null
  onAdd?: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
}

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDt(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function effectivePerUserLimit(r: PromoCodeRecord) {
  return r.perUserUsageLimit ?? r.usageLimit ?? null
}

export function PromoCodeTable({ rows, loading = false, deletingId = null, onAdd, onEdit, onDelete }: PromoCodeTableProps) {
  return (
    <section className="datatable-card" aria-labelledby="promo-code-table-title">
      <div
        className="datatable-header"
        style={onAdd ? { justifyContent: 'space-between' } : undefined}
      >
        <h1 id="promo-code-table-title">Promo codes</h1>
        {onAdd ? (
          <Button type="primary" onClick={onAdd}>
            Add promo
          </Button>
        ) : null}
      </div>

      <Table<PromoCodeRecord>
        rowKey="_id"
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 12 }}
        scroll={{ x: 1100 }}
        columns={[
          { title: 'Code', dataIndex: 'code', key: 'code', width: 120, fixed: 'left' },
          { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, width: 180 },
          {
            title: 'Discount',
            key: 'discount',
            width: 140,
            render: (_, r) => (r.discountType === 'percent' ? `${r.value}%` : toCurrency(r.value)),
          },
          {
            title: 'Min order',
            dataIndex: 'minOrderAmount',
            key: 'minOrderAmount',
            width: 100,
            render: (v: number) => toCurrency(v ?? 0),
          },
          {
            title: 'Cap',
            key: 'cap',
            width: 100,
            render: (_, r) => (r.discountType === 'percent' && r.maxDiscountAmount != null ? toCurrency(r.maxDiscountAmount) : '—'),
          },
          {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 90,
            render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'YES' : 'NO'}</Tag>,
          },
          {
            title: 'Giới hạn / TK',
            key: 'perUser',
            width: 120,
            render: (_, r) => {
              const lim = effectivePerUserLimit(r)
              return lim == null ? '∞' : `${lim} lần`
            },
          },
          { title: 'Starts', dataIndex: 'startsAt', key: 'startsAt', width: 150, render: formatDt },
          { title: 'Ends', dataIndex: 'endsAt', key: 'endsAt', width: 150, render: formatDt },
          {
            title: 'Action',
            key: 'action',
            width: 160,
            fixed: 'right',
            render: (_, record) => (
              <div className="product-actions">
                <Button size="small" onClick={() => onEdit(record._id)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete promo code"
                  description="Delete this promo? Existing orders are unchanged."
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true, loading: deletingId === record._id }}
                  onConfirm={async () => {
                    try {
                      await onDelete(record._id)
                      message.success('Promo code deleted.')
                    } catch (error) {
                      message.error(error instanceof Error ? error.message : 'Delete failed.')
                    }
                  }}
                >
                  <Button danger size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />
    </section>
  )
}
