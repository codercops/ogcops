import { describe, it, expect } from 'vitest';
import { PLATFORMS, resolvePlatformPreviews } from '@/lib/platform-specs';
import type { MetaTags } from '@/lib/meta-fetcher';

describe('resolvePlatformPreviews', () => {
  it('returns one preview per platform, in PLATFORMS order', () => {
    const previews = resolvePlatformPreviews({}, 'https://example.com');
    expect(previews).toHaveLength(8);
    expect(previews.map((p) => p.platform)).toEqual(PLATFORMS.map((p) => p.id));
  });

  it('prefers twitter:* tags for Twitter', () => {
    const tags: MetaTags = {
      ogTitle: 'OG Title',
      ogDescription: 'OG Description',
      twitterTitle: 'Twitter Title',
      twitterDescription: 'Twitter Description',
      twitterImage: 'https://example.com/twitter.png',
      ogImage: 'https://example.com/og.png',
    };

    const twitter = resolvePlatformPreviews(tags, 'https://example.com').find(
      (p) => p.platform === 'twitter'
    )!;
    expect(twitter.title).toBe('Twitter Title');
    expect(twitter.description).toBe('Twitter Description');
    expect(twitter.imageUrl).toBe('https://example.com/twitter.png');
  });

  it('prefers <title> and meta description for Google', () => {
    const tags: MetaTags = {
      title: 'Page Title',
      description: 'Page Description',
      ogTitle: 'OG Title',
      ogDescription: 'OG Description',
    };

    const google = resolvePlatformPreviews(tags, 'https://example.com').find(
      (p) => p.platform === 'google'
    )!;
    expect(google.title).toBe('Page Title');
    expect(google.description).toBe('Page Description');
    expect(google.cardType).toBe('search');
  });

  it('gives Reddit an empty description', () => {
    const tags: MetaTags = { ogDescription: 'Something' };
    const reddit = resolvePlatformPreviews(tags, 'https://example.com').find(
      (p) => p.platform === 'reddit'
    )!;
    expect(reddit.description).toBe('');
  });

  it('cuts titles to each platform max length', () => {
    const longTitle = 'A'.repeat(500);
    const tags: MetaTags = { ogTitle: longTitle };
    const previews = resolvePlatformPreviews(tags, 'https://example.com');

    for (const preview of previews) {
      const spec = PLATFORMS.find((p) => p.id === preview.platform)!;
      expect(preview.title.length).toBeLessThanOrEqual(spec.maxTitleLength);
    }
  });

  it('falls back to the hostname without www. when ogSiteName is absent', () => {
    const previews = resolvePlatformPreviews({}, 'https://www.example.com/page');
    expect(previews[0].siteName).toBe('example.com');
  });

  it('uses ogSiteName when present', () => {
    const tags: MetaTags = { ogSiteName: 'My Site' };
    const previews = resolvePlatformPreviews(tags, 'https://example.com');
    expect(previews[0].siteName).toBe('My Site');
  });

  it('returns null imageUrl when there is no og:image', () => {
    const previews = resolvePlatformPreviews({}, 'https://example.com');
    expect(previews[0].imageUrl).toBeNull();
  });
});
