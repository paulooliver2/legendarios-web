import { apiClient } from '@/shared/api/client'
import type { Event, EventTeam } from '../types/event.types'
import type { PaginatedResponse, EventType, EventStatus } from '@/shared/types/common.types'

export const eventsApi = {
  list: (params?: { page?: number; limit?: number; type?: EventType; status?: EventStatus }) =>
    apiClient.get<PaginatedResponse<Event>>('/events', { params }),
  getById: (id: string) =>
    apiClient.get<Event & { teams: EventTeam[] }>(`/events/${id}`),
  create: (data: {
    name: string
    type: EventType
    startDate: string
    endDate?: string
    description?: string
    location?: string
    uf?: string
    cidade?: string
    limiteServos?: number
    limiteParticipantes?: number
    requirements?: Record<string, string[]>
    pistaId?: string
  }) => apiClient.post<Event>('/events', data),
  update: (id: string, data: Partial<Event>) =>
    apiClient.patch<Event>(`/events/${id}`, data),
  updateStatus: (id: string, status: EventStatus) =>
    apiClient.patch<Event>(`/events/${id}/status`, { status }),
  delete: (id: string) =>
    apiClient.delete(`/events/${id}`),

  listTeams: (eventId: string) =>
    apiClient.get<EventTeam[]>(`/events/${eventId}/teams`),
  createTeam: (eventId: string, data: { name: string }) =>
    apiClient.post<EventTeam>(`/events/${eventId}/teams`, data),
}
