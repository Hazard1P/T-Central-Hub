import SectionTitle from '@/components/SectionTitle';
import CopyAddressButton from '@/components/CopyAddressButton';

const stats = [
  ['Server Name', 'T-Central Rust Vanilla Weekly Wipe'],
  ['Server Address', 'tcentralrust2.game.nfoservers.com:28015'],
  ['Game', 'Rust'],
  ['Current Map', 'Procedural Map'],
  ['Current Players', '0 / 250'],
  ['Currently Locked', 'No'],
  ['Wipe Cadence', 'Weekly Wipe']
];

export const metadata = {
  title: 'Rust Weekly Wipe',
  description: 'Official T-Central Rust Vanilla Weekly Wipe server page with join details, map info, and wipe cadence.'
};

export default function RustWeeklyPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Rust Weekly Wipe"
          title="A faster-cycle Rust server for players who want fresh starts every week."
          text="This page is built to help players quickly understand the weekly server, confirm the basics, and jump into a new run without extra clutter."
        />
        <div className="card-grid two">
          <article className="content-card large">
            <p className="eyebrow">Direct connect</p>
            <h3>tcentralrust2.game.nfoservers.com:28015</h3>
            <p className="muted">
              Use this page as the main destination for the weekly server so players can grab the address,
              check the wipe cadence, and join right away.
            </p>
            <div className="button-row">
              <CopyAddressButton value="tcentralrust2.game.nfoservers.com:28015" />
              <a href="steam://connect/tcentralrust2.game.nfoservers.com:28015" className="button secondary">Connect in Steam</a>
            </div>
          </article>

          <article className="content-card aurora-card">
            <p className="eyebrow">Server snapshot</p>
            <h3>Current weekly server details</h3>
            <div className="stats-grid">
              {stats.map(([label, value]) => (
                <div key={label} className="stat-card">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
