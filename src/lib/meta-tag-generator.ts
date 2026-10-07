/**
 * Generate HTML meta tag snippets for an OG image.
 * Attribute values are escaped so titles like `The "best" guide` stay valid HTML.
 */

export function escapeMetaContent(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function generateMetaTags(params: {
  title?: string;
  description?: string;
  imageUrl: string;
  siteName?: string;
  url?: string;
}): string {
  const title = params.title?.trim() ?? '';
  const lines: string[] = [];

  if (title) {
    lines.push(`<meta property="og:title" content="${escapeMetaContent(title)}" />`);
  }

  lines.push(`<meta property="og:image" content="${escapeMetaContent(params.imageUrl)}" />`);
  lines.push(`<meta property="og:image:width" content="1200" />`);
  lines.push(`<meta property="og:image:height" content="630" />`);

  if (params.description) {
    lines.push(
      `<meta property="og:description" content="${escapeMetaContent(params.description)}" />`,
    );
  }
  if (params.siteName) {
    lines.push(
      `<meta property="og:site_name" content="${escapeMetaContent(params.siteName)}" />`,
    );
  }
  if (params.url) {
    lines.push(`<meta property="og:url" content="${escapeMetaContent(params.url)}" />`);
  }

  lines.push('');
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  if (title) {
    lines.push(`<meta name="twitter:title" content="${escapeMetaContent(title)}" />`);
  }
  lines.push(`<meta name="twitter:image" content="${escapeMetaContent(params.imageUrl)}" />`);
  if (params.description) {
    lines.push(
      `<meta name="twitter:description" content="${escapeMetaContent(params.description)}" />`,
    );
  }

  return lines.join('\n');
}
