import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchMetaTags, parseMetaTags } from '@/lib/meta-fetcher';
import { analyzeMeta } from '@/lib/meta-analyzer';

describe('parseMetaTags', () => {
  const base = 'https://example.com/page';

  it.each(['', '   ', '\t\n ', '&nbsp;&#32;'])('treats blank meta content %j as missing', (content) => {
    const tags = parseMetaTags(`
      <title>   </title>
      <meta property="og:title" content="${content}">
      <meta name="description" content="${content}">
      <meta property="og:description" content="${content}">
      <meta property="og:image" content="${content}">
      <meta name="twitter:card" content="${content}">
    `, base);

    expect(tags.ogTitle).toBeUndefined();
    expect(tags.description).toBeUndefined();
    expect(tags.ogDescription).toBeUndefined();
    expect(tags.ogImage).toBeUndefined();
    expect(tags.twitterCard).toBeUndefined();
    expect(analyzeMeta(tags).issues).toEqual(expect.arrayContaining([
      { severity: 'error', tag: 'title', message: 'No page title found' },
      { severity: 'error', tag: 'description', message: 'No meta description found' },
    ]));
  });

  it('trims decoded meta content while preserving internal whitespace', () => {
    const tags = parseMetaTags(`
      <meta property="og:title" content="&nbsp; Hello  world &#32;">
      <meta name="description" content="  A useful description.  ">
      <meta property="og:image" content="  /cover.png  ">
      <meta name="twitter:card" content="  summary_large_image  ">
    `, base);

    expect(tags.ogTitle).toBe('Hello  world');
    expect(tags.description).toBe('A useful description.');
    expect(tags.ogImage).toBe('https://example.com/cover.png');
    expect(tags.twitterCard).toBe('summary_large_image');
  });

  it.each([
    ['1200', '630', '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'],
    [undefined, undefined, ''],
    ['1200', undefined, '<meta property="og:image:width" content="1200">'],
  ])('keeps the first image with only its own dimensions (%s, %s)', (width, height, dimensions) => {
    const tags = parseMetaTags(`
      <meta property="og:image:width" content="999">
      <meta property="og:image:height" content="999">
      <meta property="og:image" content="/first.png">
      ${dimensions}
      <meta property="og:image" content="/second.png">
      <meta property="og:image:width" content="400">
      <meta property="og:image:height" content="300">
    `, base);
    expect(tags.ogImage).toBe('https://example.com/first.png');
    expect(tags.ogImageWidth).toBe(width);
    expect(tags.ogImageHeight).toBe(height);
  });

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

  it('decodes uppercase named entities &AMP;, &LT;, &GT;, and &QUOT;', () => {
    const tags = parseMetaTags(
      '<title>&LT;Tom &AMP; Jerry &QUOT;Show&QUOT;&GT;</title>',
      base,
    );
    expect(tags.title).toBe('<Tom & Jerry "Show">');
  });

  it('does not decode uppercase or mixed-case entities that are not valid in HTML', () => {
    const tags = parseMetaTags(
      '<meta name="description" content="&APOS; &NBSP; &Amp;">',
      base,
    );
    expect(tags.description).toBe('&APOS; &NBSP; &Amp;');
  });

  it('parses unquoted meta attributes', () => {
    const tags = parseMetaTags('<meta name=twitter:card content="summary_large_image">', base);
    expect(tags.twitterCard).toBe('summary_large_image');
  });

  it('parses unquoted content values', () => {
    const tags = parseMetaTags('<meta name=description content=Hello>', base);
    expect(tags.description).toBe('Hello');
  });

  it('keeps > inside a double-quoted attribute value', () => {
    const tags = parseMetaTags('<meta property="og:title" content="Tips > Tricks">', base);
    expect(tags.ogTitle).toBe('Tips > Tricks');
  });

  it('keeps > inside a single-quoted attribute value', () => {
    const tags = parseMetaTags(`<meta property='og:title' content='Tips > Tricks'>`, base);
    expect(tags.ogTitle).toBe('Tips > Tricks');
  });
});

describe('canonical and favicon attribute order', () => {
  it.each(['alternate canonical', 'canonical alternate', 'ALTERNATE CANONICAL', ' alternate\tcanonical\n'])('detects the canonical token in rel=%j', (rel) => {
    const tags = parseMetaTags(`<link href="/preferred" rel="${rel}"><link rel="canonical" href="/later">`, 'https://example.com/page');
    expect(tags.canonical).toBe('https://example.com/preferred');
  });

  it('does not match canonical as part of another token', () => {
    expect(parseMetaTags('<link rel="not-canonical" href="/other">', 'https://example.com').canonical).toBeUndefined();
  });

  it.each(['alternate icon', 'icon alternate', 'ALTERNATE ICON', '  alternate\ticon\n ', 'shortcut  icon'])('detects the icon token in rel=%j', (rel) => {
    const tags = parseMetaTags(`<link rel="${rel}" href="/favicon.png">`, 'https://example.com/page');
    expect(tags.favicon).toBe('https://example.com/favicon.png');
  });

  it('keeps the first favicon when later links also contain an icon token', () => {
    const tags = parseMetaTags('<link rel="alternate icon" href="/first.png"><link rel="icon" href="/second.png">', 'https://example.com');
    expect(tags.favicon).toBe('https://example.com/first.png');
  });

  it.each(['alternate apple-touch-icon', 'iconic', 'mask-icon'])('does not match icon substrings in rel=%j', (rel) => {
    expect(parseMetaTags(`<link rel="${rel}" href="/other.png">`, 'https://example.com').favicon).toBeUndefined();
  });
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

  it('parses unquoted link attributes and boolean attributes', async () => {
    stubFetch('<link rel=icon crossorigin href=/favicon-32x32.png sizes=32x32>');
    const tags = await fetchMetaTags('https://example.com/page');
    expect(tags.favicon).toBe('https://example.com/favicon-32x32.png');
  });

  it('uses the final response URL for relative URLs after redirects', async () => {
    const response = new Response('<meta property="og:image" content="cover.png">', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
    Object.defineProperty(response, 'url', { value: 'https://example.com/posts/hello/' });
    vi.stubGlobal('fetch', vi.fn(async () => response));

    const tags = await fetchMetaTags('https://example.com/latest');
    expect(tags.ogImage).toBe('https://example.com/posts/hello/cover.png');
  });
});
