import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'Project Insight <noreply@projectinsight.com>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Project Insight</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${confirmLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'Project Insight <noreply@projectinsight.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
} 