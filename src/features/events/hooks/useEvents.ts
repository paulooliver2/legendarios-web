import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/events.api'
import type { EventType, EventStatus } from '@/shared/types/common.types'

export function useEvents(params?: { page?: number; limit?: number; type?: EventType; status?: EventStatus }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.list(params).then((r) => r.data),
  })
}

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof eventsApi.create>[0]) =>
      eventsApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEventStatus(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: EventStatus) => eventsApi.updateStatus(id, status).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useEventTeams(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId, 'teams'],
    queryFn: () => eventsApi.listTeams(eventId).then((r) => r.data),
    enabled: !!eventId,
  })
}
