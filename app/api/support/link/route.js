import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson, encryptJson, signValue } from '@/lib/security';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const subscriptionId = body?.subscriptionId;
  const provider = body?.provider || 'paypal';
  const planId = body?.planId || null;

  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
  }

  const cookieStore = cookies();
  const rawSteam = cookieStore.get('steam_session')?.value;
  let steamUser = null;

  try {
    steamUser = rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    steamUser = null;
  }

  if (!steamUser?.steamid) {
    return NextResponse.json({ error: 'Steam login required before linking support' }, { status: 401 });
  }

  const payload = {
    provider,
    planId,
    subscriptionId,
    steamid: steamUser.steamid,
    personaname: steamUser.personaname || null,
    linkedAt: new Date().toISOString(),
    reference: signValue(`${provider}:${subscriptionId}:${steamUser.steamid}`),
  };

  const response = NextResponse.json({
    ok: true,
    linked: {
      provider,
      subscriptionId,
      steamid: steamUser.steamid,
      personaname: steamUser.personaname || null,
      linkedAt: payload.linkedAt,
      reference: payload.reference,
    },
  });

  response.cookies.set({
    name: 'support_receipt',
    value: encryptJson(payload),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  });

  return response;
}
