import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptJson } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.reportedPlayer || !body?.reason || !body?.evidence) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const cookieStore = cookies();
  const raw = cookieStore.get('steam_session')?.value;
  let user = null;

  try {
    user = raw ? decryptJson(raw) : null;
  } catch {
    user = null;
  }

  const reference = `TC-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    ok: true,
    reference,
    report: {
      reporter: user
        ? {
            steamid: user.steamid,
            personaname: user.personaname || null,
          }
        : null,
      reportedPlayer: body.reportedPlayer,
      server: body.server || 'T-Central Hub',
      reason: body.reason,
      evidence: body.evidence,
      createdAt: new Date().toISOString(),
    },
  });
}
