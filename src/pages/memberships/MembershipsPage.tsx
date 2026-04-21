import { useState } from 'react'
import { ClipboardList, Check, X } from 'lucide-react'
import { useMemberships, useApproveMembership, useRefuseMembership } from '@/features/memberships/hooks/useMemberships'
import { MembershipStatusBadge } from '@/features/memberships/components/MembershipStatusBadge'
import { usePermission } from '@/shared/hooks/usePermission'
import type { EventMembershipStatus } from '@/shared/types/common.types'

interface Membership {
  id: string
  personId: string
  eventId: string
  role: string
  status: EventMembershipStatus
  person?: { fullName: string }
  event?: { name: string }
}

const statusOptions: { value: EventMembershipStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PRE_INSCRITO', label: 'Pré-inscrito' },
  { value: 'INSCRITO', label: 'Inscrito' },
  { value: 'EM_ANALISE', label: 'Em análise' },
  { value: 'APROVADO', label: 'Aprovado' },
  { value: 'RECUSADO', label: 'Recusado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

export function MembershipsPage() {
  const [status, setStatus] = useState<EventMembershipStatus | ''>('EM_ANALISE')
  const [refuseId, setRefuseId] = useState<string | null>(null)
  const [refuseReason, setRefuseReason] = useState('')
  const { can } = usePermission()

  const { data: memberships, isLoading } = useMemberships(
    status ? { status } : undefined,
  )
  const approve = useApproveMembership()
  const refuse = useRefuseMembership()

  const canReview = can('review_memberships')

  const handleRefuse = () => {
    if (!refuseId || !refuseReason.trim()) return
    refuse.mutate(
      { id: refuseId, reason: refuseReason },
      { onSuccess: () => { setRefuseId(null); setRefuseReason('') } },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Inscrições</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              status === opt.value
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && (memberships ?? []).length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <ClipboardList size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Nenhuma inscrição encontrada.</p>
        </div>
      )}

      {!isLoading && (memberships ?? []).length > 0 && (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Pessoa</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Evento</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Papel</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  {canReview && <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(memberships as Membership[]).map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {m.person?.fullName ?? m.personId}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.event?.name ?? m.eventId}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{m.role.toLowerCase()}</td>
                    <td className="px-4 py-3">
                      <MembershipStatusBadge status={m.status} />
                    </td>
                    {canReview && (
                      <td className="px-4 py-3">
                        {m.status === 'EM_ANALISE' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approve.mutate(m.id)}
                              disabled={approve.isPending}
                              className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                              title="Aprovar"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setRefuseId(m.id)}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                              title="Recusar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-2">
            {(memberships as Membership[]).map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{m.person?.fullName ?? m.personId}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.event?.name ?? m.eventId}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{m.role.toLowerCase()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <MembershipStatusBadge status={m.status} />
                    {canReview && m.status === 'EM_ANALISE' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => approve.mutate(m.id)}
                          className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setRefuseId(m.id)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Refuse modal */}
      {refuseId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Recusar inscrição</h3>
            <textarea
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              placeholder="Motivo da recusa..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setRefuseId(null); setRefuseReason('') }}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRefuse}
                disabled={!refuseReason.trim() || refuse.isPending}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {refuse.isPending ? 'Recusando...' : 'Recusar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
