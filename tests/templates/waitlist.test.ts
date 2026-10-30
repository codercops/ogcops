import { describe, expect, it } from 'vitest';
import waitlist from '@/templates/product/waitlist';
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
  waitlist.render({ ...waitlist.defaults, ...overrides });

describe('product-waitlist', () => {
  it('is registered in the product category and re-exported', async () => {
    expect(getTemplate('product-waitlist')?.category).toBe('product');
    const exports = await import('@/templates/product');
    expect(exports.productWaitlist.id).toBe('product-waitlist');
  });

  it('renders the label, product name, pitch, count with its label and the launch window', () => {
    expect(textContent(render())).toEqual([
      'Join the waitlist',
      'Notewell',
      'Notes that link themselves',
      '2,148',
      'people on the list',
      'Opening in November',
      'notewell.app',
    ]);
  });

  it('hides the count label whenever the count is empty', () => {
    expect(textContent(render({ count: '   ' }))).toEqual([
      'Join the waitlist',
      'Notewell',
      'Notes that link themselves',
      'Opening in November',
      'notewell.app',
    ]);
  });

  it('drops a blank description, launch window and site name cleanly', () => {
    expect(textContent(render({ description: '  ', launchWindow: '', siteName: ' ' }))).toEqual([
      'Join the waitlist',
      'Notewell',
      '2,148',
      'people on the list',
    ]);
  });

  it('keeps the separator out when only one of the launch window and site name is set', () => {
    const onlySite = elements(render({ launchWindow: ' ' }));
    const dots = onlySite.filter((element) => element.type === 'div' &&
      element.props.style?.width === '4px' && element.props.style?.height === '4px');

    expect(dots).toHaveLength(0);
    expect(textContent(render({ launchWindow: ' ' }))).toEqual([
      'Join the waitlist',
      'Notewell',
      'Notes that link themselves',
      '2,148',
      'people on the list',
      'notewell.app',
    ]);
  });

  it('shrinks long product names and pitches with autoFontSize and then truncates them', () => {
    const longTitle = 'Notewell Collaborative Knowledge Workspace for Distributed Engineering Teams';
    const longPitch = 'Notes that link themselves, find their own context, and stay in sync across every device and every teammate you work with';
    const nodes = elements(render({ title: longTitle, description: longPitch }));

    const heading = nodes.find((element) => element.type === 'h1');
    expect(textContent(heading)[0]).toHaveLength(42);
    expect(textContent(heading)[0]).toMatch(/…$/);
    expect(heading?.props.style?.fontSize).toBe('60px');

    const pitch = nodes.find((element) => element.type === 'p');
    expect(textContent(pitch)[0].length).toBeLessThanOrEqual(90);
    expect(textContent(pitch)[0]).toMatch(/…$/);
    expect(pitch?.props.style?.fontSize).toBe('22px');
  });

  it('keeps the accent text readable on a light background', () => {
    const dark = elements(render());
    const light = elements(render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' }));

    const darkLabel = dark.find((element) => element.type === 'span' &&
      textContent(element)[0] === 'Join the waitlist');
    expect(darkLabel?.props.style?.color).toBe('#E07A5F');

    const lightLabel = light.find((element) => element.type === 'span' &&
      textContent(element)[0] === 'Join the waitlist');
    expect(lightLabel?.props.style?.color).toBe('#8b7b27');

    const lightWindow = light.find((element) => element.type === 'span' &&
      textContent(element)[0] === 'Opening in November');
    expect(lightWindow?.props.style?.color).toBe('#8b7b27');
  });
});
