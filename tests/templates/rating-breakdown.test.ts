import { describe, expect, it } from 'vitest';
import ratingBreakdown from '@/templates/ecommerce/rating-breakdown';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { mixColors } from '@/templates/utils';
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
  ratingBreakdown.render({ ...ratingBreakdown.defaults, ...overrides });

// One rating row: a star label, a bar track, and a percentage label.
const rows = (tree: unknown) => elements(tree).filter((element) =>
  element.type === 'div' &&
  element.props.style?.width === '100%' &&
  !element.props.style?.flexDirection &&
  Array.isArray(element.props.children) &&
  element.props.children.length === 3);
const fills = (tree: unknown) => rows(tree).map(
  (row) => ((row.props.children as SatoriElement[])[1].props.children as SatoriElement[])[0]);
const starFills = (tree: unknown) => elements(tree)
  .filter((element) => element.type === 'svg')
  .map((star) => star.props.children.props.fill);

describe('ecommerce-rating-breakdown', () => {
  it('is re-exported and registered once in the ecommerce category', async () => {
    const exports = await import('@/templates/ecommerce');
    expect(exports.ecommerceRatingBreakdown).toBe(ratingBreakdown);
    expect(getTemplate('ecommerce-rating-breakdown')).toBe(ratingBreakdown);
    expect(getTemplatesByCategory('ecommerce').filter(({ id }) => id === 'ecommerce-rating-breakdown'))
      .toHaveLength(1);
  });

  it('declares the five optional count fields with min 0 and the documented defaults', () => {
    const countFields = ratingBreakdown.fields.filter(({ key }) => /^count[1-5]$/.test(key));

    expect(countFields.map(({ key }) => key)).toEqual(['count5', 'count4', 'count3', 'count2', 'count1']);
    for (const field of countFields) {
      expect(field.type).toBe('number');
      expect(field.min).toBe(0);
      expect(field.required).toBeFalsy();
    }
    expect(ratingBreakdown.defaults).toMatchObject({
      title: 'Trail Runner 2',
      count5: 742,
      count4: 351,
      count3: 110,
      count2: 44,
      count1: 37,
    });
  });

  it('renders the derived score, four gold stars, the review count, and the rounded percentages', () => {
    const tree = render();
    const text = textContent(tree);

    expect(text).toContain('Trail Runner 2');
    expect(text).toContain('4.3');
    expect(text).toContain('1,284 reviews');
    expect(text).toContain('codercops.com');
    expect(fills(tree).map(({ props }) => props.style.width))
      .toEqual(['58%', '27%', '9%', '3%', '3%']);
    expect(rows(tree).map((row) => textContent((row.props.children as SatoriElement[])[0])[0]))
      .toEqual(['5 stars', '4 stars', '3 stars', '2 stars', '1 star']);
    expect(rows(tree).map((row) => textContent((row.props.children as SatoriElement[])[2])[0]))
      .toEqual(['58%', '27%', '9%', '3%', '3%']);

    const stars = starFills(tree);
    expect(stars).toHaveLength(5);
    expect(stars.filter((color) => color === '#F5C518')).toHaveLength(4);
    expect(stars[4]).not.toBe('#F5C518');
    expect(JSON.stringify(tree)).not.toContain('NaN');
  });

  it('counts blank, negative, and non-numeric values as 0 without disagreeing with the totals', () => {
    const tree = render({ count5: '', count4: -10, count3: 'abc', count2: '   ', count1: 1 });
    const text = textContent(tree);

    expect(text).toContain('1.0');
    expect(text).toContain('1 review');
    expect(text).not.toContain('1,284 reviews');
    expect(fills(tree).map(({ props }) => props.style.width))
      .toEqual(['0%', '0%', '0%', '0%', '100%']);
    expect(text).toContain('100%');
    expect(JSON.stringify(tree)).not.toContain('NaN');
  });

  it('keeps the stars in step with the displayed score when the raw average rounds up', () => {
    const tree = render({ count5: 47, count4: 53, count3: 0, count2: 0, count1: 0 });
    const text = textContent(tree);

    // 47 five-star + 53 four-star reviews average 4.47, which displays as 4.5.
    expect(text).toContain('4.5');
    expect(text).toContain('100 reviews');
    const stars = starFills(tree);
    expect(stars).toHaveLength(5);
    expect(stars.filter((color) => color === '#F5C518')).toHaveLength(5);
    expect(fills(tree).map(({ props }) => props.style.width))
      .toEqual(['47%', '53%', '0%', '0%', '0%']);
    expect(JSON.stringify(tree)).not.toContain('NaN');
  });

  it('replaces the score and stars with "No reviews yet" and empties every bar when all counts are 0', () => {
    const tree = render({ count5: 0, count4: '0', count3: '', count2: null, count1: -5 });
    const text = textContent(tree);

    expect(text).toContain('No reviews yet');
    expect(text).not.toContain('4.3');
    expect(starFills(tree)).toHaveLength(0);
    expect(fills(tree).map(({ props }) => props.style.width))
      .toEqual(['0%', '0%', '0%', '0%', '0%']);
    expect(rows(tree).map((row) => textContent((row.props.children as SatoriElement[])[2])[0]))
      .toEqual(['0%', '0%', '0%', '0%', '0%']);
    expect(JSON.stringify(tree)).not.toContain('NaN');
  });

  it('shrinks a long title with autoFontSize and then truncates it on one line', () => {
    const short = elements(render()).find((element) => element.type === 'h1');
    const tree = render({ title: 'Trail Runner '.repeat(20) });
    const title = elements(tree).find((element) => element.type === 'h1');

    expect(short?.props.style.fontSize).toBe('46px');
    expect(textContent(title)[0]).toHaveLength(120);
    expect(textContent(title)[0]).toMatch(/…$/);
    expect(title?.props.style.fontSize).toBe('28px');
    expect(title?.props.style.whiteSpace).toBe('nowrap');
    expect(title?.props.style.overflow).toBe('hidden');
    expect(title?.props.style.textOverflow).toBe('ellipsis');
  });

  it('keeps a review count in the millions intact and readable', () => {
    const tree = render({ count5: 1250000, count4: 0, count3: 0, count2: 0, count1: 0 });
    const count = elements(tree).find((element) =>
      element.type === 'span' && textContent(element)[0]?.endsWith('reviews'));

    expect(textContent(count)[0]).toBe('1,250,000 reviews');
    expect(textContent(count)[0]).not.toMatch(/…/);
    expect(count?.props.style.whiteSpace).toBe('nowrap');
    expect(textContent(tree)).toContain('5.0');
    expect(fills(tree).map(({ props }) => props.style.width))
      .toEqual(['100%', '0%', '0%', '0%', '0%']);
  });

  it('keeps bars, tracks, and stars readable on a light background', () => {
    const dark = render();
    const accentInk = mixColors('#fde047', '#000000', 0.45);
    const tree = render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });
    const title = elements(tree).find((element) => element.type === 'h1');
    const percentLabels = rows(tree).map((row) => (row.props.children as SatoriElement[])[2]);

    expect(starFills(dark).filter((color) => color === '#F5C518')).toHaveLength(4);
    expect(fills(dark).every(({ props }) => props.style.backgroundColor === '#E07A5F')).toBe(true);

    expect(accentInk).not.toBe('#fde047');
    expect(fills(tree).every(({ props }) => props.style.backgroundColor === accentInk)).toBe(true);
    expect(rows(tree).every((row) =>
      (row.props.children as SatoriElement[])[1].props.style.backgroundColor ===
      mixColors('#ffffff', '#111111', 0.13))).toBe(true);
    expect(title?.props.style.color).toBe('#111111');
    expect(percentLabels.every((label) => label.props.style.color === '#111111')).toBe(true);

    const stars = starFills(tree);
    expect(stars.filter((color) => color === mixColors('#F5C518', '#000000', 0.35))).toHaveLength(4);
    expect(stars).not.toContain('#F5C518');
    expect(stars[4]).toBe(mixColors('#ffffff', '#111111', 0.5));
  });

  it('hides a blank site name cleanly', () => {
    const tree = render({ siteName: ' ' });
    expect(textContent(tree)).not.toContain('codercops.com');
  });

  it('follows the shared template checklist', () => {
    const tree = ratingBreakdown.render(ratingBreakdown.defaults);
    const all = elements(tree);

    expect(tree.props.style.width).toBe('1200px');
    expect(tree.props.style.height).toBe('630px');
    expect(ratingBreakdown.tags.length).toBeGreaterThanOrEqual(4);
    expect(ratingBreakdown.tags.length).toBeLessThanOrEqual(6);
    expect(ratingBreakdown.description).toBeTruthy();
    for (const element of all.filter(({ type }) => type === 'div')) {
      expect(element.props.style?.display).toBe('flex');
    }
    expect(JSON.stringify(tree)).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });
});
