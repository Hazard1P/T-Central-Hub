import PageShell from '@/components/PageShell';
import Script from 'next/script';

export const metadata = { title: 'Donate' };

export default function DonatePage() {
  return (
    <PageShell
      eyebrow="Support the hub"
      title="Back the system and keep it running."
      text="Support the servers, upgrades, and future expansion through a recurring subscription."
    >
      <div className="donate-layout">
        {/* LEFT: PAYPAL */}
        <section className="content-card donate-hero-card">
          <p className="eyebrow">Recurring Support</p>
          <h3>Subscribe via PayPal</h3>
          <p className="muted">
            Use the secure PayPal subscription below to support the T-Central Hub.
          </p>

          <div className="paypal-shell donate-paypal-shell">
            {/* PayPal Button */}
            <div id="paypal-button-container-P-95R19588AD368713ENHLWFNY" />

            {/* Direct Link (Fallback) */}
            <a
              href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-95R19588AD368713ENHLWFNY"
              target="_blank"
              rel="noreferrer"
              className="button primary"
              style={{
                marginTop: "14px",
                display: "inline-block",
                textAlign: "center",
                width: "100%",
              }}
            >
              Subscribe via PayPal (Direct Link)
            </a>

            {/* Helper note */}
            <p className="muted" style={{ marginTop: "8px" }}>
              If the button doesn’t load, use the direct PayPal link above.
            </p>
          </div>
        </section>

        {/* RIGHT: INFO */}
        <section className="content-card">
          <p className="eyebrow">Why Support?</p>
          <h3>Keep the system running</h3>

          <div className="step-list donate-list">
            <div className="step-item">
              <span className="dot" />
              <p>Maintain server uptime and performance</p>
            </div>
            <div className="step-item">
              <span className="dot" />
              <p>Fund new features and upgrades</p>
            </div>
            <div className="step-item">
              <span className="dot" />
              <p>Support events and community growth</p>
            </div>
            <div className="step-item">
              <span className="dot" />
              <p>Keep the ecosystem expanding long-term</p>
            </div>
          </div>
        </section>
      </div>

      {/* PAYPAL SDK */}
      <Script
        src="https://www.paypal.com/sdk/js?client-id=AXqHQLIJ608RS7GkyIvA5I-jFk-xJQueoSaKSfl3UWVkK6BtHmd0971SA2snZlJxSV-WIHFh5K-uut0Q&vault=true&intent=subscription"
        data-sdk-integration-source="button-factory"
        strategy="afterInteractive"
      />

      {/* PAYPAL INIT */}
      <Script id="paypal-init" strategy="afterInteractive">
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
                alert('Subscription successful: ' + data.subscriptionID);
              }
            }).render('#paypal-button-container-P-95R19588AD368713ENHLWFNY');
          }
        `}
      </Script>
    </PageShell>
  );
}
