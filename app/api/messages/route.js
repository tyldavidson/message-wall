import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM Message 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, message, imageUrl, recaptchaToken } = await request.json();

    // Verify CAPTCHA first
    const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' }, 
        { status: 400 }
      );
    }

    // If CAPTCHA is valid, proceed with message creation
    const { rows } = await sql`
      INSERT INTO Message (name, message, image_url, likes)
      VALUES (${name}, ${message}, ${imageUrl}, 0)
      RETURNING *
    `;
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}