import type { EventMembershipStatus, EventRole, TeamRole } from '@/shared/types/common.types'

export interface EventMembership {
  id: string
  personId: string
  eventId: string
  status: EventMembershipStatus
  role: EventRole
  notes?: string
  createdAt: string
}

export interface TeamMembership {
  id: string
  personId: string
  eventTeamId: string
  teamRole: TeamRole
  assignedAt: string
}
