import type { EventMembershipStatus } from '@/shared/types/common.types'

interface Props { status: EventMembershipStatus }

const colors: Record<EventMembershipStatus, string> = {
  PRE_INSCRITO: '#9e9e9e', INSCRITO: '#2196f3', EM_ANALISE: '#ff9800',
  APROVADO: '#4caf50', RECUSADO: '#f44336', CANCELADO: '#607d8b',
}
const labels: Record<EventMembershipStatus, string> = {
  PRE_INSCRITO: 'Pré-inscrito', INSCRITO: 'Inscrito', EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado', RECUSADO: 'Recusado', CANCELADO: 'Cancelado',
}

export function MembershipStatusBadge({ status }: Props) {
  return (
    <span style={{ background: colors[status], color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      {labels[status]}
    </span>
  )
}
