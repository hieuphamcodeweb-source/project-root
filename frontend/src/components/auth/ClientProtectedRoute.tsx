import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../services/auth'

interface ClientProtectedRouteProps {
  children: ReactNode
}

export function ClientProtectedRoute({ children }: ClientProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <>{children}</>
}
