import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { capturePayPalOrder, isPayPalConfigured } from '@/lib/paypal';
import {
  persistDonationLedger,
  readDonationLedger,
  summarizeDonationLedger,
  upsertDonationRecord,
} from '@/lib/donationLedger';
import { decryptJson } from '@/lib/security';

function errorResponse(error, status) {
  return NextResponse.json({ ok: false, error }, { status });
}

function readSteamUser() {
  const rawSteam = cookies().get('steam_session')?.value;
  try {
    return rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    return null;
  }
}

function extractCaptureDetails(order) {
  const purchaseUnit = order?.purchase_units?.[0];
  const capture = purchaseUnit?.payments?.captures?.[0];

  return {
    captureId: capture?.id || null,
    status: capture?.status || order?.status || null,
    amount: capture?.amount?.value || purchaseUnit?.amount?.value || null,
    currency: capture?.amount?.currency_code || purchaseUnit?.amount?.currency_code || null,
  };
}

export async function POST(request) {
  const steamUser = readSteamUser();
  if (!steamUser?.steamid) {
    return errorResponse('Steam login required before capturing a donation order', 401);
  }

  if (!isPayPalConfigured()) {
    return errorResponse('PayPal is not configured', 503);
  }

  const body = await request.json().catch(() => null);
  const orderId = String(body?.orderId || '').trim();

  if (!orderId) {
    return errorResponse('Missing PayPal orderId', 400);
  }

  try {
    const captureOrder = await capturePayPalOrder(orderId);
    const captureDetails = extractCaptureDetails(captureOrder);

    const ledger = readDonationLedger();
    const nextLedger = upsertDonationRecord(ledger, {
      orderId,
      steamid: steamUser.steamid,
      personaname: steamUser.personaname || null,
      captureId: captureDetails.captureId,
      amount: captureDetails.amount,
      currency: captureDetails.currency,
      status: 'CONFIRMED',
      provider: 'paypal',
      captureRaw: captureOrder,
      confirmedAt: new Date().toISOString(),
    });

    const response = NextResponse.json({
      ok: true,
      error: null,
      orderId,
      capture: {
        id: captureDetails.captureId,
        status: captureDetails.status,
        amount: captureDetails.amount,
        currency: captureDetails.currency,
      },
      ledger: summarizeDonationLedger(nextLedger),
    });

    return persistDonationLedger(response, request, nextLedger);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to capture PayPal order', 502);
  }
}
