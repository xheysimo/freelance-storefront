// src/app/contact/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
// import ContactForm from '@/components/forms/ContactForm' // <-- REMOVED
import QuoteForm from '@/components/forms/QuoteForm'     // <-- ADDED
import { Clock, DollarSign, Mail, Phone, Zap } from 'lucide-react' // Icons for contact details

export const metadata: Metadata = {
  title: 'Get a Project Estimate | QuickDev Contact', // 🚀 UPGRADE: Specific, action-oriented title
  description: 'Start your fixed-price development project today. Contact QuickDev for a free consultation or quick service purchase.', // 🚀 UPGRADE: Reiterating value proposition
}

export default function ContactPage() {
  return (
    // UPGRADE 1: Use full width, apply consistent padding, and remove unnecessary min-height
    <main className="w-full py-20 sm:py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="text-center mx-auto max-w-3xl">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="h-4 w-4 mr-2" /> Start Your Project
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Book a Free 15-Minute Consultation
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
            Whether you need a **quick, fixed-price fix** or a **custom project quote**, the first step is a clear conversation.
          </p>
        </div>

        {/* --- Two-Column Contact Section --- */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Column 1: Contact Details & Value Proposition (Credibility) */}
          <div className="lg:order-first">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Contact QuickDev?
            </h2>
            
            {/* Value Points */}
            <dl className="space-y-6">
              <div className="flex items-start">
                <Clock className="h-6 w-6 shrink-0 text-indigo-600 mt-1" />
                <div className="ml-4">
                  <dt className="text-lg font-medium text-gray-900 dark:text-white">Guaranteed Response Time</dt>
                  <dd className="text-gray-600 dark:text-gray-400">Expect a reply within **1 working day**. We respect your timeline.</dd>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="h-6 w-6 shrink-0 text-indigo-600 mt-1" />
                <div className="ml-4">
                  <dt className="text-lg font-medium text-gray-900 dark:text-white">Clear Pricing Structure</dt>
                  <dd className="text-gray-600 dark:text-gray-400">Discussing your needs helps determine if a fixed-price package or a custom quote is best.</dd>
                </div>
              </div>
            </dl>

            {/* Alternative Contact Methods */}
            <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Other Ways to Connect
              </h3>
              <div className="space-y-4">
                <p className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="h-5 w-5 mr-3 text-indigo-600 shrink-0" />
                  <a href="mailto:contact@quickdev.com" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    contact@quickdev.com
                  </a>
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="h-5 w-5 mr-3 text-indigo-600 shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    (123) 456-7890 (by appointment)
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: The Contact Form */}
          <div className="p-8 rounded-2xl shadow-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send Your Project Inquiry
            </h2>
            <QuoteForm /> {/* <-- THIS IS THE CHANGED LINE */}
          </div>

        </div>
        {/* --- End Two-Column Contact Section --- */}

        {/* Final CTA/Next Step */}
        <div className="mt-20 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Prefer to buy a service directly? 
                <Link href="/#services" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline ml-2">
                    Browse Fixed-Price Packages &rarr;
                </Link>
            </p>
        </div>
      </div>
    </main>
  )
}