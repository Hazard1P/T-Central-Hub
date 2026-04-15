import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson } from '@/lib/security';
import { createPrivacySummary } from '@/lib/universePrivacyEngine';
import { createEpochAnchor, summarizeEpochRelativity } from '@/lib/epochDysonEngine';
import { buildUniverseGraph } from '@/lib/universeEngine';
import { parsePrayerSeedVault, PRAYER_SEED_COOKIE } from '@/lib/universeApiStore';

export async function GET(request) {
  const universeEnabled = process.env.UNIVERSE_API_ENABLED !== 'false';
  const cookieStore = cookies();

  const url = new URL(request.url);
  const lobbyMode = url.searchParams.get('lobbyMode') === 'private' ? 'private' : 'hub';

  const rawSteam = cookieStore.get('steam_session')?.value;
  let steamUser = null;

  try {
    steamUser = rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    steamUser = null;
  }

  if (!universeEnabled) {
    return NextResponse.json({
      ok: false,
      unavailable: true,
      code: 'UNIVERSE_API_DISABLED',
      message: 'Universe session API is disabled by configuration.',
      privacy: createPrivacySummary({ steamUser, lobbyMode }),
      prayerSeeds: { total: 0, latest: [] },
    }, { status: 503 });
  }

  const privacy = createPrivacySummary({ steamUser, lobbyMode });
  const epoch = summarizeEpochRelativity(createEpochAnchor({ now: Date.now(), solarSystemKey: 'solar_system', dysonKey: 'ss' }));
  const graph = buildUniverseGraph();

  const vault = parsePrayerSeedVault(cookieStore.get(PRAYER_SEED_COOKIE)?.value);
  const scopedSeeds = vault.filter((entry) => entry.scope === privacy.storageKey);

  return NextResponse.json({
    ok: true,
    mode: 'active',
    lobbyMode,
    privacy,
    epoch,
    graph: {
      stats: graph.stats,
      heroNodes: graph.heroNodes.slice(0, 12).map((node) => ({
        key: node.key,
        label: node.label,
        kind: node.kind,
        route: node.route || null,
      })),
    },
    prayerSeeds: {
      total: scopedSeeds.length,
      latest: scopedSeeds.slice(-5).reverse(),
    },
  });
}
