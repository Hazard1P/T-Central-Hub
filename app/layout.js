import './globals.css';

export const metadata = {
  metadataBase: new URL('https://t-central.me'),
  title: 'T-Central Hub',
  description: 'Interactive game server and web-game hub for T-Central.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'T-Central Hub',
    description: 'Interactive game server and web-game hub for T-Central.',
    url: 'https://t-central.me',
    siteName: 'T-Central Hub',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
