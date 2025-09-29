'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { PlusIcon } from '@heroicons/react/24/outline'
import { AuthService } from '@/lib/auth'
import { Service, Client } from '@/lib/types'
import { SERVICE_TYPES } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ClientServicesPage() {
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.clientId) {
      fetch(`/api/client?id=${user.clientId}`)
        .then((res) => res.json())
        .then((data) => setClient(data.client))
    }
  }, [])

  const { data: servicesData, error, isLoading } = useSWR(
    client ? `/api/services?clientId=${client.id}` : null,
    fetcher
  )

  const services = servicesData?.services || []

  if (!client) {
    return <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Services</h1>
          <p className="mt-2 text-gray-600">
            Manage your legal service requests
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/client/services/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Service Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            <li className="px-6 py-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </li>
          ) : services.length === 0 ? (
            <li className="px-6 py-8 text-center">
              <div className="text-gray-500">
                <p className="text-sm">No service requests yet.</p>
                <Link
                  href="/client/services/new"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  Create your first request
                </Link>
              </div>
            </li>
          ) : (
            services.map((service: Service) => (
              <li key={service.id}>
                <Link
                  href={`/client/services/${service.id}`}
                  className="block hover:bg-gray-50 px-6 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {service.title}
                        </h3>
                        <div className='flex gap-2'>
                          <StatusBadge status={service.status} />
                          <UrgencyBadge urgency={service.urgency} />
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{SERVICE_TYPES[service.type]}</span>
                        <span className="mx-2">•</span>
                        <span>Created {formatDate(service.createdAt)}</span>
                        {service.assignedAttorney && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Assigned to {service.assignedAttorney}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}