import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@/types/auth";

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard/users": ['ADMIN'],
  "/dashboard/settings": ['ADMIN'],
  "/dashboard/reports": ['ADMIN'],
  "/dashboard/screenshots": ['ADMIN', 'EMPLOYEE'],
  "/dashboard": ['ADMIN', 'EMPLOYEE'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const userRole = token?.role as Role;

    // Handle root path
    if (req.nextUrl.pathname === "/") {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!isAuth) {
      // Only add callbackUrl for protected routes, not for root path
      if (req.nextUrl.pathname !== "/") {
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check role-based access
    const path = req.nextUrl.pathname;
    const requiredRoles = protectedRoutes[path as keyof typeof protectedRoutes];

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
}; 