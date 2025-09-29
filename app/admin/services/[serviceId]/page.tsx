'use client'

import { useState, use } from 'react'
import useSWR from 'swr'
import {
  UserIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Service, ServiceStatus, ServiceUrgency } from '@/lib/types'
import { SERVICE_TYPES, SERVICE_STATUS_LABELS } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'

interface PageProps {
  params: Promise<{
    serviceId: string
  }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    status: '' as ServiceStatus,
    urgency: '' as ServiceUrgency,
    assignedAttorney: '',
    notes: [] as string[]
  })
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/services/${resolvedParams.serviceId}`,
    fetcher
  )

  const { data: attorneysData } = useSWR('/api/attorneys', fetcher)

  const service: Service = data?.service

  const startEditing = () => {
    if (service) {
      setEditData({
        status: service.status,
        urgency: service.urgency,
        assignedAttorney: service.assignedAttorney || '',
        notes: service.notes || []
      })
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!service) return

    setSaving(true)
    try {
      const response = await fetch(`/api/services/${resolvedParams.serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      })

      if (!response.ok) {
        throw new Error('Failed to update service')
      }

      await mutate()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating service:', error)
    } finally {
      setSaving(false)
    }
  }

  const addNote = () => {
    if (newNote.trim()) {
      setEditData(prev => ({
        ...prev,
        notes: [...prev.notes, `${new Date().toLocaleString()}: ${newNote.trim()}`]
      }))
      setNewNote('')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Service Not Found</h2>
          <p className="mt-2 text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            <p className="mt-2 text-gray-600">{SERVICE_TYPES[service.type]}</p>
          </div>
          <div className="flex items-center space-x-3">
            <UrgencyBadge urgency={service.urgency} />
            <StatusBadge status={service.status} />
            <Button
              onClick={isEditing ? handleSave : startEditing}
              disabled={saving}
              size="sm"
            >
              {isEditing ? (
                saving ? 'Saving...' : 'Save Changes'
              ) : (
                <>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Client Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {service.client?.name}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {service.client?.email}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {service.client?.company}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Client Since</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {service.client?.createdAt && formatDateTime(service.client.createdAt)}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Request Details
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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

          {(service.notes?.length > 0 || isEditing) && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Internal Notes
                </h3>
                <div className="space-y-3">
                  {(isEditing ? editData.notes : service.notes || []).map((note, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3">
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button size="sm" onClick={addNote}>
                        Add Note
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Service Management
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as ServiceStatus }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="legal_review">Legal Review</option>
                      <option value="client_review">Client Review</option>
                      <option value="complete">Complete</option>
                    </select>
                  ) : (
                    <div className="mt-1">
                      <StatusBadge status={service.status} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Urgency Level
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.urgency}
                      onChange={(e) => setEditData(prev => ({ ...prev, urgency: e.target.value as ServiceUrgency }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no_rush">No Rush</option>
                      <option value="fast">Fast</option>
                      <option value="asap">ASAP</option>
                    </select>
                  ) : (
                    <UrgencyBadge urgency={service.urgency} />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assigned Attorney
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.assignedAttorney}
                      onChange={(e) => setEditData(prev => ({ ...prev, assignedAttorney: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {(attorneysData?.attorneys || []).map((attorney: any) => (
                        <option key={attorney.id} value={attorney.name}>
                          {attorney.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1 text-sm text-gray-900">
                      {service.assignedAttorney || 'Unassigned'}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 space-y-2">
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {formatDateTime(service.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {formatDateTime(service.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <Button size="sm" className="w-full" variant="outline">
                Send Update to Client
              </Button>
              <Button size="sm" className="w-full" variant="outline">
                Generate Documents
              </Button>
              <Button size="sm" className="w-full" variant="outline">
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}