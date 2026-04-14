import { NextResponse } from 'next/server';

function getBaseUrl(request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, '');

  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const inferredProto = host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const proto = request.headers.get('x-forwarded-proto') || inferredProto;
  return `${proto}://${host}`;
}

export async function GET(request) {
  const baseUrl = getBaseUrl(request);
  const returnTo = `${baseUrl}/api/auth/steam/callback`;

  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': baseUrl,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  return NextResponse.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`);
}
