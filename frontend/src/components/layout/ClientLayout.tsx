import { Button } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'

export function ClientLayout() {
  const navigate = useNavigate()

  return (
    <div className="client-shell">
      <header className="client-topbar">
        <strong>Shop Client</strong>
        <Button type="primary" onClick={() => navigate('/admin/login')}>
          Admin
        </Button>
      </header>
      <main className="client-content">
        <Outlet />
      </main>
    </div>
  )
}
