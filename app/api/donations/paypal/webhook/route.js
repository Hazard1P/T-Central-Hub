import { NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '@/lib/paypal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  const bodyText = await request.text();

  try {
    const verified = await verifyPayPalWebhook({ request, bodyText });
    if (!verified) {
      return NextResponse.json({ ok: false, error: 'Webhook verification failed' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    return NextResponse.json({ ok: true, eventType: event?.event_type || null });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message || 'Webhook handling failed' }, { status: 500 });
  }
}
