import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson } from '@/lib/security';
import { SYSTEM_RUNTIME } from '@/lib/systemRuntime';
import { createPrivacySummary } from '@/lib/universePrivacyEngine';
import { createEpochAnchor, summarizeEpochRelativity } from '@/lib/epochDysonEngine';
import { summarizePrayerSeeds } from '@/lib/prayerSeedEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const cookieStore = cookies();
  const rawSteam = cookieStore.get('steam_session')?.value;
  const rawSeeds = cookieStore.get('prayer_seeds')?.value;
  const lobbyMode = request.nextUrl.searchParams.get('lobbyMode') || 'hub';

  let steamUser = null;
  let seeds = [];
  try {
    steamUser = rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    steamUser = null;
  }
  try {
    seeds = rawSeeds ? decryptJson(rawSeeds) : [];
    if (!Array.isArray(seeds)) seeds = [];
  } catch {
    seeds = [];
  }

  const privacy = createPrivacySummary({ steamUser, lobbyMode, roomName: SYSTEM_RUNTIME.roomName });
  const epochAnchor = createEpochAnchor({});

  return NextResponse.json({
    ok: true,
    privacy,
    epoch: summarizeEpochRelativity(epochAnchor),
    prayerSeeds: summarizePrayerSeeds(seeds, 'solar_system'),
  });
}
