import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/events.api'
import type { EventType } from '@/shared/types/common.types'

export function useEvents(params?: { page?: number; limit?: number; type?: EventType; published?: boolean }) {
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
    mutationFn: (data: { name: string; type: EventType; startDate: string; description?: string }) =>
      eventsApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function usePublishEvent(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (isPublished: boolean) => eventsApi.publish(id, isPublished).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events', id] }),
  })
}

export function useEventTeams(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId, 'teams'],
    queryFn: () => eventsApi.listTeams(eventId).then((r) => r.data),
    enabled: !!eventId,
  })
}
