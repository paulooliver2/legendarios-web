import { apiClient } from '@/shared/api/client'
import type { Manada, ManadaMember } from '../types/manada.types'

export const manadasApi = {
  list: () => apiClient.get<Manada[]>('/manadas'),
  getById: (id: string) => apiClient.get<Manada>(`/manadas/${id}`),
  create: (data: { name: string; description?: string }) => apiClient.post<Manada>('/manadas', data),
  listMembers: (id: string) => apiClient.get<ManadaMember[]>(`/manadas/${id}/members`),
  addMember: (id: string, personId: string) => apiClient.post<ManadaMember>(`/manadas/${id}/members`, { personId }),
}
