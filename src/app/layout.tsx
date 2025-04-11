import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project Insight - Employee Monitoring Dashboard',
  description: 'Admin dashboard for employee activity and productivity monitoring system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <head>
      <meta name="google-site-verification" content="pGKXTHVq-njhtZtqVty6OXr-_XAP_kF0YDZXQPtulDA" />
    </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}