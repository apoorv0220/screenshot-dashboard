import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@/types/auth";

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard/users": [Role.ADMIN],
  "/dashboard/settings": [Role.ADMIN],
  "/dashboard/reports": [Role.ADMIN, Role.MANAGER],
  "/dashboard/screenshots": [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE],
  "/dashboard": [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const userRole = token?.role as Role;

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    // Check if user is authenticated
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Check role-based access
    const path = req.nextUrl.pathname;
    const requiredRoles = protectedRoutes[path as keyof typeof protectedRoutes];

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}; 