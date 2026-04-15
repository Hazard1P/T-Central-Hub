import { NextResponse } from 'next/server';
import { signValue } from '@/lib/security';

function createReference(email) {
  return `CT-${signValue(`${email}:${Date.now()}`).slice(0, 10).toUpperCase()}`;
}

export async function POST(request) {
  const contactEnabled = process.env.CONTACT_FORM_ENABLED === 'true';

  if (!contactEnabled) {
    return NextResponse.json({
      ok: false,
      unavailable: true,
      code: 'CONTACT_FORM_DISABLED',
      error: 'Contact form delivery is currently disabled. Please use direct email instead.',
      directEmail: 'BrainandBodyai@gmail.com',
    }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim();
  const subject = String(body?.subject || '').trim();
  const message = String(body?.message || '').trim();
  const phone = String(body?.phone || '').trim();
  const company = String(body?.company || '').trim();

  if (company) {
    return NextResponse.json({ ok: true, message: 'Message received.', reference: createReference(email || 'honeypot') });
  }

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Name, email, subject, and message are required.' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Message received. We will follow up through email.',
    reference: createReference(email),
    contact: {
      name,
      email,
      subject,
      phone: phone || null,
      receivedAt: new Date().toISOString(),
    },
  });
}
