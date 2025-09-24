import { NextRequest, NextResponse } from 'next/server'
import { HybridDatabaseService } from '@/lib/services/hybrid-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('id')

    if (clientId) {
      const client = await HybridDatabaseService.getClientById(clientId)

      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ client })
    }

    const clients = await HybridDatabaseService.getClients()
    return NextResponse.json({ clients })
  } catch (error) {
    console.error('Error fetching client data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 }
    )
  }
}