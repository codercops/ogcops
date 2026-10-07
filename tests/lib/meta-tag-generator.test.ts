import { describe, it, expect } from 'vitest';
import { escapeMetaContent, generateMetaTags } from '@/lib/meta-tag-generator';

describe('escapeMetaContent', () => {
  it('escapes ampersand, quotes, and angle brackets', () => {
    expect(escapeMetaContent(`A & B <C> "D"`)).toBe('A &amp; B &lt;C&gt; &quot;D&quot;');
  });
});

describe('generateMetaTags', () => {
  it('escapes quotes in the title attribute', () => {
    const html = generateMetaTags({
      title: 'The "best" guide',
      imageUrl: 'https://example.com/og.png',
    });

    expect(html).toContain('content="The &quot;best&quot; guide"');
    expect(html).not.toContain('content="The "best" guide"');
  });

  it('escapes ampersands in image URLs', () => {
    const html = generateMetaTags({
      title: 'Hello',
      imageUrl: 'https://example.com/og.png?w=1200&h=630',
    });

    expect(html).toContain(
      'content="https://example.com/og.png?w=1200&amp;h=630"',
    );
    expect(html).not.toContain('content="https://example.com/og.png?w=1200&h=630"');
  });

  it('includes description when provided', () => {
    const html = generateMetaTags({
      title: 'Title',
      description: 'Desc & more',
      imageUrl: 'https://example.com/a.png',
    });

    expect(html).toContain('og:description');
    expect(html).toContain('content="Desc &amp; more"');
    expect(html).toContain('twitter:description');
  });

  it('omits og:title and twitter:title when title is missing or empty', () => {
    const without = generateMetaTags({
      imageUrl: 'https://example.com/og.png',
    });
    const empty = generateMetaTags({
      title: '   ',
      imageUrl: 'https://example.com/og.png',
    });

    for (const html of [without, empty]) {
      expect(html).not.toContain('og:title');
      expect(html).not.toContain('twitter:title');
      expect(html).toContain('og:image');
      expect(html).toContain('twitter:card');
      expect(html).toContain('twitter:image');
    }
  });
});
