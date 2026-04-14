
'use client';

import { getSteamAccessProfile, MULTI_PLAYER_INSTANCE, SINGLE_PLAYER_INSTANCE } from '@/lib/steamAccess';

export default function SteamModeButtons({ steamUser, lobbyMode = 'private', onChange }) {
  const profile = getSteamAccessProfile(steamUser, lobbyMode);

  return (
    <div className="steam-mode-buttons-wrap">
      <button
        className={`button ${profile.lobbyMode === 'hub' ? 'primary' : 'secondary'} steam-mode-button`}
        onClick={() => onChange?.('hub')}
        disabled={!profile.steamLinked}
        title={profile.steamLinked ? MULTI_PLAYER_INSTANCE : 'Sign in with Steam to unlock multiplayer'}
      >
        Steam Login <(multi-player)>
      </button>

      <button
        className={`button ${profile.lobbyMode === 'private' ? 'primary' : 'secondary'} steam-mode-button`}
        onClick={() => onChange?.('private')}
        title={SINGLE_PLAYER_INSTANCE}
      >
        Steam Login <(single-player)>
      </button>
    </div>
  );
}
