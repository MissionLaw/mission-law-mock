import Link from 'next/link'
import { ScaleIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <ScaleIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Mission Law
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Professional Legal Services Management
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/client/overview"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Client Portal
          </Link>

          <Link
            href="/admin/services"
            className="w-full flex justify-center py-3 px-4 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}