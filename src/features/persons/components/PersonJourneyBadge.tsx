import type { JourneyStatus } from '@/shared/types/common.types'
import { journeyStatusLabel } from '@/shared/utils/labels'

interface Props {
  status: JourneyStatus
}

export function PersonJourneyBadge({ status }: Props) {
  if (status === 'LEGENDARIO') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        {journeyStatusLabel.LEGENDARIO}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
      {journeyStatusLabel.PRE_LEGENDARIO}
    </span>
  )
}
