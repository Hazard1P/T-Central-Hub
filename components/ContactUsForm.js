'use client';

import { useState } from 'react';

const initial = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  company: '',
};

export default function ContactUsForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState({ status: '', ok: false, reference: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ status: 'Sending transmission...', ok: false, reference: '' });

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState({ status: data?.error || 'Unable to store the message right now. Please use the direct email link.', ok: false, reference: '' });
      return;
    }

    setState({
      status: data?.message || 'Message received.',
      ok: true,
      reference: data?.reference || '',
    });
    setForm(initial);
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="donation-form-grid">
        <label className="donation-field">
          <span>Name</span>
          <input placeholder="Your name" value={form.name} onChange={(event) => update('name', event.target.value)} required maxLength={120} />
        </label>
        <label className="donation-field">
          <span>Email</span>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={(event) => update('email', event.target.value)} required maxLength={160} />
        </label>
        <label className="donation-field">
          <span>Phone</span>
          <input placeholder="Optional" value={form.phone} onChange={(event) => update('phone', event.target.value)} maxLength={40} />
        </label>
      </div>

      <label className="donation-field contact-field-wide">
        <span>Subject</span>
        <input placeholder="What can we help with?" value={form.subject} onChange={(event) => update('subject', event.target.value)} required maxLength={140} />
      </label>

      <label className="donation-field contact-field-wide honeypot-field" aria-hidden="true">
        <span>Company</span>
        <input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update('company', event.target.value)} />
      </label>

      <label className="donation-field contact-field-wide">
        <span>Message</span>
        <textarea placeholder="Tell us about your server, support request, partnership, or deployment question." value={form.message} onChange={(event) => update('message', event.target.value)} required rows={7} maxLength={2500} />
      </label>

      <div className="contact-actions">
        <button className="button primary" type="submit">Send message</button>
        <a className="button secondary" href="mailto:BrainandBodyai@gmail.com">Email directly</a>
      </div>

      {state.status ? (
        <p className={`report-status ${state.ok ? 'success' : 'error'}`}>
          {state.status} {state.reference ? <span>Reference: {state.reference}</span> : null}
        </p>
      ) : null}
    </form>
  );
}
