import Image from 'next/image';
import PageShell from '@/components/PageShell';
import ServerConnectActions from '@/components/ServerConnectActions';

export const metadata = { title: 'Arma3 CTH' };

const futureProspects = [
  'Expanded dynamic server browser integration from the blackhole interior.',
  'Richer event nights, rotating hill layouts, and curated tactical sessions.',
  'Progression, stat tracking, and stronger website-to-server handoff.',
  'Better live status visibility and more direct launch paths through Steam.',
];

const cthPoints = [
  'Capture the Hill is built around control of a central objective under constant team pressure.',
  'Players re-enter quickly, contest the hill, and fight for territory, score, and momentum.',
  'The mode works best when the travel time stays low and the objective stays active.',
  'T-Central is aiming for a cleaner tactical loop: fast entry, clear action, repeat sessions.',
];

export default function ArmaPage() {
  const serverIp = 'tcentral.game.nfoservers.com:2302';

  return (
    <PageShell
      eyebrow="Arma3 CTH"
      title="Capture the Hill, deploy fast, and stay in the fight."
      text="This page is the practical entry point for the single live T-Central Arma3 Capture the Hill server, with quick connect actions, a clear server route, and a briefing on where the mode is headed."
    >
      <div className="arma-entry-grid">
        <article className="content-card">
          <p className="eyebrow">Quick connect</p>
          <h3>{serverIp}</h3>
          <p className="muted">
            Launch Arma 3, copy the server IP, or use the Steam quick-connect handoff to get into the T-Central CTH route faster.
          </p>

          <ServerConnectActions
            serverIp={serverIp}
            steamAppId="107410"
            launchLabel="Launch Arma 3"
            connectLabel="Quick Connect"
          />

          <div className="server-inline-meta">
            <span>Game: Arma 3</span>
            <span>Mode: Capture the Hill</span>
            <span>Route: Public tactical server</span>
          </div>
        </article>

        <article className="content-card arma-hero-image-card">
          <Image
            src="/arma-cth-shot.png"
            alt="Arma 3 CTH battlefield map"
            width={1366}
            height={1024}
            className="page-image"
            priority
          />
        </article>
      </div>

      <div className="arma-brief-grid">
        <article className="content-card">
          <p className="eyebrow">What CTH is</p>
          <h3>Briefing</h3>
          <ul className="arma-list">
            {cthPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="content-card">
          <p className="eyebrow">Map reference</p>
          <h3>Visual context</h3>
          <div className="arma-highlight">
            <strong>Altis battlefield map</strong>
            <p className="muted">
              This route is aligned around the Arma battlefield map so the entry stays focused on gameplay instead of unrelated fallback images.
            </p>
          </div>
          <div className="arma-highlight">
            <strong>Join priority</strong>
            <p className="muted">
              The page is meant to shorten the path from website → Steam → server as much as possible.
            </p>
          </div>
        </article>

        <article className="content-card">
          <p className="eyebrow">Future prospects</p>
          <h3>Where it can go next</h3>
          <ul className="arma-list">
            {futureProspects.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </div>
    </PageShell>
  );
}
