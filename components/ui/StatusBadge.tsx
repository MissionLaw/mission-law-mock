import { ServiceStatus } from '@/lib/types'
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from '@/lib/constants'

interface StatusBadgeProps {
  status: ServiceStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SERVICE_STATUS_COLORS[status]} ${className}`}
    >
      {SERVICE_STATUS_LABELS[status]}
    </span>
  )
}