import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify SMTP connection configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify your email address - Project Insight',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1f2937; margin-bottom: 10px;">Welcome to Project Insight!</h1>
          <p style="color: #4b5563; font-size: 16px;">Thank you for registering. Please verify your email address to get started.</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <p style="color: #4b5563; margin-bottom: 20px;">Click the button below to verify your email address:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 16px 0;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${verificationUrl}" style="color: #4F46E5; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this email, please ignore it.</p>
        </div>
      </div>
    `,
    text: `
      Welcome to Project Insight!
      
      Please verify your email address by clicking the link below:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't request this email, please ignore it.
    `,
  };

  if (process.env.NODE_ENV === 'development') {
    // In development, log the verification URL
    console.log('Verification URL:', verificationUrl);
    console.log('Email content:', mailOptions);
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
} 