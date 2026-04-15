import { NextResponse } from 'next/server';
import { isPayPalConfigured } from '@/lib/paypal';
import { hasStrongServerSecret } from '@/lib/security';
import { isServerPersistenceConfigured } from '@/lib/serverPersistence';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const checks = {
    paypalConfigured: isPayPalConfigured(),
    hasSessionSecret: hasStrongServerSecret(),
    serverPersistenceConfigured: isServerPersistenceConfigured(),
  };

  const warnings = [];
  if (!checks.hasSessionSecret) warnings.push('SESSION_SECRET or SUPPORT_LINK_SECRET is missing.');
  if (!checks.serverPersistenceConfigured) warnings.push('Supabase server persistence is not configured.');
  if (!checks.paypalConfigured) warnings.push('PayPal is not configured.');

  return NextResponse.json({
    ok: warnings.length === 0,
    uptime: 'online',
    checks,
    warnings,
  }, { status: warnings.length === 0 ? 200 : 503 });
}
