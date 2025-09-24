export type ServiceType = 'nda' | 'employee_onboarding' | 'contract_review'

export type ServiceStatus = 'submitted' | 'legal_review' | 'client_review' | 'complete'

export interface Client {
  id: string
  name: string
  email: string
  company: string
  createdAt: string
}

export interface Service {
  id: string
  title: string
  type: ServiceType
  status: ServiceStatus
  clientId: string
  createdAt: string
  updatedAt: string
  formData: Record<string, unknown>
  assignedAttorney?: string
  notes?: string[]
  documents?: Document[]
}

export interface Document {
  id: string
  name: string
  url: string
  uploadedAt: string
  uploadedBy: string
}

export interface Attorney {
  id: string
  name: string
  email: string
  specialties: ServiceType[]
}

export interface ServiceFormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'file' | 'checkbox' | 'date'
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface ServiceTemplate {
  type: ServiceType
  title: string
  description: string
  fields: ServiceFormField[]
}

export interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'admin'
  clientId?: string
}