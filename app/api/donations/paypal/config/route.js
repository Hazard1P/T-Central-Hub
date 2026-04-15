import { NextResponse } from 'next/server';
import { getPayPalClientId, getPayPalCurrency, getPayPalEnv, isPayPalConfigured } from '@/lib/paypal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: isPayPalConfigured(),
    clientId: getPayPalClientId(),
    currency: getPayPalCurrency(),
    env: getPayPalEnv(),
  });
}
