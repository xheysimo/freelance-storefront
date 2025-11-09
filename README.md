# 🚀 Freelance Storefront - Next.js + Sanity + Stripe Boilerplate

This is a complete Next.js 16 (App Router) project designed as a storefront for a freelance developer. It supports fixed-price services, recurring subscriptions, custom quotes, user authentication, and secure payment processing with Stripe and Sanity CMS.

## ✨ Key Features

  * **Fixed-Price Checkout:** Secure payment authorization (Stripe Payment Intent) for one-off services (charged on completion).
  * **Recurring Subscriptions:** Stripe Checkout for monthly memberships, synced to Sanity.
  * **Quote System:** Handles custom quote submissions, allows admin to generate a Stripe Payment Link via Sanity Studio.
  * **User Authentication:** Custom credentials provider using **NextAuth.js** and `bcrypt` for secure login/registration.
  * **Account Dashboard:** User-specific order history, password change form, and subscription management via Stripe Customer Portal.
  * **Admin CMS (Sanity Studio):** Fully configured Sanity Studio for managing services, projects, testimonials, orders, and quotes. Includes custom document actions (e.g., "Capture Payment," "Cancel Subscription").
  * **Serverless Email:** Transactional email sending via **Resend**.
  * **Webhooks:** Secure webhooks for **Stripe-to-Sanity** (e.g., price syncing) and **Sanity-to-Stripe** (e.g., subscription cancellation).

-----

## 🏗️ Project Structure

The codebase is organized following the Next.js App Router convention, with key application logic separated for clarity:

| Directory/File | Purpose |
| :--- | :--- |
| `src/app/api/` | All **Serverless API Routes** including Stripe webhooks, user authentication, password management, and Stripe portal/checkout session creation. |
| `src/app/(routes)/` | Contains all frontend pages (`page.tsx`) like `/about`, `/contact`, `/login`, and dynamic routes like `/services/[slug]`. |
| `src/components/checkout/` | Client components for the **Stripe payment form** (`CheckoutForm.tsx`) and the dynamic **Project Brief submission form**. |
| `src/lib/authOptions.ts` | The configuration file for **NextAuth.js** credentials provider and JWT session management. |
| `src/lib/resend.ts` | A utility function and interface for sending templated emails using **Resend**. |
| `src/sanity/schemaTypes/` | All **Sanity CMS Schema** definitions (e.g., `orderType`, `quoteType`, `serviceType`). |
| `src/sanity/actions/` | Custom **Sanity Document Actions** to trigger server-side Stripe operations (e.g., `PublishOrderAction`, `GeneratePaymentLinkAction`). |
| `sanity.config.ts` | The main configuration for the **Sanity Studio**. |

-----

## 🛠️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

### 1\. Environment Variables

Create a file named `.env.local` in the root of your project and copy the contents from the `.env.local.example` above. Fill in all placeholder values before running the application.

### 2\. Sanity CMS Setup

  * **Initialize Sanity:** Run the following to set up your remote project, using the **Project ID** and **Dataset** from your `.env.local` when prompted:

    ```bash
    npx sanity init
    ```

  * **Deploy Studio:** The schema and structure are configured in `sanity.config.ts` and `src/sanity/structure.ts`.

    ```bash
    # Deploy your studio configuration to the web
    npx sanity deploy
    ```

  * **Create API Token:** In your Sanity project settings, create an **API Write Token** with **Editor** privileges and paste it as `SANITY_API_WRITE_TOKEN`.

  * **Configure Webhooks:**

      * Go to Project Settings \> **Webhooks**.
      * Create a webhook for `service` document mutations, pointing to `NEXT_PUBLIC_SITE_URL/api/sync-sanity-to-stripe`.
      * Set the **Secret** to match your `SANITY_WEBHOOK_SECRET` value.

### 3\. Stripe Setup

  * **API Keys:** Copy your **Publishable** and **Secret** keys from the Stripe dashboard and paste them into your `.env.local`.

  * **Webhooks:**

      * Go to Developers \> **Webhooks**.
      * Add an endpoint pointing to `NEXTAUTH_URL/api/stripe-webhook`.
      * Listen for the following events: `checkout.session.completed`, `price.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.
      * Copy the **Signing Secret** and paste it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

-----

## ☁️ Deployment (Vercel Recommended)

This project is highly optimized for Vercel, the creators of Next.js.

  * **Set Environment Variables:** When deploying to Vercel, ensure all **Secret** variables from your `.env.local` (especially `STRIPE_SECRET_KEY`, `SANITY_API_WRITE_TOKEN`, `NEXTAUTH_SECRET`, and all webhook secrets) are set as **Environment Variables** in your Vercel project settings.
  * **Update Webhook URLs:** Once your site is live at `https://[YOUR_DEPLOYMENT_URL]`, you must update the URLs in both the **Stripe Webhook** and the **Sanity Webhook** settings to use your production domain instead of `http://localhost:3000`.

-----

## 💡 Learn More

To learn more about Next.js, take a look at the following resources:

  * [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
  * [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.