import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { CreateUserForm } from '../../components/datatable/CreateUserForm'
import { createUser } from '../../services/usersApi'
import type { CreateUserPayload } from '../../types'

export function UserAddPage() {
  const navigate = useNavigate()

  async function handleCreateUser(payload: CreateUserPayload) {
    await createUser(payload)
    navigate('/admin/users')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Users', 'Add']} />
      <CreateUserForm onCreate={handleCreateUser} />
    </>
  )
}
