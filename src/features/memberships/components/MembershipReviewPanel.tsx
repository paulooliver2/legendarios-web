import { useState } from 'react'
import { useMemberships, useApproveMembership, useRefuseMembership } from '../hooks/useMemberships'
import { MembershipStatusBadge } from './MembershipStatusBadge'
import type { EventMembershipStatus } from '@/shared/types/common.types'
import type { EventMembership } from '../types/membership.types'

interface Props { eventId: string }

export function MembershipReviewPanel({ eventId }: Props) {
  const [status, setStatus] = useState<EventMembershipStatus>('EM_ANALISE')
  const [refuseId, setRefuseId] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const { data: memberships, isLoading } = useMemberships({ eventId, status })
  const approve = useApproveMembership()
  const refuse = useRefuseMembership()

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value as EventMembershipStatus)}>
        {(['PRE_INSCRITO','INSCRITO','EM_ANALISE','APROVADO','RECUSADO','CANCELADO'] as EventMembershipStatus[]).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <table style={{ width: '100%', marginTop: 12 }}>
        <thead><tr><th>Pessoa</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {(memberships ?? []).map((m: EventMembership & { person?: { fullName: string } }) => (
            <tr key={m.id}>
              <td>{m.person?.fullName ?? m.personId}</td>
              <td><MembershipStatusBadge status={m.status} /></td>
              <td>
                {m.status === 'EM_ANALISE' && (
                  <>
                    <button onClick={() => approve.mutate(m.id)} disabled={approve.isPending}>Aprovar</button>
                    <button onClick={() => setRefuseId(m.id)} style={{ marginLeft: 8 }}>Recusar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {refuseId && (
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', padding: 24, border: '1px solid #ccc', zIndex: 100 }}>
          <h3>Motivo da recusa</h3>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} style={{ width: '100%' }} />
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={() => { refuse.mutate({ id: refuseId, reason }); setRefuseId(null); setReason('') }} disabled={!reason}>
              Confirmar
            </button>
            <button onClick={() => { setRefuseId(null); setReason('') }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
