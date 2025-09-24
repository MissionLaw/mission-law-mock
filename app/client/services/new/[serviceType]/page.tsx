'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { SERVICE_TEMPLATES } from '@/lib/constants'
import { ServiceType, ServiceTemplate, ServiceFormField } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface PageProps {
  params: {
    serviceType: ServiceType
  }
}

export default function ServiceRequestPage({ params }: PageProps) {
  const router = useRouter()
  const [template, setTemplate] = useState<ServiceTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const foundTemplate = SERVICE_TEMPLATES.find(t => t.type === params.serviceType)
    if (foundTemplate) {
      setTemplate(foundTemplate)
      const initialData: Record<string, any> = {}
      foundTemplate.fields.forEach(field => {
        initialData[field.id] = field.type === 'checkbox' ? false : ''
      })
      setFormData(initialData)
    }
  }, [params.serviceType])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = AuthService.getCurrentUser()
      if (!user?.clientId) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: generateTitle(template!, formData),
          type: params.serviceType,
          clientId: user.clientId,
          formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create service request')
      }

      const { service } = await response.json()
      router.push(`/client/services/${service.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const generateTitle = (template: ServiceTemplate, formData: Record<string, any>) => {
    switch (template.type) {
      case 'nda':
        return `NDA with ${formData.counterparty_name || 'Counterparty'}`
      case 'employee_onboarding':
        return `Employee Onboarding - ${formData.employee_name || 'New Employee'}`
      case 'contract_review':
        return formData.contract_title || 'Contract Review'
      default:
        return template.title
    }
  }

  const renderField = (field: ServiceFormField) => {
    const value = formData[field.id] || ''

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            required={field.required}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2"
          />
        )

      case 'textarea':
        return (
          <textarea
            id={field.id}
            rows={4}
            required={field.required}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2"
          />
        )

      case 'select':
        return (
          <select
            id={field.id}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2"
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 block text-sm text-gray-900">
              Yes
            </label>
          </div>
        )

      case 'file':
        return (
          <div className="mt-1">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor={field.id}
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id={field.id}
                      type="file"
                      className="sr-only"
                      required={field.required}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleInputChange(field.id, file.name)
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                {value && (
                  <p className="text-sm text-blue-600 font-medium">{value}</p>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!template) {
    return <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
        <p className="mt-2 text-gray-600">{template.description}</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {template.fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}