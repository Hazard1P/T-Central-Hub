import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">T-Central Hub</p>
          <h1 className="hero-title">A sharper, more cinematic server hub for Arma3 CTH and Rust Vanilla.</h1>
          <p className="hero-copy">
            Everything has been upgraded into a cleaner multi-page experience with stronger visuals,
            support flow, better game separation, and a homepage that feels like an actual system map.
          </p>
          <div className="button-row">
            <Link href="/servers/arma3-cth" className="button primary">Explore Arma3 CTH</Link>
            <Link href="/servers/rust-vanilla" className="button secondary">Explore Rust Vanilla</Link>
          </div>
          <div className="stats-grid compact">
            <div className="stat-card"><span>Games</span><strong>2 Active Servers</strong></div>
            <div className="stat-card"><span>Discord</span><strong>Live Community Link</strong></div>
            <div className="stat-card"><span>Support</span><strong>Subscription Enabled</strong></div>
            <div className="stat-card"><span>Deploy</span><strong>Vercel Ready</strong></div>
          </div>
        </div>

        <div className="hero-orb">
          <div className="orb-backdrop" />
          <div className="orb-ring ring-a" />
          <div className="orb-ring ring-b" />
          <div className="orb-ring ring-c" />
          <div className="orb-core">
            <span className="pulse pulse-a" />
            <span className="pulse pulse-b" />
            <span className="pulse pulse-c" />
            <div className="orb-label">
              <p className="eyebrow">Core hub</p>
              <h3>System-scale presentation with game-specific routes.</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
