import { Popconfirm } from 'antd'

interface ActionButtonsProps {
  onEdit: () => void
  onDelete: () => Promise<void>
  deleting?: boolean
}

export function ActionButtons({ onEdit, onDelete, deleting = false }: ActionButtonsProps) {
  return (
    <div className="action-group">
      <button className="action-btn action-view" type="button" aria-label="View details" disabled>
        ◔
      </button>
      <button className="action-btn action-edit" type="button" aria-label="Edit record" onClick={onEdit}>
        ✎
      </button>
      <Popconfirm
        title="Delete user"
        description="Are you sure you want to delete this user?"
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleting }}
        onConfirm={onDelete}
      >
        <button className="action-btn action-delete" type="button" aria-label="Delete record" disabled={deleting}>
          🗑
        </button>
      </Popconfirm>
    </div>
  )
}
