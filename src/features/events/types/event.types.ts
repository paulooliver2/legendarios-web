import type { EventType, EventStatus } from '@/shared/types/common.types'

export interface Event {
  id: string
  name: string
  type: EventType
  status: EventStatus
  description?: string
  startDate: string
  endDate?: string
  location?: string
  uf?: string
  cidade?: string
  limiteServos?: number
  limiteParticipantes?: number
  inscritosServos?: number
  inscritosParticipantes?: number
  requirements?: Record<string, string[]>
  pistaId?: string
  pista?: { id: string; name: string }
  createdAt: string
}

export interface EventTeam {
  id: string
  eventId: string
  name: string
  description?: string
}
