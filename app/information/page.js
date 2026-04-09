import SectionTitle from '@/components/SectionTitle';

const infoBlocks = [
  {
    title: 'Community standards',
    text: 'Set expectations for fair play, respectful behavior, cheating policy, and event conduct for both communities.',
  },
  {
    title: 'Announcements and updates',
    text: 'Use this section for wipe notices, map changes, restart windows, community news, and seasonal events.',
  },
  {
    title: 'Guides and onboarding',
    text: 'Add quick-start information for Arma3 CTH and Rust Vanilla so new players can join smoothly.',
  },
  {
    title: 'Support channels',
    text: 'Point players toward Discord, moderation contact routes, and issue reporting steps without forcing account creation.',
  },
];

export default function InformationPage() {
  return (
    <section className="section-block page-top">
      <div className="container">
        <SectionTitle
          eyebrow="Information"
          title="A page built for clarity, updates, and community trust."
          text="This page can become the central place for rules, schedules, update notes, onboarding help, and community-facing information across both servers."
        />
        <div className="card-grid two">
          {infoBlocks.map((block) => (
            <article key={block.title} className="content-card">
              <h3>{block.title}</h3>
              <p className="muted">{block.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
