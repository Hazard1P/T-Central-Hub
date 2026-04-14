import { STATUS_DEFAULTS } from '@/lib/serverData';

export async function GET() {
  const url = process.env.STATUS_SOURCE_URL;

  if (!url) {
    return Response.json({
      ok: true,
      mode: 'unconfigured',
      statuses: STATUS_DEFAULTS,
    });
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return Response.json({
        ok: false,
        mode: 'error',
        error: `Status source returned ${res.status}`,
        statuses: STATUS_DEFAULTS,
      });
    }

    const data = await res.json();
    return Response.json({
      ok: true,
      mode: 'remote',
      statuses: {
        ...STATUS_DEFAULTS,
        ...(data.statuses || {}),
      },
    });
  } catch (error) {
    return Response.json({
      ok: false,
      mode: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      statuses: STATUS_DEFAULTS,
    });
  }
}
