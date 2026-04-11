import type { JourneyStatus } from '@/shared/types/common.types'

interface Props {
  status: JourneyStatus
}

const styles: Record<JourneyStatus, React.CSSProperties> = {
  LEGENDARIO: { background: '#d4af37', color: '#000', padding: '2px 10px', borderRadius: 12, fontWeight: 700, fontSize: 12 },
  PRE_LEGENDARIO: { background: '#e0e0e0', color: '#444', padding: '2px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12 },
}

const labels: Record<JourneyStatus, string> = {
  LEGENDARIO: 'Legendário',
  PRE_LEGENDARIO: 'Pré-Legendário',
}

export function PersonJourneyBadge({ status }: Props) {
  return <span style={styles[status]}>{labels[status]}</span>
}
