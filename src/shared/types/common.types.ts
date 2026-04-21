export type SystemRole = 'ADMIN' | 'OPERATOR' | 'TEAM_LEADER' | 'PISTA_LEADER' | 'VIEWER'
export type PistaMemberRole = 'MEMBRO' | 'SUB_COORDENADOR' | 'COORDENADOR' | 'LIDER'
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
export type EventStatus = 'PLANEJAMENTO' | 'INSCRICOES_ABERTAS' | 'EM_ANDAMENTO' | 'FINALIZADO'
export type EventType = 'TOP' | 'RPM' | 'OUTRO'

export interface AuthUser {
  id: string
  name: string
  systemRole: SystemRole
  journeyStatus: JourneyStatus
  pistaId?: string
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
