import './globals.css';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL('https://t-central.me'),
  title: {
    default: 'T-Central Hub | Arma3 CTH and Rust Vanilla',
    template: '%s | T-Central Hub'
  },
  description:
    'Join T-Central Hub for Arma3 Capture the Hill and Rust Vanilla. Explore server info, connect with the community, support the hub, and jump into the battlefield or the wipe with confidence.',
  keywords: [
    'T-Central Hub',
    'Arma3 CTH',
    'Arma 3 Capture the Hill',
    'Rust Vanilla server',
    'game server website',
    'tcentral.game.nfoservers.com',
    'tcentralrust.game.nfoservers.com'
  ],
  openGraph: {
    title: 'T-Central Hub',
    description: 'Explore T-Central Hub, meet the community, get the server details you need, and jump into Arma3 CTH or Rust Vanilla.',
    images: ['/cosmic-map.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T-Central Hub',
    description: 'Explore T-Central Hub, meet the community, get the server details you need, and jump into Arma3 CTH or Rust Vanilla.',
    images: ['/cosmic-map.jpg']
  }
};

const nav = [
  ['/', 'Home'],
  ['/servers/arma3-cth', 'Arma3 CTH'],
  ['/servers/rust-vanilla', 'Rust Vanilla'],
  ['/information', 'Information'],
  ['/report-player', 'Report Player'],
  ['https://synapticsystems.ca', 'S.S'],
  ['/donate', 'Donate']
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="container header-inner">
              <div className="brand-wrap">
                <p className="eyebrow">T-Central Hub</p>
                <Link href="/" className="brand">Arma3 CTH + Rust Vanilla</Link>
              </div>
              <nav className="nav">
                {nav.map(([href, label]) =>
                  href.startsWith('http') ? (
                    <a key={href} href={href} className="nav-link" target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  ) : (
                    <Link key={href} href={href} className="nav-link">
                      {label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            <div className="container footer-grid">
              <div className="footer-card">
                <p className="eyebrow">T-Central</p>
                <h3>Built to scale like a real server ecosystem.</h3>
                <p className="muted">
                  This version is upgraded around a stronger visual identity, cleaner game separation,
                  better support flow, and future-ready sections for live stats and announcements.
                </p>
              </div>
              <div className="footer-card">
                <h4>Current servers</h4>
                <ul>
                  <li>Arma3 Capture the Hill</li>
                  <li>Rust Vanilla Bi-Weekly Wipe</li>
                  <li>Rust Vanilla Monthly Wipe</li>
                  <li>Rust Vanilla Weekly Wipe</li>
                  <li>Discord community hub</li>
                </ul>
              </div>
              <div className="footer-card">
                <h4>Built in</h4>
                <ul>
                  <li>Interactive cosmic map homepage</li>
                  <li>Player reporting section</li>
                  <li>Donate and subscription support</li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
