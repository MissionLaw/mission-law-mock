'use client'

import { use } from 'react'
import useSWR from 'swr'
import {
  ClockIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Service } from '@/lib/types'
import { SERVICE_TYPES, SERVICE_STATUS_LABELS } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'

interface PageProps {
  params: Promise<{
    serviceId: string
  }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const { data, error, isLoading, mutate } = useSWR(
    `/api/services/${resolvedParams.serviceId}`,
    fetcher
  )

  const service: Service = data?.service

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'submitted', label: 'Submitted', description: 'Request received' },
      { key: 'legal_review', label: 'Legal Review', description: 'Under attorney review' },
      { key: 'client_review', label: 'Client Review', description: 'Waiting for your review' },
      { key: 'complete', label: 'Complete', description: 'Service completed' }
    ]

    const currentIndex = steps.findIndex(step => step.key === currentStatus)

    return steps.map((step, index) => ({
      ...step,
      status: index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
    }))
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Service Not Found</h2>
          <p className="mt-2 text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps(service.status)

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            <p className="mt-2 text-gray-600">{SERVICE_TYPES[service.type]}</p>
          </div>
          <StatusBadge status={service.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Service Progress
              </h3>
              <nav aria-label="Progress">
                <ol className="space-y-4">
                  {statusSteps.map((step, stepIndex) => (
                    <li key={step.key}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {step.status === 'complete' ? (
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : step.status === 'current' ? (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <ClockIcon className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full" />
                          )}
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <h4 className={`text-sm font-medium ${
                            step.status === 'current' ? 'text-blue-600' :
                            step.status === 'complete' ? 'text-green-600' :
                            'text-gray-500'
                          }`}>
                            {step.label}
                          </h4>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </div>
                      {stepIndex < statusSteps.length - 1 && (
                        <div className="ml-4 mt-2 w-0.5 h-4 bg-gray-300" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Request Details
              </h3>
              <dl className="space-y-4">
                {Object.entries(service.formData).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Service Information
              </h3>
              <dl className="space-y-4">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDateTime(service.createdAt)}
                    </dd>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDateTime(service.updatedAt)}
                    </dd>
                  </div>
                </div>

                {service.assignedAttorney && (
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Assigned Attorney</dt>
                      <dd className="text-sm text-gray-900">
                        {service.assignedAttorney}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {service.status === 'client_review' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900">Action Required</h4>
              <p className="mt-1 text-sm text-blue-700">
                Your documents are ready for review. Please review and approve to complete the service.
              </p>
              <div className="mt-3 space-y-2">
                <Button size="sm" className="w-full">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Download Documents
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Approve & Complete
                </Button>
              </div>
            </div>
          )}

          {service.status === 'complete' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900">Service Complete</h4>
              <p className="mt-1 text-sm text-green-700">
                Your service request has been completed successfully.
              </p>
              <div className="mt-3">
                <Button size="sm" className="w-full">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Download Final Documents
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}