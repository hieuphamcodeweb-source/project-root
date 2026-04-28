import { Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { UserForm } from '../../components/datatable/UserForm'
import { getUserById, updateUser } from '../../services/usersApi'
import type { CreateUserPayload } from '../../types'

export function UserEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userId = Number(id)
  const [initialValues, setInitialValues] = useState<CreateUserPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!Number.isInteger(userId) || userId <= 0) {
        message.error('Invalid user id.')
        navigate('/admin/users')
        return
      }

      try {
        setLoading(true)
        const result = await getUserById(userId)
        setInitialValues({
          username: result.data.username,
          dateRegistered: result.data.dateRegistered,
          role: result.data.role,
          status: result.data.status,
        })
      } catch {
        message.error('Cannot load user by id.')
        navigate('/admin/users')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [navigate, userId])

  async function handleUpdateUser(payload: CreateUserPayload) {
    await updateUser(userId, payload)
    navigate('/admin/users')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Users', 'Edit']} />
      {loading || !initialValues ? (
        <div className="loading-panel">
          <Spin />
        </div>
      ) : (
        <UserForm
          title={`Edit user #${userId}`}
          submitLabel="Update user"
          successMessage="User updated successfully."
          initialValues={initialValues}
          onSubmit={handleUpdateUser}
        />
      )}
    </>
  )
}
