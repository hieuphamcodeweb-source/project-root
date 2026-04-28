const notifications = [
  { color: 'danger', value: 5 },
  { color: 'warning', value: 3 },
  { color: 'primary', value: 7 },
]

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-left" />
      <div className="topbar-right">
        <div className="notification-group" aria-label="Notifications">
          {notifications.map((item, index) => (
            <span key={`${item.color}-${index}`} className={`counter-dot ${item.color}`}>
              {item.value}
            </span>
          ))}
        </div>
        <button className="avatar-button" type="button" aria-label="Open profile">
          HA
        </button>
      </div>
    </header>
  )
}
