// src/components/layout/Footer.tsx
import Link from 'next/link' // <-- Import Link

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
        {/* --- ADDED LINKS --- */}
        <div className="flex justify-center gap-6 mb-4">
          <Link
            href="/about"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            About
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
        </div>
        {/* --- END ADDED LINKS --- */}

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} Your Freelance Name. All rights reserved.
        </p>
      </div>
    </footer>
  )
}