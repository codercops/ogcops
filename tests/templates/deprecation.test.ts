import { describe, expect, it } from 'vitest';
import deprecation from '@/templates/saas/deprecation';
import { saasDeprecation } from '@/templates/saas';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

function walk(node: unknown, visit: (element: SatoriElement) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (!node || typeof node !== 'object' || !('type' in node)) return;

  const element = node as SatoriElement;
  visit(element);
  walk(element.props.children, visit);
}

function allElements(node: unknown): SatoriElement[] {
  const found: SatoriElement[] = [];
  walk(node, (element) => found.push(element));
  return found;
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
  deprecation.render({ ...deprecation.defaults, ...overrides });

describe('saas-deprecation', () => {
  it('is re-exported and registered exactly once in the SaaS category', () => {
    expect(saasDeprecation).toBe(deprecation);
    expect(getTemplate('saas-deprecation')).toBe(deprecation);
    expect(getTemplatesByCategory('saas').filter((template) => template.id === 'saas-deprecation'))
      .toHaveLength(1);
  });

  it('renders the deprecated name, replacement, sunset date, note, and site name', () => {
    expect(textContent(render())).toEqual([
      'Deprecated',
      'NO LONGER SUPPORTED',
      'API v1',
      'USE INSTEAD',
      'API v2',
      'Shuts down on March 31, 2027',
      'The migration guide is in the docs',
      'Acme API',
    ]);
    expect(allElements(render()).find((element) =>
      element.type === 'span' && textContent(element).includes('Acme API')
    )?.props.style.alignSelf).toBe('flex-end');
    expect(allElements(render()).some((element) => element.type === 'svg')).toBe(true);
  });

  it('hides whitespace-only optional fields and the arrow when the replacement is empty', () => {
    const tree = render({ replacement: '  ', sunsetDate: '   ', description: '  ', siteName: ' ' });
    expect(textContent(tree)).toEqual(['Deprecated', 'NO LONGER SUPPORTED', 'API v1']);
    expect(allElements(tree).some((element) => element.type === 'svg')).toBe(false);
  });

  it('shrinks then truncates long old and replacement names', () => {
    const tree = render({ title: 'Old API name '.repeat(9), replacement: 'Replacement API name '.repeat(8) });
    const elements = allElements(tree);
    const oldName = elements.find((element) => element.type === 'h1');
    const newName = elements.find((element) =>
      element.type === 'span' && textContent(element).some((text) => text.startsWith('Replacement API'))
    );

    expect(textContent(oldName)[0].length).toBeLessThanOrEqual(44);
    expect(textContent(oldName)[0]).toMatch(/…$/);
    expect(oldName?.props.style.fontSize).toBe('42px');
    expect(oldName?.props.style.textDecoration).toBe('line-through');
    expect(textContent(newName)[0].length).toBeLessThanOrEqual(44);
    expect(textContent(newName)[0]).toMatch(/…$/);
    expect(newName?.props.style.fontSize).toBe('42px');
  });

  it('darkens label and accent text on a light background with a pale accent', () => {
    const tree = render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });
    const elements = allElements(tree);
    const deprecatedLabel = elements.find((element) =>
      textContent(element).includes('Deprecated') && element.type === 'span'
    );
    const replacementLabel = elements.find((element) =>
      textContent(element).includes('USE INSTEAD') && element.type === 'span'
    );
    const sunset = elements.find((element) =>
      element.type === 'span' && textContent(element).includes('Shuts down on March 31, 2027')
    );

    expect(deprecatedLabel?.props.style.color).toBe('#8b7b27');
    expect(replacementLabel?.props.style.color).toBe('#8b7b27');
    expect(sunset?.props.style.color).toBe('#8b7b27');
  });

  it('uses the required canvas size and flex layout for all divs', () => {
    const elements = allElements(render());
    expect(elements[0].props.style.width).toBe('1200px');
    expect(elements[0].props.style.height).toBe('630px');
    expect(elements.every((element) =>
      element.type !== 'div' || element.props.style?.display === 'flex'
    )).toBe(true);
  });
});
