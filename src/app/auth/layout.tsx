'use client';

import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Auth form */}
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Project Insight Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <h1 className="text-2xl font-bold text-gray-900">
                  Project Insight
                </h1>
              </div>
              <h2 className="mt-2 text-sm text-gray-600">
                Employee Activity Monitoring System
              </h2>
            </div>
            {children}
          </div>
        </div>

        {/* Right side - Background image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-opacity-75 backdrop-blur-sm">
              <div className="flex h-full items-center justify-center">
                <div className="max-w-2xl p-8 text-center text-white">
                  <h2 className="text-3xl font-bold">
                    Welcome to Project Insight
                  </h2>
                  <p className="mt-4 text-lg">
                    Monitor, analyze, and optimize your team's productivity with
                    our comprehensive activity tracking solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 