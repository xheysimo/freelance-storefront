// src/app/account/page.tsx
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { authOptions } from '@/lib/authOptions' 
import SignOutButton from '@/components/auth/SignOutButton'
import AccountClientUI from '@/components/auth/AccountClientUI'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

// Define the shape of our orders
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

// A simple loading fallback for the tabs
function TabsLoading() {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      <aside className="lg:col-span-3 mb-8 lg:mb-0">
        <div className="space-y-1">
          <div className="bg-gray-200 dark:bg-gray-800 h-9 w-full rounded-md"></div>
          <div className="bg-gray-200 dark:bg-gray-800 h-9 w-full rounded-md"></div>
        </div>
      </aside>
      <div className="lg:col-span-9">
        <div className="bg-gray-200 dark:bg-gray-800 h-64 w-full rounded-xl"></div>
      </div>
    </div>
  )
}

export default async function AccountPage() {
  cookies()

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect('/login')
  }

  // Fetch orders
  const query = `*[_type == "order" && customerEmail == $email] | order(_createdAt desc) {
    _id,
    _createdAt,
    oneOffStatus,
    subscriptionStatus,
    service->{
      title,
      "slug": slug
    }
  }`
  const ordersResult = await sanityFetch<any>({
    query,
    params: { email: session.user.email },
  })
  const orders = ordersResult.data as Order[]

  return (
    <main className="w-full py-20 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Page Header (Stays on Server) */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Account
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Welcome back, {session.user.name}!
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <SignOutButton />
          </div>
        </div>

        {/* 3. Render the Client UI inside Suspense */}
        <Suspense fallback={<TabsLoading />}>
          <AccountClientUI orders={orders} />
        </Suspense>
      </div>
    </main>
  )
}