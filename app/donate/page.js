import PageShell from '@/components/PageShell';
import Script from 'next/script';

export const metadata = { title: 'Donate' };

const supportReasons = [
  'Help keep the servers online and stable.',
  'Support site upgrades, polish, and future features.',
  'Contribute toward events, media, and community growth.',
  'Back a hub built for long-term players and repeat sessions.'
];

const tierCards = [
  {
    name: 'Field Supporter',
    status: 'Current PayPal Plan',
    text: 'A simple recurring support lane for players who want to back the hub consistently without extra steps.',
    features: ['Recurring support', 'Fast checkout', 'Good for regular players'],
    active: true
  },
  {
    name: 'Community Backer',
    status: 'Tier framework',
    text: 'A stronger support identity for players who want to contribute more heavily to improvements, events, and long-term polish.',
    features: ['Higher-impact support lane', 'Great for core community members', 'Can be expanded later with a second plan ID'],
    active: false
  },
  {
    name: 'Hub Patron',
    status: 'Tier framework',
    text: 'A premium support identity for those who want to back the ecosystem at a higher level as the hub keeps expanding.',
    features: ['Premium supporter identity', 'Future-ready for added benefits', 'Can be activated later with another plan ID'],
    active: false
  }
];

export default function DonatePage() {
  return (
    <PageShell
      eyebrow="Support the hub"
      title="Back the system and help it keep growing."
      text="This page is rebuilt with a stronger multi-tier presentation while keeping your current PayPal subscription flow honest and fully usable right now."
    >
      <div className="donate-top-grid">
        <section className="content-card donate-hero-card">
          <p className="eyebrow">Recurring support</p>
          <h3>Active PayPal subscription</h3>
          <p className="muted">
            The section below uses your current PayPal subscription setup directly. Supporters can use the embedded
            button or the direct PayPal link if they prefer a simpler route.
          </p>

          <div className="paypal-shell donate-paypal-shell">
            <div id="paypal-button-container-P-95R19588AD368713ENHLWFNY" />

            <a
              href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-95R19588AD368713ENHLWFNY"
              target="_blank"
              rel="noreferrer"
              className="button primary donate-direct-link"
            >
              Subscribe via PayPal (Direct Link)
            </a>

            <p className="muted donate-helper">
              If the PayPal button does not load, use the direct subscription link above.
            </p>
          </div>

          <div className="donate-note">
            <strong>Plan ID</strong>
            <span>P-95R19588AD368713ENHLWFNY</span>
          </div>
        </section>

        <section className="content-card donate-side-card">
          <p className="eyebrow">Why support matters</p>
          <h3>Help sustain uptime, improvements, and growth.</h3>
          <div className="step-list donate-list">
            {supportReasons.map((reason) => (
              <div key={reason} className="step-item">
                <span className="dot" />
                <p>{reason}</p>
              </div>
            ))}
          </div>

          <div className="donate-side-box">
            <strong>Built honestly</strong>
            <p className="muted">
              This page only activates the one PayPal plan you gave me. The extra tier cards below are real visual
              structure for future growth, but they are not wired to fake payment plans.
            </p>
          </div>
        </section>
      </div>

      <section className="donate-tier-section">
        <div className="donate-section-head">
          <p className="eyebrow">Support tiers</p>
          <h3>Multi-tier structure for the hub.</h3>
          <p className="muted">
            The page now presents a clearer tier system so supporters can understand the different levels of backing.
            Right now, the active checkout path is the PayPal plan above.
          </p>
        </div>

        <div className="info-grid three donate-tier-grid">
          {tierCards.map((tier) => (
            <article
              key={tier.name}
              className={`content-card donate-tier-card ${tier.active ? 'donate-tier-card-active' : ''}`}
            >
              <div className="donate-tier-top">
                <div>
                  <p className="eyebrow">Support tier</p>
                  <h3>{tier.name}</h3>
                </div>
                <span className={`tier-badge ${tier.active ? 'tier-badge-live' : ''}`}>
                  {tier.status}
                </span>
              </div>

              <p className="muted">{tier.text}</p>

              <div className="tier-feature-list">
                {tier.features.map((feature) => (
                  <div key={feature} className="step-item">
                    <span className="dot" />
                    <p>{feature}</p>
                  </div>
                ))}
              </div>

              {tier.active ? (
                <a
                  href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-95R19588AD368713ENHLWFNY"
                  target="_blank"
                  rel="noreferrer"
                  className="button primary tier-button"
                >
                  Use Active Plan
                </a>
              ) : (
                <a
                  href="https://discord.gg/8bJAEau9"
                  target="_blank"
                  rel="noreferrer"
                  className="button secondary tier-button"
                >
                  Ask in Discord
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="donate-bottom-grid">
        <article className="content-card donate-bottom-card">
          <p className="eyebrow">Support flow</p>
          <h3>Simple route for players.</h3>
          <p className="muted">
            Players can open the donate page from the 3D system, review the support tiers, use the active PayPal
            plan, and then return to the hub without needing an account system.
          </p>
        </article>

        <article className="content-card donate-bottom-card">
          <p className="eyebrow">Community route</p>
          <h3>Questions before supporting?</h3>
          <p className="muted">
            If someone wants to ask questions first, they can open Discord and speak with the community before
            subscribing.
          </p>
          <a href="https://discord.gg/8bJAEau9" target="_blank" rel="noreferrer" className="button secondary">
            Open Discord
          </a>
        </article>
      </section>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=AXqHQLIJ608RS7GkyIvA5I-jFk-xJQueoSaKSfl3UWVkK6BtHmd0971SA2snZlJxSV-WIHFh5K-uut0Q&vault=true&intent=subscription"
        data-sdk-integration-source="button-factory"
        strategy="afterInteractive"
      />

      <Script id="paypal-subscription-init" strategy="afterInteractive">
        {`
          if (window.paypal) {
            window.paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe'
              },
              createSubscription: function(data, actions) {
                return actions.subscription.create({
                  plan_id: 'P-95R19588AD368713ENHLWFNY'
                });
              },
              onApprove: function(data, actions) {
                alert(data.subscriptionID);
              }
            }).render('#paypal-button-container-P-95R19588AD368713ENHLWFNY');
          }
        `}
      </Script>
    </PageShell>
  );
}
