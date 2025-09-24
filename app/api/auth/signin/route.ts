import { NextRequest, NextResponse } from 'next/server'
import { HybridDatabaseService } from '@/lib/services/hybrid-database'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const userData = await HybridDatabaseService.getUserByEmail(email)

    if (userData) {
      const user = {
        id: userData.user.id,
        name: userData.user.name,
        email: userData.user.email,
        role: userData.user.role,
        clientId: userData.user.clientId || undefined
      }

      return NextResponse.json({ user })
    }

    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}