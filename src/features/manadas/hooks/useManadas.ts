import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pistasApi } from '../api/manadas.api'
import type { PistaMemberRole } from '@/shared/types/common.types'

export function usePistas() {
  return useQuery({ queryKey: ['pistas'], queryFn: () => pistasApi.list().then((r) => r.data) })
}

export function usePistaDetail(id: string) {
  return useQuery({
    queryKey: ['pistas', id],
    queryFn: () => pistasApi.getById(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function usePistaMembers(id: string) {
  return useQuery({
    queryKey: ['pistas', id, 'members'],
    queryFn: () => pistasApi.listMembers(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useAddPistaMember(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ personId, memberRole, pistaTeamId }: { personId: string; memberRole?: PistaMemberRole; pistaTeamId?: string }) =>
      pistasApi.addMember(id, personId, memberRole, pistaTeamId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pistas', id] })
    },
  })
}

export function useSetPistaMemberRole(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ personId, memberRole, pistaTeamId }: { personId: string; memberRole: PistaMemberRole; pistaTeamId?: string | null }) =>
      pistasApi.setMemberRole(id, personId, memberRole, pistaTeamId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pistas', id] })
    },
  })
}

export function usePistaTeams(id: string) {
  return useQuery({
    queryKey: ['pistas', id, 'teams'],
    queryFn: () => pistasApi.listTeams(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreatePistaTeam(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => pistasApi.createTeam(id, name).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pistas', id] })
    },
  })
}
