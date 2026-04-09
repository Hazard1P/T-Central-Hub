import PageShell from '@/components/PageShell';

export const metadata = { title: 'Rust Bi-Weekly' };

export default function RustBiweeklyPage() {
  return (
    <PageShell
      eyebrow="Rust Bi-Weekly"
      title="Bi-weekly Rust cycle with a direct route in."
      text="Use this page for the bi-weekly server address, map notes, and future wipe updates."
    >
      <div className="info-grid three">
        <article className="content-card">
          <p className="eyebrow">Address</p>
          <h3>tcentralrust.game.nfoservers.com:28015</h3>
        </article>
        <article className="content-card">
          <p className="eyebrow">Map</p>
          <h3>Procedural Map</h3>
        </article>
        <article className="content-card">
          <p className="eyebrow">Capacity</p>
          <h3>250 Players</h3>
        </article>
      </div>
    </PageShell>
  );
}
