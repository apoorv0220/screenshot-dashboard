import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_SESSIONS_PER_USER = 5;

export async function updateSessionActivity(sessionToken: string) {
  try {
    await prisma.session.update({
      where: { sessionToken },
      data: { lastActive: new Date() },
    });
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
}

export async function getActiveSessions(userId: string) {
  return prisma.session.findMany({
    where: {
      userId,
      isActive: true,
      expires: { gt: new Date() },
    },
    orderBy: { lastActive: 'desc' },
  });
}

export async function revokeSession(sessionToken: string) {
  return prisma.session.update({
    where: { sessionToken },
    data: { isActive: false },
  });
}

export async function revokeAllSessions(userId: string) {
  return prisma.session.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });
}

export async function createSession(
  userId: string,
  sessionToken: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Check if user has reached session limit
  const activeSessions = await getActiveSessions(userId);
  if (activeSessions.length >= MAX_SESSIONS_PER_USER) {
    // Revoke oldest session
    const oldestSession = activeSessions[activeSessions.length - 1];
    await revokeSession(oldestSession.sessionToken);
  }

  return prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires: new Date(Date.now() + SESSION_TIMEOUT),
      ipAddress,
      userAgent,
    },
  });
}

export async function checkSessionTimeout() {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const dbSession = await prisma.session.findUnique({
    where: { sessionToken: session.sessionToken },
  });

  if (!dbSession || !dbSession.isActive) return false;

  const timeSinceLastActive = Date.now() - dbSession.lastActive.getTime();
  if (timeSinceLastActive > SESSION_TIMEOUT) {
    await revokeSession(dbSession.sessionToken);
    return false;
  }

  return true;
} 