import PageShell from '@/components/PageShell';

export const metadata = { title: 'Terms and Conditions' };

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms and conditions"
      title="Terms and conditions"
      text="These terms cover use of the T-Central website, multiplayer web-game system, linked identity features, blackhole/server interactions, and community routes."
    >
      <div className="arma-brief-grid">
        <article className="content-card">
          <p className="eyebrow">Use of service</p>
          <h3>General use</h3>
          <p className="muted">
            Users are expected to use the site, web-game space, and linked server routes responsibly and in accordance with applicable community rules.
          </p>
        </article>
        <article className="content-card">
          <p className="eyebrow">Multiplayer behavior</p>
          <h3>Shared environment</h3>
          <p className="muted">
            The live web-game space is intended for participation, spectating, piloting, and server entry. Abuse, harassment, or disruption may result in moderation action.
          </p>
        </article>
        <article className="content-card">
          <p className="eyebrow">External handoff</p>
          <h3>Game and platform routes</h3>
          <p className="muted">
            Some blackholes and buttons hand off to external routes such as Steam, game servers, or third-party websites. Availability can vary by platform and installed software.
          </p>
        </article>
      </div>
    </PageShell>
  );
}
