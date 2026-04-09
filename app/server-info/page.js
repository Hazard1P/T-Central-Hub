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
      'Server name: NFOservers.com: T-Central Rust Vanilla Bi-Weekly Wipe',
      'Direct connect: tcentralrust.game.nfoservers.com:28015',
      'Game: Rust',
      'Current map: Procedural Map',
      'Current players: 0 / 250',
      'Currently locked: No',
      'Wipe cadence: Bi-Weekly Wipe',
    ],
  },
];

const rustQuickStats = [
  { label: 'Server', value: 'Rust Vanilla' },
  { label: 'Wipe', value: 'Bi-Weekly' },
  { label: 'Map', value: 'Procedural Map' },
  { label: 'Capacity', value: '250 Players' },
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

        <div className="section-block" style={{ paddingBottom: 0 }}>
          <SectionTitle
            eyebrow="Rust quick view"
            title="Current Rust server snapshot."
            text="A dedicated card set for the live Rust public details you provided."
          />
          <div className="card-grid four">
            {rustQuickStats.map((item) => (
              <article key={item.label} className="content-card">
                <p className="eyebrow">{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
