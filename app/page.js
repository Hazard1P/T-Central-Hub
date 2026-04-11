import MultiplayerHud from '@/components/MultiplayerHud';
import SteamLoginHud from '@/components/SteamLoginHud';
import SystemScene from '@/components/SystemScene';

export default function HomePage() {
  return (
    <>
      <SteamLoginHud />
      <MultiplayerHud />
      <SystemScene />
    </>
  );
}
