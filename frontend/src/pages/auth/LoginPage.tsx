import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginWithCredentials } from '../../services/authApi'

interface LoginValues {
  username: string
  password: string
}

export function LoginPage() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = (location.state as { from?: string } | null)?.from

  async function handleLogin(values: LoginValues) {
    try {
      setSubmitting(true)
      const session = await loginWithCredentials(values)
      if (session.user.role === 'admin') {
        const to =
          fromPath && fromPath.startsWith('/admin') ? fromPath : '/admin/users'
        navigate(to, { replace: true })
      } else {
        message.info('Logged in as user. Redirecting to client area.')
        const to =
          fromPath && fromPath.startsWith('/client') ? fromPath : '/client/products'
        navigate(to, { replace: true })
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-screen">
      <Card className="auth-card" title="Admin Login">
        <Typography.Paragraph type="secondary">
          Login with your account. If you do not have one, create it from Register.
        </Typography.Paragraph>
        <Form<LoginValues> layout="vertical" onFinish={handleLogin}>
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
        <Typography.Paragraph type="secondary" className="auth-alt-link">
          No account yet? <Link to="/admin/register">Register now</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  )
}
