import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '../routes'

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
