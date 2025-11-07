// src/app/layout.tsx
import type { Metadata } from "next";
// Assuming Geist is correctly set up for both sans and mono
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/layout/Header"; 
import Footer from "@/components/layout/Footer"; 
import { SanityLive } from "@/sanity/lib/live"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fixed-Price Dev Solutions | Expert Freelance Storefront", // 💡 UPGRADE: More professional SEO title
  description: "Transparent, fixed-price development services for quick feature implementation and technical fixes. Built by a senior engineer.", // 💡 UPGRADE: Specific, trust-building description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className="scroll-smooth" // 🚀 UPGRADE 1: Enable smooth scrolling for section navigation
      suppressHydrationWarning // Move suppressHydrationWarning here for better accessibility/SSR
    >
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          font-sans 
          bg-white dark:bg-gray-950 // 🚀 UPGRADE 2: Set global base background color for dark mode consistency
          text-gray-900 dark:text-gray-100 // 🚀 UPGRADE 3: Set default text colors
        `}
        suppressHydrationWarning={true}
      >
        <div className="flex min-h-screen flex-col">
          {/* Header (assumed to be sticky/fixed) */}
          <Header />
          
          {/* Main content area */}
          <main className="flex-1 overflow-x-hidden"> {/* 🚀 UPGRADE 4: Prevent horizontal overflow */}
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
        
        {/* Sanity visual editing component */}
        <SanityLive />
      </body>
    </html>
  );
}