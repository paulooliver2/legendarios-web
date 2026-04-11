import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { manadasApi } from '../api/manadas.api'

export function useManadas() {
  return useQuery({ queryKey: ['manadas'], queryFn: () => manadasApi.list().then((r) => r.data) })
}

export function useManadaDetail(id: string) {
  return useQuery({ queryKey: ['manadas', id], queryFn: () => manadasApi.getById(id).then((r) => r.data), enabled: !!id })
}

export function useManadaMembers(id: string) {
  return useQuery({ queryKey: ['manadas', id, 'members'], queryFn: () => manadasApi.listMembers(id).then((r) => r.data), enabled: !!id })
}

export function useAddManadaMember(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (personId: string) => manadasApi.addMember(id, personId).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manadas', id, 'members'] }),
  })
}
