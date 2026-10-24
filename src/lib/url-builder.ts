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
 * The query string for the editor's image URLs. Empty values are left out,
 * except a field the user cleared while its default isn't empty: that one is
 * kept as `key=`, so the API leaves it empty instead of using the default.
 */
export function buildOgQuery(
  templateId: string,
  params: Record<string, any>,
  defaults: Record<string, string | number | boolean> = {}
): string {
  const query = new URLSearchParams();
  query.set('template', templateId);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (value === '') {
      const fallback = defaults[key];
      if (fallback !== undefined && fallback !== '') query.set(key, '');
      continue;
    }
    query.set(key, String(value));
  }

  return query.toString();
}

/**
 * Build a thumbnail URL for a template.
 */
export function buildThumbnailUrl(templateId: string): string {
  return `${BASE_URL}/api/templates/${templateId}/thumbnail.png`;
}
