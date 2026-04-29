import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdmin, isAuthenticated } from '../../services/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin()) {
    return <Navigate to="/client/products" replace />
  }

  return <>{children}</>
}
