import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const systemItems = ['Dashboard', 'Reports', 'Settings']
const managementGroups = [
  {
    id: 'users',
    label: 'Users',
    parentTo: '/admin/users',
    childItems: [{ to: '/admin/users/add', label: 'Add' }],
    matchPrefix: '/admin/users',
  },
  {
    id: 'products',
    label: 'Products',
    parentTo: '/admin/products',
    childItems: [{ to: '/admin/products/add', label: 'Add' }],
    matchPrefix: '/admin/products',
  },
  {
    id: 'categories',
    label: 'Categories',
    parentTo: '/admin/categories',
    childItems: [{ to: '/admin/categories/add', label: 'Add' }],
    matchPrefix: '/admin/categories',
  },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    users: false,
    products: false,
    categories: false,
  })

  useEffect(() => {
    const activeGroup = managementGroups.find((group) => pathname.startsWith(group.matchPrefix))
    if (activeGroup) {
      setExpandedGroups((prev) => ({ ...prev, [activeGroup.id]: true }))
    }
  }, [pathname])

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="brand">COREUI</div>
      <nav className="sidebar-nav">
        <p className="section-label">Management</p>

        {managementGroups.map((group) => {
          const isExpanded = expandedGroups[group.id]
          const isGroupActive = pathname.startsWith(group.matchPrefix)

          return (
            <div key={group.id} className="nav-group">
              <div className={`nav-group-header ${isGroupActive ? 'is-active' : ''}`}>
                <NavLink to={group.parentTo} end className={({ isActive }) => `nav-item nav-parent ${isActive ? 'is-active' : ''}`}>
                  <span>{group.label}</span>
                </NavLink>
                <button type="button" className="nav-expand-btn" onClick={() => toggleGroup(group.id)} aria-label={`Toggle ${group.label}`}>
                  {isExpanded ? '-' : '+'}
                </button>
              </div>

              {isExpanded ? (
                <div className="nav-submenu">
                  {group.childItems.map((child) => (
                    <NavLink key={child.to} to={child.to} className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} nav-child`}>
                      <span>{`${group.label} / ${child.label}`}</span>
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}

        <NavLink to="/client/products" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} nav-child`}>
          <span>Client / Products</span>
        </NavLink>
        <a href="#" className="nav-item">
          <span>Orders</span>
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
