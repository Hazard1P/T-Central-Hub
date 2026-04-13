'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SteamLoginHud from '@/components/SteamLoginHud';
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
      {entered ? <MultiplayerHud /> : null}
      {entered ? <SystemScene /> : <SystemLauncher onEnter={() => setEntered(true)} />}
    </>
  );
}
