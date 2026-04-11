import { apiClient } from '@/shared/api/client'
import type { Person, CreatePersonRequest } from '../types/person.types'
import type { PaginatedResponse } from '@/shared/types/common.types'

export const personsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Person>>('/persons', { params }),
  getById: (id: string) =>
    apiClient.get<Person>(`/persons/${id}`),
  create: (data: CreatePersonRequest) =>
    apiClient.post<Person>('/persons', data),
  update: (id: string, data: Partial<CreatePersonRequest>) =>
    apiClient.patch<Person>(`/persons/${id}`, data),
  promoteJourney: (id: string, reason?: string) =>
    apiClient.patch(`/persons/${id}/journey`, { journeyStatus: 'LEGENDARIO', reason }),
}
