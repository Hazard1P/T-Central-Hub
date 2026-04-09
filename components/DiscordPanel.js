export default function DiscordPanel() {
  return (
    <section className="section-block">
      <div className="container">
        <div className="discord-panel">
          <div>
            <p className="eyebrow">Community hub</p>
            <h3>Join the Discord for updates, support, squads, and server news.</h3>
            <p className="muted">
              Keep both communities connected through one shared invite, with room for announcements,
              support flow, and event coordination.
            </p>
          </div>
          <div className="button-column">
            <a href="https://discord.gg/8bJAEau9" target="_blank" rel="noreferrer" className="button primary">Join Discord</a>
            <a href="/information" className="button secondary">Open Information</a>
          </div>
        </div>
      </div>
    </section>
  );
}
