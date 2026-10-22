export interface MetaTags {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  favicon?: string;
  canonical?: string;
  themeColor?: string;
  [key: string]: string | undefined;
}

/**
 * Fetch and parse meta tags from a URL.
 */
export async function fetchMetaTags(url: string): Promise<MetaTags> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'OGCOPS-Preview-Bot/1.0 (+https://og.codercops.com)',
      'Accept': 'text/html',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return parseMetaTags(html, url);
}

export function parseMetaTags(html: string, baseUrl: string): MetaTags {
  const tags: MetaTags = {};

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch) tags.title = decodeEntities(titleMatch[1].trim());

  // Extract meta tags
  const metaRegex = /<meta\s+([^>]*?)\/?>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);

    // Standard meta (name/content)
    if (attrs.name && attrs.content) {
      const name = attrs.name.toLowerCase();
      if (name === 'description') tags.description = attrs.content;
      if (name === 'theme-color') tags.themeColor = attrs.content;
      if (name === 'twitter:card') tags.twitterCard = attrs.content;
      if (name === 'twitter:title') tags.twitterTitle = attrs.content;
      if (name === 'twitter:description') tags.twitterDescription = attrs.content;
      if (name === 'twitter:image') tags.twitterImage = resolveUrl(attrs.content, baseUrl);
      if (name === 'twitter:site') tags.twitterSite = attrs.content;
      if (name === 'twitter:creator') tags.twitterCreator = attrs.content;
    }

    // Open Graph (property/content)
    if (attrs.property && attrs.content) {
      const prop = attrs.property.toLowerCase();
      if (prop === 'og:title') tags.ogTitle = attrs.content;
      if (prop === 'og:description') tags.ogDescription = attrs.content;
      if (prop === 'og:image') tags.ogImage = resolveUrl(attrs.content, baseUrl);
      if (prop === 'og:image:width') tags.ogImageWidth = attrs.content;
      if (prop === 'og:image:height') tags.ogImageHeight = attrs.content;
      if (prop === 'og:url') tags.ogUrl = attrs.content;
      if (prop === 'og:type') tags.ogType = attrs.content;
      if (prop === 'og:site_name') tags.ogSiteName = attrs.content;
    }
  }

  // Extract canonical and favicon. Attribute order varies (`rel` before or
  // after `href`), so match the tag first and read the attributes from it.
  for (const m of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = parseAttributes(m[1]);
    if (!attrs.rel) continue;
    const rel = attrs.rel.toLowerCase();

    if (rel === 'canonical' && !tags.canonical && attrs.href) {
      // Resolve like the favicon does, so a relative canonical is stored absolute.
      tags.canonical = resolveUrl(attrs.href, baseUrl);
    }
    // Exact rel match, so `apple-touch-icon` is not picked up as the favicon.
    if ((rel === 'icon' || rel === 'shortcut icon') && !tags.favicon && attrs.href) {
      tags.favicon = resolveUrl(attrs.href, baseUrl);
    }
  }

  return tags;
}

function parseAttributes(str: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /(\w[\w-]*)=(?:"([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = regex.exec(str)) !== null) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3]);
  }
  return attrs;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
};

function decodeEntities(str: string): string {
  return str.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity, body: string) => {
    if (body[0] !== '#') return NAMED_ENTITIES[body] ?? entity;
    const hex = body[1] === 'x' || body[1] === 'X';
    const code = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}
