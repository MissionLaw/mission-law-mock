import {  ServiceUrgency } from '@/lib/types'
import {
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface StatusBadgeProps {
  urgency: ServiceUrgency
  className?: string
}

export function UrgencyBadge({ urgency, className = '' }: StatusBadgeProps) {
  return (
    <div className={`mt-1 ${className}`}>
      {(() => {
        const urgencyDisplay = getUrgencyDisplay(urgency);
        const IconComponent = urgencyDisplay.icon;
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${urgencyDisplay.bgColor} ${urgencyDisplay.color}`}>
            <IconComponent className="h-3 w-3 mr-1" />
            {urgencyDisplay.label}
          </span>
        );
      })()}
    </div>
  )
}

export const getUrgencyDisplay = (urgency: string) => {
    switch (urgency) {
      case 'asap':
        return { label: 'ASAP', color: 'text-red-600', bgColor: 'bg-red-100', icon: ExclamationTriangleIcon }
      case 'fast':
        return { label: 'Fast', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: ClockIcon }
      case 'no_rush':
        return { label: 'No Rush', color: 'text-green-600', bgColor: 'bg-green-100', icon: ClockIcon }
      default:
        return { label: 'No Rush', color: 'text-green-600', bgColor: 'bg-green-100', icon: ClockIcon }
    }
  }