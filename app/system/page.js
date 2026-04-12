import dynamic from 'next/dynamic';
import SteamLoginHud from '@/components/SteamLoginHud';
import MultiplayerHud from '@/components/MultiplayerHud';

const SystemScene = dynamic(() => import('@/components/SystemScene'), {
  ssr: false,
  loading: () => <div className="system-loading">Initializing navigation system…</div>,
});

export const metadata = { title: 'System' };

export default function SystemPage() {
  return (
    <>
      <SteamLoginHud />
      <MultiplayerHud />
      <SystemScene />
    </>
  );
}
