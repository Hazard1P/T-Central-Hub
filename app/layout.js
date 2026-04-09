import './globals.css';

export const metadata = {
  metadataBase: new URL('https://t-central.me'),
  title: {
    default: 'T-Central Hub',
    template: '%s | T-Central Hub'
  },
  description:
    'Interactive 3D hub for T-Central Arma3 CTH and Rust servers with community links, support options, and future-ready deployment on Vercel.',
  openGraph: {
    title: 'T-Central Hub',
    description:
      'Interactive 3D hub for Arma3 CTH and Rust servers.',
    images: ['/cosmic-map.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T-Central Hub',
    description:
      'Interactive 3D hub for Arma3 CTH and Rust servers.',
    images: ['/cosmic-map.jpg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
