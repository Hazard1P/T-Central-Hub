'use client';

export default function SubscriptionWidget() {
  return (
    <div className="subscription-card">
      <p className="muted">
        Recurring PayPal subscription buttons were removed from the static component because they contained hardcoded live identifiers.
        Use the protected server-side donation flow instead.
      </p>
    </div>
  );
}
