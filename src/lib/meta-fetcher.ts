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
  return parseMetaTags(html, response.url || url);
}

export function parseMetaTags(html: string, baseUrl: string): MetaTags {
  const tags: MetaTags = {};
  let inFirstImageGroup = false;

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch) tags.title = decodeEntities(titleMatch[1].trim());

  // Extract meta tags
  for (const tag of findTags(html, 'meta')) {
    const attrs = parseAttributes(tag);
    if (attrs.content !== undefined) attrs.content = attrs.content.trim();

    // Every image tag starts a new group, even if its content is empty.
    // Dimensions before an image or belonging to later images are ignored.
    if (attrs.property?.toLowerCase() === 'og:image') {
      inFirstImageGroup = tags.ogImage === undefined && !!attrs.content;
    }

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
      if (prop === 'og:image' && inFirstImageGroup) tags.ogImage = resolveUrl(attrs.content, baseUrl);
      if (prop === 'og:image:width' && inFirstImageGroup) tags.ogImageWidth = attrs.content;
      if (prop === 'og:image:height' && inFirstImageGroup) tags.ogImageHeight = attrs.content;
      if (prop === 'og:url') tags.ogUrl = attrs.content;
      if (prop === 'og:type') tags.ogType = attrs.content;
      if (prop === 'og:site_name') tags.ogSiteName = attrs.content;
    }
  }

  // Extract canonical and favicon. Attribute order varies (`rel` before or
  // after `href`), so match the tag first and read the attributes from it.
  for (const tag of findTags(html, 'link')) {
    const attrs = parseAttributes(tag);
    if (!attrs.rel) continue;
    const rel = attrs.rel.toLowerCase();
    const relTokens = rel.split(/\s+/);

    if (relTokens.includes('canonical') && !tags.canonical && attrs.href) {
      // Resolve like the favicon does, so a relative canonical is stored absolute.
      tags.canonical = resolveUrl(attrs.href, baseUrl);
    }
    // Match a complete relationship token, keeping `apple-touch-icon` excluded.
    if (relTokens.includes('icon') && !tags.favicon && attrs.href) {
      tags.favicon = resolveUrl(attrs.href, baseUrl);
    }
  }

  return tags;
}

function parseAttributes(str: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let index = 0;

  while (index < str.length) {
    while (/\s/.test(str[index] ?? '')) index++;
    if (index >= str.length || str[index] === '/') break;

    const nameStart = index;
    while (index < str.length && !/[\s=/>]/.test(str[index])) index++;
    if (nameStart === index) {
      index++;
      continue;
    }

    const name = str.slice(nameStart, index).toLowerCase();
    while (/\s/.test(str[index] ?? '')) index++;

    if (str[index] !== '=') {
      attrs[name] = '';
      continue;
    }

    index++;
    while (/\s/.test(str[index] ?? '')) index++;

    let value = '';
    const quote = str[index];
    if (quote === '"' || quote === "'") {
      index++;
      const valueStart = index;
      while (index < str.length && str[index] !== quote) index++;
      value = str.slice(valueStart, index);
      if (str[index] === quote) index++;
    } else {
      const valueStart = index;
      while (index < str.length && !/[\s>]/.test(str[index])) index++;
      value = str.slice(valueStart, index);
    }

    attrs[name] = decodeEntities(value);
  }

  return attrs;
}

function findTags(html: string, tagName: 'meta' | 'link'): string[] {
  const tags: string[] = [];
  const startPattern = new RegExp(`<${tagName}\\b`, 'gi');
  let match;

  while ((match = startPattern.exec(html)) !== null) {
    let quote: '"' | "'" | undefined;
    let end = match.index + match[0].length;

    for (; end < html.length; end++) {
      const char = html[end];
      if (quote) {
        if (char === quote) quote = undefined;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '>') {
        tags.push(html.slice(match.index + match[0].length, end));
        startPattern.lastIndex = end + 1;
        break;
      }
    }

    if (end === html.length) break;
  }

  return tags;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  AMP: '&',
  LT: '<',
  GT: '>',
  QUOT: '"',
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
