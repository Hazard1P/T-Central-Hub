import SteamLoginHud from '@/components/SteamLoginHud';

export default function HomePage() {
  return (
    <main className="entry-page">
      <SteamLoginHud />
      <main className="entry-page"><div className="cosmic-overlay" /><section className="entry-shell">
        <div className="entry-copy cosmic-hero-panel" style={{padding:"22px", borderRadius:"24px"}}>
          <p className="eyebrow">T-Central Hub</p>
          <h1>Enter the live 3D multiplayer server-space.</h1>
          <p className="muted">
            Sign in with Steam, enter the shared 3D space, fly in pilot mode, spectate the player base, and use blackholes as live server-entry systems.
          </p>

          <div className="entry-actions">
            <a className="button primary" href="/system">Enter system</a>
            <a className="button secondary" href="/servers/arma3-cth">Arma3 CTH</a>
            <a className="button secondary" href="/donate">Support</a>
          </div>

          <div className="entry-link-row">
            <a href="/privacy-policy">Privacy policy</a>
            <a href="/terms-and-conditions">Terms and conditions</a>
            <a href="/report-player">Report player</a>
            <a href="/status">Status</a>
          </div>
        </div>

        <div className="entry-panel-grid">
          <article className="content-card entry-panel">
            <span className="entry-panel-kicker">Live 3D system</span>
            <strong>Shared navigation space</strong>
            <p>Players can enter the same world, fly, spectate, and interact with blackholes as destination systems.</p>
          </article>

          <article className="content-card entry-panel">
            <span className="entry-panel-kicker">Pilot + spectate</span>
            <strong>Two clear roles</strong>
            <p>Fly directly in pilot mode or move through the system as an observer while watching the active player base.</p>
          </article>

          <article className="content-card entry-panel">
            <span className="entry-panel-kicker">100-slot target</span>
            <strong>Multiplayer baseline</strong>
            <p>The package is prepared for a 100-slot realtime room model through a Supabase-backed presence layer.</p>
          </article>
        </div>
      </section></main>
  );
}
