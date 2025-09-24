import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('id')

    if (clientId) {
      const client = await DatabaseService.getClientById(clientId)

      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ client })
    }

    const clients = await DatabaseService.getClients()
    return NextResponse.json({ clients })
  } catch (error) {
    console.error('Error fetching client data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 }
    )
  }
}