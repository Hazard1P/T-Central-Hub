import { createClient } from '@supabase/supabase-js';

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

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
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

  const supabase = getAdminClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('contact_messages').insert(payload);
      if (error) {
        return json({ ok: true, message: 'Message received. Database storage was skipped, but the reference is valid.', reference, warning: error.message });
      }
      return json({ ok: true, message: 'Message received and stored successfully.', reference });
    } catch {
      return json({ ok: true, message: 'Message received. Storage fallback engaged.', reference });
    }
  }

  return json({ ok: true, message: 'Message received. Backend storage is not configured yet, so keep the reference for manual follow-up.', reference });
}
