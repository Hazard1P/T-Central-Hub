import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  createPayPalOrder,
  getPayPalCurrency,
  isPayPalConfigured,
} from '@/lib/paypal';
import {
  createDonationIntent,
  persistDonationLedger,
  readDonationLedger,
  upsertDonationRecord,
} from '@/lib/donationLedger';
import { decryptJson } from '@/lib/security';

function errorResponse(error, status) {
  return NextResponse.json({ ok: false, error }, { status });
}

function parseDonationAmount(rawAmount) {
  const normalized = typeof rawAmount === 'number' ? rawAmount.toString() : String(rawAmount || '').trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount.toFixed(2);
}

function readSteamUser() {
  const rawSteam = cookies().get('steam_session')?.value;
  try {
    return rawSteam ? decryptJson(rawSteam) : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  const steamUser = readSteamUser();
  if (!steamUser?.steamid) {
    return errorResponse('Steam login required before creating a donation order', 401);
  }

  if (!isPayPalConfigured()) {
    return errorResponse('PayPal is not configured', 503);
  }

  const body = await request.json().catch(() => null);
  const amount = parseDonationAmount(body?.amount);
  if (!amount) {
    return errorResponse('Amount must be a positive decimal with up to 2 places', 400);
  }

  const currency = String(body?.currency || getPayPalCurrency()).toUpperCase();
  const anchorSlug = body?.anchorSlug || 'deep_blackhole';
  const solarSystemKey = body?.solarSystemKey || 'solar_system';

  try {
    const order = await createPayPalOrder({
      request,
      amount,
      currency,
      steamUser,
      anchorSlug,
      solarSystemKey,
    });

    if (!order?.id) {
      return errorResponse('PayPal did not return an order ID', 502);
    }

    const ledger = readDonationLedger();
    const intent = createDonationIntent({
      steamUser,
      amount,
      currency,
      anchorSlug,
      solarSystemKey,
      orderId: order.id,
    });
    const nextLedger = upsertDonationRecord(ledger, intent);

    const response = NextResponse.json({
      ok: true,
      error: null,
      orderId: order.id,
    });

    return persistDonationLedger(response, request, nextLedger);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to create PayPal order', 502);
  }
}
