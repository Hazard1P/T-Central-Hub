import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cookieStore = cookies();
  const raw = cookieStore.get('steam_session')?.value;
  let user = null;
  try {
    user = raw ? decryptJson(raw) : null;
  } catch {
    user = null;
  }

  return NextResponse.json({
    authenticated: Boolean(user),
    user: user || null,
  });
}
