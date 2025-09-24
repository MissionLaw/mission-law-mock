'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { User } from '@/lib/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'client' | 'admin'
  fallbackPath?: string
}

export default function AuthGuard({
  children,
  requiredRole,
  fallbackPath = '/'
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()

    if (!currentUser) {
      router.push(fallbackPath)
      return
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push(fallbackPath)
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [router, requiredRole, fallbackPath])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}