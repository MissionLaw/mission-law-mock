import {  ServiceUrgency } from '@/lib/types'
import { getUrgencyDisplay } from '@/app/utils/getUrgencyDisplay'

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