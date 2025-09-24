import { db, services, clients, attorneys, users } from '../db'
import { eq, desc, and, like, or } from 'drizzle-orm'
import type { Service as ServiceSchema, Client as ClientSchema } from '../db/schema'

export class DatabaseService {
  // Client operations
  static async getClients() {
    return await db.select().from(clients).orderBy(desc(clients.createdAt))
  }

  static async getClientById(id: string) {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1)
    return result[0] || null
  }

  // Service operations
  static async getServices(filters: {
    clientId?: string
    status?: string
    type?: string
    search?: string
  } = {}) {
    let query = db
      .select({
        service: services,
        client: clients,
        attorney: attorneys,
      })
      .from(services)
      .leftJoin(clients, eq(services.clientId, clients.id))
      .leftJoin(attorneys, eq(services.assignedAttorneyId, attorneys.id))

    const conditions = []

    if (filters.clientId) {
      conditions.push(eq(services.clientId, filters.clientId))
    }

    if (filters.status) {
      conditions.push(eq(services.status, filters.status as any))
    }

    if (filters.type) {
      conditions.push(eq(services.type, filters.type as any))
    }

    if (filters.search) {
      conditions.push(
        or(
          like(services.title, `%${filters.search}%`),
          like(clients.name, `%${filters.search}%`),
          like(clients.company, `%${filters.search}%`)
        )
      )
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const result = await query.orderBy(desc(services.createdAt))

    return result.map(({ service, client, attorney }) => ({
      ...service,
      client,
      attorney,
      assignedAttorney: attorney?.name
    }))
  }

  static async getServiceById(id: string) {
    const result = await db
      .select({
        service: services,
        client: clients,
        attorney: attorneys,
      })
      .from(services)
      .leftJoin(clients, eq(services.clientId, clients.id))
      .leftJoin(attorneys, eq(services.assignedAttorneyId, attorneys.id))
      .where(eq(services.id, id))
      .limit(1)

    if (result.length === 0) return null

    const { service, client, attorney } = result[0]
    return {
      ...service,
      client,
      attorney,
      assignedAttorney: attorney?.name
    }
  }

  static async createService(data: {
    title: string
    type: 'nda' | 'employee_onboarding' | 'contract_review'
    clientId: string
    formData: Record<string, unknown>
  }) {
    const result = await db
      .insert(services)
      .values({
        ...data,
        status: 'submitted',
      })
      .returning()

    if (result.length === 0) return null

    return await this.getServiceById(result[0].id)
  }

  static async updateService(id: string, data: {
    status?: 'submitted' | 'legal_review' | 'client_review' | 'complete'
    assignedAttorneyId?: string
    notes?: string[]
  }) {
    const updateData: any = {}

    if (data.status) {
      updateData.status = data.status
    }

    if (data.assignedAttorneyId !== undefined) {
      updateData.assignedAttorneyId = data.assignedAttorneyId || null
    }

    if (data.notes) {
      updateData.notes = data.notes
    }

    updateData.updatedAt = new Date()

    await db.update(services).set(updateData).where(eq(services.id, id))

    return await this.getServiceById(id)
  }

  // User operations
  static async getUserByEmail(email: string) {
    const result = await db
      .select({
        user: users,
        client: clients,
      })
      .from(users)
      .leftJoin(clients, eq(users.clientId, clients.id))
      .where(eq(users.email, email))
      .limit(1)

    if (result.length === 0) return null

    const { user, client } = result[0]
    return {
      ...user,
      client,
    }
  }

  // Attorney operations
  static async getAttorneys() {
    return await db.select().from(attorneys).orderBy(attorneys.name)
  }

  static async getAttorneyByName(name: string) {
    const result = await db.select().from(attorneys).where(eq(attorneys.name, name)).limit(1)
    return result[0] || null
  }
}