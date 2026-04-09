import PageShell from '@/components/PageShell';

export const metadata = { title: 'Report Player' };

const steps = [
  'Tell staff which server the issue happened on.',
  'Include the player name and the time or date.',
  'Keep the description factual and short.',
  'Attach screenshots or clips if you have them.',
  'Use Discord for active disruptions or urgent issues.'
];

export default function ReportPlayerPage() {
  return (
    <PageShell
      eyebrow="Player Reporting"
      title="A clear route for reporting rule violations and misconduct."
      text="This page routes reports through your Discord moderation path for now, without pretending there is a backend report queue."
    >
      <div className="info-grid two">
        <article className="content-card">
          <p className="eyebrow">How to report</p>
          <div className="step-list">
            {steps.map((step) => (
              <div key={step} className="step-item">
                <span className="dot" />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="content-card">
          <p className="eyebrow">Discord route</p>
          <h3>Open the community moderation path.</h3>
          <a href="https://discord.gg/8bJAEau9" target="_blank" rel="noreferrer" className="button primary">
            Join Discord
          </a>
        </article>
      </div>
    </PageShell>
  );
}
