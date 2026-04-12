import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson } from '@/lib/security';

export async function GET() {
  const cookieStore = cookies();
  const raw = cookieStore.get('support_receipt')?.value;

  let support = null;
  try {
    support = raw ? decryptJson(raw) : null;
  } catch {
    support = null;
  }

  return NextResponse.json({
    linked: Boolean(support),
    support: support
      ? {
          provider: support.provider,
          planId: support.planId || null,
          subscriptionId: support.subscriptionId,
          steamid: support.steamid,
          personaname: support.personaname || null,
          linkedAt: support.linkedAt,
          reference: support.reference,
        }
      : null,
  });
}
