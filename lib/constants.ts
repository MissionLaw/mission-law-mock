import { ServiceTemplate, ServiceType } from './types'

export const SERVICE_TYPES: Record<ServiceType, string> = {
  nda: 'Non-Disclosure Agreement',
  employee_onboarding: 'Employee Onboarding',
  contract_review: 'Contract Review'
}

export const SERVICE_STATUS_LABELS = {
  submitted: 'Submitted',
  legal_review: 'Legal Review',
  client_review: 'Client Review',
  complete: 'Complete'
}

export const SERVICE_STATUS_COLORS = {
  submitted: 'bg-yellow-100 text-yellow-800',
  legal_review: 'bg-blue-100 text-blue-800',
  client_review: 'bg-purple-100 text-purple-800',
  complete: 'bg-green-100 text-green-800'
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    type: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Request a new NDA for confidential information protection',
    fields: [
      {
        id: 'counterparty_name',
        label: 'Counterparty Name',
        type: 'text',
        required: true,
        placeholder: 'Company or individual name'
      },
      {
        id: 'counterparty_email',
        label: 'Counterparty Email',
        type: 'text',
        required: true,
        placeholder: 'email@example.com'
      },
      {
        id: 'purpose',
        label: 'Purpose of NDA',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the purpose and scope of confidential information sharing'
      },
      {
        id: 'duration',
        label: 'Duration (months)',
        type: 'select',
        required: true,
        options: ['12', '24', '36', '60']
      },
      {
        id: 'mutual',
        label: 'Mutual NDA',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    type: 'employee_onboarding',
    title: 'Employee Onboarding',
    description: 'Process new employee documentation and agreements',
    fields: [
      {
        id: 'employee_name',
        label: 'Employee Name',
        type: 'text',
        required: true,
        placeholder: 'Full legal name'
      },
      {
        id: 'employee_email',
        label: 'Employee Email',
        type: 'text',
        required: true,
        placeholder: 'work@company.com'
      },
      {
        id: 'position',
        label: 'Position/Title',
        type: 'text',
        required: true,
        placeholder: 'Job title'
      },
      {
        id: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true
      },
      {
        id: 'salary',
        label: 'Annual Salary',
        type: 'text',
        required: true,
        placeholder: '$75,000'
      },
      {
        id: 'equity',
        label: 'Equity Package',
        type: 'checkbox',
        required: false
      },
      {
        id: 'additional_notes',
        label: 'Additional Notes',
        type: 'textarea',
        required: false,
        placeholder: 'Any special terms or considerations'
      }
    ]
  },
  {
    type: 'contract_review',
    title: 'Contract Review',
    description: 'Submit a contract for legal review and analysis',
    fields: [
      {
        id: 'contract_title',
        label: 'Contract Title/Type',
        type: 'text',
        required: true,
        placeholder: 'Service Agreement, Licensing, etc.'
      },
      {
        id: 'counterparty',
        label: 'Counterparty',
        type: 'text',
        required: true,
        placeholder: 'Other party to the contract'
      },
      {
        id: 'contract_value',
        label: 'Contract Value',
        type: 'text',
        required: false,
        placeholder: '$50,000'
      },
      {
        id: 'review_priority',
        label: 'Review Priority',
        type: 'select',
        required: true,
        options: ['Low', 'Medium', 'High', 'Urgent']
      },
      {
        id: 'deadline',
        label: 'Signature Deadline',
        type: 'date',
        required: false
      },
      {
        id: 'key_concerns',
        label: 'Key Concerns or Focus Areas',
        type: 'textarea',
        required: false,
        placeholder: 'Specific clauses or terms you want us to focus on'
      },
      {
        id: 'contract_file',
        label: 'Contract Document',
        type: 'file',
        required: true
      }
    ]
  }
]