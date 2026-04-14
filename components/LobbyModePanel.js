'use client';

export default function LobbyModePanel({ lobbyMode, onChange, steamUser, universe = null }) {
  const privateReady = Boolean(steamUser?.steamid);

  return (
    <div className="lobby-mode-panel">
      <div className="live-room-head">
        <span className="pilot-assist-kicker">Lobby mode</span>
        <strong>{lobbyMode === 'hub' ? 'Multiplayer Hub' : 'Private World'}</strong>
      </div>

      <p className="lobby-mode-copy">
        {lobbyMode === 'hub'
          ? 'The multiplayer hub brings Steam-linked pilots into one shared room and keeps route portals active.'
          : 'The private world stays scoped to the linked Steam account while keeping route portals and server connections available.'}
      </p>

      <div className="lobby-mode-actions">
        <button
          className={`button ${lobbyMode === 'hub' ? 'primary' : 'secondary'}`}
          onClick={() => onChange?.('hub')}
        >
          Multiplayer hub
        </button>
        <button
          className={`button ${lobbyMode === 'private' ? 'primary' : 'secondary'}`}
          onClick={() => onChange?.('private')}
          disabled={!privateReady}
        >
          Private world
        </button>
      </div>

      <div className="lobby-mode-note">
        {steamUser?.steamid
          ? <span>Steam linked: private world can bind to this account.</span>
          : <span>Sign in with Steam to unlock the private world.</span>}
        {universe?.privacy?.observanceScope ? <span>Observance scope: {universe.privacy.observanceScope}</span> : null}
      </div>
    </div>
  );
}
