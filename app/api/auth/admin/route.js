import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        admin: {
          username: 'admin',
          role: 'ADMIN',
          loginTime: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ success: false, message: 'Username atau password admin salah!' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}