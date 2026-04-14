import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson, encryptJson } from '@/lib/security';
import { createEpochAnchor } from '@/lib/epochDysonEngine';
import { createUniverseScope } from '@/lib/universePrivacyEngine';
import { normalizePrayerSeed, summarizePrayerSeeds, sortPrayerSeeds } from '@/lib/prayerSeedEngine';
import { shouldUseSecureCookies } from '@/lib/runtimeConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function readSeedList(cookieStore) {
  const raw = cookieStore.get('prayer_seeds')?.value;
  try {
    const decoded = raw ? decryptJson(raw) : [];
    return Array.isArray(decoded) ? decoded : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const cookieStore = cookies();
  const seeds = readSeedList(cookieStore);
  return NextResponse.json({ ok: true, seeds: sortPrayerSeeds(seeds), summary: summarizePrayerSeeds(seeds, 'solar_system') });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const text = body?.body;
  if (!text || !String(text).trim()) {
    return NextResponse.json({ error: 'Missing prayer seed body' }, { status: 400 });
  }

  const cookieStore = cookies();
  const rawSteam = cookieStore.get('steam_session')?.value;
  let steamUser = null;
  try {
    steamUser = rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    steamUser = null;
  }

  const scope = createUniverseScope({ steamId: steamUser?.steamid || null, lobbyMode: 'private' });
  const epochAnchor = createEpochAnchor({});
  const seed = normalizePrayerSeed({ body: String(text), tags: body?.tags }, { scope, solarSystemKey: body?.solarSystemKey || 'solar_system', epochAnchor });

  if (!seed) {
    return NextResponse.json({ error: 'Unable to normalize prayer seed' }, { status: 400 });
  }

  const existing = readSeedList(cookieStore).filter((item) => item?.id !== seed.id);
  const nextSeeds = [seed, ...existing].slice(0, 144);

  const response = NextResponse.json({ ok: true, seed, summary: summarizePrayerSeeds(nextSeeds, seed.solarSystemKey) });
  response.cookies.set({
    name: 'prayer_seeds',
    value: encryptJson(nextSeeds),
    httpOnly: true,
    secure: shouldUseSecureCookies(request),
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
