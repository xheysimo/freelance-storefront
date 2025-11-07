// src/components/layout/Header.tsx
"use client" // Needed for useState and mobile menu interaction

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react' // Icons for menu and branding

// We'll define nav links here for easy management
const navLinks = [
  { name: 'Services', href: '/#services' },
  { name: 'Portfolio', href: '/#portfolio' },
  { name: 'About', href: '/about' }, // Added About link for credibility
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    // UPGRADE 1: Make header sticky and use full width
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-950/95 dark:border-gray-800 transition-shadow duration-300 shadow-sm">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Left Side: Logo/Title (Branding Upgrade) */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center group"
          onClick={() => setMobileMenuOpen(false)} // Close menu on logo click
        >
          <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2 group-hover:rotate-12 transition-transform" />
          QuickDev
        </Link>

        {/* Center: Desktop Navigation Links (Hidden on Mobile) */}
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

        {/* Right Side: Primary CTA & Mobile Button */}
        <div className="flex items-center gap-4">
          {/* UPGRADE 3: High-contrast CTA Button */}
          <Link
            href="/contact"
            className="hidden lg:block rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            Get an Estimate
          </Link>

          {/* UPGRADE 2: Mobile Menu Button */}
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

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-xl font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={toggleMobileMenu} // Close menu after selection
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
              onClick={toggleMobileMenu}
            >
              Get an Estimate
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}