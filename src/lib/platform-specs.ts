import type { MetaTags } from './meta-fetcher';

export interface PlatformPreview {
  platform: string;
  name: string;
  imageUrl: string | null;
  title: string;
  description: string;
  siteName: string;
  imageSize: { width: number; height: number };
  cardType: string;
}

export type PlatformId =
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'discord'
  | 'slack'
  | 'reddit'
  | 'whatsapp'
  | 'google';

export interface PlatformSpec {
  id: PlatformId;
  name: string;
  imageSize: { width: number; height: number };
  maxTitleLength: number;
  maxDescLength: number;
}

export const PLATFORMS: PlatformSpec[] = [
  { id: 'twitter', name: 'Twitter / X', imageSize: { width: 1200, height: 628 }, maxTitleLength: 70, maxDescLength: 200 },
  { id: 'facebook', name: 'Facebook', imageSize: { width: 1200, height: 630 }, maxTitleLength: 65, maxDescLength: 155 },
  { id: 'linkedin', name: 'LinkedIn', imageSize: { width: 1200, height: 627 }, maxTitleLength: 70, maxDescLength: 150 },
  { id: 'discord', name: 'Discord', imageSize: { width: 1200, height: 630 }, maxTitleLength: 256, maxDescLength: 350 },
  { id: 'slack', name: 'Slack', imageSize: { width: 1200, height: 630 }, maxTitleLength: 100, maxDescLength: 300 },
  { id: 'reddit', name: 'Reddit', imageSize: { width: 1200, height: 630 }, maxTitleLength: 300, maxDescLength: 0 },
  { id: 'whatsapp', name: 'WhatsApp', imageSize: { width: 1200, height: 630 }, maxTitleLength: 65, maxDescLength: 155 },
  { id: 'google', name: 'Google Search', imageSize: { width: 1200, height: 630 }, maxTitleLength: 60, maxDescLength: 160 },
];

/**
 * Resolve what each platform would display for the given meta tags.
 */
export function resolvePlatformPreviews(tags: MetaTags, url: string): PlatformPreview[] {
  const ogTitle = tags.ogTitle || tags.title || '';
  const ogDesc = tags.ogDescription || tags.description || '';
  const ogImage = tags.ogImage || null;
  const siteName = tags.ogSiteName || extractDomain(url);

  return PLATFORMS.map((spec) => {
    let title = ogTitle;
    let description = ogDesc;
    let imageUrl = ogImage;
    let cardType = 'large';

    switch (spec.id) {
      case 'twitter':
        title = tags.twitterTitle || ogTitle;
        description = tags.twitterDescription || ogDesc;
        imageUrl = tags.twitterImage || ogImage;
        cardType = tags.twitterCard || 'summary_large_image';
        break;
      case 'google':
        title = tags.title || ogTitle;
        description = tags.description || ogDesc;
        cardType = 'search';
        break;
      default:
        break;
    }

    return {
      platform: spec.id,
      name: spec.name,
      imageUrl,
      title: title.slice(0, spec.maxTitleLength),
      description: spec.maxDescLength > 0 ? description.slice(0, spec.maxDescLength) : '',
      siteName,
      imageSize: spec.imageSize,
      cardType,
    };
  });
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
