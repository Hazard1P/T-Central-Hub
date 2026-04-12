import PageShell from '@/components/PageShell';

const checkpoints = [
  'Single live Arma3 server route kept as the primary live connection.',
  'Arma quick-connect flow remains tied to Steam launch and direct connect.',
  'Donate and report pages remain scrollable while the fullscreen hub stays locked.',
  'Steam login, support linking, and reporting flow remain in the package.',
  'Arma route keeps the restored map and uploaded reference photo.',
];

export const metadata = { title: 'Project Status' };

export default function StatusPage() {
  return (
    <PageShell
      eyebrow="Project status"
      title="Current conformance pass"
      text="This page summarizes the current stabilized direction of the T-Central package after the recent architecture, image, support, and quick-connect fixes."
    >
      <div className="arma-brief-grid">
        <article className="content-card">
          <p className="eyebrow">Current state</p>
          <h3>Stabilized package</h3>
          <ul className="arma-list">
            {checkpoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="content-card">
          <p className="eyebrow">Live route</p>
          <h3>Primary server</h3>
          <div className="arma-highlight">
            <strong>tcentral.game.nfoservers.com:2302</strong>
            <p className="muted">
              The package is now aligned around one live server overall instead of placeholder multi-server branching.
            </p>
          </div>
        </article>

        <article className="content-card">
          <p className="eyebrow">Next steps</p>
          <h3>Best upgrade path</h3>
          <ul className="arma-list">
            <li>Live server polling from a real status source.</li>
            <li>Supporter persistence through webhook-backed billing confirmation.</li>
            <li>Further blackhole polish around the single-server route.</li>
          </ul>
        </article>
      </div>
    </PageShell>
  );
}
