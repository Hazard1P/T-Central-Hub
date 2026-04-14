'use client';

import { useEffect, useState } from 'react';
import SteamLoginHud from '@/components/SteamLoginHud';
import SystemStatusStrip from '@/components/SystemStatusStrip';
import SystemLauncher from '@/components/SystemLauncher';
import LobbyModePanel from '@/components/LobbyModePanel';
import SystemErrorBoundary from '@/components/SystemErrorBoundary';
import StableSystemWorld from '@/components/StableSystemWorld';
import SystemNewsInfoPanel from '@/components/SystemNewsInfoPanel';

export default function SystemEntryClient() {
  const [entered, setEntered] = useState(false);
  const [lobbyMode, setLobbyMode] = useState('hub');
  const [steamUser, setSteamUser] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

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
      {entered ? <SystemNewsInfoPanel lobbyMode={lobbyMode} selected={selectedNode} /> : null}
      {entered ? (
        <SystemErrorBoundary>
          <>
            <LobbyModePanel lobbyMode={lobbyMode} onChange={setLobbyMode} steamUser={steamUser} />
            <StableSystemWorld lobbyMode={lobbyMode} steamUser={steamUser} onSelectionChange={setSelectedNode} />
          </>
        </SystemErrorBoundary>
      ) : <SystemLauncher onEnter={() => setEntered(true)} />}
    </>
  );
}
