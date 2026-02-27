/**
 * Generate HTML meta tag snippets for an OG image.
 */
export function generateMetaTagsHtml(params: {
  title: string;
  description?: string;
  imageUrl: string;
  siteName?: string;
  url?: string;
}): string {
  const lines: string[] = [];

  lines.push(`<meta property="og:title" content="${escape(params.title)}" />`);
  if (params.description) {
    lines.push(`<meta property="og:description" content="${escape(params.description)}" />`);
  }
  lines.push(`<meta property="og:image" content="${escape(params.imageUrl)}" />`);
  lines.push(`<meta property="og:image:width" content="1200" />`);
  lines.push(`<meta property="og:image:height" content="630" />`);
  if (params.siteName) {
    lines.push(`<meta property="og:site_name" content="${escape(params.siteName)}" />`);
  }
  if (params.url) {
    lines.push(`<meta property="og:url" content="${escape(params.url)}" />`);
  }

  lines.push('');
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`<meta name="twitter:title" content="${escape(params.title)}" />`);
  lines.push(`<meta name="twitter:image" content="${escape(params.imageUrl)}" />`);
  if (params.description) {
    lines.push(`<meta name="twitter:description" content="${escape(params.description)}" />`);
  }

  return lines.join('\n');
}

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
