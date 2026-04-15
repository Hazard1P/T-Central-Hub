import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { readDonationLedger, summarizeDonationLedger } from '@/lib/donationLedger';
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

export async function GET() {
  const steamUser = readSteamUser();
  if (!steamUser?.steamid) {
    return errorResponse('Steam login required to view donation summary', 401);
  }

  const ledger = readDonationLedger();
  const ownLedger = ledger.filter((entry) => entry.steamid === steamUser.steamid);

  return NextResponse.json({
    ok: true,
    error: null,
    steamid: steamUser.steamid,
    summary: summarizeDonationLedger(ownLedger),
  });
}
