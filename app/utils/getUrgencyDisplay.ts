import {
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

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