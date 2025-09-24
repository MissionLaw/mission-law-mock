import { db, clients, attorneys, users, services } from '../lib/db'
import { eq } from 'drizzle-orm'

export async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Clear existing data
    await db.delete(services)
    await db.delete(users)
    await db.delete(attorneys)
    await db.delete(clients)

    // Seed clients
    const clientsData = await db.insert(clients).values([
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        company: 'TechCorp Solutions',
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@innovatelab.com',
        company: 'InnovateLab Inc',
      },
      {
        name: 'Amanda Rodriguez',
        email: 'amanda.rodriguez@globalventures.com',
        company: 'Global Ventures LLC',
      },
    ]).returning()

    // Seed attorneys
    const attorneysData = await db.insert(attorneys).values([
      {
        name: 'David Morrison',
        email: 'david.morrison@missionlaw.com',
        specialties: ['contract_review', 'nda'],
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@missionlaw.com',
        specialties: ['employee_onboarding', 'contract_review'],
      },
    ]).returning()

    // Seed users
    const usersData = await db.insert(users).values([
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        role: 'client',
        clientId: clientsData[0].id,
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@innovatelab.com',
        role: 'client',
        clientId: clientsData[1].id,
      },
      {
        name: 'Amanda Rodriguez',
        email: 'amanda.rodriguez@globalventures.com',
        role: 'client',
        clientId: clientsData[2].id,
      },
      {
        name: 'David Morrison',
        email: 'david.morrison@missionlaw.com',
        role: 'admin',
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@missionlaw.com',
        role: 'admin',
      },
    ]).returning()

    // Seed services
    await db.insert(services).values([
      {
        title: 'NDA with DataFlow Systems',
        type: 'nda',
        status: 'legal_review',
        clientId: clientsData[0].id,
        assignedAttorneyId: attorneysData[0].id,
        formData: {
          counterparty_name: 'DataFlow Systems',
          counterparty_email: 'legal@dataflow.com',
          purpose: 'Sharing technical specifications for potential partnership',
          duration: '24',
          mutual: true,
        },
        notes: ['Initial review completed', 'Waiting for counterparty response'],
      },
      {
        title: 'Employee Onboarding - John Smith',
        type: 'employee_onboarding',
        status: 'client_review',
        clientId: clientsData[0].id,
        assignedAttorneyId: attorneysData[1].id,
        formData: {
          employee_name: 'John Smith',
          employee_email: 'john.smith@techcorp.com',
          position: 'Senior Software Engineer',
          start_date: '2024-10-01',
          salary: '$95,000',
          equity: true,
          additional_notes: 'Remote work agreement needed',
        },
      },
      {
        title: 'SaaS Licensing Agreement Review',
        type: 'contract_review',
        status: 'submitted',
        clientId: clientsData[1].id,
        formData: {
          contract_title: 'SaaS Licensing Agreement',
          counterparty: 'CloudTech Solutions',
          contract_value: '$120,000',
          review_priority: 'High',
          deadline: '2024-10-15',
          key_concerns: 'Data privacy clauses and termination terms',
        },
      },
      {
        title: 'Partnership NDA with StartupX',
        type: 'nda',
        status: 'complete',
        clientId: clientsData[2].id,
        assignedAttorneyId: attorneysData[0].id,
        formData: {
          counterparty_name: 'StartupX Inc',
          counterparty_email: 'legal@startupx.com',
          purpose: 'Investment due diligence',
          duration: '36',
          mutual: false,
        },
      },
      {
        title: 'Marketing Manager Onboarding',
        type: 'employee_onboarding',
        status: 'legal_review',
        clientId: clientsData[1].id,
        assignedAttorneyId: attorneysData[1].id,
        formData: {
          employee_name: 'Emily Davis',
          employee_email: 'emily.davis@innovatelab.com',
          position: 'Marketing Manager',
          start_date: '2024-10-15',
          salary: '$75,000',
          equity: false,
        },
      },
    ])

    console.log('✅ Database seeded successfully!')
    console.log(`Created ${clientsData.length} clients`)
    console.log(`Created ${attorneysData.length} attorneys`)
    console.log(`Created ${usersData.length} users`)
    console.log('Created 5 services')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}