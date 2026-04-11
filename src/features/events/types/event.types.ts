import type { EventType } from '@/shared/types/common.types'

export interface Event {
  id: string
  name: string
  type: EventType
  description?: string
  startDate: string
  endDate?: string
  location?: string
  isPublished: boolean
  createdAt: string
}

export interface EventTeam {
  id: string
  eventId: string
  name: string
  description?: string
}
