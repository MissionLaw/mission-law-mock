import { NextRequest, NextResponse } from 'next/server'
import { HybridDatabaseService } from '@/lib/services/hybrid-database'

export async function GET(request: NextRequest) {
  try {
    const attorneys = await HybridDatabaseService.getAttorneys()
    return NextResponse.json({ attorneys })
  } catch (error) {
    console.error('Error fetching attorneys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attorneys' },
      { status: 500 }
    )
  }
}