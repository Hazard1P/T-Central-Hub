import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/runtimeConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    ok: true,
    appUrl: getSiteUrl(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
}
