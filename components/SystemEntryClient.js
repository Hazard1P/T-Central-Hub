'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SteamLoginHud from '@/components/SteamLoginHud';
import SystemStatusStrip from '@/components/SystemStatusStrip';
import MultiplayerHud from '@/components/MultiplayerHud';
import SystemLauncher from '@/components/SystemLauncher';
import LobbyModePanel from '@/components/LobbyModePanel';
import { ROUTE_CHIPS } from '@/lib/worldLayout';

const SystemScene = dynamic(() => import('@/components/SystemScene'), {
  ssr: false,
  loading: () => <div className="system-loading">Initializing navigation system…</div>,
});

export default function SystemEntryClient() {
  const [entered, setEntered] = useState(false);
  const [lobbyMode, setLobbyMode] = useState('hub');
  const [steamUser, setSteamUser] = useState(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/steam/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setSteamUser(data?.authenticated ? data.user : null);
      })
      .catch(() => {
        if (!active) return;
        setSteamUser(null);
      });
    return () => { active = false; };
  }, []);


  return (
    <>
      <SteamLoginHud />
      <SystemStatusStrip />
      {entered ? <MultiplayerHud lobbyMode={lobbyMode} steamUser={steamUser} /> : null}
      {entered ? (
        <>
          <LobbyModePanel lobbyMode={lobbyMode} onChange={setLobbyMode} steamUser={steamUser} />
          <SystemScene lobbyMode={lobbyMode} steamUser={steamUser} />
        </>
      ) : <SystemLauncher onEnter={() => setEntered(true)} />}
    </>
  );
}
