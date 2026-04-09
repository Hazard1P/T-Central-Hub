import Image from 'next/image';
import PageShell from '@/components/PageShell';

export const metadata = { title: 'Arma3 CTH' };

export default function ArmaPage() {
  return (
    <PageShell
      eyebrow="Arma3 CTH"
      title="Deploy into the tactical side of the system."
      text="This page acts as the Arma3 entry point for server identity, direct connection, and future event messaging."
    >
      <div className="info-grid two">
        <article className="content-card">
          <p className="eyebrow">Direct connect</p>
          <h3>tcentral.game.nfoservers.com:2302</h3>
          <p className="muted">Public tactical hill-control server for repeat sessions and team pressure.</p>
        </article>
        <article className="content-card">
          <Image
            src="/arma-cth-shot.png"
            alt="Arma3 Capture the Hill screenshot"
            width={1366}
            height={1024}
            className="page-image"
            priority
          />
        </article>
      </div>
    </PageShell>
  );
}
