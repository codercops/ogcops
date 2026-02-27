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

/**
 * Generate HTML meta tags for an OG image.
 */
export function generateMetaTags(params: {
  title: string;
  description?: string;
  imageUrl: string;
  siteName?: string;
  url?: string;
}): string {
  const lines: string[] = [
    `<meta property="og:title" content="${escapeHtml(params.title)}" />`,
    `<meta property="og:image" content="${escapeHtml(params.imageUrl)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
  ];

  if (params.description) {
    lines.push(`<meta property="og:description" content="${escapeHtml(params.description)}" />`);
  }
  if (params.siteName) {
    lines.push(`<meta property="og:site_name" content="${escapeHtml(params.siteName)}" />`);
  }
  if (params.url) {
    lines.push(`<meta property="og:url" content="${escapeHtml(params.url)}" />`);
  }

  lines.push('');
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`<meta name="twitter:title" content="${escapeHtml(params.title)}" />`);
  lines.push(`<meta name="twitter:image" content="${escapeHtml(params.imageUrl)}" />`);
  if (params.description) {
    lines.push(`<meta name="twitter:description" content="${escapeHtml(params.description)}" />`);
  }

  return lines.join('\n');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
