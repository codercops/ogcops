import { describe, expect, it } from 'vitest';
import articleExcerpt from '@/templates/quote/article-excerpt';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  articleExcerpt.render({ ...articleExcerpt.defaults, ...overrides });

describe('quote-article-excerpt', () => {
  it('is registered in the quote category and re-exported', async () => {
    expect(getTemplate('quote-article-excerpt')?.category).toBe('quote');
    const exports = await import('@/templates/quote');
    expect(exports.quoteArticleExcerpt.id).toBe('quote-article-excerpt');
  });

  it('renders the excerpt, title, site name, and author line with defaults', () => {
    expect(textContent(render())).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
      'What three years of incidents taught us',
      'blog.example.com',
      'by Priya Raman',
    ]);
  });

  it('hides author, site name, or title cleanly when empty or only spaces', () => {
    expect(textContent(render({ author: '' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
      'What three years of incidents taught us',
      'blog.example.com',
    ]);
    expect(textContent(render({ author: '   ' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
      'What three years of incidents taught us',
      'blog.example.com',
    ]);
    expect(textContent(render({ siteName: '' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
      'What three years of incidents taught us',
      'by Priya Raman',
    ]);
    expect(textContent(render({ title: '' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
      'blog.example.com',
      'by Priya Raman',
    ]);
  });

  it('hides the whole box when the title and site name are both empty or only spaces', () => {
    expect(textContent(render({ title: '', siteName: '' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
    ]);
    expect(textContent(render({ title: '   ', siteName: '   ' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
    ]);
    // Even if author is provided, the preview box stays hidden if both title and siteName are empty
    expect(textContent(render({ title: '', siteName: '', author: 'Priya Raman' }))).toEqual([
      'Most of our outages started as a config change that looked too small to review.',
    ]);
  });

  it('avoids duplicate by prefix when author already begins with by', () => {
    expect(textContent(render({ author: 'by Priya Raman' }))).toContain('by Priya Raman');
    expect(textContent(render({ author: 'By Priya Raman' }))).toContain('By Priya Raman');
  });

  it('shrinks long excerpts and titles with autoFontSize and then truncates them', () => {
    const longQuote =
      'Most of our outages started as a config change that looked too small to review, but ended up cascading across all regions because fallback paths had never been tested under realistic production traffic levels.';
    const longTitle =
      'What three years of incidents, postmortems, unexpected failures, and emergency hotfixes taught us about systems';
    const rendered = elements(render({ quote: longQuote, title: longTitle }));
    const quoteParagraph = rendered.find((el) => el.type === 'p');
    const titleDiv = rendered.find(
      (el) => el.type === 'div' && el.props.style?.lineHeight === 1.3,
    );

    expect(quoteParagraph).toBeDefined();
    expect(textContent(quoteParagraph)[0]).toHaveLength(200);
    expect(textContent(quoteParagraph)[0]).toMatch(/…$/);
    expect(quoteParagraph?.props.style?.fontSize).toBe('28px');

    expect(titleDiv).toBeDefined();
    expect(textContent(titleDiv)[0]).toHaveLength(100);
    expect(textContent(titleDiv)[0]).toMatch(/…$/);
    expect(titleDiv?.props.style?.fontSize).toBe('20px');
  });

  it('keeps text readable on a light background by darkening the accent and text', () => {
    const dark = elements(render());
    const light = elements(render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' }));

    const darkSiteName = dark.find(
      (el) => el.type === 'span' && textContent(el)[0] === 'blog.example.com',
    );
    expect(darkSiteName?.props.style?.color).toBe('#E07A5F');

    const lightSiteName = light.find(
      (el) => el.type === 'span' && textContent(el)[0] === 'blog.example.com',
    );
    expect(lightSiteName?.props.style?.color).toBe('#8b7b27');

    const lightQuote = light.find((el) => el.type === 'p');
    expect(lightQuote?.props.style?.color).toBe('#111111');

    const lightDefaultText = elements(render({ bgColor: '#ffffff' }));
    const defaultQuoteOnLight = lightDefaultText.find((el) => el.type === 'p');
    expect(defaultQuoteOnLight?.props.style?.color).toBe('#000000');
  });

  it('renders the accent bar as a plain shape without images', () => {
    const rendered = elements(render());
    const images = rendered.filter((el) => el.type === 'img');
    expect(images).toHaveLength(0);

    const accentBar = rendered.find(
      (el) => el.type === 'div' && el.props.style?.backgroundColor === '#E07A5F' && el.props.style?.width === '6px',
    );
    expect(accentBar).toBeDefined();
  });
});
