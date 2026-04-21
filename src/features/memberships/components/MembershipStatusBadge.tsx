import type { EventMembershipStatus } from '@/shared/types/common.types'

interface Props { status: EventMembershipStatus }

const classes: Record<EventMembershipStatus, string> = {
  PRE_INSCRITO: 'bg-gray-100 text-gray-600',
  INSCRITO: 'bg-blue-100 text-blue-700',
  EM_ANALISE: 'bg-orange-100 text-orange-700',
  APROVADO: 'bg-green-100 text-green-700',
  RECUSADO: 'bg-red-100 text-red-700',
  CANCELADO: 'bg-gray-100 text-gray-500',
}

const labels: Record<EventMembershipStatus, string> = {
  PRE_INSCRITO: 'Pré-inscrito',
  INSCRITO: 'Inscrito',
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  RECUSADO: 'Recusado',
  CANCELADO: 'Cancelado',
}

export function MembershipStatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes[status]}`}>
      {labels[status]}
    </span>
  )
}
