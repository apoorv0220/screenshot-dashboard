import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ message: 'Email is required' }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'No user found with this email' }),
        { status: 404 }
      );
    }

    // Generate a reset token
    const resetToken = await hash(email + Date.now(), 10);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save the reset token to the database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email with reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: 'Password reset email sent' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong' }),
      { status: 500 }
    );
  }
} 