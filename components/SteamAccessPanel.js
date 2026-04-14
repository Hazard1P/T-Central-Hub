'use client';

import { getSteamAccessProfile, MULTI_PLAYER_INSTANCE, SINGLE_PLAYER_INSTANCE } from '@/lib/steamAccess';

export default function SteamAccessPanel({ steamUser, lobbyMode = 'private', onChange }) {
  const profile = getSteamAccessProfile(steamUser, lobbyMode);

  return (
    <div className="steam-access-panel">
      <div className="live-room-head">
        <span className="pilot-assist-kicker">Steam_Access</span>
        <strong>{profile.personaName}</strong>
      </div>

      <div className="steam-access-grid">
        <div className="steam-access-item">
          <span>Steam name</span>
          <strong>{profile.personaName}</strong>
        </div>
        <div className="steam-access-item">
          <span>Account ID</span>
          <strong>{profile.steamId || 'Guest'}</strong>
        </div>
        <div className="steam-access-item">
          <span>Lobby mode</span>
          <strong>{profile.lobbyMode === 'hub' ? 'Multiplayer Hub' : 'Private World'}</strong>
        </div>
        <div className="steam-access-item">
          <span>Instance</span>
          <strong>{profile.instanceType}</strong>
        </div>
      </div>

      <div className="lobby-mode-actions">
        <button
          className={`button ${profile.lobbyMode === 'hub' ? 'primary' : 'secondary'}`}
          onClick={() => onChange?.('hub')}
          disabled={!profile.steamLinked}
        >
          {MULTI_PLAYER_INSTANCE}
        </button>
        <button
          className={`button ${profile.lobbyMode === 'private' ? 'primary' : 'secondary'}`}
          onClick={() => onChange?.('private')}
        >
          {SINGLE_PLAYER_INSTANCE}
        </button>
      </div>

      <p className="lobby-mode-note">
        {profile.steamLinked
          ? 'Lobby mode is linked to the signed-in Steam account context and controls whether the account enters the shared hub or a private world.'
          : 'Sign in with Steam to unlock the shared multiplayer instance. Private world remains available as the guest-safe fallback.'}
      </p>
    </div>
  );
}
