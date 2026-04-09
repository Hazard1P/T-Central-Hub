import Hero from '@/components/Hero';
import CosmicMap from '@/components/CosmicMap';
import SectionTitle from '@/components/SectionTitle';
import ServerCards from '@/components/ServerCards';
import DiscordPanel from '@/components/DiscordPanel';
import Link from 'next/link';

const bullets = [
  'Interactive cosmic hub navigation on the homepage',
  'Dedicated premium pages for Arma3 and Rust',
  'Donation and PayPal subscription support',
  'SEO-ready metadata, sitemap, and robots',
  'Future-ready structure for live status and announcements',
  'Deployable on Vercel with no login requirement'
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section-block">
        <div className="container">
          <SectionTitle
            eyebrow="System map"
            title="A homepage that feels like an actual hub."
            text="The cosmic artwork is now used as an interactive navigation surface so the site feels branded, memorable, and purpose-built instead of generic."
          />
          <CosmicMap />
        </div>
      </section>

      <section className="section-block alt">
        <div className="container split-grid">
          <div>
            <SectionTitle
              eyebrow="Server lineup"
              title="Two games, one polished front door."
              text="Each game now has its own cleaner destination page, while support, community, and general information stay centralized."
            />
            <ServerCards />
          </div>
          <div className="content-card large">
            <p className="eyebrow">Upgrade summary</p>
            <h3>Everything is now tightened up for a better public impression.</h3>
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
              <Link href="/servers/rust-vanilla" className="button secondary">Open Rust page</Link>
              <Link href="/donate" className="button secondary">Open support page</Link>
            </div>
          </div>
        </div>
      </section>

      <DiscordPanel />
    </>
  );
}
