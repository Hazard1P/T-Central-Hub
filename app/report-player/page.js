import SectionTitle from '@/components/SectionTitle';

const steps = [
  'Tell staff which server the issue happened on.',
  'Add the player name and the time or date of the incident.',
  'Describe clearly what happened in a short factual summary.',
  'Include screenshots, clips, or other evidence if you have them.',
  'Use Discord for urgent moderation issues or active disruption.'
];

export const metadata = {
  title: 'Report a Player',
  description: 'Report player misconduct, cheating concerns, griefing, or rule violations for the T-Central community.'
};

export default function ReportPlayerPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Player reporting"
          title="A clear place for players to report issues and rule violations."
          text="This page helps community members report cheating concerns, griefing, harassment, or other misconduct in a structured way."
        />

        <div className="card-grid two">
          <article className="content-card large">
            <p className="eyebrow">How to report</p>
            <h3>Give staff enough information to act on it quickly.</h3>
            <div className="list-block compact-list">
              {steps.map((step) => (
                <div key={step} className="list-item">
                  <span className="dot" />
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="content-card large">
            <p className="eyebrow">Submit report</p>
            <h3>Open a report through Discord.</h3>
            <p className="muted">
              The website currently routes reports through your Discord community so moderation can review them
              in one central place. You can later replace this with a live form handler or moderation backend.
            </p>
            <div className="button-column">
              <a
                href="https://discord.gg/8bJAEau9"
                target="_blank"
                rel="noreferrer"
                className="button primary"
              >
                Open Discord Report Route
              </a>
              <a href="/information" className="button secondary">
                Review Community Information
              </a>
            </div>
          </article>
        </div>

        <div className="section-spacer">
          <div className="card-grid three">
            <article className="content-card">
              <p className="eyebrow">Good reports</p>
              <h3>Be specific.</h3>
              <p className="muted">
                Strong reports include names, timeframes, the server involved, and clear evidence or witnesses.
              </p>
            </article>
            <article className="content-card">
              <p className="eyebrow">Best evidence</p>
              <h3>Clips and screenshots help.</h3>
              <p className="muted">
                Short clips, screenshots, and timestamps help staff review issues much faster than vague summaries.
              </p>
            </article>
            <article className="content-card">
              <p className="eyebrow">Urgent issues</p>
              <h3>Use Discord fast.</h3>
              <p className="muted">
                If someone is actively disrupting the server, use Discord immediately so staff can respond faster.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
