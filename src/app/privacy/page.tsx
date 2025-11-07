// src/app/privacy/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: November 7, 2025
          </p>
        </div>

        <article className="prose prose-lg dark:prose-invert mt-12 mx-auto">
          <p className="lead">
            <strong>Disclaimer:</strong> This is a placeholder document. You
            must replace this content with your own Privacy Policy, drafted
            to comply with relevant laws (like GDPR or CCPA).
          </p>

          <h2>1. Introduction</h2>
          <p>
            [Your Freelance Name] ("I", "me", "my") respects your privacy.
            This Privacy Policy explains how I collect, use, disclose, and
            safeguard your information when you visit my website and use my
            services.
          </p>

          <h2>2. What Information I Collect</h2>
          <p>
            I collect personally identifiable information that you voluntarily
            provide to me when you:
          </p>
          <ul>
            <li>
              <strong>Make a purchase:</strong> When you book a service, I
              collect your name and email. Your payment card details are
              collected directly by my payment processor, Stripe, and are
              never stored on my servers.
            </li>
            <li>
              <strong>Fill out the contact form:</strong> I collect your name,
              email, and the content of your message.
            </li>
            <li>
              <strong>Submit a project brief:</strong> I collect all
              information you provide in the brief, which may include
              personal or business details.
            </li>
          </ul>

          <h2>3. How I Use Your Information</h2>
          <p>I use the information I collect to:</p>
          <ul>
            <li>Fulfill and manage your service orders.</li>
            <li>Process payments and authorizations (via Stripe).</li>
            <li>Respond to your inquiries via the contact form.</li>
            <li>Communicate with you about your order or service.</li>
          </ul>

          <h2>4. Data Sharing and Third Parties</h2>
          <p>
            I do not sell, trade, or rent your personal information to
            others. I share data only with the following third parties
            necessary to provide my services:
          </p>
          <ul>
            <li>
              <strong>Stripe:</strong> To process payments and manage
              subscriptions. See Stripe's Privacy Policy for more details.
            </li>
            <li>
              <strong>Resend (or email provider):</strong> To send you
              transactional emails and respond to contact form inquiries.
            </li>
            <li>
              <strong>Sanity:</strong> To store your order details and
              project brief information securely.
            </li>
          </ul>

          <h2>5. Your Data Rights</h2>
          <p>
            You have the right to request access to, correction of, or
            deletion of your personal data. To make such a request, please
            contact me via the <a href="/contact">contact page</a>.
          </p>

          <h2>6. Data Security</h2>
          <p>
            I use administrative, technical, and physical security measures
            to help protect your personal information. While I have taken
            reasonable steps to secure the personal information you provide,
            please be aware that no security measures are perfect or
            impenetrable.
          </p>
        </article>
      </div>
    </main>
  )
}