import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './components/AuthProvider';
import dbConnect from './lib/mongodb';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Screenshot Dashboard',
  description: 'Monitor user activity with screenshots and AI summaries.',
}

async function init() {
  await dbConnect();
}

init();

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}