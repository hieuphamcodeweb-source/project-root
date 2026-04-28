import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { DataTable } from '../../components/datatable/DataTable'
import { deleteUser, getUsers } from '../../services/usersApi'
import type { UserRecord } from '../../types'

export function UsersListPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true)
        const result = await getUsers()
        setUsers(result.data)
        setError(null)
      } catch {
        setError('Cannot load user data from backend API.')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  async function handleDeleteUser(id: number) {
    try {
      setDeletingUserId(id)
      await deleteUser(id)
      setUsers((prev) => prev.filter((user) => user.id !== id))
      message.success('User deleted successfully.')
    } catch {
      message.error('Delete user failed.')
    } finally {
      setDeletingUserId(null)
    }
  }

  function handleEditUser(id: number) {
    navigate(`/admin/users/${id}/edit`)
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Users']} />
      <DataTable
        rows={users}
        loading={loading}
        error={error}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        deletingUserId={deletingUserId}
      />
    </>
  )
}
