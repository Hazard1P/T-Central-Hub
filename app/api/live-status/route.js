const DEFAULT_STATUSES = {
  arma3: {
    key: 'arma3',
    name: 'Arma3 CTH',
    online: null,
    players: null,
    maxPlayers: null,
    map: null,
    source: 'No status source configured'
  },
  rust_biweekly: {
    key: 'rust_biweekly',
    name: 'Rust Bi-Weekly',
    online: null,
    players: 0,
    maxPlayers: 250,
    map: 'Procedural Map',
    source: 'No status source configured'
  },
  rust_weekly: {
    key: 'rust_weekly',
    name: 'Rust Weekly',
    online: null,
    players: 0,
    maxPlayers: 250,
    map: 'Procedural Map',
    source: 'No status source configured'
  },
  rust_monthly: {
    key: 'rust_monthly',
    name: 'Rust Monthly',
    online: null,
    players: 0,
    maxPlayers: 250,
    map: 'Procedural Map',
    source: 'No status source configured'
  }
};

export async function GET() {
  const url = process.env.STATUS_SOURCE_URL;

  if (!url) {
    return Response.json({
      ok: true,
      mode: 'unconfigured',
      statuses: DEFAULT_STATUSES
    });
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return Response.json({
        ok: false,
        mode: 'error',
        error: `Status source returned ${res.status}`,
        statuses: DEFAULT_STATUSES
      });
    }

    const data = await res.json();
    return Response.json({
      ok: true,
      mode: 'remote',
      statuses: {
        ...DEFAULT_STATUSES,
        ...(data.statuses || {})
      }
    });
  } catch (error) {
    return Response.json({
      ok: false,
      mode: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      statuses: DEFAULT_STATUSES
    });
  }
}
