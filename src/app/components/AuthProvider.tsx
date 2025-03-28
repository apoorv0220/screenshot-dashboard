"use client";

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider refetchInterval={600 * 1000} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}