import './globals.css';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'T-Central Hub | Arma3 CTH and Rust Vanilla',
    template: '%s | T-Central Hub'
  },
  description:
    'Premium game server hub for Arma3 Capture the Hill and Rust Vanilla with cinematic visuals, donation support, subscriptions, server info, and Vercel-ready deployment.',
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
    description: 'Premium hub for Arma3 CTH and Rust Vanilla.',
    images: ['/cosmic-map.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T-Central Hub',
    description: 'Premium hub for Arma3 CTH and Rust Vanilla.',
    images: ['/cosmic-map.jpg']
  }
};

const nav = [
  ['/', 'Home'],
  ['/servers/arma3-cth', 'Arma3 CTH'],
  ['/servers/rust-vanilla', 'Rust Vanilla'],
  ['/information', 'Information'],
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
                {nav.map(([href, label]) => (
                  <Link key={href} href={href} className="nav-link">{label}</Link>
                ))}
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
                  <li>Discord community hub</li>
                </ul>
              </div>
              <div className="footer-card">
                <h4>Built in</h4>
                <ul>
                  <li>Interactive cosmic map homepage</li>
                  <li>Donate and subscription support</li>
                  <li>SEO files and Vercel-ready structure</li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
