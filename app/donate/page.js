import SectionTitle from '@/components/SectionTitle';

const tiers = [
  {
    name: 'Field Supporter',
    text: 'A lightweight option for players who want to help keep the servers online and the hub improving.',
  },
  {
    name: 'Community Backer',
    text: 'A mid-tier option for regular players who want to support events, upgrades, and long-term growth.',
  },
  {
    name: 'Hub Patron',
    text: 'A higher-tier option for those who want to contribute strongly to stability, future tools, and ongoing polish.',
  },
];

export default function DonatePage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Support the hub"
          title="Donation page structure without a login system."
          text="This page is designed for simple public support flows. Swap the placeholder buttons with your actual payment links, donation platform, or community support method."
        />

        <div className="donation-panel">
          <div>
            <p className="eyebrow">Why support matters</p>
            <h3>Help maintain better uptime, cleaner presentation, and future upgrades.</h3>
            <p className="muted">
              Use this section to explain what donations support, such as hosting, site improvements, event nights,
              art, moderation tools, or server-related upgrades.
            </p>
          </div>
          <div className="button-column">
            <a href="#" className="button primary">Add donation link</a>
            <a href="#" className="button secondary">Add community support link</a>
          </div>
        </div>

        <div className="card-grid three">
          {tiers.map((tier) => (
            <article key={tier.name} className="content-card">
              <h3>{tier.name}</h3>
              <p className="muted">{tier.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
