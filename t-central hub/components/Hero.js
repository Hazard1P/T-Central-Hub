import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">T-Central Hub</p>
          <h1 className="hero-title">A premium home for Arma3 CTH and Rust Vanilla players.</h1>
          <p className="hero-copy">
            Designed as a sharp, futuristic server hub with room for community growth, donation support,
            server visibility, and clean onboarding. This starter is multi-page, deployable on Vercel, and
            organized to scale without a login system.
          </p>
          <div className="button-row">
            <Link href="/server-info" className="button primary">View Server Info</Link>
            <Link href="/donate" className="button secondary">Support the Hub</Link>
          </div>
          <div className="stat-grid compact">
            <div className="stat-card"><span>Games</span><strong>2 Active Servers</strong></div>
            <div className="stat-card"><span>Focus</span><strong>Vanilla + CTH</strong></div>
            <div className="stat-card"><span>Deploy</span><strong>Vercel Ready</strong></div>
            <div className="stat-card"><span>Structure</span><strong>Multi-page</strong></div>
          </div>
        </div>
        <div className="visual-card">
          <Image
            src="/cosmic-map.jpg"
            alt="Cosmic map artwork used as the visual identity for T-Central Hub"
            width={1200}
            height={1600}
            className="hero-image"
            priority
          />
          <div className="overlay-card">
            <p className="eyebrow">Creative identity</p>
            <h3>Cosmic, tactical, and built to stand out.</h3>
            <p className="muted">
              The visual direction uses your artwork as a signature backdrop to make the site memorable and unique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
