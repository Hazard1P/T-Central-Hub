import Hero from '@/components/Hero';
import InteractiveGalaxyMap from '@/components/InteractiveGalaxyMap';
import SectionTitle from '@/components/SectionTitle';
import ServerCards from '@/components/ServerCards';
import DiscordPanel from '@/components/DiscordPanel';
import Link from 'next/link';

const bullets = [
  'Interactive 3D cosmic map that works on Vercel',
  'Warp zoom transitions into Arma3 and Rust routes',
  'Rust servers pinned around the black hole cluster',
  'Arma3 upgraded into its own interactive black hole anchor',
  'Spinning Dyson sphere for the support network',
  'Future-ready structure for live status and announcement integrations'
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section-block">
        <div className="container">
          <SectionTitle
            eyebrow="Interactive navigation"
            title="A more defined 3D map with sectors, anchors, and warp transitions."
            text="Rotate, zoom, and click through a more structured constellation. The map now separates the hub into an Arma sector, a Rust sector, and a support sector, while a separate shining star links out to the Government of Canada national security reporting resource."
          />
          <InteractiveGalaxyMap />
        </div>
      </section>

      <section className="section-block alt">
        <div className="container split-grid">
          <div>
            <SectionTitle
              eyebrow="Server lineup"
              title="Arma3 and multiple Rust wipe options, all organized in one place."
              text="Whether someone wants tactical hill control, a bi-weekly Rust cycle, a long monthly progression server, or a fast weekly reset, the hub gets them there cleanly."
            />
            <ServerCards />
          </div>
          <div className="content-card large">
            <p className="eyebrow">Upgrade summary</p>
            <h3>The hub now feels more like an interactive control surface than a static homepage.</h3>
            <div className="list-block compact-list">
              {bullets.map((item) => (
                <div key={item} className="list-item">
                  <span className="dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="button-column">
              <Link href="/servers/arma3-cth" className="button primary">Open Arma3 page</Link>
              <Link href="/servers/rust-vanilla" className="button secondary">Open Rust bi-weekly</Link>
              <Link href="/servers/rust-monthly" className="button secondary">Open Rust monthly</Link>
              <Link href="/servers/rust-weekly" className="button secondary">Open Rust weekly</Link>
              <Link href="/report-player" className="button secondary">Report a player</Link>
              <Link href="/donate" className="button secondary">Open support page</Link>
            </div>
          </div>
        </div>
      </section>

      <DiscordPanel />
    </>
  );
}
