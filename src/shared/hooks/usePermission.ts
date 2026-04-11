import { useAuthStore } from '../store/auth.store'

export function usePermission() {
  const user = useAuthStore((s) => s.user)

  return {
    isAdmin: user?.systemRole === 'ADMIN',
    isOperatorOrAbove: ['ADMIN', 'OPERATOR'].includes(user?.systemRole ?? ''),
    isTeamLeaderOrAbove: ['ADMIN', 'OPERATOR', 'TEAM_LEADER'].includes(user?.systemRole ?? ''),
    isLegendario: user?.journeyStatus === 'LEGENDARIO',
    can: (action: PermissionAction): boolean => checkPermission(user?.systemRole, action),
  }
}

type PermissionAction =
  | 'create_event'
  | 'delete_event'
  | 'manage_persons'
  | 'review_memberships'
  | 'promote_journey'
  | 'manage_teams'

function checkPermission(role: string | undefined, action: PermissionAction): boolean {
  if (!role) return false

  const permissions: Record<PermissionAction, string[]> = {
    create_event:        ['ADMIN', 'OPERATOR'],
    delete_event:        ['ADMIN'],
    manage_persons:      ['ADMIN', 'OPERATOR'],
    review_memberships:  ['ADMIN', 'OPERATOR', 'TEAM_LEADER'],
    promote_journey:     ['ADMIN'],
    manage_teams:        ['ADMIN', 'OPERATOR', 'TEAM_LEADER'],
  }

  return permissions[action]?.includes(role) ?? false
}
