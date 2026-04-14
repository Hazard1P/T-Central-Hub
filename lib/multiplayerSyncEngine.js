export function createPresenceSnapshot({ steamUser = null, telemetry = null, scope = null, lobbyMode = 'hub' } = {}) {
  return {
    id: steamUser?.steamid || 'guest',
    displayName: steamUser?.personaname || 'Guest Pilot',
    lobbyMode,
    observanceScope: scope?.observanceScope || 'hub:public',
    authenticated: Boolean(steamUser?.steamid),
    speed: Number(telemetry?.speed || 0),
    nearest: telemetry?.nearest || null,
    quantumSignature: telemetry?.quantum?.signature || 'Q12D-0-0',
    position: Array.isArray(telemetry?.position) ? telemetry.position.slice(0, 3).map((value) => Number(value || 0)) : [0, 0, 0],
    updatedAt: new Date().toISOString(),
  };
}

export function reducePresenceSnapshots(snapshots = [], maxCount = 24) {
  const deduped = new Map();
  snapshots.forEach((snapshot) => {
    if (!snapshot?.id) return;
    deduped.set(snapshot.id, snapshot);
  });
  return [...deduped.values()]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, maxCount);
}

export function broadcastLocalPresence(snapshot) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('tcentral_presence_sync', JSON.stringify(snapshot));
  } catch {}
  window.dispatchEvent(new CustomEvent('tcentral-presence-updated', { detail: snapshot }));
}
