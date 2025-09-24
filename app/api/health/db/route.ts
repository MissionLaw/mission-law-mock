import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if database connection is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { status: 'unavailable', message: 'Database URL not configured' },
        { status: 503 }
      )
    }

    // Try to import and test database connection
    const { db } = await import('@/lib/db')
    await db.execute('SELECT 1')

    return NextResponse.json({ status: 'healthy' })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: (error as Error).message },
      { status: 503 }
    )
  }
}