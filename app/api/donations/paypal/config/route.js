import { NextResponse } from 'next/server';
import {
  getPayPalClientId,
  getPayPalCurrency,
  getPayPalEnv,
  isPayPalConfigured,
} from '@/lib/paypal';

function errorResponse(error, status = 500) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function GET() {
  try {
    const clientId = getPayPalClientId();
    const configured = isPayPalConfigured();

    return NextResponse.json({
      ok: true,
      error: null,
      configured,
      clientId,
      currency: getPayPalCurrency(),
      env: getPayPalEnv(),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to load PayPal config');
  }
}
