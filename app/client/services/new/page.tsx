'use client'

import Link from 'next/link'
import {
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import { SERVICE_TEMPLATES } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

export default function NewServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          New Service Request
        </h1>
        <p className="mt-2 text-gray-600">
          Choose the type of legal service you need
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_TEMPLATES.map((template) => {
          const IconComponent = {
            nda: DocumentTextIcon,
            employee_onboarding: UserGroupIcon,
            contract_review: ClipboardDocumentCheckIcon
          }[template.type]

          return (
            <div
              key={template.type}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                {template.description}
              </p>

              <Link href={`/client/services/new/${template.type}`}>
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}