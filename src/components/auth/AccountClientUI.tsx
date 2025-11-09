// src/components/auth/AccountClientUI.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Settings } from 'lucide-react'
import ManageSubscriptionButton from '@/components/auth/ManageSubscriptionButton'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'

interface Order {
  _id: string
  _createdAt: string
  service: {
    title: string
    slug: { current: string }
  }
  oneOffStatus?: string
  subscriptionStatus?: string
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
}) {
  const activeClass = "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
  const defaultClass = "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
  
  return (
    <Link
      href={href}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive ? activeClass : defaultClass
      }`}
    >
      {children}
    </Link>
  )
}

export default function AccountClientUI({ orders }: { orders: Order[] }) {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'orders'

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      
      <aside className="lg:col-span-3 mb-8 lg:mb-0">
        <nav className="space-y-1">
          <NavLink href="/account" isActive={activeTab === 'orders'}>
            <ShoppingBag className="mr-3 h-5 w-5 shrink-0" />
            <span className="truncate">Order History</span>
          </NavLink>
          <NavLink href="/account?tab=settings" isActive={activeTab === 'settings'}>
            <Settings className="mr-3 h-5 w-5 shrink-0" />
            <span className="truncate">Account Settings</span>
          </NavLink>
        </nav>
      </aside>

      <div className="lg:col-span-9">
        
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-950 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold mb-6">Order History</h2>
            <div className="space-y-4">
              {orders.length === 0 && (
                <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
              )}
              {orders.map((order) => (
                <div key={order._id} className="p-4 border dark:border-gray-700 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {order.service.title}
                    </h3>
                    <p className="text-sm text-gray-500" suppressHydrationWarning={true}>
                        Ordered on: {new Date(order._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="mt-2 sm:mt-0 text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 self-start sm:self-center">
                    {order.oneOffStatus || order.subscriptionStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-950 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">Manage Subscription</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click the button below to manage your subscription, update your payment
                method, and view your invoice history.
              </p>
              <ManageSubscriptionButton />
            </div>
            
            <div className="bg-white dark:bg-gray-950 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
              <ChangePasswordForm />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}