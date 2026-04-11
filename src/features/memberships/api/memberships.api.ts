import { apiClient } from '@/shared/api/client'
import type { EventMembership } from '../types/membership.types'
import type { EventMembershipStatus, EventRole } from '@/shared/types/common.types'

export const membershipsApi = {
  list: (params?: { eventId?: string; status?: EventMembershipStatus }) =>
    apiClient.get<EventMembership[]>('/memberships', { params }),
  create: (data: { personId: string; eventId: string; role?: EventRole }) =>
    apiClient.post<EventMembership>('/memberships', data),
  approve: (id: string) =>
    apiClient.patch<EventMembership>(`/memberships/${id}/approve`),
  refuse: (id: string, reason: string) =>
    apiClient.patch<EventMembership>(`/memberships/${id}/refuse`, { reason }),
}
