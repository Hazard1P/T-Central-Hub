import PageShell from '@/components/PageShell';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Privacy policy"
      title="Privacy policy"
      text="This policy explains the core data used by the T-Central website, Steam-linked sign-in flow, support-link state, and multiplayer presence features."
    >
      <div className="arma-brief-grid">
        <article className="content-card">
          <p className="eyebrow">Steam sign-in</p>
          <h3>Identity data</h3>
          <p className="muted">
            When you sign in with Steam, the system may store your SteamID, display name, profile URL, and avatar for session and interface purposes.
          </p>
        </article>
        <article className="content-card">
          <p className="eyebrow">Realtime system</p>
          <h3>Presence and movement</h3>
          <p className="muted">
            Multiplayer features may use presence data and lightweight live state such as current room, display name, and in-system movement markers.
          </p>
        </article>
        <article className="content-card">
          <p className="eyebrow">Support status</p>
          <h3>Linked support state</h3>
          <p className="muted">
            If support is linked to your Steam identity, the app may store encrypted support receipt data for in-app supporter status and related features.
          </p>
        </article>
      </div>
    </PageShell>
  );
}
