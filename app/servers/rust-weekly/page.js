import PageShell from '@/components/PageShell';

export const metadata = { title: 'Rust Weekly' };

export default function RustWeeklyPage() {
  return (
    <PageShell
      eyebrow="Rust Weekly"
      title="Fast weekly resets for fresh starts."
      text="The weekly server is aimed at players who want a shorter cycle and a faster return to the early game."
    >
      <div className="info-grid three">
        <article className="content-card">
          <p className="eyebrow">Address</p>
          <h3>tcentralrust2.game.nfoservers.com:28015</h3>
        </article>
        <article className="content-card">
          <p className="eyebrow">Map</p>
          <h3>Procedural Map</h3>
        </article>
        <article className="content-card">
          <p className="eyebrow">Locked</p>
          <h3>No</h3>
        </article>
      </div>
    </PageShell>
  );
}
