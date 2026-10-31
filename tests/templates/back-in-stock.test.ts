import { describe, expect, it } from 'vitest';
import backInStock from '@/templates/ecommerce/back-in-stock';
import { getTemplate } from '@/templates/registry';
import { contrastText } from '@/templates/utils';
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
  backInStock.render({ ...backInStock.defaults, ...overrides });

const findText = (rendered: unknown, startsWith: string) =>
  elements(rendered).find((element) =>
    textContent(element).some((text) => text.startsWith(startsWith)));

describe('ecommerce-back-in-stock', () => {
  it('is registered in the ecommerce category and re-exported', async () => {
    expect(getTemplate('ecommerce-back-in-stock')?.category).toBe('ecommerce');
    const exports = await import('@/templates/ecommerce');
    expect(exports.ecommerceBackInStock.id).toBe('ecommerce-back-in-stock');
  });

  it('renders the badge, product name, price, urgency line and store name', () => {
    expect(textContent(render())).toEqual([
      'Back in stock',
      'Classic Canvas Weekender',
      '$89',
      'Only 12 left',
      'Field & Co.',
    ]);
  });

  it('shrinks long product names with autoFontSize and then truncates them', () => {
    const longName = 'Handmade Waxed Canvas Weekender Duffel Bag with Leather Straps and a Padded Shoulder Sling';
    const rendered = render({ productName: longName });
    const heading = elements(rendered).find((element) => element.type === 'h1');

    expect(textContent(heading)[0]).toHaveLength(80);
    expect(textContent(heading)[0]).toMatch(/…$/);
    expect(heading?.props.style?.fontSize).toBe('36px');
    expect(findText(rendered, 'Handmade Waxed')).toBeDefined();
  });

  it('uses a smaller size for a medium-length name than for a short one', () => {
    const short = elements(render()).find((element) => element.type === 'h1');
    const medium = elements(render({ productName: 'Waxed Canvas Weekender with Leather Straps' }))
      .find((element) => element.type === 'h1');

    expect(short?.props.style?.fontSize).toBe('64px');
    expect(medium?.props.style?.fontSize).toBe('44px');
  });

  it('hides a blank price or stock note cleanly', () => {
    const rendered = render({ price: '   ', stockNote: ' ' });

    expect(textContent(rendered)).toEqual(['Back in stock', 'Classic Canvas Weekender', 'Field & Co.']);
  });

  it('keeps the badge label readable on any accent and the accent text readable on a light background', () => {
    const dark = elements(render({ accentColor: '#E07A5F' }));
    const light = elements(render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' }));

    const badge = dark.find((element) => element.type === 'div' &&
      element.props.style?.backgroundColor === '#E07A5F');
    expect(badge?.props.style?.backgroundColor).toBe('#E07A5F');
    expect(textContent(badge)).toEqual(['Back in stock']);
    const badgeLabel = elements(badge).find((element) => element.type === 'span');
    expect(badgeLabel?.props.style?.color).toBe(contrastText('#E07A5F'));

    const paleBadge = light.find((element) => element.type === 'div' &&
      element.props.style?.backgroundColor === '#fde047');
    const paleLabel = elements(paleBadge).find((element) => element.type === 'span');
    expect(paleLabel?.props.style?.color).toBe(contrastText('#fde047'));

    const palePrice = elements(light).find((element) => element.type === 'span' &&
      textContent(element)[0] === '$89');
    expect(palePrice?.props.style?.color).toBe('#8b7b27');
  });
});
