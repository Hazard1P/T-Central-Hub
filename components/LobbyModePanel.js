'use client';

const MODE_COPY = {
  hub: {
    kicker: 'Shared observance',
    title: 'Multiplayer hub',
    body: 'Step into the shared room where route portals, pilot presence, and live server observance stay synchronized across the active universe shell.',
    badge: 'Shared room active',
  },
  private: {
    kicker: 'Scoped observance',
    title: 'Single-player world',
    body: 'Keep the simulation anchored to one Steam-linked pilot, with private world storage, route access, and quiet system traversal.',
    badge: 'Private scope active',
  },
};

function ModePill({ active, label, copy, disabled, onClick, sublabel }) {
  return (
    <button
      type="button"
      className={`mode-bubble-option ${active ? 'active' : ''}`}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="mode-bubble-dot" />
      <span className="mode-bubble-text">
        <strong>{label}</strong>
        <small>{copy}</small>
      </span>
      <span className="mode-bubble-sublabel">{sublabel}</span>
    </button>
  );
}

export default function LobbyModePanel({ lobbyMode, onChange, steamUser, universe = null }) {
  const privateReady = Boolean(steamUser?.steamid);
  const active = MODE_COPY[lobbyMode === 'hub' ? 'hub' : 'private'];
  const observance = universe?.privacy?.observanceScope || (lobbyMode === 'hub' ? 'shared_hub' : 'private_world');

  return (
    <div className="lobby-mode-panel mode-bubble-shell">
      <div className="mode-bubble-head">
        <div>
          <span className="pilot-assist-kicker">Universe mode</span>
          <strong>{active.title}</strong>
        </div>
        <span className="mode-bubble-badge">{active.badge}</span>
      </div>

      <p className="lobby-mode-copy mode-bubble-copy">{active.body}</p>

      <div className="mode-bubble-track" role="tablist" aria-label="Universe mode switch">
        <ModePill
          active={lobbyMode === 'private'}
          label="Single-player"
          copy="Steam-linked private traversal"
          sublabel={privateReady ? 'Ready' : 'Guest'}
          onClick={() => onChange?.('private')}
        />
        <ModePill
          active={lobbyMode === 'hub'}
          label="Multiplayer"
          copy="Shared room and synchronized pilots"
          sublabel={privateReady ? 'Linked' : 'Steam required'}
          disabled={!privateReady}
          onClick={() => onChange?.('hub')}
        />
      </div>

      <div className="lobby-mode-note mode-bubble-note">
        <span>{privateReady ? `Steam linked to ${steamUser.personaname || 'pilot'} for private storage and shared-room access.` : 'Sign in with Steam to unlock multiplayer and bind private-world storage.'}</span>
        <span>Observance scope: {observance}</span>
      </div>
    </div>
  );
}
