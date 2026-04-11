export type SystemRole = 'ADMIN' | 'OPERATOR' | 'TEAM_LEADER' | 'VIEWER'
export type JourneyStatus = 'PRE_LEGENDARIO' | 'LEGENDARIO'
export type EventMembershipStatus =
  | 'PRE_INSCRITO'
  | 'INSCRITO'
  | 'EM_ANALISE'
  | 'APROVADO'
  | 'RECUSADO'
  | 'CANCELADO'
export type EventRole = 'PARTICIPANTE' | 'SERVO' | 'LIDER' | 'COORDENADOR'
export type TeamRole = 'MEMBRO' | 'LIDER'
export type EventType = 'TOP' | 'RPM' | 'OUTRO'

export interface AuthUser {
  id: string
  name: string
  systemRole: SystemRole
  journeyStatus: JourneyStatus
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  message: string
  details?: Record<string, string[]>
}
