import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchMetaTags } from '@/lib/meta-fetcher';

// We test the parseMetaTags logic by importing the module
// For now, test the meta-analyzer which doesn't need network access

describe('Meta Fetcher', () => {
  it('should exist as a module', async () => {
    const mod = await import('@/lib/meta-fetcher');
    expect(mod.fetchMetaTags).toBeDefined();
    expect(typeof mod.fetchMetaTags).toBe('function');
  });
});

describe('canonical and favicon attribute order', () => {
  const html = (body: string) =>
    new Response(body, { status: 200, headers: { 'content-type': 'text/html' } });

  const stubFetch = (body: string) => {
    vi.stubGlobal('fetch', vi.fn(async () => html(body)));
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('detects canonical with rel before href', async () => {
    stubFetch('<link rel="canonical" href="https://example.com/page">');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.canonical).toBe('https://example.com/page');
  });

  it('detects canonical with href before rel', async () => {
    stubFetch('<link href="https://example.com/page" rel="canonical">');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.canonical).toBe('https://example.com/page');
  });

  it('detects favicon with href before rel', async () => {
    stubFetch('<link href="/favicon.ico" rel="icon">');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.favicon).toBe('https://example.com/favicon.ico');
  });

  it('resolves a relative canonical against the page url', async () => {
    stubFetch('<link href="/about" rel="canonical">');
    const tags = await fetchMetaTags('https://example.com/docs/page');
    expect(tags.canonical).toBe('https://example.com/about');
  });

  it('still accepts rel="shortcut icon"', async () => {
    stubFetch('<link href="/fav.png" rel="shortcut icon">');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.favicon).toBe('https://example.com/fav.png');
  });

  it('does not treat apple-touch-icon as the favicon', async () => {
    stubFetch('<link href="/apple.png" rel="apple-touch-icon">');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.favicon).toBeUndefined();
  });

  it('matches an uppercase rel, like the old case-insensitive regexes', async () => {
    stubFetch('<link REL="Canonical" HREF="https://example.com/page">');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.canonical).toBe('https://example.com/page');
  });
});
