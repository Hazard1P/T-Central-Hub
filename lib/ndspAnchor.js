export function createBuildAnchor(steamUser, lobbyMode = 'private') {
  const steamId = steamUser?.steamid || 'guest';
  const persona = steamUser?.personaname || 'Guest';
  const now = new Date().toISOString();
  const scope = lobbyMode === 'hub' ? 'multi' : 'private';
  const anchorSeed = `${steamId}:${scope}:${now}`;
  return {
    steamId,
    persona,
    scope,
    anchorId: `anchor:${scope}:${steamId}`,
    anchorLabel: `${persona} ${scope === 'private' ? 'private' : 'multiplayer'} anchor`,
    anchorSeed,
    createdAt: now,
  };
}
