'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Service, ServiceStatus, ServiceType, ServiceUrgency } from '@/lib/types'
import { SERVICE_TYPES, SERVICE_STATUS_LABELS } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ServiceType | 'all'>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<ServiceUrgency | 'all'>('all')
  const [sortBy, setSortBy] = useState<'created' | 'urgency' | 'status'>('urgency') 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, error, isLoading } = useSWR('/api/services', fetcher)

  const services: Service[] = data?.services || []

  const getUrgencyPriority = (urgency: string) => {
    switch (urgency) {
      case 'asap': return 3
      case 'fast': return 2
      case 'no_rush': return 1
      default: return 1
    }
  }

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.client?.company?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || service.status === statusFilter
      const matchesType = typeFilter === 'all' || service.type === typeFilter
      const matchesUrgency = urgencyFilter === 'all' || service.urgency === urgencyFilter

      return matchesSearch && matchesStatus && matchesType && matchesUrgency
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'urgency':
          comparison = getUrgencyPriority(b.urgency) - getUrgencyPriority(a.urgency)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'created':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
      }
      
      return sortOrder === 'asc' ? -comparison : comparison
    })

  const stats = {
    total: services.length,
    submitted: services.filter(s => s.status === 'submitted').length,
    inReview: services.filter(s => s.status === 'legal_review').length,
    clientReview: services.filter(s => s.status === 'client_review').length,
    completed: services.filter(s => s.status === 'complete').length
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <p className="mt-2 text-gray-600">
          Manage all client service requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{stats.total}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-yellow-800">{stats.submitted}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">New</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.submitted}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-800">{stats.inReview}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Review</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inReview}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-800">{stats.completed}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search services, clients, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value as ServiceUrgency | 'all')}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Urgency</option>
                <option value="asap">ASAP</option>
                <option value="fast">Fast</option>
                <option value="no_rush">No Rush</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | 'all')}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="legal_review">Legal Review</option>
                <option value="client_review">Client Review</option>
                <option value="complete">Complete</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ServiceType | 'all')}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="nda">NDA</option>
                <option value="employee_onboarding">Employee Onboarding</option>
                <option value="contract_review">Contract Review</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No services found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={()=>{
                      setSortOrder(sortOrder==='asc'?'desc':'asc');
                    }}>
                      <span>Urgency {(sortOrder==='asc'?'↓':'↑')}</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attorney
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {service.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {service.client?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.client?.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {SERVICE_TYPES[service.type]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <UrgencyBadge urgency={service.urgency} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(service.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.assignedAttorney || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/services/${service.id}`}>
                          <Button variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}