import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchMetaTags, parseMetaTags } from '@/lib/meta-fetcher';

describe('parseMetaTags', () => {
  const base = 'https://example.com/page';

  it('keeps an apostrophe inside a double-quoted value', () => {
    const tags = parseMetaTags('<meta property="og:title" content="Don\'t Panic">', base);
    expect(tags.ogTitle).toBe("Don't Panic");
  });

  it('keeps double quotes inside a single-quoted value', () => {
    const tags = parseMetaTags(`<meta name='description' content='The "best" guide'>`, base);
    expect(tags.description).toBe('The "best" guide');
  });

  it('decodes the &#039; in a Wikipedia og:title', () => {
    const tags = parseMetaTags(
      '<meta property="og:title" content="The Hitchhiker&#039;s Guide to the Galaxy - Wikipedia">',
      base,
    );
    expect(tags.ogTitle).toBe("The Hitchhiker's Guide to the Galaxy - Wikipedia");
  });

  it('decodes decimal and hex numeric entities', () => {
    const tags = parseMetaTags('<meta name="description" content="It&#8217;s here &#x2014; now">', base);
    expect(tags.description).toBe('It\u2019s here \u2014 now');
  });

  it('decodes &nbsp; to a non-breaking space', () => {
    const tags = parseMetaTags('<meta name="description" content="10&nbsp;km">', base);
    expect(tags.description).toBe('10\u00a0km');
  });

  it('decodes in a single pass, so &amp;lt; becomes &lt;', () => {
    const tags = parseMetaTags('<meta name="description" content="Use &amp;lt;meta&amp;gt; tags">', base);
    expect(tags.description).toBe('Use &lt;meta&gt; tags');
  });

  it('leaves unknown entities as they are', () => {
    const tags = parseMetaTags('<meta name="description" content="a &bogus; b">', base);
    expect(tags.description).toBe('a &bogus; b');
  });

  it('decodes entities in the title', () => {
    const tags = parseMetaTags('<title>Tom &amp; Jerry&#039;s</title>', base);
    expect(tags.title).toBe("Tom & Jerry's");
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
