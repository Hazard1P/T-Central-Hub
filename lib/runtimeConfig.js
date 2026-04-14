export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw.replace(/\/$/, '');
  return `https://${raw.replace(/\/$/, '')}`;
}

export function getRequestBaseUrl(request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, '');

  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const proto = forwardedProto || (host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export function shouldUseSecureCookies(request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL || '';
  if (configured.startsWith('https://')) return true;
  if (configured.startsWith('http://localhost') || configured.startsWith('http://127.0.0.1')) return false;

  const host = request?.headers.get('x-forwarded-host') || request?.headers.get('host') || '';
  if (host.includes('localhost') || host.startsWith('127.0.0.1')) return false;

  const proto = request?.headers.get('x-forwarded-proto');
  if (proto) return proto === 'https';
  return process.env.NODE_ENV === 'production';
}
