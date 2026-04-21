import { apiClient } from '@/shared/api/client'
import type { Pista, PistaMemberItem, PistaTeam } from '../types/manada.types'
import type { PistaMemberRole } from '@/shared/types/common.types'

export const pistasApi = {
  list: () => apiClient.get<Pista[]>('/pistas'),
  getById: (id: string) => apiClient.get<Pista>(`/pistas/${id}`),
  create: (data: { name: string; description?: string; logoUrl?: string; uf?: string; cidade?: string }) =>
    apiClient.post<Pista>('/pistas', data),

  listMembers: (id: string) => apiClient.get<PistaMemberItem[]>(`/pistas/${id}/members`),
  addMember: (id: string, personId: string, memberRole?: PistaMemberRole, pistaTeamId?: string) =>
    apiClient.post<PistaMemberItem>(`/pistas/${id}/members`, { personId, memberRole, pistaTeamId }),
  setMemberRole: (id: string, personId: string, memberRole: PistaMemberRole, pistaTeamId?: string | null) =>
    apiClient.patch<PistaMemberItem>(`/pistas/${id}/members/${personId}/role`, { memberRole, pistaTeamId }),

  join: (id: string) => apiClient.post<PistaMemberItem>(`/pistas/${id}/join`, {}),

  listTeams: (id: string) => apiClient.get<PistaTeam[]>(`/pistas/${id}/teams`),
  createTeam: (id: string, name: string) => apiClient.post<PistaTeam>(`/pistas/${id}/teams`, { name }),
}
