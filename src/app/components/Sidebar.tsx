'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Role } from '@prisma/client';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', roles: [Role.ADMIN, Role.EMPLOYEE] },
  { name: 'Screenshots', href: '/dashboard/screenshots', roles: [Role.ADMIN, Role.EMPLOYEE] },
  { name: 'Users', href: '/dashboard/users', roles: [Role.ADMIN] },
  { name: 'Reports', href: '/dashboard/reports', roles: [Role.ADMIN] },
  { name: 'Settings', href: '/dashboard/settings', roles: [Role.ADMIN] },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-semibold text-gray-900">Project Insight</h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
} 