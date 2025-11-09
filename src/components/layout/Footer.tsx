// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Zap, Mail, Twitter, Github, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const serviceLinks = [
    { name: 'Fixed-Price Packages', href: '/#services' },
    { name: 'Custom Projects', href: '/contact' },
    { name: 'Recent Case Studies', href: '/#portfolio' },
  ]

  const companyLinks = [
    { name: 'About the Expert', href: '/about' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ]

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 pb-10">
          
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center mb-4"
            >
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              QuickDev
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
              **Senior-level code, fixed pricing, and guaranteed delivery.** Your reliable source for fast, high-quality development solutions.
            </p>
            
            <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Github className="h-5 w-5" /></a>
                <a href="mailto:contact@quickdev.com" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Mail className="h-5 w-5" /></a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Solutions</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-4 self-end mt-8 lg:mt-0">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ready to Start?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get in touch today to discuss your custom project or purchase a package instantly.
                </p>
                <Link
                    href="/contact"
                    className="w-full inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
                >
                    Book a Free Consultation
                </Link>
            </div>
          </div>

        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 mt-4">
            <p className="text-center text-xs text-gray-500 dark:text-gray-500">
                &copy; {currentYear} QuickDev. All rights reserved. Registered Freelance Business.
            </p>
        </div>
      </div>
    </footer>
  )
}