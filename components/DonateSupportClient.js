'use client';

import { useEffect, useRef, useState } from 'react';

const PAYPAL_CLIENT_ID = 'AXqHQLIJ608RS7GkyIvA5I-jFk-xJQueoSaKSfl3UWVkK6BtHmd0971SA2snZlJxSV-WIHFh5K-uut0Q';
const PAYPAL_PLAN_ID = 'P-95R19588AD368713ENHLWFNY';

export default function DonateSupportClient() {
  const containerRef = useRef(null);
  const [steamUser, setSteamUser] = useState(null);
  const [support, setSupport] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/auth/steam/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setSteamUser(data?.authenticated ? data.user : null))
      .catch(() => setSteamUser(null));

    fetch('/api/support/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setSupport(data?.linked ? data.support : null))
      .catch(() => setSupport(null));
  }, []);

  useEffect(() => {
    const scriptId = 'paypal-subscription-sdk';
    let script = document.getElementById(scriptId);

    const renderButtons = () => {
      if (!window.paypal || !containerRef.current || containerRef.current.dataset.rendered === 'true') return;
      containerRef.current.dataset.rendered = 'true';
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        },
        createSubscription: function (data, actions) {
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID,
          });
        },
        onApprove: async function (data) {
          try {
            const res = await fetch('/api/support/link', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                provider: 'paypal',
                subscriptionId: data.subscriptionID,
                planId: PAYPAL_PLAN_ID,
              }),
            });
            const payload = await res.json();
            if (!res.ok) {
              setStatus(payload?.error || 'Support linked failed');
              return;
            }
            setSupport(payload.linked);
            setStatus('Subscription linked to your Steam identity.');
          } catch {
            setStatus('Subscription approved, but support linking could not be confirmed.');
          }
        },
      }).render(containerRef.current);
    };

    if (script) {
      if (window.paypal) renderButtons();
      else script.addEventListener('load', renderButtons, { once: true });
      return;
    }

    script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.addEventListener('load', renderButtons, { once: true });
    document.body.appendChild(script);

    return () => {};
  }, []);

  return (
    <>
      <section className="content-card support-link-card">
        <p className="eyebrow">Steam-linked support</p>
        <h3>Associate recurring support with your Steam identity</h3>
        <p className="muted">
          Sign in with Steam first, then subscribe. After approval, the subscription is linked to your Steam ID through a server-side encrypted support receipt.
        </p>

        <div className="support-link-grid">
          <div className="support-link-panel">
            <span className="support-link-label">Steam identity</span>
            <strong>{steamUser?.personaname || 'Not signed in'}</strong>
            <small>{steamUser?.steamid || 'Steam login required for linking'}</small>
          </div>

          <div className="support-link-panel">
            <span className="support-link-label">Support status</span>
            <strong>{support ? 'Linked' : 'Not linked yet'}</strong>
            <small>{support?.subscriptionId || 'No current linked subscription'}</small>
          </div>
        </div>

        {status ? <p className="support-link-status">{status}</p> : null}
      </section>

      <div className="paypal-live-shell">
        <div ref={containerRef} id="paypal-button-container-P-95R19588AD368713ENHLWFNY" />
      </div>
    </>
  );
}
