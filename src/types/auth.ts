import { Role as PrismaRole } from "@prisma/client";

export type Role = PrismaRole;

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
} 