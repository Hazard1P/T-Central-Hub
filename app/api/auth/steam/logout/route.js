import { NextResponse } from 'next/server';
import { shouldUseSecureCookies } from '@/lib/runtimeConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const url = new URL(request.url);
  const redirectUrl = new URL('/', url.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: 'steam_session',
    value: '',
    httpOnly: true,
    secure: shouldUseSecureCookies(request),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
