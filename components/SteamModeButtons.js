'use client';

import { getSteamAccessProfile, MULTI_PLAYER_INSTANCE, SINGLE_PLAYER_INSTANCE } from '@/lib/steamAccess';

export default function SteamModeButtons({ steamUser, lobbyMode = 'private', onChange }) {
  const profile = getSteamAccessProfile(steamUser, lobbyMode);

  return (
    <div className="steam-mode-buttons-wrap">
      <div className="steam-mode-intro">
        <span className="pilot-assist-kicker">Steam access</span>
        <strong>Private world first</strong>
        <p className="muted">
          Steam-linked access anchors into the private single-player world first. NDSP keeps each player's build profile discrete from others in both the single-player and multiplayer instances.
        </p>
      </div>

      <button
        className={`button ${profile.lobbyMode === 'private' ? 'primary' : 'secondary'} steam-mode-button`}
        onClick={() => onChange?.('private')}
        title={SINGLE_PLAYER_INSTANCE}
      >
        Steam Login {'<(single-player)>'}
      </button>

      <button
        className={`button ${profile.lobbyMode === 'hub' ? 'primary' : 'secondary'} steam-mode-button`}
        onClick={() => onChange?.('hub')}
        disabled={!profile.steamLinked}
        title={profile.steamLinked ? MULTI_PLAYER_INSTANCE : 'Sign in with Steam to unlock multiplayer'}
      >
        Exit to Multiplayer {'<(multi-player)>'}
      </button>
    </div>
  );
}
