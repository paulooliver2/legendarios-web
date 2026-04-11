import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { personsApi } from '../api/persons.api'
import type { CreatePersonRequest } from '../types/person.types'

export function usePersons(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['persons', params],
    queryFn: () => personsApi.list(params).then((r) => r.data),
  })
}

export function usePersonDetail(id: string) {
  return useQuery({
    queryKey: ['persons', id],
    queryFn: () => personsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreatePerson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePersonRequest) => personsApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['persons'] }),
  })
}

export function useUpdatePerson(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreatePersonRequest>) =>
      personsApi.update(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['persons'] }),
  })
}

export function usePromoteJourney(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reason?: string) => personsApi.promoteJourney(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['persons', id] }),
  })
}
