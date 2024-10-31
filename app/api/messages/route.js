import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // First, ensure the table exists
    await sql`
      CREATE TABLE IF NOT EXISTS Message (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        image_url TEXT,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const result = await sql`
      SELECT * FROM Message 
      ORDER BY created_at DESC
    `;
    
    // Always return an array, even if empty
    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, message, imageUrl } = await request.json();
    
    const result = await sql`
      INSERT INTO Message (name, message, image_url, likes)
      VALUES (${name}, ${message}, ${imageUrl}, 0)
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}