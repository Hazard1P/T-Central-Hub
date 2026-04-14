import Link from 'next/link';
import { SERVER_DEFINITIONS } from '@/lib/serverData';

const cards = SERVER_DEFINITIONS.filter((server) => server.slug !== 'rust-biweekly').map((server) => ({
  title: server.slug === 'rust-vanilla' ? 'Rust Vanilla Bi-Weekly Wipe' : server.title,
  meta: server.ip,
  text:
    server.slug === 'arma3-cth'
      ? 'Battlefield-focused page with direct connect details, tactical presentation, and room for future events.'
      : server.slug === 'rust-monthly'
        ? 'Monthly Rust server built for longer progression, a steadier rhythm, and a simpler way for players to find the right wipe cadence.'
        : server.slug === 'rust-weekly'
          ? 'Weekly Rust server for players who want faster reset cycles, fresh starts, and a quick route into a new procedural map.'
          : 'Bi-weekly Rust server with a procedural map and room for future wipe and community updates.',
  href: server.href,
}));

export default function ServerCards() {
  return (
    <div className="card-grid two">
      {cards.map((card) => (
        <article key={card.title} className="content-card server-card animated-card">
          <p className="eyebrow">{card.meta}</p>
          <h3>{card.title}</h3>
          <p className="muted">{card.text}</p>
          <Link href={card.href} className="button secondary">
            Open page
          </Link>
        </article>
      ))}
    </div>
  );
}
