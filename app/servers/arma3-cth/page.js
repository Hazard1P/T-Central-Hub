import SectionTitle from '@/components/SectionTitle';
import Image from 'next/image';
import CopyAddressButton from '@/components/CopyAddressButton';

const items = [
  'Server address: tcentral.game.nfoservers.com:2302',
  'Mode: Capture the Hill',
  'Focus: public tactical objective combat',
  'Built for returning players, public sessions, and map pressure',
  'Ready for future event updates, featured clips, and patch notes'
];

export const metadata = {
  title: 'Arma3 CTH',
  description: 'Official T-Central Arma3 Capture the Hill server page with direct connect details and battlefield imagery.'
};

export default function ArmaPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Arma3 CTH"
          title="Tactical battlefield identity, built into its own premium page."
          text="This page focuses on direct connect information, the visual battlefield feel, and a structure that can later hold rotations, events, and top-player highlights."
        />
        <div className="feature-hero-grid">
          <div className="content-card large">
            <p className="eyebrow">Direct connect</p>
            <h3>tcentral.game.nfoservers.com:2302</h3>
            <p className="muted">
              Use this as the public landing point for your Arma3 community, with clean access to the server
              address and space for future community-facing updates.
            </p>
            <div className="button-row">
              <CopyAddressButton value="tcentral.game.nfoservers.com:2302" />
              <a href="https://discord.gg/8bJAEau9" target="_blank" rel="noreferrer" className="button secondary">Join Discord</a>
            </div>
            <div className="list-block compact-list">
              {items.map((item) => (
                <div key={item} className="list-item">
                  <span className="dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="visual-stack">
            <div className="visual-frame">
              <Image
                src="/arma-cth-shot.png"
                alt="Arma3 Capture the Hill server screenshot"
                width={1366}
                height={1024}
                className="page-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
