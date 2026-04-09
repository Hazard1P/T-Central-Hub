import Link from 'next/link';

const cards = [
  {
    title: 'Arma3 Capture the Hill',
    meta: 'tcentral.game.nfoservers.com:2302',
    text: 'Battlefield-focused page with direct connect details, tactical presentation, and room for future events.',
    href: '/servers/arma3-cth'
  },
  {
    title: 'Rust Vanilla Bi-Weekly Wipe',
    meta: 'tcentralrust.game.nfoservers.com:28015',
    text: 'Bi-weekly Rust server with a procedural map and room for future wipe and community updates.',
    href: '/servers/rust-vanilla'
  },
  {
    title: 'Rust Vanilla Monthly Wipe',
    meta: 'tcentralrust3.game.nfoservers.com:28015',
    text: 'Monthly Rust server built for longer progression, a steadier rhythm, and a simpler way for players to find the right wipe cadence.',
    href: '/servers/rust-monthly'
  },
  {
    title: 'Rust Vanilla Weekly Wipe',
    meta: 'tcentralrust2.game.nfoservers.com:28015',
    text: 'Weekly Rust server for players who want faster reset cycles, fresh starts, and a quick route into a new procedural map.',
    href: '/servers/rust-weekly'
  }
];

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
