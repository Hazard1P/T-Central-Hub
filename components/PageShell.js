import Link from 'next/link';

export default function PageShell({ eyebrow, title, text, children }) {
  return (
    <main className="content-page">
      <div className="content-backdrop" />
      <div className="content-bubbles">
        <Link href="/" className="bubble-link">Return to Hub</Link>
        <Link href="/about" className="bubble-link">About</Link>
        <Link href="/contact" className="bubble-link">Contact</Link>
        <Link href="/donate" className="bubble-link">Donate</Link>
        <Link href="/report-player" className="bubble-link">Report</Link>
      </div>

      <section className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{text}</p>
      </section>

      <section className="page-section">{children}</section>
    </main>
  );
}
