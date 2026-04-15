import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson } from '@/lib/security';
import { createPayPalOrder, getPayPalCurrency, isPayPalConfigured } from '@/lib/paypal';
import { createDonationIntent, persistDonationLedger, readDonationLedger, upsertDonationRecord } from '@/lib/donationLedger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeAmount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  if (number < 1) return null;
  if (number > 5000) return null;
  return number.toFixed(2);
}

export async function POST(request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: 'PayPal is not configured' }, { status: 503 });
  }

  const rawSteam = cookies().get('steam_session')?.value;
  let steamUser = null;
  try {
    steamUser = rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    steamUser = null;
  }

  if (!steamUser?.steamid) {
    return NextResponse.json({ error: 'Steam login required before donation' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const amount = normalizeAmount(body?.amount);
  const currency = (body?.currency || getPayPalCurrency()).toUpperCase();
  const anchorSlug = typeof body?.anchorSlug === 'string' ? body.anchorSlug.slice(0, 80) : 'deep_blackhole';
  const solarSystemKey = typeof body?.solarSystemKey === 'string' ? body.solarSystemKey.slice(0, 80) : 'solar_system';

  if (!amount) {
    return NextResponse.json({ error: 'Donation amount must be between 1 and 5000' }, { status: 400 });
  }

  try {
    const order = await createPayPalOrder({ request, amount, currency, steamUser, anchorSlug, solarSystemKey });
    const ledger = readDonationLedger();
    const intent = createDonationIntent({ steamUser, amount, currency, anchorSlug, solarSystemKey, orderId: order.id });
    const updated = upsertDonationRecord(ledger, intent);

    const response = NextResponse.json({
      ok: true,
      orderId: order.id,
      status: order.status,
      intent: {
        steamid: steamUser.steamid,
        anchorSlug,
        solarSystemKey,
        amount,
        currency,
      },
    });

    return persistDonationLedger(response, request, updated);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to create donation order' }, { status: 500 });
  }
}
