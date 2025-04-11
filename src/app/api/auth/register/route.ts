import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/auth';
import { getServerSession } from 'next-auth';
import { sendVerificationEmail } from '@/lib/email';
import { generateToken } from '@/lib/token';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Role validation
    const session = await getServerSession();
    const isAdmin = session?.user?.role === Role.ADMIN;

    // Only admins can create manager accounts
    if (role === Role.MANAGER && !isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized to create manager accounts' },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate verification token
    const verificationToken = generateToken();

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.EMPLOYEE,
        emailVerified: null,
        verificationToken: {
          create: {
            token: verificationToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        },
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 