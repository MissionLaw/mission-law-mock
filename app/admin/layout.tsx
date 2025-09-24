'use client'

import AuthGuard from '@/components/AuthGuard'
import { Navigation } from '@/components/Layout/Navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="admin" fallbackPath="/login">
      <div className="min-h-screen bg-gray-50">
        <Navigation userRole="admin" />
        <main>{children}</main>
      </div>
    </AuthGuard>
  )
}