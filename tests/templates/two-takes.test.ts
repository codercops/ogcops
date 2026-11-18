import { describe, expect, it } from 'vitest';
import quoteTwoTakesDefault from '@/templates/quote/two-takes';
import { quoteTwoTakes } from '@/templates/quote';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
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
  quoteTwoTakesDefault.render({ ...quoteTwoTakesDefault.defaults, ...overrides });

describe('quote-two-takes', () => {
  it('is re-exported and registered once in the quote category', () => {
    expect(quoteTwoTakes).toBe(quoteTwoTakesDefault);
    expect(getTemplate('quote-two-takes')).toBe(quoteTwoTakesDefault);
    expect(
      getTemplatesByCategory('quote').filter(({ id }) => id === 'quote-two-takes'),
    ).toHaveLength(1);
  });

  it('renders defaults with title, left label, left quote, left author, vs chip, right quote, right author, and site name', () => {
    const tree = render();
    const text = textContent(tree);

    expect(text).toContain('Should every team write design docs?');
    expect(text).toContain('Yes');
    expect(text).toContain('Writing it down is the cheapest review you\u2019ll ever get.');
    expect(text).toContain('Dana Whitfield, Engineering Manager');
    expect(text).toContain('vs');
    expect(text).toContain('No');
    expect(text).toContain('Most design docs are read once, by the person who wrote them.');
    expect(text).toContain('Marco Velez, Staff Engineer');
    expect(text).toContain('Dev Panel Weekly');
  });

  it('falls back to default quote text when leftQuote or rightQuote is blank', () => {
    const tree = render({ leftQuote: '', rightQuote: '' });
    const text = textContent(tree);

    expect(text).toContain('Writing it down is the cheapest review you\u2019ll ever get.');
    expect(text).toContain('Most design docs are read once, by the person who wrote them.');
  });

  it('omits title row entirely when title is blank, with no empty gap', () => {
    const tree = render({ title: '' });
    const text = textContent(tree);

    expect(text).not.toContain('Should every team write design docs?');
    // h1 element should not appear
    const h1s = elements(tree).filter((el) => el.type === 'h1');
    expect(h1s).toHaveLength(0);
  });

  it('omits label pill when leftLabel or rightLabel is blank, leaving no gap', () => {
    const tree = render({ leftLabel: '', rightLabel: '' });
    const text = textContent(tree);

    expect(text).not.toContain('Yes');
    expect(text).not.toContain('No');

    // The uppercase pill spans should not exist
    const pillSpans = elements(tree).filter(
      (el) => el.type === 'span' && el.props.style?.textTransform === 'uppercase',
    );
    expect(pillSpans).toHaveLength(0);
  });

  it('renders default quotes at 40px font size', () => {
    const tree = render();
    const allEls = elements(tree);
    const leftSpan = allEls.find(
      (el) => el.type === 'span' && textContent(el).some((t) => t.includes('Writing it down')),
    );
    expect(leftSpan).toBeDefined();
    expect(leftSpan!.props.style?.fontSize).toBe('40px');
  });

  it('omits author byline when leftAuthor or rightAuthor is blank', () => {
    const tree = render({ leftAuthor: '', rightAuthor: '' });
    const text = textContent(tree);

    expect(text).not.toContain('Dana Whitfield, Engineering Manager');
    expect(text).not.toContain('Marco Velez, Staff Engineer');
  });

  it('omits site name footer when siteName is blank', () => {
    const tree = render({ siteName: '' });
    const text = textContent(tree);

    expect(text).not.toContain('Dev Panel Weekly');
  });

  it('truncates long quotes at 220 chars without pushing content off-card', () => {
    const longQuote = 'A'.repeat(300);
    const tree = render({ leftQuote: longQuote, rightQuote: longQuote });
    const text = textContent(tree);

    // The rendered text should not exceed 220 chars (truncated by truncate())
    const leftRendered = text.find((t) => t.startsWith('A') && t.length <= 220);
    expect(leftRendered).toBeDefined();
    expect(leftRendered!.length).toBeLessThanOrEqual(220);
  });

  it('uses the same quoteSize for both columns (driven by the longer quote)', () => {
    const shortQuote = 'Short.';
    const longQuote = 'A much longer quote that pushes the font size down for both columns.';
    const tree = render({ leftQuote: shortQuote, rightQuote: longQuote });

    // Both quote spans should share the same fontSize (derived from the longer quote)
    const allEls = elements(tree);
    // Find spans containing quote text
    const leftSpan = allEls.find((el) => el.type === 'span' && textContent(el).includes(shortQuote));
    const rightSpan = allEls.find((el) => el.type === 'span' && textContent(el).includes(longQuote));

    expect(leftSpan).toBeDefined();
    expect(rightSpan).toBeDefined();
    expect(leftSpan!.props.style?.fontSize).toBe(rightSpan!.props.style?.fontSize);
  });

  it('renders long title truncated to one line with ellipsis style', () => {
    const longTitle = 'An Extremely Long Debate Topic Title That Would Normally Overflow The Header Row';
    const tree = render({ title: longTitle.slice(0, 80) });

    const h1 = elements(tree).find((el) => el.type === 'h1');
    expect(h1).toBeDefined();
    expect(h1!.props.style?.overflow).toBe('hidden');
    expect(h1!.props.style?.textOverflow).toBe('ellipsis');
    expect(h1!.props.style?.whiteSpace).toBe('nowrap');
  });

  it('renders with a smaller titleSize for longer titles', () => {
    const shortTitle = render({ title: 'Short?' });
    const longTitle = render({ title: 'A very long debate topic title that pushes the font size down significantly' });

    const shortH1 = elements(shortTitle).find((el) => el.type === 'h1');
    const longH1 = elements(longTitle).find((el) => el.type === 'h1');

    const shortSize = parseInt(String(shortH1?.props.style?.fontSize ?? '0'), 10);
    const longSize = parseInt(String(longH1?.props.style?.fontSize ?? '0'), 10);

    expect(shortSize).toBeGreaterThan(longSize);
  });

  it('renders cleanly on a light background with readable label colors (not white on white)', () => {
    const tree = render({
      bgColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#6366f1',
    });

    const allEls = elements(tree);

    // Left label pill color should NOT be close to pure white
    const leftLabelSpan = allEls.find(
      (el) => el.type === 'span' && textContent(el).includes('Yes') && el.props.style?.fontWeight === 700,
    );
    expect(leftLabelSpan).toBeDefined();
    // Color must not be white (#ffffff / #fff)
    const color = String(leftLabelSpan!.props.style?.color ?? '');
    expect(color.toLowerCase()).not.toBe('#ffffff');
    expect(color.toLowerCase()).not.toBe('#fff');

    // vs chip text color must not be white
    const vsSpan = allEls.find((el) => el.type === 'span' && textContent(el).includes('vs'));
    expect(vsSpan).toBeDefined();
    const vsColor = String(vsSpan!.props.style?.color ?? '');
    expect(vsColor.toLowerCase()).not.toBe('#ffffff');
    expect(vsColor.toLowerCase()).not.toBe('#fff');
  });

  it('renders "vs" chip with a circular border in the divider', () => {
    const tree = render();
    const allEls = elements(tree);

    const vsChip = allEls.find(
      (el) =>
        el.type === 'div' &&
        el.props.style?.borderRadius === '50%' &&
        textContent(el).includes('vs'),
    );
    expect(vsChip).toBeDefined();
    expect(vsChip!.props.style?.border).toBeDefined();
  });
});
