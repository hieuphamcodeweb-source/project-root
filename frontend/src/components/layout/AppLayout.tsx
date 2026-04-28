import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-content">
        <TopBar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
