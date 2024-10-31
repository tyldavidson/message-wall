import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { rows } = await sql`
      UPDATE Message 
      SET likes = likes + 1 
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}