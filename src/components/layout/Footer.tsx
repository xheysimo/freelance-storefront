// src/components/layout/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} Your Freelance Name. All rights reserved.
        </p>
      </div>
    </footer>
  )
}