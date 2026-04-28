import type { UserStatus } from '../../types'

interface StatusBadgeProps {
  status: UserStatus
}

const statusLabel: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  banned: 'Banned',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge ${status}`}>{statusLabel[status]}</span>
}
