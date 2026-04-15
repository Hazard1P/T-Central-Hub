'use client';

import { getSteamAccessProfile, MULTI_PLAYER_INSTANCE, SINGLE_PLAYER_INSTANCE } from '@/lib/steamAccess';

export default function SteamModeButtons({ steamUser, lobbyMode = 'private', onChange }) {
  const profile = getSteamAccessProfile(steamUser, lobbyMode);

  return (
    <div className="steam-mode-buttons-wrap steam-mode-bubble-card">
      <div className="steam-mode-intro">
        <span className="pilot-assist-kicker">Steam routing</span>
        <strong>Single-player and multiplayer observance</strong>
        <p className="muted">
          Steam identity anchors private storage first, then opens the shared multiplayer room without crossing private universe boundaries.
        </p>
      </div>

      <div className="steam-mode-bubble-row" role="tablist" aria-label="Steam lobby selection">
        <button
          className={`steam-mode-bubble ${profile.lobbyMode === 'private' ? 'active' : ''}`}
          onClick={() => onChange?.('private')}
          title={SINGLE_PLAYER_INSTANCE}
          type="button"
        >
          <span className="steam-mode-bubble-state" />
          <span>
            <strong>Single-player</strong>
            <small>Private world and pilot-bound storage</small>
          </span>
        </button>

        <button
          className={`steam-mode-bubble ${profile.lobbyMode === 'hub' ? 'active' : ''}`}
          onClick={() => onChange?.('hub')}
          disabled={!profile.steamLinked}
          title={profile.steamLinked ? MULTI_PLAYER_INSTANCE : 'Sign in with Steam to unlock multiplayer'}
          type="button"
        >
          <span className="steam-mode-bubble-state" />
          <span>
            <strong>Multiplayer</strong>
            <small>{profile.steamLinked ? 'Shared room, shared observance' : 'Steam login required'}</small>
          </span>
        </button>
      </div>
    </div>
  );
}
