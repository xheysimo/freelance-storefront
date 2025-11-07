// src/components/layout/Header.tsx
import Link from 'next/link'

// We'll define nav links here for easy management
const navLinks = [
  { name: 'Services', href: '/#services' },
  { name: 'Portfolio', href: '/#portfolio' },
  { name: 'Contact', href: 'mailto:your-email@example.com' }, // Simple mailto link for now
]

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-5xl px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left Side: Logo/Title */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          Freelance Storefront
        </Link>

        {/* Right Side: Navigation Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}