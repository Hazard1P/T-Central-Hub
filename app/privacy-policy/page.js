
export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <h1>Privacy Policy</h1>

      <p>
        This platform enforces strict per-user isolation using Steam-linked identity and NDSP (Synaptics Systems protocol).
      </p>

      <h2>Data Isolation</h2>
      <p>
        Each user is assigned a discrete namespace, build anchor, and ledger scope. No cross-user data exposure occurs between single-player or multiplayer instances.
      </p>

      <h2>Steam Integration</h2>
      <p>
        Steam identifiers are used only for authentication and routing. No unauthorized sharing or exposure of Steam data occurs.
      </p>

      <h2>NDSP Protocol</h2>
      <p>
        NDSP ensures each player remains isolated across all instances, enforcing privacy boundaries and preventing data crossover.
      </p>

      <h2>Compliance</h2>
      <p>
        This system is designed to align with global privacy standards and Steam platform requirements.
      </p>
    </main>
  );
}
