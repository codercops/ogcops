import { describe, it, expect } from 'vitest';
import { analyzeMeta } from '@/lib/meta-analyzer';
import type { MetaTags } from '@/lib/meta-fetcher';
import { parseMetaTags } from '@/lib/meta-fetcher';

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

describe('analyzeMeta', () => {
  const full: MetaTags = {
    title: 'Example Page',
    description: 'This is a great page with useful content for developers.',
    ogTitle: 'Example Page - Site',
    ogDescription: 'This is a great page with useful content for developers.',
    ogImage: 'https://example.com/og.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogUrl: 'https://example.com',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Example Page',
    twitterImage: 'https://example.com/og.png',
    canonical: 'https://example.com',
  };
  const longTitle = 'A'.repeat(80);
  const longDescription = 'A'.repeat(170);

  it.each([
    ['abc', '630'], ['1200', '-100'], ['0', '630'], ['1200', '0'],
    ['12.5', '630'], ['1200', '630.5'], ['Infinity', '630'], ['1200', 'NaN'],
    ['1200px', '630'], [' ', '630'],
  ])('warns about invalid image dimensions %s x %s', (ogImageWidth, ogImageHeight) => {
    const result = analyzeMeta({ ...full, ogImageWidth, ogImageHeight });
    expect(result.issues).toEqual([
      { severity: 'warning', tag: 'og:image:width/height', message: 'Image dimensions must be positive whole numbers' },
    ]);
    expect(result.score).toBe(97);
  });

  it.each([['1200', '630'], ['1', '1']])('accepts positive whole image dimensions %s x %s', (ogImageWidth, ogImageHeight) => {
    const result = analyzeMeta({ ...full, ogImageWidth, ogImageHeight });
    expect(result.issues).toEqual([]);
    expect(result.score).toBe(100);
  });

  it.each([[undefined, '630'], ['1200', undefined], ['', '630'], [undefined, undefined]])('retains the missing-dimensions message for %s x %s', (ogImageWidth, ogImageHeight) => {
    const result = analyzeMeta({ ...full, ogImageWidth, ogImageHeight });
    expect(result.issues).toEqual([
      { severity: 'info', tag: 'og:image:width/height', message: 'Image dimensions not specified — platforms may crop unexpectedly' },
    ]);
    expect(result.score).toBe(97);
  });

  it('does not validate dimensions when og:image is missing', () => {
    const result = analyzeMeta({ ...full, ogImage: undefined, ogImageWidth: 'abc', ogImageHeight: '-100' });
    expect(result.issues.some((issue) => issue.tag === 'og:image:width/height')).toBe(false);
    expect(result.issues).toContainEqual(expect.objectContaining({ tag: 'og:image', severity: 'error' }));
  });

  it.each([
    '/articles/example', './article', '//example.com/article', 'example.com',
    'ftp://example.com', 'javascript:alert(1)', 'https://', 'https://exa mple.com',
    'https:example.com',
  ])('warns when og:url is not an absolute HTTP(S) URL: %s', (ogUrl) => {
    const tags = { ...full, ogUrl };
    const result = analyzeMeta(tags);

    expect(result.issues).toEqual([
      { severity: 'warning', tag: 'og:url', message: 'og:url must be an absolute HTTP or HTTPS URL' },
    ]);
    expect(result.score).toBe(98);
    expect(tags.ogUrl).toBe(ogUrl);
  });

  it.each(['https://example.com/article?x=1#top', 'http://example.com', 'HTTPS://example.com', 'HTTP://example.com'])('accepts absolute og:url %s', (ogUrl) => {
    expect(analyzeMeta({ ...full, ogUrl }).issues).toEqual([]);
  });

  it.each([undefined, ''])('retains the existing missing og:url issue for %s', (ogUrl) => {
    const result = analyzeMeta({ ...full, ogUrl });
    expect(result.issues).toEqual([
      { severity: 'info', tag: 'og:url', message: 'Missing og:url tag' },
    ]);
    expect(result.score).toBe(98);
  });

  it('preserves a parsed relative og:url and warns about it', () => {
    const parsed = parseMetaTags('<meta property="og:url" content="/articles/example">', 'https://example.com/blog');
    expect(parsed.ogUrl).toBe('/articles/example');
    expect(analyzeMeta({ ...full, ...parsed }).issues).toEqual([
      { severity: 'warning', tag: 'og:url', message: 'og:url must be an absolute HTTP or HTTPS URL' },
    ]);
  });

  it('warns and deducts five points for an overlong og:title without an HTML title', () => {
    const result = analyzeMeta({ ...full, title: undefined, ogTitle: longTitle });

    expect(result.issues).toEqual([
      { severity: 'warning', tag: 'title', message: 'Title is 80 chars (recommended: under 70)' },
    ]);
    expect(result.score).toBe(95);
  });

  it('accepts an og:title at the 70-character limit without an HTML title', () => {
    const result = analyzeMeta({ ...full, title: undefined, ogTitle: 'A'.repeat(70) });

    expect(result.issues).toEqual([]);
    expect(result.score).toBe(100);
  });

  it('prefers the HTML title when both title sources are present', () => {
    const result = analyzeMeta({ ...full, ogTitle: longTitle });

    expect(result.issues).toEqual([]);
    expect(result.score).toBe(100);
  });

  it.each([
    [90, 'A', { ogUrl: undefined, ogImageWidth: undefined, ogDescription: undefined }],
    [89, 'B', { ogImageWidth: undefined, twitterCard: undefined }],
    [75, 'B', { twitterCard: undefined, title: longTitle, description: 'Too short', ogDescription: undefined, ogUrl: undefined }],
    [74, 'C', { twitterCard: undefined, title: longTitle, description: 'Too short', ogDescription: undefined, ogImageWidth: undefined }],
    [60, 'C', { ogTitle: undefined, twitterCard: undefined, title: longTitle, description: 'Too short', ogDescription: undefined, ogUrl: undefined, ogType: undefined, ogImageWidth: undefined }],
    [59, 'D', { ogImage: undefined, twitterCard: undefined, title: longTitle, description: longDescription, ogDescription: undefined }],
    [40, 'D', { title: undefined, ogTitle: undefined, ogImage: undefined, twitterCard: undefined, ogUrl: undefined }],
    [39, 'F', { title: undefined, ogTitle: undefined, ogImage: undefined, twitterCard: undefined, description: longDescription }],
  ])('gives score %i grade %s', (score, grade, overrides) => {
    const result = analyzeMeta({ ...full, ...overrides });
    expect(result.score).toBe(score);
    expect(result.grade).toBe(grade);
  });

  it.each([
    ['A', {}, 'Excellent! Your meta tags are well-configured.'],
    ['B', { ogImageWidth: undefined, twitterCard: undefined }, 'Good setup with minor improvements possible.'],
    ['C with no errors', { title: longTitle, description: 'Too short', ogDescription: undefined, ogImageWidth: undefined, twitterCard: undefined }, 'Decent, a few warnings to fix.'],
    ['C with one error', { ogTitle: undefined, twitterCard: undefined, title: longTitle, description: 'Too short' }, 'Decent, but 1 critical issue found.'],
    ['C with two errors', { ogTitle: undefined, ogImage: undefined }, 'Decent, but 2 critical issues found.'],
    ['D with one error', { ogImage: undefined, twitterCard: undefined, title: longTitle, description: longDescription, ogDescription: undefined }, '1 critical issue affecting social previews.'],
    ['F with five errors', { title: undefined, description: undefined, ogTitle: undefined, ogDescription: undefined, ogImage: undefined, twitterImage: undefined }, '5 critical issues affecting social previews.'],
  ])('writes the summary for %s', (_, overrides, summary) => {
    expect(analyzeMeta({ ...full, ...overrides }).summary).toContain(summary);
  });
});
