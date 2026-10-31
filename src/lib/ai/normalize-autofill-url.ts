/** Preserve HTTP(S) URLs and default bare domains to HTTPS. */
export function normalizeAutofillUrl(url: string): string {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
