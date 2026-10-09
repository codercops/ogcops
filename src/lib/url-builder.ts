const BASE_URL = 'https://og.codercops.com';

/**
 * Build an OG API URL from editor state.
 */
export function buildOgUrl(params: Record<string, any>): string {
  const url = new URL('/api/og', BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Build a thumbnail URL for a template.
 */
export function buildThumbnailUrl(templateId: string): string {
  return `${BASE_URL}/api/templates/${templateId}/thumbnail.png`;
}
