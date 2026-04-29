import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getCartCount, initializeCartFromApi, subscribeCartUpdates } from '../../services/cart'

export function ClientLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    async function bootstrapCart() {
      try {
        await initializeCartFromApi()
      } catch {
        // Skip blocking UI if cart API is unavailable
      }
    }

    function refreshCount() {
      setCartCount(getCartCount())
    }

    void bootstrapCart()
    refreshCount()
    return subscribeCartUpdates(refreshCount)
  }, [])

  return (
    <div className="client-shell">
      <header className="client-topbar">
        <strong>Shop Client</strong>
        <div className="client-topbar-actions">
          <Button
            onClick={() => {
              if (location.pathname === '/client/cart') {
                window.location.reload()
                return
              }
              navigate('/client/cart', { state: { refreshAt: Date.now() } })
            }}
          >
            Cart ({cartCount})
          </Button>
          <Button type="primary" onClick={() => navigate('/admin/login')}>
            Admin
          </Button>
        </div>
      </header>
      <main className="client-content">
        <Outlet />
      </main>
    </div>
  )
}
