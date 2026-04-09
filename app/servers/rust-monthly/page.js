import SectionTitle from '@/components/SectionTitle';
import CopyAddressButton from '@/components/CopyAddressButton';

const stats = [
  ['Server Name', 'T-Central Rust Vanilla Monthly Wipe'],
  ['Server Address', 'tcentralrust3.game.nfoservers.com:28015'],
  ['Game', 'Rust'],
  ['Current Map', 'Procedural Map'],
  ['Current Players', '0 / 250'],
  ['Wipe Cadence', 'Monthly Wipe']
];

export const metadata = {
  title: 'Rust Monthly Wipe',
  description: 'Official T-Central Rust Vanilla Monthly Wipe server page with join details, map info, and wipe cadence.'
};

export default function RustMonthlyPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Rust Monthly Wipe"
          title="A longer-cycle Rust server for players who want more time to build and progress."
          text="This page gives players a direct way into the monthly server, with the essentials up front so they can tell right away if this is the wipe pace they want."
        />
        <div className="card-grid two">
          <article className="content-card large">
            <p className="eyebrow">Direct connect</p>
            <h3>tcentralrust3.game.nfoservers.com:28015</h3>
            <p className="muted">
              Use this page as the main destination for the monthly Rust server so players can quickly find the
              address, understand the wipe cadence, and join without confusion.
            </p>
            <div className="button-row">
              <CopyAddressButton value="tcentralrust3.game.nfoservers.com:28015" />
              <a href="steam://connect/tcentralrust3.game.nfoservers.com:28015" className="button secondary">Connect in Steam</a>
            </div>
          </article>

          <article className="content-card aurora-card">
            <p className="eyebrow">Server snapshot</p>
            <h3>Current monthly server details</h3>
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
