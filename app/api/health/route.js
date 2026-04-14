import { NextResponse } from 'next/server';
import { isPayPalConfigured } from '@/lib/paypal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    ok: true,
    uptime: 'online',
    paypalConfigured: isPayPalConfigured(),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
  });
}
