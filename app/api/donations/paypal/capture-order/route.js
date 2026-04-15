import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decryptJson, encryptJson, signValue } from '@/lib/security';
import { shouldUseSecureCookies } from '@/lib/runtimeConfig';
import { capturePayPalOrder } from '@/lib/paypal';
import { insertRecord, isServerPersistenceConfigured } from '@/lib/serverPersistence';
import { persistDonationLedger, readDonationLedger, summarizeDonationLedger, upsertDonationRecord } from '@/lib/donationLedger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  const rawSteam = cookies().get('steam_session')?.value;
  let steamUser = null;
  try {
    steamUser = rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    steamUser = null;
  }

  if (!steamUser?.steamid) {
    return NextResponse.json({ error: 'Steam login required before capture' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = body?.orderId;
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  try {
    const capture = await capturePayPalOrder(orderId);
    const purchaseUnit = capture?.purchase_units?.[0] || {};
    const payment = purchaseUnit?.payments?.captures?.[0] || null;
    const ledger = readDonationLedger();
    const existing = ledger.find((entry) => entry.orderId === orderId) || {};
    const record = {
      ...existing,
      orderId,
      steamid: steamUser.steamid,
      personaname: steamUser.personaname || null,
      amount: payment?.amount?.value || existing.amount || null,
      currency: payment?.amount?.currency_code || existing.currency || null,
      status: capture.status === 'COMPLETED' ? 'CONFIRMED' : 'CAPTURED',
      captureId: payment?.id || null,
      anchorSlug: existing.anchorSlug || 'deep_blackhole',
      solarSystemKey: existing.solarSystemKey || 'solar_system',
      confirmedAt: payment?.create_time || null,
      payer: capture?.payer?.email_address || null,
      receiptRef: signValue(`${steamUser.steamid}:${orderId}:${payment?.id || 'pending'}`),
    };
    const updated = upsertDonationRecord(ledger, record);

    if (isServerPersistenceConfigured()) {
      try {
        await insertRecord('donation_receipts', {
          reference: record.receiptRef,
          provider: 'paypal',
          order_id: orderId,
          capture_id: record.captureId,
          steamid: record.steamid,
          personaname: record.personaname,
          amount: record.amount,
          currency: record.currency,
          status: record.status,
          anchor_slug: record.anchorSlug,
          solar_system_key: record.solarSystemKey,
          payer: record.payer,
          confirmed_at: record.confirmedAt || new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      } catch {}
    }

    const response = NextResponse.json({
      ok: true,
      capture: {
        orderId,
        captureId: record.captureId,
        status: record.status,
        amount: record.amount,
        currency: record.currency,
        receiptRef: record.receiptRef,
      },
      ledger: summarizeDonationLedger(updated),
    });

    response.cookies.set({
      name: 'support_receipt',
      value: encryptJson({
        provider: 'paypal',
        orderId,
        captureId: record.captureId,
        steamid: steamUser.steamid,
        personaname: steamUser.personaname || null,
        linkedAt: record.confirmedAt || new Date().toISOString(),
        reference: record.receiptRef,
        amount: record.amount,
        currency: record.currency,
        anchorSlug: record.anchorSlug,
        solarSystemKey: record.solarSystemKey,
      }),
      httpOnly: true,
      secure: shouldUseSecureCookies(request),
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    });

    return persistDonationLedger(response, request, updated);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to capture order' }, { status: 500 });
  }
}
