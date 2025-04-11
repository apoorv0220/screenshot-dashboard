import { Role } from '@/types/auth';

export const hasRequiredRole = (userRole: Role, requiredRoles: Role[]) => {
  return requiredRoles.includes(userRole);
};

export const getAccessibleRoutes = (userRole: Role) => {
  const routes = {
    dashboard: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE],
    users: [Role.ADMIN],
    screenshots: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE],
    reports: [Role.ADMIN, Role.MANAGER],
    settings: [Role.ADMIN],
  };

  return Object.entries(routes).reduce((acc, [key, roles]) => {
    if (roles.includes(userRole)) {
      acc.push(key);
    }
    return acc;
  }, [] as string[]);
}; 