import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionTitle from '@/components/SectionTitle';

const pillars = [
  {
    title: 'Arma3 Capture the Hill',
    text: 'Promote your battlefield, map loops, faction combat, event nights, and direct connect information in a clean high-end layout.',
  },
  {
    title: 'Rust Vanilla',
    text: 'Showcase vanilla progression, wipe cadence, survival rules, and community standards without clutter or bloat.',
  },
  {
    title: 'Future-ready hub',
    text: 'Organized so you can later add live server state, stat cards, featured clips, guides, or staff announcements.',
  },
];

const highlights = [
  'Premium landing page built around strong visual identity',
  'Clear multi-page structure for information and onboarding',
  'Donation page without requiring account systems',
  'Reusable components for future sections and expansions',
  'Deployable on standard Vercel systems with no backend required',
  'Clean codebase with room for future integrations',
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section-block">
        <div className="container">
          <SectionTitle
            eyebrow="Core design"
            title="Built like a real community hub, not a placeholder landing page."
            text="The homepage balances atmosphere, clear navigation, and practical game-server information so new visitors immediately understand what T-Central is about."
          />
          <div className="card-grid three">
            {pillars.map((item) => (
              <article key={item.title} className="content-card">
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block alt">
        <div className="container split-grid">
          <div>
            <SectionTitle
              eyebrow="What this starter includes"
              title="A polished foundation for growth."
              text="This version stays lightweight and deployable while still setting you up for future upgrades."
            />
            <div className="list-block">
              {highlights.map((item) => (
                <div key={item} className="list-item">
                  <span className="dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="content-card large">
            <p className="eyebrow">Quick navigation</p>
            <h3>Guide players where they need to go.</h3>
            <p className="muted">
              Keep the homepage focused, then move details into dedicated sections for server info, donation support,
              and community-facing information.
            </p>
            <div className="button-column">
              <Link href="/server-info" className="button secondary">Open Server Information</Link>
              <Link href="/information" className="button secondary">Open Information Page</Link>
              <Link href="/donate" className="button secondary">Open Donation Page</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
