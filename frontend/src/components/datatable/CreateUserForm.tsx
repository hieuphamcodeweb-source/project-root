import { Button, Form, Input, Select, message } from 'antd'
import type { CreateUserPayload, UserRole, UserStatus } from '../../types'

interface CreateUserFormProps {
  onCreate: (payload: CreateUserPayload) => Promise<void>
}

const roles: UserRole[] = ['Staff', 'Admin', 'Member']
const statuses: UserStatus[] = ['active', 'inactive', 'pending', 'banned']

export function CreateUserForm({ onCreate }: CreateUserFormProps) {
  const [form] = Form.useForm<CreateUserPayload>()

  async function handleSubmit(values: CreateUserPayload) {
    try {
      await onCreate(values)
      message.success('User created successfully.')
      form.setFieldValue('username', '')
    } catch {
      message.error('Create user failed. Please check backend API.')
    }
  }

  return (
    <section className="create-user-panel" aria-labelledby="create-user-title">
      <h2 id="create-user-title">Create user</h2>

      <Form<CreateUserPayload>
        className="create-user-form"
        layout="vertical"
        form={form}
        initialValues={{
          username: '',
          dateRegistered: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
          role: 'Staff',
          status: 'active',
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please enter username.' },
            { min: 2, message: 'Username must be at least 2 characters.' },
          ]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          label="Date registered"
          name="dateRegistered"
          rules={[
            { required: true, message: 'Please enter register date.' },
            { pattern: /^\d{4}\/\d{2}\/\d{2}$/, message: 'Date must match YYYY/MM/DD.' },
          ]}
        >
          <Input placeholder="YYYY/MM/DD" />
        </Form.Item>

        <Form.Item<CreateUserPayload> label="Role" name="role" rules={[{ required: true, message: 'Please choose role.' }]}>
          <Select options={roles.map((role) => ({ label: role, value: role as UserRole }))} />
        </Form.Item>

        <Form.Item<CreateUserPayload> label="Status" name="status" rules={[{ required: true, message: 'Please choose status.' }]}>
          <Select options={statuses.map((status) => ({ label: status, value: status as UserStatus }))} />
        </Form.Item>

        <Form.Item className="create-user-submit">
          <Button type="primary" htmlType="submit">
            Add new user
          </Button>
        </Form.Item>
      </Form>
    </section>
  )
}
