import { NavLink } from 'react-router-dom'

const systemItems = ['Dashboard', 'Reports', 'Settings']

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="brand">COREUI</div>
      <nav className="sidebar-nav">
        <p className="section-label">Management</p>
        <NavLink to="/users" end className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} nav-parent`}>
          <span>Users</span>
        </NavLink>
        <NavLink to="/users/add" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} nav-child`}>
          <span>Users / Add</span>
        </NavLink>
        <NavLink to="/products" end className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} nav-parent`}>
          <span>Products</span>
        </NavLink>
        <NavLink to="/products/add" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} nav-child`}>
          <span>Products / Add</span>
        </NavLink>
        <a href="#" className="nav-item">
          <span>Orders</span>
        </a>
        <a href="#" className="nav-item">
          <span>Categories</span>
        </a>

        <p className="section-label">System</p>
        {systemItems.map((item) => (
          <a key={item} href="#" className="nav-item">
            <span>{item}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
