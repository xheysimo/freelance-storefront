// src/app/about/page.tsx
import { Metadata } from 'next'
import Image from 'next/image' // Assuming you'll add a profile picture

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about my mission, values, and experience.',
}

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            About Me
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            [Your Mission Statement Here. e.g., "I help businesses succeed
            by building high-quality, scalable web solutions with a focus on user
            experience and performance."]
          </p>
        </div>

        {/* Optional: Profile Picture */}
        {/* <div className="relative h-64 w-64 mx-auto mt-16 rounded-full overflow-hidden shadow-lg">
          <Image
            src="/path-to-your-profile-image.jpg"
            alt="Your Name"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        */}

        <article className="prose prose-lg dark:prose-invert mt-16 mx-auto">
          <h2>My Story</h2>
          <p>
            [Placeholder: Start with your background. How did you get into
            your field? What are you passionate about? e.g., "My journey into
            web development started over [X] years ago..."]
          </p>

          <h2>My Approach</h2>
          <p>
            [Placeholder: Describe how you work. What makes you different?
            e.g., "I believe in a collaborative process. I work closely with my
            clients to understand their core needs..."]
          </p>

          <h2>Why Work With Me?</h2>
          <ul>
            <li>
              <strong>[Value 1]:</strong> [e.g., "Transparent Communication"]
            </li>
            <li>
              <strong>[Value 2]:</strong> [e.g., "Quality-First Development"]
            </li>
            <li>
              <strong>[Value 3]:</strong> [e.g., "Long-Term Partnership"]
            </li>
          </ul>
        </article>
      </div>
    </main>
  )
}