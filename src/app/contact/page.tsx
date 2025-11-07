// src/app/contact/page.tsx
import { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Me',
  description: 'Get in touch for a project consultation or inquiry.',
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
      {/* Hero Section */}
      <div className="z-10 w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Get in Touch
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Have a project in mind, or just want to say hi?
          <br />
          Fill out the form below and I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Form Section */}
      <div className="mt-16 w-full max-w-xl">
        <ContactForm />
      </div>
    </main>
  )
}