import { describe, it, expect } from 'vitest';
import youAsked from '@/templates/product/you-asked';
import { productYouAsked } from '@/templates/product';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  youAsked.render({ ...youAsked.defaults, ...overrides });

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'type' in node) {
    const element = node as SatoriElement;
    return [element, ...elements(element.props.children)];
  }
  return [];
}

describe('product-you-asked', () => {
  it('is registered and re-exported', () => {
    expect(getTemplate('product-you-asked')).toBe(youAsked);
    expect(productYouAsked).toBe(youAsked);
  });

  it('renders the request card, pill, title, and site name', () => {
    expect(textContent(render())).toEqual(expect.arrayContaining([
      '“Please add a dark mode for working late”',
      'Shipped in v2.4',
      'Dark mode is here',
      'notewell.app',
    ]));
  });

  it('hides the card for blank requests while keeping the pill and title', () => {
    const empty = render({ request: '   ' });
    const content = textContent(empty);
    expect(content).toEqual(expect.arrayContaining(['Shipped in v2.4', 'Dark mode is here', 'notewell.app']));
    expect(elements(empty).some((element) => element.props.children === '“”')).toBe(false);
  });

  it('hides the vote box and vote label without a count', () => {
    const content = textContent(render({ votes: '   ' }));
    expect(content).not.toContain('248');
    expect(content).not.toContain('votes');
  });

  it('only renders the vote label when a count exists', () => {
    expect(textContent(render())).toContain('votes');
    expect(textContent(render({ voteLabel: '   ' }))).not.toContain('votes');
  });

  it('uses Shipped when the version is blank', () => {
    expect(textContent(render({ version: '   ' }))).toContain('Shipped');
    expect(textContent(render({ version: '   ' }))).not.toContain('Shipped in');
  });

  it('shrinks and truncates long titles', () => {
    const element = render({ title: 'A very long title that keeps going beyond the available width for this announcement' });
    const title = elements(element).find((item) => item.type === 'h1');
    expect(title?.props.style.fontSize).toBe('38px');
    expect(textContent(title)[0]).toMatch(/^A very long title that keeps going beyond/);
    expect(textContent(title)[0]).toMatch(/…$/);
  });

  it('truncates long requests and vote counts', () => {
    const element = render({
      request: 'This is an exceptionally long customer request that should be capped so the card remains within two lines and never pushes the title out of place.',
      votes: '123456789012345',
    });
    const content = textContent(element);
    const request = content.find((text) => text.startsWith('“')) ?? '';
    expect(request.length).toBeLessThan(132);
    expect(request).toMatch(/…”$/);
    const voteCount = content.find((text) => text.endsWith('…')) ?? '';
    expect(voteCount).toMatch(/…$/);
    expect(voteCount.length).toBeLessThanOrEqual(9);
  });

  it('uses darkened accent ink on a light background', () => {
    const element = render({ bgColor: '#ffffff', accentColor: '#E07A5F' });
    expect(() => JSON.stringify(element)).not.toThrow();
    expect(JSON.stringify(element)).toContain('#7b4334');
  });
});