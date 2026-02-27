import { describe, it, expect } from 'vitest';
import { analyzeMeta } from '@/lib/meta-analyzer';
import type { MetaTags } from '@/lib/meta-fetcher';

describe('Meta Analyzer', () => {
  it('should give high score for complete meta tags', () => {
    const tags: MetaTags = {
      title: 'Example Page',
      description: 'This is a great page with useful content for developers.',
      ogTitle: 'Example Page - Site',
      ogDescription: 'This is a great page with useful content for developers.',
      ogImage: 'https://example.com/og.png',
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogUrl: 'https://example.com',
      ogType: 'website',
      ogSiteName: 'Example',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Example Page',
      twitterImage: 'https://example.com/og.png',
      canonical: 'https://example.com',
    };

    const result = analyzeMeta(tags);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.grade).toBe('A');
    expect(result.issues.length).toBeLessThanOrEqual(1);
  });

  it('should give low score for missing meta tags', () => {
    const tags: MetaTags = {};

    const result = analyzeMeta(tags);
    expect(result.score).toBeLessThan(50);
    expect(['D', 'F']).toContain(result.grade);
    expect(result.issues.length).toBeGreaterThan(3);
  });

  it('should flag missing og:image as error', () => {
    const tags: MetaTags = {
      title: 'Test',
      ogTitle: 'Test',
      description: 'A description that is long enough to not be too short.',
    };

    const result = analyzeMeta(tags);
    const ogImageIssue = result.issues.find((i) => i.tag === 'og:image');
    expect(ogImageIssue).toBeDefined();
    expect(ogImageIssue!.severity).toBe('error');
  });

  it('should warn about long titles', () => {
    const tags: MetaTags = {
      title: 'A'.repeat(80),
      ogTitle: 'A'.repeat(80),
      ogImage: 'https://example.com/og.png',
      description: 'A description that is long enough.',
      twitterCard: 'summary_large_image',
    };

    const result = analyzeMeta(tags);
    const titleIssue = result.issues.find((i) => i.tag === 'title');
    expect(titleIssue).toBeDefined();
    expect(titleIssue!.severity).toBe('warning');
  });

  it('should return grade based on score', () => {
    // Full tags = A
    const fullTags: MetaTags = {
      title: 'Test Page',
      description: 'A good description that is between 50 and 160 characters long.',
      ogTitle: 'Test Page',
      ogDescription: 'A good description',
      ogImage: 'https://example.com/og.png',
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogUrl: 'https://example.com',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Test',
      twitterImage: 'https://example.com/og.png',
      canonical: 'https://example.com',
    };

    const result = analyzeMeta(fullTags);
    expect(['A', 'B']).toContain(result.grade);
  });
});
