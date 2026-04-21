import { useAuthStore } from '../store/auth.store'

type PermissionAction =
  | 'create_person'
  | 'create_event'
  | 'delete_event'
  | 'manage_persons'
  | 'review_memberships'
  | 'promote_journey'
  | 'manage_teams'
  | 'add_pista_member'
  | 'inscribe_event'

export function usePermission() {
  const user = useAuthStore((s) => s.user)
  const role = user?.systemRole
  const journey = user?.journeyStatus
  const isPreLegendario = role === 'VIEWER' && journey === 'PRE_LEGENDARIO'
  const isLegendario = role === 'VIEWER' && journey === 'LEGENDARIO'

  return {
    isAdmin: role === 'ADMIN',
    isOperatorOrAbove: ['ADMIN', 'OPERATOR'].includes(role ?? ''),
    isTeamLeaderOrAbove: ['ADMIN', 'OPERATOR', 'TEAM_LEADER'].includes(role ?? ''),
    isLegendario,
    isPreLegendario,
    can: (action: PermissionAction): boolean => {
      if (!role) return false

      if (isPreLegendario) {
        return action === 'inscribe_event'
      }

      const permissions: Record<PermissionAction, string[]> = {
        create_person:      ['ADMIN', 'OPERATOR'],
        create_event:       ['ADMIN', 'OPERATOR'],
        delete_event:       ['ADMIN'],
        manage_persons:     ['ADMIN', 'OPERATOR'],
        review_memberships: ['ADMIN', 'OPERATOR', 'TEAM_LEADER'],
        promote_journey:    ['ADMIN'],
        manage_teams:       ['ADMIN', 'OPERATOR', 'TEAM_LEADER'],
        add_pista_member:   ['ADMIN', 'OPERATOR', 'PISTA_LEADER'],
        inscribe_event:     ['ADMIN', 'OPERATOR', 'TEAM_LEADER', 'VIEWER'],
      }

      return permissions[action]?.includes(role) ?? false
    },
  }
}
