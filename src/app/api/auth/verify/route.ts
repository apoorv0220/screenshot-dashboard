import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isTokenExpired } from '@/lib/token';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: 'Invalid verification token' },
        { status: 400 }
      );
    }

    if (isTokenExpired(verificationToken.expiresAt)) {
      return NextResponse.json(
        { message: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user and delete the verification token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.user.id },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    return NextResponse.redirect(
      new URL('/auth/login?verified=true', req.url)
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 