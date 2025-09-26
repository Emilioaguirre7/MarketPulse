/**
 * Server-side helper to build absolute API URLs
 *
 * Logic:
 * - If WEB_ORIGIN exists, use that
 * - Else if VERCEL_URL exists, use https://${VERCEL_URL}
 * - Else fallback to http://localhost:3000 for dev
 */
export function getApiBaseUrl(): string {
  if (process.env.WEB_ORIGIN) {
    return process.env.WEB_ORIGIN;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export function apiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${path}`;
}