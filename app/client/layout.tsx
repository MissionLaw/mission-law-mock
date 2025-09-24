'use client'

import AuthGuard from '@/components/AuthGuard'
import { Navigation } from '@/components/Layout/Navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="client" fallbackPath="/login">
      <div className="min-h-screen bg-gray-50">
        <Navigation userRole="client" />
        <main>{children}</main>
      </div>
    </AuthGuard>
  )
}