import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'T-Central Hub',
  description: 'T-Central Hub for Arma 3 CTH and Rust Vanilla communities.',
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/server-info', label: 'Server Info' },
  { href: '/information', label: 'Information' },
  { href: '/donate', label: 'Donate' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="container header-inner">
              <div>
                <p className="eyebrow">T-Central Hub</p>
                <Link href="/" className="brand">Arma3 CTH + Rust Vanilla</Link>
              </div>
              <nav className="nav">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <div className="container footer-grid">
              <div>
                <p className="eyebrow">T-Central</p>
                <h3>Built for long-term community growth.</h3>
                <p className="muted">
                  Multi-page Vercel-ready website starter for public game servers with room for future stats,
                  announcements, support workflows, and donation expansion.
                </p>
              </div>
              <div>
                <h4>Current focus</h4>
                <ul>
                  <li>Arma 3 Capture the Hill</li>
                  <li>Rust Vanilla</li>
                  <li>Public server onboarding</li>
                </ul>
              </div>
              <div>
                <h4>Suggested next upgrades</h4>
                <ul>
                  <li>Live player counts</li>
                  <li>Discord widget embed</li>
                  <li>Automated status cards</li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
