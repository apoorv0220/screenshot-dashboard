import { randomBytes } from 'crypto';

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
} 