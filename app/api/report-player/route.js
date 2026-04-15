import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptJson } from '@/lib/security';
import { insertRecord, isServerPersistenceConfigured } from '@/lib/serverPersistence';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const reportedPlayer = clean(body?.reportedPlayer, 120);
  const server = clean(body?.server, 120) || 'T-Central Hub';
  const reason = clean(body?.reason, 280);
  const evidence = clean(body?.evidence, 2500);

  if (!reportedPlayer || !reason || !evidence) {
    return NextResponse.json({ error: 'Reported player, reason, and evidence are required.' }, { status: 400 });
  }

  if (!isServerPersistenceConfigured()) {
    return NextResponse.json({
      error: 'Report storage is not configured yet. Please send reports directly to the support email until moderation storage is enabled.',
    }, { status: 503 });
  }

  const raw = cookies().get('steam_session')?.value;
  let user = null;

  try {
    user = raw ? decryptJson(raw) : null;
  } catch {
    user = null;
  }

  const reference = `TC-${Date.now().toString(36).toUpperCase()}`;
  const record = {
    reference,
    reported_player: reportedPlayer,
    server,
    reason,
    evidence,
    reporter_steamid: user?.steamid || null,
    reporter_name: user?.personaname || null,
    created_at: new Date().toISOString(),
    source: 't-central-report-player',
  };

  try {
    await insertRecord('player_reports', record);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to store report.' }, { status: 503 });
  }

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
      reportedPlayer,
      server,
      reason,
      evidence,
      createdAt: record.created_at,
    },
  });
}
