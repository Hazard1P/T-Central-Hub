import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'About | T-Central Hub',
  description: 'About the T-Central simulation hub, its systems, and its founder.',
};

const pillars = [
  {
    label: 'Universe layer',
    body: 'A procedurally rendered observer space made of blackholes, solar systems, relays, event-horizon effects, and gameplay-driven route logic.',
  },
  {
    label: 'Identity layer',
    body: 'Steam-linked identity, donation linkage, privacy scope, and pilot observance all route through shared session workflows instead of disconnected pages.',
  },
  {
    label: 'Server layer',
    body: 'Game routes, status, moderation, support, and world telemetry are designed to stay synchronized through common APIs and engine modules.',
  },
  {
    label: 'Deployment layer',
    body: 'The project is shaped around a Vercel-ready Next.js shell with API routes, environment-backed secrets, and room for persistent storage.',
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About T-Central"
      title="A web game, server hub, and simulation shell built to keep every layer connected."
      text="T-Central is being developed as a unified observer system: a clean public-facing website, a playable universe layer, and a synchronized route network for game servers, support, and future multiplayer systems."
    >
      <div className="info-grid two">
        {pillars.map((pillar) => (
          <article className="content-card" key={pillar.label}>
            <p className="eyebrow">{pillar.label}</p>
            <h3>{pillar.label}</h3>
            <p className="muted">{pillar.body}</p>
          </article>
        ))}
      </div>

      <div className="arma-brief-grid">
        <article className="content-card">
          <p className="eyebrow">Continuity</p>
          <h3>What this build is aiming to become</h3>
          <ul className="arma-list">
            <li>One shared universe where visuals, gameplay state, support status, and server routes stay in sync.</li>
            <li>A cleaner observer shell on top of a heavier procedural simulation core.</li>
            <li>A privacy-aware architecture where public and private universe scopes can coexist safely.</li>
            <li>A path toward real multiplayer observance, persistence, and live operations.</li>
          </ul>
        </article>

        <article className="content-card founder-card">
          <p className="eyebrow">Founder</p>
          <h3>Michael Rybaltowicz</h3>
          <p className="muted">Founder and primary system architect for the T-Central direction, continuity, and buildout.</p>
          <div className="server-inline-meta">
            <span>Procedural universe direction</span>
            <span>Server and route architecture</span>
            <span>Steam / support / deployment integration</span>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
