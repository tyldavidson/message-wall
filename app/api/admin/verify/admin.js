import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('Received password:', password);
    console.log('Admin password:', adminPassword);

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}