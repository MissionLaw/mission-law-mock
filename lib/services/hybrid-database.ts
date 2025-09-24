// Hybrid service that tries database first, falls back to mock data
import { mockServices, mockClients, mockAttorneys, mockUsers } from '../mock-data'

export class HybridDatabaseService {
  private static isDatabaseAvailable = false

  // Check if database is available
  static async checkDatabaseConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/health/db')
      this.isDatabaseAvailable = response.ok
      return this.isDatabaseAvailable
    } catch {
      this.isDatabaseAvailable = false
      return false
    }
  }

  // Client operations
  static async getClients() {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getClients()
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    return mockClients
  }

  static async getClientById(id: string) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getClientById(id)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    return mockClients.find(c => c.id === id) || null
  }

  // Service operations
  static async getServices(filters: {
    clientId?: string
    status?: string
    type?: string
    search?: string
  } = {}) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getServices(filters)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    // Mock data filtering logic
    let services = mockServices.map(service => ({
      ...service,
      client: mockClients.find(c => c.id === service.clientId),
      attorney: mockAttorneys.find(a => a.name === service.assignedAttorney),
      assignedAttorney: service.assignedAttorney
    }))

    if (filters.clientId) {
      services = services.filter(service => service.clientId === filters.clientId)
    }

    if (filters.status) {
      services = services.filter(service => service.status === filters.status)
    }

    if (filters.type) {
      services = services.filter(service => service.type === filters.type)
    }

    if (filters.search) {
      services = services.filter(service =>
        service.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        service.client?.name?.toLowerCase().includes(filters.search!.toLowerCase()) ||
        service.client?.company?.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    return services
  }

  static async getServiceById(id: string) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getServiceById(id)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    const service = mockServices.find(s => s.id === id)
    if (!service) return null

    return {
      ...service,
      client: mockClients.find(c => c.id === service.clientId),
      attorney: mockAttorneys.find(a => a.name === service.assignedAttorney),
      assignedAttorney: service.assignedAttorney
    }
  }

  static async createService(data: {
    title: string
    type: 'nda' | 'employee_onboarding' | 'contract_review'
    clientId: string
    formData: Record<string, unknown>
  }) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.createService(data)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    // Mock creation - in a real app this would persist to memory/localStorage
    const newService = {
      id: `service-${Date.now()}`,
      title: data.title,
      type: data.type,
      status: 'submitted' as const,
      clientId: data.clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: data.formData,
      notes: []
    }

    const client = mockClients.find(c => c.id === data.clientId)
    return {
      ...newService,
      client,
      attorney: null,
      assignedAttorney: undefined
    }
  }

  static async updateService(id: string, data: {
    status?: 'submitted' | 'legal_review' | 'client_review' | 'complete'
    assignedAttorneyId?: string
    notes?: string[]
  }) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.updateService(id, data)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    // Mock update - in a real app this would update the stored data
    return await this.getServiceById(id)
  }

  // User operations
  static async getUserByEmail(email: string) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getUserByEmail(email)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    const user = mockUsers.find(u => u.email === email)
    if (!user) return null

    const client = user.clientId ? mockClients.find(c => c.id === user.clientId) : null
    return { user, client }
  }

  // Attorney operations
  static async getAttorneys() {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getAttorneys()
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    return mockAttorneys
  }

  static async getAttorneyByName(name: string) {
    if (await this.checkDatabaseConnection()) {
      try {
        const { DatabaseService } = await import('./database')
        return await DatabaseService.getAttorneyByName(name)
      } catch (error) {
        console.warn('Database unavailable, falling back to mock data:', error)
      }
    }

    return mockAttorneys.find(a => a.name === name) || null
  }
}