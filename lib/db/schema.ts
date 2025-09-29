import { pgTable, uuid, varchar, text, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const serviceTypeEnum = pgEnum('service_type', ['nda', 'employee_onboarding', 'contract_review'])
export const serviceStatusEnum = pgEnum('service_status', ['submitted', 'legal_review', 'client_review', 'complete'])
export const userRoleEnum = pgEnum('user_role', ['client', 'admin'])
export const serviceUrgencyEnum = pgEnum('service_urgency', ['asap', 'fast', 'no_rush'])

// Tables
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  company: varchar('company', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const attorneys = pgTable('attorneys', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  specialties: jsonb('specialties').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  type: serviceTypeEnum('type').notNull(),
  status: serviceStatusEnum('status').notNull().default('submitted'),
  urgency: serviceUrgencyEnum('urgency').notNull().default('no_rush'),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  assignedAttorneyId: uuid('assigned_attorney_id').references(() => attorneys.id),
  formData: jsonb('form_data').notNull(),
  notes: jsonb('notes').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const clientsRelations = relations(clients, ({ many, one }) => ({
  services: many(services),
  user: one(users, {
    fields: [clients.id],
    references: [users.clientId],
  }),
}))

export const attorneysRelations = relations(attorneys, ({ many }) => ({
  assignedServices: many(services),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
  uploadedDocuments: many(documents),
}))

export const servicesRelations = relations(services, ({ one, many }) => ({
  client: one(clients, {
    fields: [services.clientId],
    references: [clients.id],
  }),
  assignedAttorney: one(attorneys, {
    fields: [services.assignedAttorneyId],
    references: [attorneys.id],
  }),
  documents: many(documents),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  service: one(services, {
    fields: [documents.serviceId],
    references: [services.id],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}))

// TypeScript types
export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert
export type Attorney = typeof attorneys.$inferSelect
export type NewAttorney = typeof attorneys.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert