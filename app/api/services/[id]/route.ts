import { NextRequest, NextResponse } from 'next/server'
import { HybridDatabaseService } from '@/lib/services/hybrid-database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await HybridDatabaseService.getServiceById(params.id)

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updateData: any = {}

    if (body.status) {
      updateData.status = body.status
    }

    if (body.assignedAttorney) {
      // Find attorney by name and get their ID
      const attorney = await HybridDatabaseService.getAttorneyByName(body.assignedAttorney)
      updateData.assignedAttorneyId = attorney?.id || null
    }

    if (body.notes) {
      updateData.notes = body.notes
    }

    const service = await HybridDatabaseService.updateService(params.id, updateData)

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}