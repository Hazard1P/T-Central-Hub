import SectionTitle from '@/components/SectionTitle';
import CopyAddressButton from '@/components/CopyAddressButton';

const stats = [
  ['Server Name', 'NFOservers.com: T-Central Rust Vanilla Bi-Weekly Wipe'],
  ['Server Address', 'tcentralrust.game.nfoservers.com:28015'],
  ['Game', 'Rust'],
  ['Current Map', 'Procedural Map'],
  ['Current Players', '0 / 250'],
  ['Currently Locked', 'No'],
  ['Wipe Cadence', 'Bi-Weekly Wipe']
];

export const metadata = {
  title: 'Rust Vanilla',
  description: 'Official T-Central Rust Vanilla server page with direct connect details, wipe cadence, and map info.'
};

export default function RustPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Rust Vanilla"
          title="Built to make the Rust server feel established and easy to join."
          text="This page is structured for wipe cadence, map details, server address, and future notes like wipe countdowns, featured rules, or community updates."
        />
        <div className="card-grid two">
          <article className="content-card large">
            <p className="eyebrow">Direct connect</p>
            <h3>tcentralrust.game.nfoservers.com:28015</h3>
            <p className="muted">
              Use this page as the primary join destination for your Rust community while keeping the site
              clean and fast without adding unnecessary account systems.
            </p>
            <div className="button-row">
              <CopyAddressButton value="tcentralrust.game.nfoservers.com:28015" />
              <a href="steam://connect/tcentralrust.game.nfoservers.com:28015" className="button secondary">Connect in Steam</a>
            </div>
          </article>

          <article className="content-card aurora-card">
            <p className="eyebrow">Server snapshot</p>
            <h3>Current Rust details</h3>
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
