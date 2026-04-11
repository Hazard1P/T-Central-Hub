import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function decodeSession(value) {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const raw = cookieStore.get('steam_session')?.value;
  const user = raw ? decodeSession(raw) : null;

  return NextResponse.json({
    authenticated: Boolean(user),
    user: user || null,
  });
}
