import { Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../services/auth'

interface LoginValues {
  username: string
  password: string
}

export function LoginPage() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin/users'

  async function handleLogin() {
    try {
      setSubmitting(true)
      login()
      navigate(redirectTo, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-screen">
      <Card className="auth-card" title="Admin Login">
        <Typography.Paragraph type="secondary">Đăng nhập để truy cập khu vực quản trị.</Typography.Paragraph>
        <Form<LoginValues> layout="vertical" onFinish={handleLogin} initialValues={{ username: 'admin' }}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required.' }]}>
            <Input placeholder="admin" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required.' }]}>
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
