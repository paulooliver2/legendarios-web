import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import type { SystemRole } from '@/shared/types/common.types'

interface RoleGuardProps {
  roles: SystemRole[]
}

export function RoleGuard({ roles }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !roles.includes(user.systemRole)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
