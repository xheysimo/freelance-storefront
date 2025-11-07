// src/app/about/page.tsx
import { Metadata } from 'next'
import Image from 'next/image' 
import Link from 'next/link'
import { CheckCircle2, Trophy, Clock, Zap, Code, Shield, DollarSign, Mail, User, ArrowRightIcon } from 'lucide-react' // Icons for value props

export const metadata: Metadata = {
  title: 'About the QuickDev Expert | Experience & Values', // 🚀 UPGRADE: More detail in title
  description: 'Meet the senior developer behind QuickDev. Learn about my commitment to fixed-price delivery, modern technology, and efficient project execution.', // 🚀 UPGRADE: Reiterate key value props
}

const credibilityMetrics = [
  { value: '10+', label: 'Years of Experience', icon: Trophy },
  { value: '50+', label: 'Projects Completed', icon: CheckCircle2 },
  { value: '48hr', label: 'Average Delivery Time (Packages)', icon: Clock },
]

const coreValues = [
  { title: 'Fixed-Price Guarantee', description: 'No scope creep, no surprise invoices. The price you see is the price we deliver on.', icon: DollarSign },
  { title: 'Senior-Level Code', description: 'All solutions are architected and coded by a single, senior engineer—not outsourced.', icon: Code },
  { title: 'Built for Speed', description: 'Leveraging modern frameworks (Next.js, Sanity) for rapid deployment and performance.', icon: Zap },
  { title: 'Direct Communication', description: 'Skip the project managers. You communicate directly with the person doing the work.', icon: Mail },
]

export default function AboutPage() {
  return (
    <main className="w-full bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-20 sm:pt-24 pb-16">
        
        {/* --- 1. HERO: PROFILE & MISSION --- */}
        <div className="lg:flex lg:items-start lg:gap-16">
          
          {/* Left: Image/Metrics */}
          <div className="flex flex-col items-center lg:items-start lg:w-1/3 shrink-0">
            {/* Profile Picture Placeholder */}
            <div className="relative h-64 w-64 rounded-full overflow-hidden shadow-2xl border-4 border-indigo-600 dark:border-indigo-400 bg-gray-200 dark:bg-gray-700">
                <div className='flex items-center justify-center h-full'>
                    <User className="h-20 w-20 text-gray-500 dark:text-gray-400" />
                </div>
            </div>
            
            <h2 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
                [Your Name]
            </h2>
            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold">
                Senior Full-Stack Developer
            </p>
            
            {/* Credibility Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8 w-full text-center border-t border-b border-gray-100 dark:border-gray-800 py-6">
                {credibilityMetrics.map((metric) => (
                    <div key={metric.label}>
                        <metric.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{metric.label}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* Right: Mission Statement & Intro */}
          <div className="mt-12 lg:mt-0 lg:w-2/3">
            <h1 className="text-base font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                The QuickDev Mission
            </h1>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Solving Complex Problems with Clarity, Speed, and Fixed Pricing.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                My mission is simple: to provide the **highest quality freelance development** without the usual pitfalls—the endless scoping calls, budget creep, and communication friction. I focus exclusively on efficient, well-defined work, allowing you to **just order the solution you need.**
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                My journey began over **[X] years ago**, focused on architecting scalable systems using **Next.js, TypeScript, and Sanity**. I combine deep technical expertise with a commitment to transparency, ensuring every project is delivered on time, within budget, and ready to perform.
            </p>

            <Link
                href="/#services"
                className="mt-8 inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
            >
                See My Fixed-Price Services <ArrowRightIcon className="inline ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* --- 2. CORE VALUES & APPROACH --- */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 py-20 sm:py-24 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900 sm:text-4xl dark:text-white mb-12">
                The QuickDev Guarantee
            </h2>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
                {coreValues.map((value) => (
                    <div key={value.title} className="p-4 rounded-lg">
                        <value.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                        <dt className="text-xl font-bold text-gray-900 dark:text-white">{value.title}</dt>
                        <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">{value.description}</dd>
                    </div>
                ))}
            </dl>
        </div>
      </div>

      {/* --- 3. KEY TECHNOLOGIES & EXPERTISE --- */}
      <div className="w-full py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900 sm:text-4xl dark:text-white mb-12">
                My Core Technology Expertise
            </h2>
            <p className="text-center text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-16">
                I specialize in modern, high-performance web architecture, guaranteeing solutions that are both fast and scalable.
            </p>
            
            {/* Placeholder for Logos/Skills Grid - Replace with actual technology names */}
            <div className="grid grid-cols-3 gap-8 md:grid-cols-6 grayscale opacity-70">
                <div className="flex justify-center items-center h-12">
                    <Code className="h-8 w-8 text-gray-400" /> <span className='ml-2 text-lg font-medium dark:text-gray-300'>Next.js</span>
                </div>
                <div className="flex justify-center items-center h-12">
                    <Code className="h-8 w-8 text-gray-400" /> <span className='ml-2 text-lg font-medium dark:text-gray-300'>React</span>
                </div>
                <div className="flex justify-center items-center h-12">
                    <Code className="h-8 w-8 text-gray-400" /> <span className='ml-2 text-lg font-medium dark:text-gray-300'>TypeScript</span>
                </div>
                <div className="flex justify-center items-center h-12">
                    <Code className="h-8 w-8 text-gray-400" /> <span className='ml-2 text-lg font-medium dark:text-gray-300'>Sanity CMS</span>
                </div>
                <div className="flex justify-center items-center h-12">
                    <Code className="h-8 w-8 text-gray-400" /> <span className='ml-2 text-lg font-medium dark:text-gray-300'>Tailwind CSS</span>
                </div>
                <div className="flex justify-center items-center h-12">
                    <Code className="h-8 w-8 text-gray-400" /> <span className='ml-2 text-lg font-medium dark:text-gray-300'>Vercel/AWS</span>
                </div>
            </div>
            
            <div className="mt-16 text-center">
                <Link
                    href="/contact"
                    className="rounded-xl bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:bg-indigo-700 transition"
                >
                    Discuss Your Tech Stack &rarr;
                </Link>
            </div>
        </div>
      </div>
      
    </main>
  )
}