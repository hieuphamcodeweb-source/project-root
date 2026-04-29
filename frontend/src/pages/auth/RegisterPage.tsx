import { Button, Card, Form, Input, Select, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { registerAccount } from '../../services/authApi'
import type { AuthRole } from '../../services/auth'

interface RegisterValues {
  username: string
  password: string
  role: AuthRole
}

export function RegisterPage() {
  const navigate = useNavigate()

  async function handleRegister(values: RegisterValues) {
    try {
      await registerAccount(values)
      message.success('Register successfully. Please login.')
      navigate('/admin/login')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Register failed.')
    }
  }

  return (
    <div className="auth-screen">
      <Card className="auth-card" title="Create Account">
        <Typography.Paragraph type="secondary">Tao tai khoan moi va luu vao bang user.</Typography.Paragraph>
        <Form<RegisterValues> layout="vertical" onFinish={handleRegister} initialValues={{ role: 'user' }}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Username is required.' },
              { min: 3, message: 'Username must be at least 3 characters.' },
            ]}
          >
            <Input placeholder="your username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required.' },
              { min: 6, message: 'Password must be at least 6 characters.' },
            ]}
          >
            <Input.Password placeholder="at least 6 characters" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required.' }]}>
            <Select options={[{ label: 'User', value: 'user' }, { label: 'Admin', value: 'admin' }]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          <Typography.Paragraph type="secondary" className="auth-alt-link">
            Already have an account? <Link to="/admin/login">Login</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  )
}
