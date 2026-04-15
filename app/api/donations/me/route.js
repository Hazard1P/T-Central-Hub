import { NextResponse } from 'next/server';
import { readDonationLedger, summarizeDonationLedger } from '@/lib/donationLedger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const ledger = readDonationLedger();
  return NextResponse.json({ ok: true, summary: summarizeDonationLedger(ledger), donations: ledger });
}
