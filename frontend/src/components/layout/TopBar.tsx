import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../../services/auth'

const notifications = [
  { color: 'danger', value: 5 },
  { color: 'warning', value: 3 },
  { color: 'primary', value: 7 },
]

export function TopBar() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <header className="topbar">
      <div className="topbar-left" />
      <div className="topbar-right">
        <span>{currentUser?.fullName ?? 'Guest'}</span>
        <div className="notification-group" aria-label="Notifications">
          {notifications.map((item, index) => (
            <span key={`${item.color}-${index}`} className={`counter-dot ${item.color}`}>
              {item.value}
            </span>
          ))}
        </div>
        <button className="avatar-button" type="button" aria-label="Logout admin" onClick={handleLogout}>
          OUT
        </button>
      </div>
    </header>
  )
}
