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

function parseMetaTags(html: string, baseUrl: string): MetaTags {
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

  // Extract canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (canonicalMatch) tags.canonical = canonicalMatch[1];

  // Extract favicon
  const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i);
  if (faviconMatch) tags.favicon = resolveUrl(faviconMatch[1], baseUrl);

  return tags;
}

function parseAttributes(str: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /(\w[\w-]*)=["']([^"']*?)["']/gi;
  let m;
  while ((m = regex.exec(str)) !== null) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2]);
  }
  return attrs;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}
