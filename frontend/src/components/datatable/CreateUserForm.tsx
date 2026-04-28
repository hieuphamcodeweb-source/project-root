import { UserForm } from './UserForm'
import type { CreateUserPayload } from '../../types'

interface CreateUserFormProps {
  onCreate: (payload: CreateUserPayload) => Promise<void>
}

export function CreateUserForm({ onCreate }: CreateUserFormProps) {
  return (
    <UserForm
      title="Create user"
      submitLabel="Add new user"
      successMessage="User created successfully."
      initialValues={{
        username: '',
        dateRegistered: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
        role: 'Staff',
        status: 'active',
      }}
      onSubmit={onCreate}
    />
  )
}
