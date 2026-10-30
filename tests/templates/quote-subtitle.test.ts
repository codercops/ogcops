import { describe, expect, it } from 'vitest';
import subtitle from '@/templates/quote/subtitle';
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
  subtitle.render({ ...subtitle.defaults, ...overrides });

describe('quote-subtitle', () => {
  it('is registered in the quote category and re-exported', async () => {
    expect(getTemplate('quote-subtitle')?.category).toBe('quote');
    const exports = await import('@/templates/quote');
    expect(exports.quoteSubtitle.id).toBe('quote-subtitle');
  });

  it('renders the source line, speaker name, and quote subtitle with defaults', () => {
    expect(textContent(render())).toEqual([
      'Opening keynote, 2026',
      'Ana Ruiz',
      'Ship the small version first, then listen.',
    ]);
  });

  it('hides the speaker and source cleanly when empty or only spaces', () => {
    expect(textContent(render({ author: '', source: '' }))).toEqual([
      'Ship the small version first, then listen.',
    ]);
    expect(textContent(render({ author: '   ', source: '   ' }))).toEqual([
      'Ship the small version first, then listen.',
    ]);
  });

  it('shrinks long quotes with autoFontSize and then truncates them', () => {
    const longQuote =
      'Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible, serving us without drawing attention to itself in any way.';
    const rendered = elements(render({ quote: longQuote }));
    const quoteParagraph = rendered.find((el) => el.type === 'p');

    expect(quoteParagraph).toBeDefined();
    expect(textContent(quoteParagraph)[0]).toHaveLength(200);
    expect(textContent(quoteParagraph)[0]).toMatch(/…$/);
    expect(quoteParagraph?.props.style?.fontSize).toBe('28px');
  });

  it('keeps the quote and speaker readable on a light background', () => {
    const dark = elements(render());
    const light = elements(render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' }));

    const darkSpeaker = dark.find(
      (el) => el.type === 'span' && textContent(el)[0] === 'Ana Ruiz',
    );
    expect(darkSpeaker?.props.style?.color).toBe('#E07A5F');

    const paleSpeaker = light.find(
      (el) => el.type === 'span' && textContent(el)[0] === 'Ana Ruiz',
    );
    expect(paleSpeaker?.props.style?.color).toBe('#8b7b27');

    const lightQuote = light.find((el) => el.type === 'p');
    expect(lightQuote?.props.style?.color).toBe('#111111');

    const lightDefaultText = elements(render({ bgColor: '#ffffff' }));
    const defaultQuoteOnLight = lightDefaultText.find((el) => el.type === 'p');
    expect(defaultQuoteOnLight?.props.style?.color).toBe('#000000');
  });

  it('renders letterbox bars and soft shadows as plain styles without images', () => {
    const rendered = elements(render());
    const images = rendered.filter((el) => el.type === 'img');
    expect(images).toHaveLength(0);

    const quoteParagraph = rendered.find((el) => el.type === 'p');
    expect(quoteParagraph?.props.style?.textShadow).toContain('0 2px 8px');

    const bars = rendered.filter(
      (el) => el.type === 'div' && el.props.style?.backgroundColor === '#000000' && el.props.style?.height === '60px',
    );
    expect(bars).toHaveLength(2);
  });
});
