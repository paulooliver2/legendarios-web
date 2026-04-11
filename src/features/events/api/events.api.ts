import { apiClient } from '@/shared/api/client'
import type { Event, EventTeam } from '../types/event.types'
import type { PaginatedResponse, EventType } from '@/shared/types/common.types'

export const eventsApi = {
  list: (params?: { page?: number; limit?: number; type?: EventType; published?: boolean }) =>
    apiClient.get<PaginatedResponse<Event>>('/events', { params }),
  getById: (id: string) =>
    apiClient.get<Event & { teams: EventTeam[] }>(`/events/${id}`),
  create: (data: { name: string; type: EventType; startDate: string; description?: string; location?: string }) =>
    apiClient.post<Event>('/events', data),
  update: (id: string, data: Partial<Event>) =>
    apiClient.patch<Event>(`/events/${id}`, data),
  publish: (id: string, isPublished: boolean) =>
    apiClient.patch<Event>(`/events/${id}/publish`, { isPublished }),
  delete: (id: string) =>
    apiClient.delete(`/events/${id}`),

  // Teams
  listTeams: (eventId: string) =>
    apiClient.get<EventTeam[]>(`/events/${eventId}/teams`),
  createTeam: (eventId: string, data: { name: string }) =>
    apiClient.post<EventTeam>(`/events/${eventId}/teams`, data),
}
