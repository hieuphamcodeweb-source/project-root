import { Button, Image, Popconfirm, Table, Tag, message } from 'antd'
import type { ProductRecord } from '../../types'

interface ProductTableProps {
  rows: ProductRecord[]
  loading?: boolean
  deletingId?: string | null
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
}

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

export function ProductTable({ rows, loading = false, deletingId = null, onView, onEdit, onDelete }: ProductTableProps) {
  return (
    <section className="datatable-card" aria-labelledby="product-table-title">
      <div className="datatable-header">
        <h1 id="product-table-title">Products</h1>
      </div>

      <Table<ProductRecord>
        rowKey="_id"
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        columns={[
          {
            title: 'Image',
            key: 'image',
            width: 86,
            render: (_, record) => <Image width={52} height={52} src={record.thumbnailUrl} alt={record.name} className="image-preview" />,
          },
          { title: 'Name', dataIndex: 'name', key: 'name', width: 180 },
          { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 130 },
          { title: 'Category', dataIndex: 'category', key: 'category', width: 130 },
          {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => toCurrency(price),
          },
          { title: 'Stock', dataIndex: 'stock', key: 'stock', width: 90 },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: ProductRecord['status']) => <Tag color={statusColorMap[status]}>{status.toUpperCase()}</Tag>,
          },
          {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 170,
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
          },
          {
            title: 'Action',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
              <div className="product-actions">
                <Button size="small" onClick={() => onView(record._id)}>
                  View
                </Button>
                <Button size="small" onClick={() => onEdit(record._id)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete product"
                  description="Are you sure to delete this product?"
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true, loading: deletingId === record._id }}
                  onConfirm={async () => {
                    try {
                      await onDelete(record._id)
                      message.success('Product deleted successfully.')
                    } catch (error) {
                      message.error(error instanceof Error ? error.message : 'Delete product failed.')
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
