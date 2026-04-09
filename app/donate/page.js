import PageShell from '@/components/PageShell';
import Script from 'next/script';

export const metadata = { title: 'Donate' };

const supportReasons = [
  'Help keep the servers online and stable.',
  'Support site upgrades, polish, and future features.',
  'Contribute toward events, media, and community growth.',
  'Back a hub built for long-term players and repeat sessions.'
];

const supportTiers = [
  {
    name: 'Field Supporter',
    text: 'A lighter recurring support option for players who want to contribute to upkeep and steady improvements.'
  },
  {
    name: 'Community Backer',
    text: 'A stronger recurring option for regular players who want to help sustain events, polish, and long-term quality.'
  },
  {
    name: 'Hub Patron',
    text: 'A premium recurring support option for players who want to contribute more directly to the ecosystem and its future upgrades.'
  }
];

export default function DonatePage() {
  return (
    <PageShell
      eyebrow="Support the hub"
      title="Back the system and help it keep growing."
      text="This donate page is rebuilt around your PayPal subscription flow so supporters can subscribe directly without extra account steps."
    >
      <div className="donate-layout">
        <section className="content-card donate-hero-card">
          <p className="eyebrow">Recurring support</p>
          <h3>PayPal subscription</h3>
          <p className="muted">
            Use the subscription button below to support the hub through your PayPal plan. This is wired to the
            subscription setup you provided.
          </p>

          <div className="paypal-shell donate-paypal-shell">
            <div id="paypal-button-container-P-95R19588AD368713ENHLWFNY" />
          </div>

          <div className="donate-note">
            <strong>Plan ID</strong>
            <span>P-95R19588AD368713ENHLWFNY</span>
          </div>
        </section>

        <section className="content-card">
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
        </section>
      </div>

      <div className="info-grid three donate-tier-grid">
        {supportTiers.map((tier) => (
          <article key={tier.name} className="content-card donate-tier-card">
            <p className="eyebrow">Support tier</p>
            <h3>{tier.name}</h3>
            <p className="muted">{tier.text}</p>
          </article>
        ))}
      </div>

      <section className="content-card donate-footer-card">
        <p className="eyebrow">Community route</p>
        <h3>Questions before supporting?</h3>
        <p className="muted">
          If you want to ask questions first, open the Discord and speak with the community before subscribing.
        </p>
        <a href="https://discord.gg/8bJAEau9" target="_blank" rel="noreferrer" className="button secondary">
          Open Discord
        </a>
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
