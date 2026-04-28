import { Button, Popconfirm, Table, Tag, message } from 'antd'
import type { CategoryRecord } from '../../types'

interface CategoryTableProps {
  rows: CategoryRecord[]
  loading?: boolean
  deletingId?: string | null
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
}

const statusColorMap: Record<CategoryRecord['status'], string> = {
  active: 'green',
  inactive: 'red',
  draft: 'gold',
}

export function CategoryTable({ rows, loading = false, deletingId = null, onEdit, onDelete }: CategoryTableProps) {
  return (
    <section className="datatable-card" aria-labelledby="category-table-title">
      <div className="datatable-header">
        <h1 id="category-table-title">Categories</h1>
      </div>

      <Table<CategoryRecord>
        rowKey="_id"
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        columns={[
          { title: 'Category code', dataIndex: 'categoryCode', key: 'categoryCode', width: 150 },
          { title: 'Category name', dataIndex: 'categoryName', key: 'categoryName', width: 200 },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: CategoryRecord['status']) => <Tag color={statusColorMap[status]}>{status.toUpperCase()}</Tag>,
          },
          { title: 'Sort order', dataIndex: 'sortOrder', key: 'sortOrder', width: 100 },
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
            width: 180,
            fixed: 'right',
            render: (_, record) => (
              <div className="product-actions">
                <Button size="small" onClick={() => onEdit(record._id)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete category"
                  description="Are you sure to delete this category?"
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true, loading: deletingId === record._id }}
                  onConfirm={async () => {
                    try {
                      await onDelete(record._id)
                      message.success('Category deleted successfully.')
                    } catch (error) {
                      message.error(error instanceof Error ? error.message : 'Delete category failed.')
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
