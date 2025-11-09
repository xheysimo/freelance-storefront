// src/components/layout/Header.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

const navLinks = [
  { name: 'Services', href: '/#services' },
  { name: 'Portfolio', href: '/#portfolio' },
  { name: 'About', href: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-950/95 dark:border-gray-800 transition-shadow duration-300 shadow-sm">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between">
        
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2 group-hover:rotate-12 transition-transform" />
          QuickDev
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          
          <div className="hidden lg:flex items-center gap-4">
            {isLoading ? (
              <div className="rounded-full bg-gray-200 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-500">
                ...
              </div>
            ) : session ? (
              <>
                <Link
                  href="/account"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  My Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2.5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-xl font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={toggleMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            
            {isLoading ? (
              <div className="mt-6 block w-full rounded-md bg-gray-200 px-3.5 py-2.5 text-center text-base font-semibold text-gray-500">
                ...
              </div>
            ) : session ? (
              <>
                <Link
                  href="/account"
                  className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
                  onClick={toggleMobileMenu}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu();
                  }}
                  className="mt-4 block w-full rounded-md bg-gray-200 dark:bg-gray-800 px-3.5 py-2.5 text-center text-base font-semibold text-gray-700 dark:text-gray-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
            
          </div>
        </div>
      )}
    </header>
  )
}