import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You are not authorized to access this page',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            401 - Unauthorized
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You need to be logged in to access this page.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 