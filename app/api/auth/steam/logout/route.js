import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const redirectUrl = new URL('/', url.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: 'steam_session',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
