'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { AuthService } from '@/lib/auth'
import { Service, Client } from '@/lib/types'
import { SERVICE_TYPES } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ClientOverviewPage() {
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.clientId) {
      fetch(`/api/client?id=${user.clientId}`)
        .then((res) => res.json())
        .then((data) => setClient(data.client))
    }
  }, [])

  const { data: servicesData, error: servicesError } = useSWR(
    client ? `/api/services?clientId=${client.id}` : null,
    fetcher
  )

  const services = servicesData?.services || []
  const recentServices = services.slice(0, 5)

  const stats = {
    total: services.length,
    inProgress: services.filter((s: Service) =>
      ['submitted', 'legal_review', 'client_review'].includes(s.status)
    ).length,
    completed: services.filter((s: Service) => s.status === 'complete').length,
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {client.name}
        </h1>
        <p className="mt-2 text-gray-600">{client.company}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Services
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.inProgress}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/client/services/new/nda">
                <Button className="w-full justify-start" variant="outline">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Request NDA
                </Button>
              </Link>
              <Link href="/client/services/new/employee_onboarding">
                <Button className="w-full justify-start" variant="outline">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Employee Onboarding
                </Button>
              </Link>
              <Link href="/client/services/new/contract_review">
                <Button className="w-full justify-start" variant="outline">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Contract Review
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Services
              </h3>
              <Link
                href="/client/services"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentServices.length === 0 ? (
                <p className="text-gray-500 text-sm">No services yet</p>
              ) : (
                recentServices.map((service: Service) => (
                  <Link
                    key={service.id}
                    href={`/client/services/${service.id}`}
                    className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {service.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {SERVICE_TYPES[service.type]} • {formatDate(service.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={service.status} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}