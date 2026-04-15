import { NextResponse } from 'next/server';
import { shouldUseSecureCookies } from '@/lib/runtimeConfig';

export async function GET(request) {
  const url = new URL(request.url);
  const redirectUrl = new URL('/', url.origin);
  const response = NextResponse.redirect(redirectUrl);
  const secure = shouldUseSecureCookies(request);
  response.cookies.set({
    name: 'steam_session',
    value: '',
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
