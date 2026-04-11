import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { membershipsApi } from '../api/memberships.api'
import type { EventMembershipStatus, EventRole } from '@/shared/types/common.types'

export function useMemberships(params?: { eventId?: string; status?: EventMembershipStatus }) {
  return useQuery({
    queryKey: ['memberships', params],
    queryFn: () => membershipsApi.list(params).then((r) => r.data),
  })
}

export function useCreateMembership() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { personId: string; eventId: string; role?: EventRole }) =>
      membershipsApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberships'] }),
  })
}

export function useApproveMembership() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => membershipsApi.approve(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberships'] }),
  })
}

export function useRefuseMembership() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      membershipsApi.refuse(id, reason).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberships'] }),
  })
}
