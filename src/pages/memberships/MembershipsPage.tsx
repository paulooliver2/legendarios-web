import { useState } from 'react'
import { useMemberships } from '@/features/memberships/hooks/useMemberships'
import { MembershipStatusBadge } from '@/features/memberships/components/MembershipStatusBadge'
import { usePermission } from '@/shared/hooks/usePermission'

export function MembershipsPage() {
  const [eventId, setEventId] = useState('')
  const { data: memberships, isLoading } = useMemberships(eventId ? { eventId } : undefined)
  const { can } = usePermission()

  return (
    <div>
      <h1>Inscrições</h1>
      <div style={{ marginBottom: 12 }}>
        <label>Filtrar por Evento ID: </label>
        <input value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="ID do evento" style={{ marginLeft: 8 }} />
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Pessoa</th><th>Evento</th><th>Papel</th><th>Status</th>
              {can('review_memberships') && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {(memberships ?? []).map((m: { id: string; personId: string; eventId: string; role: string; status: import('@/shared/types/common.types').EventMembershipStatus; person?: { fullName: string }; event?: { name: string } }) => (
              <tr key={m.id}>
                <td>{m.person?.fullName ?? m.personId}</td>
                <td>{m.event?.name ?? m.eventId}</td>
                <td>{m.role}</td>
                <td><MembershipStatusBadge status={m.status} /></td>
                {can('review_memberships') && <td>—</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
