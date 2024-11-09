import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, name, message, image_url, likes 
      FROM message 
      ORDER BY id DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
      const { name, message, imageUrl, iframeContent, recaptchaToken } = await request.json();
      
      const { rows } = await sql`
        INSERT INTO message (name, message, image_url, iframe_content, likes)
        VALUES (${name}, ${message}, ${imageUrl}, ${iframeContent}, 0)
        RETURNING *
      `;
      
      return NextResponse.json(rows[0]);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }