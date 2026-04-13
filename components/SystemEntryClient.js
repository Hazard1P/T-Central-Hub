'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SteamLoginHud from '@/components/SteamLoginHud';
import SystemStatusStrip from '@/components/SystemStatusStrip';
import MultiplayerHud from '@/components/MultiplayerHud';
import SystemLauncher from '@/components/SystemLauncher';

const SystemScene = dynamic(() => import('@/components/SystemScene'), {
  ssr: false,
  loading: () => <div className="system-loading">Initializing navigation system…</div>,
});

export default function SystemEntryClient() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <SteamLoginHud />
      <SystemStatusStrip />
      {entered ? <MultiplayerHud /> : null}
      {entered ? (
        <div className="system-route-chipbar">
          <span className="system-route-chip">Arma3 CTH</span>
          <span className="system-route-chip matrix">MatrixCoinExchange</span>
          <span className="system-route-chip">Rust</span>
        </div>
      ) : null}
      {entered ? <SystemScene /> : <SystemLauncher onEnter={() => setEntered(true)} />}
    </>
  );
}
