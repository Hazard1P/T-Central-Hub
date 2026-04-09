import PageShell from '@/components/PageShell';
import Script from 'next/script';

export const metadata = { title: 'Donate' };

export default function DonatePage() {
  return (
    <PageShell
      eyebrow="Support"
      title="Support the hub if you want to help it keep growing."
      text="This page keeps support simple with a recurring PayPal subscription block and no account system."
    >
      <div className="content-card">
        <p className="eyebrow">Subscription plan</p>
        <h3>Recurring support</h3>
        <div className="paypal-shell">
          <div id="paypal-button-container-P-95R19588AD368713ENHLWFNY" />
        </div>
      </div>

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
              onApprove: function(data) {
                alert('Subscription successful: ' + data.subscriptionID);
              }
            }).render('#paypal-button-container-P-95R19588AD368713ENHLWFNY');
          }
        `}
      </Script>
    </PageShell>
  );
}
