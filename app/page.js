import SteamLoginHud from '@/components/SteamLoginHud';

const launchCards = [
  {
    kicker: 'Deep-space anchor',
    title: 'Mapped blackhole routing',
    copy: 'The deep-space blackhole reuses the project map and anchor assets so the visual language stays consistent across the world.',
    image: '/cosmic-map.jpg',
  },
  {
    kicker: 'Arma3 route',
    title: 'Server-entry blackhole',
    copy: 'Arma3 remains one of the primary destination wells with direct routing, live server detail pages, and anchored world presence.',
    image: '/arma-cth-shot.png',
  },
  {
    kicker: 'Shared shell',
    title: 'Unified asset presentation',
    copy: 'Panels, overlays, route cards, and blackhole anchors now share the same polished cosmic treatment for cleaner deployment.',
    image: '/blackhole-anchor.jpg',
  },
];

export default function HomePage() {
  return (
    <main className="entry-page cosmic-entry-page">
      <SteamLoginHud />
      <div className="cosmic-overlay" />
      <div className="entry-orbit entry-orbit-a" />
      <div className="entry-orbit entry-orbit-b" />

      <section className="entry-shell">
        <div className="entry-copy cosmic-hero-panel entry-hero-panel">
          <p className="eyebrow">T-Central Hub</p>
          <h1>Enter the live 3D multiplayer server-space.</h1>
          <p className="muted">
            Sign in with Steam, enter the shared 3D space, fly in pilot mode, spectate the player base,
            and use blackholes as live server-entry systems.
          </p>

          <div className="entry-actions">
            <a className="button primary" href="/system">Enter system</a>
            <a className="button secondary" href="/servers/arma3-cth">Arma3 CTH</a>
            <a className="button secondary" href="/donate">Support</a>
          </div>

          <div className="entry-status-bar">
            <span>Deep-space anchor online</span>
            <span>Steam layer ready</span>
            <span>Blackhole routes stable</span>
          </div>

          <div className="entry-link-row">
            <a href="/privacy-policy">Privacy policy</a>
            <a href="/terms-and-conditions">Terms and conditions</a>
            <a href="/report-player">Report player</a>
            <a href="/status">Status</a>
          </div>
        </div>

        <div className="entry-visual-stack">
          <div className="entry-map-card">
            <div className="entry-map-card-copy">
              <span className="entry-panel-kicker">Primary visual anchor</span>
              <strong>Deep-space map integration</strong>
              <p>The existing cosmic map now leads the visual stack so the home shell matches the world anchor strategy.</p>
            </div>
            <img src="/cosmic-map.jpg" alt="Deep-space project map" />
          </div>

          <div className="entry-panel-grid enhanced">
            {launchCards.map((card) => (
              <article className="content-card entry-panel polished" key={card.title}>
                <div className="entry-panel-media">
                  <img src={card.image} alt={card.title} />
                </div>
                <span className="entry-panel-kicker">{card.kicker}</span>
                <strong>{card.title}</strong>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
