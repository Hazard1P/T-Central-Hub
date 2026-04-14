import './globals.css';
import { SteamSessionProvider } from '@/components/SteamSessionProvider';
import { getSiteUrl } from '@/lib/runtimeConfig';

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'T-Central Hub',
  description: 'Interactive game server and web-game hub for T-Central.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'T-Central Hub',
    description: 'Interactive game server and web-game hub for T-Central.',
    url: siteUrl,
    siteName: 'T-Central Hub',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SteamSessionProvider>{children}</SteamSessionProvider>
      </body>
    </html>
  );
}
