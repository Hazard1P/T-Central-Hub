import { insertRecord, isServerPersistenceConfigured } from '@/lib/serverPersistence';

export const dynamic = 'force-dynamic';

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init,
  });
}

function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

function referenceCode() {
  return `TC-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const subject = clean(body.subject, 140);
  const message = clean(body.message, 2500);
  const company = clean(body.company, 60);

  if (company) {
    return json({ ok: true, message: 'Message received.', reference: referenceCode() });
  }

  if (!name || !email || !subject || !message) {
    return json({ error: 'Name, email, subject, and message are required.' }, { status: 400 });
  }

  if (!isServerPersistenceConfigured()) {
    return json({
      error: 'Contact storage is not configured yet. Please use the direct email link until backend persistence is enabled.',
    }, { status: 503 });
  }

  const reference = referenceCode();
  const payload = {
    reference,
    name,
    email,
    phone,
    subject,
    message,
    created_at: new Date().toISOString(),
    source: 't-central-contact-form',
  };

  try {
    await insertRecord('contact_messages', payload);
    return json({ ok: true, message: 'Message received and stored successfully.', reference });
  } catch (error) {
    return json({
      error: error.message || 'Unable to store the message right now. Please use the direct email link.',
    }, { status: 503 });
  }
}
