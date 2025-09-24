import { Client, Service, Attorney, User } from './types'

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Solutions',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'client-2',
    name: 'Michael Chen',
    email: 'michael.chen@innovatelab.com',
    company: 'InnovateLab Inc',
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: 'client-3',
    name: 'Amanda Rodriguez',
    email: 'amanda.rodriguez@globalventures.com',
    company: 'Global Ventures LLC',
    createdAt: '2024-03-10T09:15:00Z'
  }
]

export const mockAttorneys: Attorney[] = [
  {
    id: 'attorney-1',
    name: 'David Morrison',
    email: 'david.morrison@missionlaw.com',
    specialties: ['contract_review', 'nda']
  },
  {
    id: 'attorney-2',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@missionlaw.com',
    specialties: ['employee_onboarding', 'contract_review']
  }
]

export const mockServices: Service[] = [
  {
    id: 'service-1',
    title: 'NDA with DataFlow Systems',
    type: 'nda',
    status: 'legal_review',
    clientId: 'client-1',
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-21T15:30:00Z',
    assignedAttorney: 'David Morrison',
    formData: {
      counterparty_name: 'DataFlow Systems',
      counterparty_email: 'legal@dataflow.com',
      purpose: 'Sharing technical specifications for potential partnership',
      duration: '24',
      mutual: true
    },
    notes: ['Initial review completed', 'Waiting for counterparty response']
  },
  {
    id: 'service-2',
    title: 'Employee Onboarding - John Smith',
    type: 'employee_onboarding',
    status: 'client_review',
    clientId: 'client-1',
    createdAt: '2024-09-18T14:00:00Z',
    updatedAt: '2024-09-22T11:00:00Z',
    assignedAttorney: 'Lisa Thompson',
    formData: {
      employee_name: 'John Smith',
      employee_email: 'john.smith@techcorp.com',
      position: 'Senior Software Engineer',
      start_date: '2024-10-01',
      salary: '$95,000',
      equity: true,
      additional_notes: 'Remote work agreement needed'
    }
  },
  {
    id: 'service-3',
    title: 'SaaS Licensing Agreement Review',
    type: 'contract_review',
    status: 'submitted',
    clientId: 'client-2',
    createdAt: '2024-09-23T09:30:00Z',
    updatedAt: '2024-09-23T09:30:00Z',
    formData: {
      contract_title: 'SaaS Licensing Agreement',
      counterparty: 'CloudTech Solutions',
      contract_value: '$120,000',
      review_priority: 'High',
      deadline: '2024-10-15',
      key_concerns: 'Data privacy clauses and termination terms'
    }
  },
  {
    id: 'service-4',
    title: 'Partnership NDA with StartupX',
    type: 'nda',
    status: 'complete',
    clientId: 'client-3',
    createdAt: '2024-09-15T16:00:00Z',
    updatedAt: '2024-09-19T10:00:00Z',
    assignedAttorney: 'David Morrison',
    formData: {
      counterparty_name: 'StartupX Inc',
      counterparty_email: 'legal@startupx.com',
      purpose: 'Investment due diligence',
      duration: '36',
      mutual: false
    }
  },
  {
    id: 'service-5',
    title: 'Marketing Manager Onboarding',
    type: 'employee_onboarding',
    status: 'legal_review',
    clientId: 'client-2',
    createdAt: '2024-09-22T11:15:00Z',
    updatedAt: '2024-09-23T08:45:00Z',
    assignedAttorney: 'Lisa Thompson',
    formData: {
      employee_name: 'Emily Davis',
      employee_email: 'emily.davis@innovatelab.com',
      position: 'Marketing Manager',
      start_date: '2024-10-15',
      salary: '$75,000',
      equity: false
    }
  }
]

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    role: 'client',
    clientId: 'client-1'
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    email: 'michael.chen@innovatelab.com',
    role: 'client',
    clientId: 'client-2'
  },
  {
    id: 'user-3',
    name: 'Amanda Rodriguez',
    email: 'amanda.rodriguez@globalventures.com',
    role: 'client',
    clientId: 'client-3'
  },
  {
    id: 'admin-1',
    name: 'David Morrison',
    email: 'david.morrison@missionlaw.com',
    role: 'admin'
  },
  {
    id: 'admin-2',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@missionlaw.com',
    role: 'admin'
  }
]