import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function GET() {
  try {
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testToken = 'test-token-' + Date.now();

    console.log('Testing email configuration...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('Sending test email to:', testEmail);

    await sendVerificationEmail(testEmail, testToken);

    return NextResponse.json({
      success: true,
      message: process.env.NODE_ENV === 'development' 
        ? 'Test email logged to console (development mode)'
        : 'Test email sent successfully',
      recipient: testEmail,
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 