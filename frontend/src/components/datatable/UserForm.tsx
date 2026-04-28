import { Button, Form, Input, Select, message } from 'antd'
import type { CreateUserPayload, UserRole, UserStatus } from '../../types'

interface UserFormProps {
  title: string
  submitLabel: string
  initialValues: CreateUserPayload
  successMessage: string
  onSubmit: (payload: CreateUserPayload) => Promise<void>
}

const roles: UserRole[] = ['Staff', 'Admin', 'Member']
const statuses: UserStatus[] = ['active', 'inactive', 'pending', 'banned']

export function UserForm({ title, submitLabel, initialValues, successMessage, onSubmit }: UserFormProps) {
  const [form] = Form.useForm<CreateUserPayload>()

  async function handleSubmit(values: CreateUserPayload) {
    try {
      await onSubmit(values)
      message.success(successMessage)
    } catch {
      message.error('Request failed. Please check validation and backend API.')
    }
  }

  return (
    <section className="create-user-panel" aria-labelledby="user-form-title">
      <h2 id="user-form-title">{title}</h2>

      <Form<CreateUserPayload>
        className="create-user-form"
        layout="vertical"
        form={form}
        initialValues={initialValues}
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
            {submitLabel}
          </Button>
        </Form.Item>
      </Form>
    </section>
  )
}
