import PageShell from '@/components/PageShell';
import ContactUsForm from '@/components/ContactUsForm';

export const metadata = {
  title: 'Contact | T-Central Hub',
  description: 'Contact T-Central for support, partnerships, and development inquiries.',
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact T-Central"
      title="Direct support, partnerships, and system inquiries."
      text="Use the contact route for support, server inquiries, development discussion, deployment help, and business communication. Messages can be stored in the configured backend when available and always return a reference code for follow-up. The contact card below stays public while the form is kept blank for visitors."
    >
      <div className="arma-entry-grid">
        <article className="content-card">
          <p className="eyebrow">Primary contact</p>
          <h3>Michael Rybaltowicz</h3>
          <div className="system-news-list">
            <a className="system-news-link" href="mailto:BrainandBodyai@gmail.com">
              <span>Email</span>
              <small>BrainandBodyai@gmail.com</small>
            </a>
            <a className="system-news-link" href="tel:16048309324">
              <span>Phone</span>
              <small>+1 (604) 830-9324</small>
            </a>
          </div>
          <div className="donate-note-box compact-note-box">
            <strong>Best use cases</strong>
            <p>Partnerships, deployment support, server onboarding, moderation escalation, and technical planning.</p>
          </div>
        </article>

        <article className="content-card">
          <p className="eyebrow">Interactive contact form</p>
          <h3>Send a message into the system</h3>
          <ContactUsForm />
        </article>
      </div>
    </PageShell>
  );
}
