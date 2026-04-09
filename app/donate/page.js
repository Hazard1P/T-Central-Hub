import SectionTitle from '@/components/SectionTitle';
import SubscriptionWidget from '@/components/SubscriptionWidget';

const tiers = [
  ['Field Supporter', 'A lighter support option for players who want to help keep the servers online and maintained.'],
  ['Community Backer', 'A mid-tier support option for regulars who want to help with events, polish, and long-term quality.'],
  ['Hub Patron', 'A stronger support option for players who want to contribute more directly to the ecosystem and future upgrades.']
];

export const metadata = {
  title: 'Donate',
  description: 'Support T-Central through donations and recurring PayPal subscriptions.'
};

export default function DonatePage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Support the hub"
          title="Support the hub if you want to help it keep growing."
          text="Players who want to support the servers can do it here in a simple way, without making an account or jumping through extra steps."
        />

        <div className="donation-panel premium-panel">
          <div>
            <p className="eyebrow">Why support matters</p>
            <h3>Help keep the servers active, polished, and improving over time.</h3>
            <p className="muted">
              Support can go toward hosting, better presentation, community improvements, and the kind of polish that makes people want to come back.
            </p>
            <div className="button-row">
              <a href="https://discord.gg/8bJAEau9" target="_blank" rel="noreferrer" className="button secondary">Join Discord</a>
              <a href="#subscription" className="button primary">View Subscription</a>
            </div>
          </div>

          <div className="support-summary">
            <div className="support-stat"><span>Type</span><strong>Public Support</strong></div>
            <div className="support-stat"><span>Billing</span><strong>Subscription Ready</strong></div>
            <div className="support-stat"><span>Platform</span><strong>PayPal Vault</strong></div>
          </div>
        </div>

        <div className="card-grid three">
          {tiers.map(([name, text]) => (
            <article key={name} className="content-card">
              <h3>{name}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </div>

        <div id="subscription" className="section-spacer">
          <SectionTitle
            eyebrow="Subscription plan"
            title="Recurring support plan"
            text="The embedded button below uses your PayPal subscription plan directly in the client."
          />
          <SubscriptionWidget />
        </div>
      </div>
    </section>
  );
}
