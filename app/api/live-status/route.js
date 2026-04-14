import { mergeStatusesWithDefaults } from '@/lib/serverData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const url = process.env.STATUS_SOURCE_URL;

  if (!url) {
    return Response.json({
      ok: true,
      mode: 'unconfigured',
      statuses: mergeStatusesWithDefaults(),
    });
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return Response.json({
        ok: false,
        mode: 'error',
        error: `Status source returned ${res.status}`,
        statuses: mergeStatusesWithDefaults(),
      });
    }

    const data = await res.json();
    const payload = data?.statuses && typeof data.statuses === 'object' ? data.statuses : {};
    return Response.json({
      ok: true,
      mode: 'remote',
      statuses: mergeStatusesWithDefaults(payload),
    });
  } catch (error) {
    return Response.json({
      ok: false,
      mode: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      statuses: mergeStatusesWithDefaults(),
    });
  }
}
