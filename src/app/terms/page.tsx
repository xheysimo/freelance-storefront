// src/app/terms/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using our services.',
}

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: November 7, 2025
          </p>
        </div>

        <article className="prose prose-lg dark:prose-invert mt-12 mx-auto">
          <p className="lead">
            <strong>Disclaimer:</strong> This is a placeholder document. These
            terms are not legally binding. You must replace this content with
            your own Terms of Service, preferably drafted by a legal
            professional.
          </p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using the services provided by [Your Freelance
            Name] ("I", "me", "my"), you agree to be bound by these Terms of
            Service ("Terms"). If you disagree with any part of the terms,
            then you may not access the service.
          </p>

          <h2>2. Services</h2>
          <p>
            I provide [List your services, e.g., "web development,
            consulting, and website maintenance"] services. All services are
            subject to a separate agreement or statement of work (SOW) that
            will detail the scope, fees, and deliverables.
          </p>

          <h2>3. Payments, Refunds, and Cancellations</h2>
          <p>
            For one-off services, payment is authorized upfront and captured
            upon completion, as described during checkout. For recurring
            services, payments are billed in advance on a monthly basis.
            Payments are non-refundable except as required by law or as
_           explicitly stated in your SOW. You may cancel recurring
            services at any time, with cancellation taking effect at the end
            of the current billing period.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            Upon full and final payment, I grant you a non-exclusive,
            royalty-free license to use the final deliverables. I retain the
            right to use the work for my portfolio and marketing purposes unless
            otherwise agreed in writing.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall I be liable for any indirect, incidental,
            special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use the service.
          </p>

          <h2>6. Changes to Terms</h2>
          <p>
            I reserve the right to modify or replace these Terms at any time.
            I will provide at least 30 days' notice prior to any new terms
            taking effect.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact me via
            the <a href="/contact">contact page</a>.
          </p>
        </article>
      </div>
    </main>
  )
}