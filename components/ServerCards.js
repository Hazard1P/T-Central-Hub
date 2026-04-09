import Link from 'next/link';

const cards = [
  {
    title: 'Arma3 Capture the Hill',
    meta: 'tcentral.game.nfoservers.com:2302',
    text: 'Battlefield-focused page with direct connect details, tactical presentation, and room for future events.'
  },
  {
    title: 'Rust Vanilla Bi-Weekly Wipe',
    meta: 'tcentralrust.game.nfoservers.com:28015',
    text: 'Wipe cadence, join details, map information, and a stronger public-facing Rust destination.'
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
          <Link href={card.title.includes('Arma3') ? '/servers/arma3-cth' : '/servers/rust-vanilla'} className="button secondary">
            Open page
          </Link>
        </article>
      ))}
    </div>
  );
}
