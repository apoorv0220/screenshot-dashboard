import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/types/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊', roles: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { name: 'Users', href: '/dashboard/users', icon: '👥', roles: [Role.ADMIN] },
  { name: 'Screenshots', href: '/dashboard/screenshots', icon: '📸', roles: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { name: 'Reports', href: '/dashboard/reports', icon: '📄', roles: [Role.ADMIN, Role.MANAGER] },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', roles: [Role.ADMIN] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role;

  const filteredNavigation = navigation.filter(
    (item) => item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800">
      <div className="flex h-16 items-center justify-center">
        <h1 className="text-xl font-bold text-white">Project Insight</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 