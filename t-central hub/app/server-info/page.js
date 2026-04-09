import SectionTitle from '@/components/SectionTitle';

const serverCards = [
  {
    title: 'Arma3 CTH Server',
    details: [
      'Direct connect: tcentral.game.nfoservers.com:2302',
      'Mode: Capture the Hill',
      'Focus: public tactical team combat',
      'Use this card for map rotation, restart schedule, and featured event notes.',
    ],
  },
  {
    title: 'Rust Vanilla Server',
    details: [
      'Replace with your live Rust IP and port',
      'Focus: vanilla gameplay and survival progression',
      'Use this card for wipe cycle details and rules summary',
      'Great place for Discord alerts and server expectations.',
    ],
  },
];

export default function ServerInfoPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Server information"
          title="Keep all join details in one clean place."
          text="This page is built for players who want quick access to direct connect details, server expectations, and the core experience for each game."
        />

        <div className="card-grid two">
          {serverCards.map((card) => (
            <article key={card.title} className="content-card large">
              <h3>{card.title}</h3>
              <div className="list-block compact-list">
                {card.details.map((detail) => (
                  <div key={detail} className="list-item">
                    <span className="dot" />
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
